import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

export default function ProtectedRoute({ children }) {
    const {isAuthenticated} = useAuth()
    console.log(isAuthenticated);
    if(!isAuthenticated) return <Navigate to='/login' replace/>
  return children
}
