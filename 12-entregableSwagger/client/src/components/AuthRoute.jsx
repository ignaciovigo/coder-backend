import { useAuth } from '../hooks/useAuth'
import { Navigate } from 'react-router-dom'

export default function AuthRoute({children}) {
    const { isAuthenticated } = useAuth()
    if(isAuthenticated) return <Navigate replace to='/products' />
  return children
}
