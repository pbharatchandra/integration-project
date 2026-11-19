import { Navigate } from 'react-router'
import { getAccessToken } from '../../api'

const ProtectedRoute = ({ children }) => {
  const token = getAccessToken()
  if (token === undefined) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default ProtectedRoute
