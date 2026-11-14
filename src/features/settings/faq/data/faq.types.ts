/**
 * FAQ Request - Payload fields for create and update operations.
 * Sent as a plain JSON body.
 */
export interface FaqRequest {
  /** Category code of type FAQ_TARGET (e.g. guest_home) */
  target: string;
  question: string;
  questionEn?: string;
  answer: string;
  answerEn?: string;
  /** ISO date (yyyy-MM-dd) */
  startDate: string;
  /** ISO date (yyyy-MM-dd); empty/null = valid indefinitely */
  endDate?: string;
  sortOrder: number;
}

/**
 * FAQ Response - mirrors FaqResponseDTO from the backend.
 */
export interface FaqResponse {
  id: number;
  target: string;
  question: string;
  questionEn?: string;
  answer: string;
  answerEn?: string;
  startDate: string;
  endDate?: string;
  sortOrder: number;
  createdOn?: string;
  modifiedOn?: string;
  createdBy?: string;
  modifiedBy?: string;
}

/**
 * Public FAQ payload served by GET /api/public/faqs
 * (locale already resolved server-side with Indonesian fallback).
 */
export interface FaqPublicResponse {
  id: number;
  target: string;
  question: string;
  answer: string;
}