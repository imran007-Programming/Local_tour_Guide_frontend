// Intentionally empty: no full-screen loader inside the dashboard. Without this
// file Next.js would fall back to app/loading.tsx and cover the whole screen
// (sidebar included) on every dashboard navigation.
export default function DashboardLoading() {
  return null;
}
