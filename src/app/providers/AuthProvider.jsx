import { useAuthInit } from '../../features/auth/useAuth'

export default function AuthProvider({ children }) {
  useAuthInit()
  return children
}