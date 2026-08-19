/**
 * Central API Client for Ummah Scholars Tribune Public Frontend
 * Follows Next.js best practices with configurable caching/ISR and clean data unwrapping.
 */

const DEFAULT_API_URL = "http://localhost:8000/api/v1";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined"
    ? window.location.origin.includes(":3000")
      ? "http://localhost:8000/api/v1"
      : "/api/v1"
    : DEFAULT_API_URL);

/**
 * Generic safe fetch wrapper
 */
async function fetchApi(endpoint, options = {}) {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 }, // ISR: refresh every 60 seconds
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    if (!res.ok) {
      console.warn(`[API] Fetch failed for ${url} (Status: ${res.status})`);
      return null;
    }

    const payload = await res.json();

    // Unwrap NestJS ResponseInterceptor envelope { success: true, data: ... }
    if (payload && typeof payload === "object" && "data" in payload) {
      return payload.data;
    }

    return payload;
  } catch (err) {
    console.error(`[API] Error fetching ${url}:`, err?.message || err);
    return null;
  }
}

/**
 * Normalize image URL (handles relative media paths, absolute backend URLs, and cloud URLs)
 * @param {string|Object} image
 * @param {string} [fallback='/news/news1.avif']
 * @returns {string}
 */
export function getMediaUrl(image, fallback = "/news/news1.avif") {
  if (!image) return fallback;

  if (typeof image === "object") {
    if (image.url) return getMediaUrl(image.url, fallback);
    if (image.thumbnailUrl) return getMediaUrl(image.thumbnailUrl, fallback);
    return fallback;
  }

  if (typeof image === "string") {
    let clean = image.trim();
    if (!clean) return fallback;

    const baseApi = API_BASE_URL.replace(/\/+$/, "");
    const backendOrigin = baseApi.replace(/\/api\/v1\/?$/, "");

    // If backend returned a localhost/127.0.0.1 URL but frontend is configured with a live backend (e.g. Vercel)
    if (clean.includes("localhost:8000") || clean.includes("127.0.0.1:8000")) {
      if (!baseApi.includes("localhost:8000") && !baseApi.includes("127.0.0.1:8000")) {
        clean = clean
          .replace(/^https?:\/\/(localhost|127\.0\.0\.1):8000\/api\/v1\/?/, `${baseApi}/`)
          .replace(/^https?:\/\/(localhost|127\.0\.0\.1):8000\/?/, `${backendOrigin}/`);
        return clean;
      }
    }

    // Already a complete web URL or local static asset
    if (clean.startsWith("http://") || clean.startsWith("https://") || clean.startsWith("/")) {
      return clean;
    }

    // It's a media filename/key from backend storage (e.g. 'pexels-xyz.webp')
    if (clean.startsWith("api/v1/media/uploads/") || clean.startsWith("media/uploads/")) {
      return `${backendOrigin}/${clean.replace(/^\//, "")}`;
    }

    return `${baseApi}/media/uploads/${clean.replace(/^\//, "")}`;
  }

  return fallback;
}

/**
 * Normalizes all image fields on a post record to guarantee valid URLs for next/image
 * @param {Object} post
 * @returns {Object}
 */
export function normalizePost(post) {
  if (!post) return post;

  const rawImage =
    (post.featuredImage && typeof post.featuredImage === "object"
      ? post.featuredImage.url || post.featuredImage.thumbnailUrl
      : typeof post.featuredImage === "string"
      ? post.featuredImage
      : null) ||
    post.featuredImageUrl ||
    post.image ||
    post.ogImageUrl ||
    null;

  const resolvedUrl = getMediaUrl(rawImage, "/news/news1.avif");

  return {
    ...post,
    featuredImage: {
      ...(typeof post.featuredImage === "object" ? post.featuredImage : {}),
      url: resolvedUrl,
    },
    image: resolvedUrl,
    featuredImageUrl: resolvedUrl,
  };
}

/**
 * Fetch all categories or filtered by type ('POST' | 'PAGE')
 * @param {Object} options
 * @param {'POST' | 'PAGE'} [options.type] - Category type filter
 * @returns {Promise<Array>} Array of category objects
 */
export async function fetchCategories(options = {}) {
  const data = await fetchApi("/categories");
  if (!Array.isArray(data)) return [];

  if (options.type) {
    return data.filter(
      (c) => (c.type || "").toUpperCase() === options.type.toUpperCase()
    );
  }

  return data;
}

/**
 * Fetch posts with query filtering
 * @param {Object} params
 * @param {string} [params.pageCategory] - Page Category ID or slug
 * @param {string} [params.category] - Topic Category ID or slug
 * @param {string} [params.status='PUBLISHED'] - Post status
 * @param {number} [params.limit=10] - Number of items to fetch
 * @param {number} [params.page=1] - Page number
 * @param {string} [params.sort='newest'] - Sort order ('newest' | 'oldest' | 'views')
 * @returns {Promise<{ posts: Array, total: number }>}
 */
