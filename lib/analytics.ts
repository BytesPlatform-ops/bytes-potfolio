/**
 * Optional analytics. Nothing loads unless the matching environment variable
 * is set — there are no placeholder IDs anywhere in this file.
 *
 *   NEXT_PUBLIC_GA_ID              e.g. G-XXXXXXXXXX
 *   NEXT_PUBLIC_META_PIXEL_ID      e.g. 000000000000000
 *   NEXT_PUBLIC_LINKEDIN_PARTNER_ID
 */
export const analytics = {
  gaId: process.env.NEXT_PUBLIC_GA_ID,
  metaPixelId: process.env.NEXT_PUBLIC_META_PIXEL_ID,
  linkedInPartnerId: process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID,
};

export const hasAnalytics = Boolean(
  analytics.gaId || analytics.metaPixelId || analytics.linkedInPartnerId,
);
