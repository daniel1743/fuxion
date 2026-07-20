/**
 * BAIOS - Editor IA
 * Asset Contracts — Phase 1C
 */

export type AssetType =
  | 'IMAGE'
  | 'VIDEO'
  | 'PDF'
  | 'SVG'
  | 'ICON'
  | 'AUDIO'
  | 'INFOGRAPHIC';

export interface Asset {
  id: string;
  type: AssetType;
  url: string;
  alt_text: string;
  width: number | null;
  height: number | null;
  file_size_bytes: number | null;
  mime_type: string;
  article_id: string | null;
  created_at: string;
}

export interface AssetUploadRequest {
  file_name: string;
  mime_type: string;
  type: AssetType;
  article_id: string;
}

export interface AssetUploadResult {
  asset: Asset;
  upload_url: string;
}

export interface AssetSearchQuery {
  type?: AssetType;
  article_id?: string;
  keyword?: string;
  limit: number;
  offset: number;
}