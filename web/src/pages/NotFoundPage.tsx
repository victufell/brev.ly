import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center">
      <div className="card max-w-md w-full mx-4 text-center">
        <div className="mb-6">
          <img src="/404.svg" alt="404" className="w-24 h-24 mx-auto mb-4" />
        </div>
        
        <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Link não encontrado
        </h2>
        <p className="text-gray-600 mb-8">
          O link que você está tentando acessar não existe, foi removido ou é uma URL inválida.{' '}
          <a 
            href="/"
            className="text-primary-600 hover:underline"
          >
            Saiba mais em brev.ly
          </a>
          .
        </p>
        
        <button
          onClick={() => navigate('/')}
          className="btn-primary w-full"
        >
          Voltar para o início
        </button>
      </div>
    </div>
  )
} 