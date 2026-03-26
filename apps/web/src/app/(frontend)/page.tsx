// Root redirect is handled by middleware (/ → /te).
// This file must exist for Next.js routing but is never reached in production.
export default function RootPage() {
    return null;
}
