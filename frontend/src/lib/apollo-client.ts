import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { CombinedGraphQLErrors } from '@apollo/client/errors'
import { getToken, clearToken } from './auth'

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_HTTP_URL || 'http://localhost:4000/graphql',
})

const authLink = setContext((_, { headers }) => {
  const token = getToken()
  return {
    headers: {
      ...headers,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  }
})

const errorLink = onError(({ error }) => {
  if (CombinedGraphQLErrors.is(error)) {
    const isUnauthorized = error.errors.some(
      (e: { extensions?: { code?: string; http?: { status?: number } } }) =>
        e.extensions?.code === 'NOT_AUTHENTICATED' || e.extensions?.http?.status === 401
    )
    if (isUnauthorized) {
      clearToken()
      window.location.href = '/login'
    }
  }
})

export const apolloClient = new ApolloClient({
  link: authLink.concat(errorLink).concat(httpLink),
  cache: new InMemoryCache(),
})
