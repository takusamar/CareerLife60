import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { AppBar } from '../components/AppBar'
import { Box } from '@chakra-ui/react'

export const Route = createRootRoute({
  component: RootPage
})

function RootPage() {
  return (
    <Box w="full">
      <AppBar />
      <Outlet />
      <TanStackRouterDevtools />
    </Box>
  )
}