export interface FeaturedUploadResponse {
  status: 'success' | 'error';
  message: string;
  path: string; // "assets/images/…"
  url: string;  // absolute URL
}
