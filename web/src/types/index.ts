export interface ShortUrl {
  id: string
  originalUrl: string
  shortUrl: string
  accessCount: number
  createdAt: string
  updatedAt: string
}

export interface CreateUrlRequest {
  originalUrl: string
  shortUrl?: string
}

export interface CreateUrlResponse {
  id: string
  originalUrl: string
  shortUrl: string
  accessCount: number
  createdAt: string
  updatedAt: string
}

export interface ApiError {
  message: string
  statusCode: number
} 