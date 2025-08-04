import axios from 'axios'
import type { CreateUrlRequest, CreateUrlResponse, ShortUrl } from '../types'

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:3333',
  timeout: 10000,
})

export const urlService = {
  async createUrl(data: CreateUrlRequest): Promise<CreateUrlResponse> {
    const response = await api.post('/api/urls', data)
    return response.data.url
  },

  async getUrls(): Promise<ShortUrl[]> {
    const response = await api.get('/api/urls')
    return response.data.urls
  },

  async getUrlByShort(shortUrl: string): Promise<ShortUrl> {
    const response = await api.get(`/api/urls/${shortUrl}`)
    return response.data.url
  },

  async deleteUrl(id: string): Promise<void> {
    await api.delete(`/api/urls/${id}`)
  },

  async downloadCSV(): Promise<Blob> {
    const response = await api.get('/api/urls/export/csv', {
      responseType: 'blob',
    })
    return response.data
  },
}

export default api 