export async function fetchPosts(params = {}) {
  const query = new URLSearchParams();

  if (params.pageCategory) query.set("pageCategory", params.pageCategory);
  if (params.category) query.set("category", params.category);
  query.set("status", params.status || "PUBLISHED");
  if (params.limit) query.set("limit", String(params.limit));
  if (params.page) query.set("page", String(params.page));
  if (params.sort) query.set("sort", params.sort);

  const data = await fetchApi(`/posts?${query.toString()}`);

  if (!data) return { posts: [], total: 0 };

  // Backend returns { data: Post[], meta: { total: number, ... } }
  if (data && Array.isArray(data.data)) {
    return {
      posts: data.data.map(normalizePost),
      total: data.meta?.total || data.data.length,
    };
  }

  if (Array.isArray(data)) {
    return { posts: data.map(normalizePost), total: data.length };
  }

  return { posts: [], total: 0 };
}

/**
 * Fetch published posts for a specific page category slug
 * (e.g. 'research-studies', 'opinions-perspectives', 'news-announcements', 'events-initiatives')
 * @param {string} pageCategorySlug
 * @param {number} [limit=4]
 * @returns {Promise<Array>}
 */
export async function fetchPostsByPageCategory(pageCategorySlug, limit = 4) {
  const { posts } = await fetchPosts({
    pageCategory: pageCategorySlug,
    status: "PUBLISHED",
    limit,
    sort: "newest",
  });
  return posts;
}

/**
 * Fetch the latest published posts across all categories
 * @param {number} [limit=5]
 * @returns {Promise<Array>}
 */
export async function fetchLatestPosts(limit = 5) {
  const { posts } = await fetchPosts({
    status: "PUBLISHED",
    limit,
    sort: "newest",
  });
  return posts;
}

/**
 * Fetch single post by ID or Slug
 * @param {string} idOrSlug
 * @returns {Promise<Object|null>}
 */
export async function fetchPostBySlug(idOrSlug) {
  if (!idOrSlug) return null;
  const post = await fetchApi(`/posts/${idOrSlug}`);
  if (!post) return null;
  return normalizePost(post);
}

/**
 * Fetch related posts from the same category or page category with smart fallback
 * @param {Object} options
 * @param {string} [options.categoryId]
 * @param {string} [options.pageCategory]
 * @param {string} [options.currentPostId]
 * @param {number} [options.limit=3]
 * @returns {Promise<Array>}
 */
export async function fetchRelatedPosts({ categoryId, pageCategory, currentPostId, limit = 3 }) {
  let related = [];

  // Step 1: Try fetching from the same pageCategory
  if (pageCategory) {
    const { posts } = await fetchPosts({
      pageCategory,
      status: "PUBLISHED",
      limit: limit + 2,
      sort: "newest",
    });
    related = posts.filter((p) => p.id !== currentPostId && p.slug !== currentPostId);
  } else if (categoryId) {
    const { posts } = await fetchPosts({
      category: categoryId,
      status: "PUBLISHED",
      limit: limit + 2,
      sort: "newest",
    });
    related = posts.filter((p) => p.id !== currentPostId && p.slug !== currentPostId);
  }

  // Step 2: If fewer than limit posts found, backfill with recent published posts
  if (related.length < limit) {
    const { posts: fallbackPosts } = await fetchPosts({
      status: "PUBLISHED",
      limit: limit + 5,
      sort: "newest",
    });

    const seenIds = new Set(related.map((p) => p.id).concat([currentPostId]));
    for (const post of fallbackPosts) {
      if (!seenIds.has(post.id) && post.slug !== currentPostId) {
        related.push(post);
        seenIds.add(post.id);
      }
      if (related.length >= limit) break;
    }
  }

  return related.slice(0, limit);
}

/**
 * Fetch approved comments for a post
 * @param {string} postIdOrSlug
 * @param {number} [page=1]
 * @param {number} [limit=50]
 * @returns {Promise<{ comments: Array, total: number }>}
 */
export async function fetchPostComments(postIdOrSlug, page = 1, limit = 50) {
  if (!postIdOrSlug) return { comments: [], total: 0 };
  const res = await fetchApi(`/comments/post/${postIdOrSlug}?page=${page}&limit=${limit}`);
  if (!res) return { comments: [], total: 0 };

  const data = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : [];
  return {
    comments: data,
    total: res.meta?.total || data.length,
  };
}

/**
 * Submit a comment on a post (supports guest and authenticated users)
 * @param {Object} data
 * @param {string} data.postId
 * @param {string} [data.parentId]
 * @param {string} data.content
 * @param {string} [data.authorName]
 * @param {string} [data.authorEmail]
 * @param {string} [data.userId]
 * @returns {Promise<Object|null>}
 */
