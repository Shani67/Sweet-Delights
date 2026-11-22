const entities: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#039;": "'",
  "&#8217;": "’",
  "&#8211;": "–",
  "&nbsp;": " ",
};

/**
 * WooCommerce returns descriptions as HTML. The storefront renders plain text so that
 * content from the CMS can never inject markup into the page.
 */
export function htmlToText(html: string | null | undefined): string {
  if (!html) return "";
  return html
    .replace(/<\/(p|div|h[1-6]|li)>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&[#a-z0-9]+;/gi, (entity) => entities[entity] ?? entity)
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
