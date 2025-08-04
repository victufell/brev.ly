import { z } from 'zod'

export const createUrlSchema = z.object({
  originalUrl: z
    .string()
    .min(1, 'URL é obrigatória')
    .url('URL deve ser válida')
    .refine((url) => {
      try {
        const urlObj = new URL(url)
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
      } catch {
        return false
      }
    }, 'URL deve começar com http:// ou https://'),
  
  shortUrl: z
    .string()
    .optional()
    .refine((value) => {
      if (!value) return true
      return /^[a-zA-Z0-9-]{3,20}$/.test(value)
    }, 'URL encurtada deve ter entre 3-20 caracteres e conter apenas letras, números e hífens'),
})

export type CreateUrlFormData = z.infer<typeof createUrlSchema> 