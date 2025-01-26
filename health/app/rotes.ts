/**
* Type-safe route definitions for the application
*/

// Route path type definitions
type BasePath = '/' | '/dashboard' | '/profile' | '/settings'
type ApiPath = `/api/${string}`
export type RoutePath = BasePath | ApiPath

// Route constant definitions
export const routes = {
home: '/' as const,
dashboard: '/dashboard' as const,
profile: '/profile' as const,
settings: '/settings' as const,
} as const

// API routes
export const apiRoutes = {
base: '/api' as const,
// Add specific API routes here
createRoute: (path: string): ApiPath => `/api/${path}` as ApiPath,
} as const

// Type-safe URL builder
type QueryParams = Record<string, string | number | boolean | undefined>

export function createUrl(
path: RoutePath,
params?: QueryParams,
hash?: string
): string {
const searchParams = new URLSearchParams()

if (params) {
    Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
        searchParams.append(key, String(value))
    }
    })
}

const queryString = searchParams.toString()
const hashString = hash ? `#${hash}` : ''

return `${path}${queryString ? `?${queryString}` : ''}${hashString}`
}

// Route helper functions
export const getHomeUrl = () => routes.home
export const getDashboardUrl = () => routes.dashboard
export const getProfileUrl = () => routes.profile
export const getSettingsUrl = () => routes.settings
