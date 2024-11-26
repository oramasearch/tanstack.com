import { createRouter as TanStackCreateRouter } from '@tanstack/react-router'
import { routerWithQueryClient } from '@tanstack/react-router-with-query'
import { ConvexQueryClient } from '@convex-dev/react-query'
import { ConvexProvider } from 'convex/react'
import { routeTree } from './routeTree.gen'
import { DefaultCatchBoundary } from './components/DefaultCatchBoundary'
import { NotFound } from './components/NotFound'
import { QueryClient } from '@tanstack/react-query'

export function createRouter() {
  const CONVEX_URL =
    (import.meta as any).env.VITE_CONVEX_URL ||
    'https://intent-pigeon-358.convex.cloud'
  if (!CONVEX_URL) {
    console.error('missing env var VITE_CONVEX_URL')
  }
  const convexQueryClient = new ConvexQueryClient(CONVEX_URL)

  const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
      },
    },
  })

  convexQueryClient.connect(queryClient)

  const router = routerWithQueryClient(
    TanStackCreateRouter({
      routeTree,
      defaultPreload: 'intent',
      defaultErrorComponent: DefaultCatchBoundary,
      defaultStaleTime: 1,
      defaultNotFoundComponent: () => {
        return <NotFound />
      },
      context: {
        queryClient,
      },
      Wrap: ({ children }) => (
        <ConvexProvider client={convexQueryClient.convexClient}>
          {children}
        </ConvexProvider>
      ),
    }),
    queryClient
  )

  router.subscribe('onResolved', () => {
    try {
      ;(window as any)._carbonads?.refresh?.()
      document.querySelectorAll('[id^="carbonads_"]').forEach((el, i) => {
        if (i > 0) {
          el.remove()
        }
      })
    } catch {}
  })

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
  interface StaticDataRouteOption {
    baseParent?: boolean
  }
}
