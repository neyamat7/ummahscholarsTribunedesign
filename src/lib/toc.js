/**
 * Utility to extract H2 and H3 headings from rich content for Table of Contents
 * @param {string} html
 * @returns {Array<{ id: string, text: string, level: number }>}
 */
export function extractHeadings(html) {
  if (!html || typeof html !== "string") return [];

  const headings = [];
  const regex = /<(h[23])([^>]*)>(.*?)<\/\1>/gi;
  let match;
  let index = 0;

  while ((match = regex.exec(html)) !== null) {
    const tag = match[1].toLowerCase();
    const rawText = match[3] || "";
    const cleanText = rawText.replace(/<[^>]+>/g, "").trim();

    if (cleanText) {
      const slug =
        cleanText
          .toLowerCase()
          .replace(/[^\w\u0600-\u06FF]+/g, "-")
          .replace(/^-+|-+$/g, "") || `section-${++index}`;

      const level = tag === "h2" ? 2 : 3;
      headings.push({ id: slug, text: cleanText, level });
    }
  }

  return headings;
}
