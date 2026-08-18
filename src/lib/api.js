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
