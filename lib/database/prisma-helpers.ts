import type { Prisma } from "@prisma/client";

// ============================================
// COMMON PRISMA QUERY PATTERNS
// ============================================

/**
 * Include pattern for RSS feed with article count
 * Used in: getRssFeedsByUserId, getRssFeedById, getAllRssFeedsByUserId
 */

/**
 * Include pattern for RSS feed with article count
 * Used in:getRssFeedsByUserId, getRssFeedById, getAllRssFeedsByUserId
 */
export const FEED_WITH_COUNT_INCLUDE = {
  _count: {
    select: {
      articles: true,
    },
  },
} as const satisfies Prisma.RssFeedInclude;

/**
 * Common orderBy pattern for feeds (descending by creation date)
 */
export const FEED_ORDER_BY_CREATED_DESC = {
  createdAt: "desc",
} as const satisfies Prisma.RssFeedOrderByWithRelationInput;