export async function createPostComment(data) {
  return fetchApi('/comments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Record view count on post
 * @param {string} postIdOrSlug
 * @returns {Promise<void>}
 */
export async function recordPostView(postIdOrSlug) {
  if (!postIdOrSlug) return;
  try {
    await fetchApi(`/posts/${postIdOrSlug}/view`, {
      method: 'POST',
    });
  } catch (e) {
    // Non-critical, ignore error
  }
}

/**
 * Toggle like for a post
 * @param {string} postId
 * @param {string} userId
 * @returns {Promise<{ liked: boolean, count: number }|null>}
 */
export async function togglePostLike(postId, userId) {
  return fetchApi('/likes/toggle', {
    method: 'POST',
    body: JSON.stringify({ postId, userId }),
  });
}

/**
 * Toggle bookmark for a post
 * @param {string} postId
 * @param {string} userId
 * @returns {Promise<{ bookmarked: boolean, count: number }|null>}
 */
export async function togglePostBookmark(postId, userId) {
  return fetchApi('/bookmarks/toggle', {
    method: 'POST',
    body: JSON.stringify({ postId, userId }),
  });
}

/**
 * Register a new visitor user
 * @param {Object} data
 * @param {string} data.name
 * @param {string} data.email
 * @param {string} data.password
 * @returns {Promise<{ accessToken: string, user: Object }>}
 */
export async function registerUser({ name, email, password }) {
  const url = `${API_BASE_URL.replace(/\/$/, "")}/users/register`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = Array.isArray(data.message) ? data.message.join(", ") : (data.message || "Registration failed");
    throw new Error(errorMsg);
  }
  return data.data || data;
}

/**
 * Login a visitor user with email and password
 * @param {Object} data
 * @param {string} data.email
 * @param {string} data.password
 * @returns {Promise<{ accessToken: string, user: Object }>}
 */
export async function loginUser({ email, password }) {
  const url = `${API_BASE_URL.replace(/\/$/, "")}/users/login`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = Array.isArray(data.message) ? data.message.join(", ") : (data.message || "Invalid email or password");
    throw new Error(errorMsg);
  }
  return data.data || data;
}

/**
 * Fetch current user profile with JWT token
 * @param {string} [token]
 * @returns {Promise<Object|null>}
 */
export async function fetchCurrentUserProfile(token) {
  const activeToken = token || (typeof window !== "undefined" ? localStorage.getItem("scholar_auth_token") : null);
  if (!activeToken) return null;

  const url = `${API_BASE_URL.replace(/\/$/, "")}/users/me`;
  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${activeToken}`,
      },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.data || data;
  } catch (e) {
    return null;
  }
}

/**
 * Fetch user's bookmarked posts
 * @param {string} userId
 * @param {number} [page=1]
 * @param {number} [limit=20]
 * @returns {Promise<{ data: Array, meta: Object }>}
 */
export async function fetchUserBookmarks(userId, page = 1, limit = 20) {
  if (!userId) return { data: [], meta: { total: 0 } };
  const res = await fetchApi(`/users/${userId}/bookmarks?page=${page}&limit=${limit}`);
  if (!res) return { data: [], meta: { total: 0 } };
  return {
    data: Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : [],
    meta: res.meta || { total: (res.data || res || []).length },
  };
}

/**
 * Fetch user's liked posts
 * @param {string} userId
 * @param {number} [page=1]
 * @param {number} [limit=20]
 * @returns {Promise<{ data: Array, meta: Object }>}
 */
export async function fetchUserLikes(userId, page = 1, limit = 20) {
  if (!userId) return { data: [], meta: { total: 0 } };
  const res = await fetchApi(`/users/${userId}/likes?page=${page}&limit=${limit}`);
  if (!res) return { data: [], meta: { total: 0 } };
  return {
    data: Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : [],
    meta: res.meta || { total: (res.data || res || []).length },
  };
}

/**
 * Fetch user's comments
 * @param {string} userId
 * @param {number} [page=1]
 * @param {number} [limit=20]
 * @returns {Promise<{ data: Array, meta: Object }>}
 */
export async function fetchUserComments(userId, page = 1, limit = 20) {
  if (!userId) return { data: [], meta: { total: 0 } };
  const res = await fetchApi(`/users/${userId}/comments?page=${page}&limit=${limit}`);
  if (!res) return { data: [], meta: { total: 0 } };
  return {
    data: Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : [],
    meta: res.meta || { total: (res.data || res || []).length },
  };
}

/**
 * Update current visitor user profile (name, avatarUrl)
 * @param {Object} data
 * @param {string} [data.name]
 * @param {string} [data.avatarUrl]
 * @returns {Promise<Object>}
 */
export async function updateUserProfile({ name, avatarUrl }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("scholar_auth_token") : null;
  if (!token) throw new Error("Authentication required");

  const url = `${API_BASE_URL.replace(/\/$/, "")}/users/me`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, avatarUrl }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = Array.isArray(data.message)
      ? data.message.join(", ")
      : data.message || "Failed to update profile";
    throw new Error(errorMsg);
  }
  return data.data || data;
}


