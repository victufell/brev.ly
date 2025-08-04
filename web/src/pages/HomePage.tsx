import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Copy, Download, Link2, Trash2, ExternalLink } from 'lucide-react'
import { Logo } from '../components/Logo'
import { urlService } from '../services/api'
import { createUrlSchema, type CreateUrlFormData } from '../utils/validation'
import { cn } from '../utils/cn'

export default function HomePage() {
  const [copySuccess, setCopySuccess] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateUrlFormData>({
    resolver: zodResolver(createUrlSchema),
  })

  const { data: urls = [], isLoading } = useQuery({
    queryKey: ['urls'],
    queryFn: urlService.getUrls,
  })

  const createUrlMutation = useMutation({
    mutationFn: urlService.createUrl,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['urls'] })
      reset()
    },
  })

  const deleteUrlMutation = useMutation({
    mutationFn: urlService.deleteUrl,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['urls'] })
    },
  })

  const downloadCSVMutation = useMutation({
    mutationFn: urlService.downloadCSV,
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'links-report.csv'
      a.click()
      window.URL.revokeObjectURL(url)
    },
  })

  const onSubmit = (data: CreateUrlFormData) => {
    createUrlMutation.mutate(data)
  }

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(id)
      setTimeout(() => setCopySuccess(null), 2000)
    } catch (err) {
      console.error('Erro ao copiar:', err)
    }
  }

  const getShortUrl = (shortUrl: string) => {
    const baseUrl = import.meta.env.VITE_FRONTEND_URL || window.location.origin
    return `${baseUrl}/${shortUrl}`
  }

  return (
    <div className="min-h-screen bg-gray-200 py-8 px-4">
              <div className="max-w-6xl mx-auto">
          <div className="mb-8 max-md:text-center">
            <Logo className="mx-auto mb-4" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card">
            <h2 className="text-lg font-semibold text-gray-600 mb-6">Novo link</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label htmlFor="originalUrl" className="block text-xs font-medium text-gray-500 mb-2">
                  LINK ORIGINAL
                </label>
                <input
                  {...register('originalUrl')}
                  type="url"
                  id="originalUrl"
                  placeholder="www.exemplo.com.br"
                  className={cn(
                    'input-field',
                    errors.originalUrl && 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  )}
                />
                {errors.originalUrl && (
                  <p className="mt-1 text-sm text-red-600">{errors.originalUrl.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="shortUrl" className="block text-xs font-medium text-gray-500 mb-2">
                  LINK ENCURTADO
                </label>
                <input
                  {...register('shortUrl')}
                  type="text"
                  id="shortUrl"
                  placeholder="brev.ly/"
                  className={cn(
                    'input-field',
                    errors.shortUrl && 'border-red-500 focus:ring-red-500 focus:border-red-500'
                  )}
                />
                {errors.shortUrl && (
                  <p className="mt-1 text-sm text-red-600">{errors.shortUrl.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || createUrlMutation.isPending}
                className="btn-primary w-full"
              >
                {isSubmitting || createUrlMutation.isPending ? 'Salvando...' : 'Salvar link'}
              </button>

              {createUrlMutation.error && (
                <p className="text-sm text-red-600 text-center">
                  Erro ao criar link. Tente novamente.
                </p>
              )}
            </form>
                      </div>

            <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-600">Meus links</h2>
              {urls.length > 0 && (
                <button
                  onClick={() => downloadCSVMutation.mutate()}
                  disabled={downloadCSVMutation.isPending}
                  className="btn-secondary flex items-center gap-2 text-xs font-semibold text-gray-500"
                >
                  <Download size={16} />
                  Baixar CSV
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : urls.length === 0 ? (
              <div className="text-center py-12">
                <Link2 size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 text-xs">Ainda não existem links cadastrados</p>
              </div>
            ) : (
              <div className="space-y-4">
                {urls.map((url) => (
                  <div key={url.id} className="border-y border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <a
                          href={getShortUrl(url.shortUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 font-medium hover:underline flex items-center gap-1 text-sm"
                        >
                          brev.ly/{url.shortUrl}
                          <ExternalLink size={14} />
                        </a>
                        <p className="text-gray-600 text-sm truncate mt-1 text-sm">
                          {url.originalUrl}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <p className="text-gray-500 text-xs">
                          {url.accessCount} acessos
                        </p>
                        <button
                          onClick={() => copyToClipboard(getShortUrl(url.shortUrl), url.id)}
                          className="p-2 text-gray-400 bg-gray-200 rounded-lg hover:text-gray-600 transition-colors w-8 h-8 flex items-center justify-center"
                          title="Copiar link"
                        >
                          {copySuccess === url.id ? (
                            <span className="text-green-600 text-xs">Copiado!</span>
                          ) : (
                            <Copy size={16} />
                          )}
                        </button>
                        
                        <button
                          onClick={() => deleteUrlMutation.mutate(url.id)}
                          disabled={deleteUrlMutation.isPending}
                          className="p-2 text-gray-400 bg-gray-200 rounded-lg hover:text-red-600 transition-colors w-8 h-8 flex items-center justify-center "
                          title="Deletar link"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 