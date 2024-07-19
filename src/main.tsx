import React from 'react'
import ReactDOM from 'react-dom/client'

import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { ChakraProvider } from '@chakra-ui/react'
import { FirebaseProvider } from './providers/FirebaseProviders'

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FirebaseProvider>
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider>
    </FirebaseProvider>
  </React.StrictMode>,
)
