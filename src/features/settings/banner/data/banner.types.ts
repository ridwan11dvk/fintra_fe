/**
 * Banner Request - Payload fields for create and update operations.
 * Sent as multipart/form-data alongside the optional `image` file part.
 */
export interface BannerRequest {
  target: string;
  title: string;
  titleEn?: string;
  subtitle?: string;
  subtitleEn?: string;
  description?: string;
  descriptionEn?: string;
  /** ISO date (yyyy-MM-dd) */
  startDate: string;
  /** ISO date (yyyy-MM-dd); empty/null = valid indefinitely */
  endDate?: string;
  sortOrder: number;
}

/**
 * Banner Response - mirrors BannerResponseDTO from the backend.
 * `imageUrl` is a short-lived presigned URL (null for text-only banners).
 */
export interface BannerResponse {
  id: number;
  target: string;
  title: string;
  titleEn?: string;
  subtitle?: string;
  subtitleEn?: string;
  description?: string;
  descriptionEn?: string;
  imageUrl?: string;
  startDate: string;
  endDate?: string;
  sortOrder: number;
  createdOn?: string;
  modifiedOn?: string;
  createdBy?: string;
  modifiedBy?: string;
}

/**
 * Public banner payload served by GET /api/public/banners
 * (locale already resolved server-side with Indonesian fallback).
 */
export interface BannerPublicResponse {
  id: number;
  target: string;
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
}
