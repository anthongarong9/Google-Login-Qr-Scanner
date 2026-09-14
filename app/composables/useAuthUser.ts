// composables/useAuthUser.ts
export interface GoogleUser {
  sub: string
  name: string
  given_name?: string
  family_name?: string
  picture: string
  email: string
  email_verified?: boolean
}

export const useAuthUser = () => useState<GoogleUser | null>('authUser', () => null)

export function loadAuthUser() {
  if (import.meta.client) {
    const raw = localStorage.getItem('google_user')
    useAuthUser().value = raw ? JSON.parse(raw) : null
  }
}

export function clearAuthUser() {
  if (import.meta.client) {
    localStorage.removeItem('google_user')
    localStorage.removeItem('google_token')
  }
  useAuthUser().value = null
}