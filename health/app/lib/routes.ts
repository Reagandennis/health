// Route constants
export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  DOCTORS: {
    DASHBOARD: '/doctors/dashboard',
    APPLICATIONS: '/doctors/applications',
    APPLICATION_STATUS: '/doctors/applications/status',
  },
  API: {
    TEST_DB: '/api/test-db',
    DOCTORS: {
      APPLICATIONS: '/api/doctors/applications',
      APPLICATION_STATUS: '/api/doctors/applications/status',
    },
  },
} as const;

// Route parameter types
export type RouteParams = {
  id?: string | number;
  [key: string]: string | number | undefined;
};

export type DoctorApplicationParams = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  licenseNumber: string;
  specialization: string;
  yearsOfExperience: number;
  education: string;
  bio: string;
  currentWorkplace: string;
};

export type ApplicationStatusParams = {
  applicationId: string;
  status?: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
};

// Helper functions
export function createUrl(path: string, params?: RouteParams): string {
  if (!params) return path;

  const url = new URL(path, 'http://placeholder');
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.append(key, String(value));
    }
  });

  return `${url.pathname}${url.search}`;
}

export function createApiUrl(path: string, params?: RouteParams): string {
  return createUrl(path, params);
}

export function getDoctorApplicationUrl(applicationId?: string): string {
  return applicationId
    ? createApiUrl(ROUTES.API.DOCTORS.APPLICATIONS + `/${applicationId}`)
    : createApiUrl(ROUTES.API.DOCTORS.APPLICATIONS);
}

export function getDoctorApplicationStatusUrl(params: ApplicationStatusParams): string {
  return createApiUrl(ROUTES.API.DOCTORS.APPLICATION_STATUS, params);
}

// Helper function to flatten nested route objects
interface RouteValue {
  [key: string]: string | Record<string, RouteValue | string>;
}

function isRouteValue(value: unknown): value is Record<string, RouteValue | string> {
  return typeof value === 'object' && value !== null;
}

function flattenRoutes(routes: Record<string, RouteValue | string>, prefix = ''): string[] {
  return Object.entries(routes).reduce((acc: string[], [key, value]) => {
    if (typeof value === 'string') {
      acc.push(prefix + value);
    } else if (isRouteValue(value)) {
      acc.push(...flattenRoutes(value, prefix + key + '/'));
    }
    return acc;
  }, []);
}

// Type guard to check if a string is a valid route
export function isValidRoute(route: string): boolean {
  const flatRoutes = flattenRoutes(ROUTES);
  return flatRoutes.includes(route);
}

