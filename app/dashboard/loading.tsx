// Intentionally empty: no loader inside the dashboard, so the sidebar and
// header stay put while a page loads. The full-screen loader lives in
// app/(main)/loading.tsx (not app/loading.tsx) so it never covers the screen
// on the way into the dashboard either.
export default function DashboardLoading() {
  return null;
}
