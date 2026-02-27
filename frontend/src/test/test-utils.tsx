import * as React from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MockedProvider } from '@apollo/client/testing/react'
import type { MockedResponse } from '@apollo/client/testing'
import { AuthProvider } from '@/contexts/AuthContext'

export * from '@testing-library/react'

const defaultQueryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
})

export interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  mocks?: readonly MockedResponse[]
  queryClient?: QueryClient
}

function createWrapper(
  mocks: readonly MockedResponse[] = [],
  queryClient: QueryClient = defaultQueryClient
) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MockedProvider mocks={[...mocks]}>
          <AuthProvider>
            <BrowserRouter>{children}</BrowserRouter>
          </AuthProvider>
        </MockedProvider>
      </QueryClientProvider>
    )
  }
}

export function renderWithProviders(
  ui: React.ReactElement,
  options: RenderWithProvidersOptions = {}
) {
  const {
    mocks = [],
    queryClient = defaultQueryClient,
    ...renderOptions
  } = options
  const Wrapper = createWrapper(mocks, queryClient)
  return render(ui, {
    wrapper: Wrapper,
    ...renderOptions,
  })
}
