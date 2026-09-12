import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get current time
  const now = new Date();
  
  // Convert to WIB (UTC+7)
  const wibTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
  const wibHour = wibTime.getUTCHours();
  
  // Maintenance is between 04:00 and 04:59:59 WIB
  const isMaintenanceHour = wibHour === 4;

  const pathname = request.nextUrl.pathname;
  
  // Always allow API, Admin, Next.js internal files, and static files
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') // basic check for files like images/css/favicon
  ) {
    return NextResponse.next();
  }

  // Handle maintenance page routing
  if (pathname === '/maintenance') {
    if (!isMaintenanceHour) {
      // If not maintenance hour, redirect away from maintenance page
      return NextResponse.redirect(new URL('/', request.url));
    }
    // Allow access to maintenance page during maintenance hour
    return NextResponse.next();
  }

  // For all other routes, if it's maintenance hour, redirect to /maintenance
  if (isMaintenanceHour) {
    return NextResponse.redirect(new URL('/maintenance', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
