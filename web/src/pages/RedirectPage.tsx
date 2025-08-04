import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Logo } from '../components/Logo'
import { urlService } from '../services/api'

export default function RedirectPage() {
  const { shortUrl } = useParams<{ shortUrl: string }>()
  const navigate = useNavigate()

  const { data: urlData, isLoading, error } = useQuery({
    queryKey: ['url', shortUrl],
    queryFn: () => urlService.getUrlByShort(shortUrl!),
    enabled: !!shortUrl,
    retry: false,
  })

  useEffect(() => {
    if (urlData?.originalUrl) {
      window.location.href = urlData.originalUrl
    }
  }, [urlData])

  useEffect(() => {
    if (error) {
      navigate('/404', { replace: true })
    }
  }, [error, navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-200 flex items-center justify-center">
        <div className="card max-w-md w-full mx-4 text-center">
          <Logo className="mx-auto mb-6" />
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Redirecionando...
          </h1>
          <p className="text-gray-600">
            O link será aberto automaticamente em alguns instantes.
          </p>
          <p className="text-gray-500 text-sm mt-4">
            Não foi redirecionado?{' '}
            <button
              onClick={() => navigate('/')}
              className="text-primary-600 hover:underline"
            >
              Acesse aqui
            </button>
          </p>
        </div>
      </div>
    )
  }

  return null
} 