export interface CreateUrlDto {
  originalUrl: string;
  shortUrl?: string;
}

export interface UrlResponseDto {
  id: string;
  originalUrl: string;
  shortUrl: string;
  accessCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListUrlsDto {
  page?: string;
  limit?: string;
}

export interface ListUrlsResponseDto {
  urls: UrlResponseDto[];
  total: number;
}

export interface CsvExportResponseDto {
  message: string;
  url: string;
  filename: string;
}

export interface GetUrlParamsDto {
  shortUrl: string;
}

export interface DeleteUrlParamsDto {
  id: string;
}
