import { GraphQLError } from 'graphql';

export const NOT_AUTHENTICATED_ERROR = new GraphQLError('Not authenticated', { extensions: { code: 'NOT_AUTHENTICATED', http: { status: 401 } } });
export const NOT_AUTHORIZED_ERROR = new GraphQLError('Not authorized', { extensions: { code: 'NOT_AUTHORIZED', http: { status: 403 } } });
export const NOT_FOUND_ERROR = new GraphQLError('Not found', { extensions: { code: 'NOT_FOUND', http: { status: 404 } } });

export const ERROR_MESSAGE = (message: string, code: string, status: number): GraphQLError => {
    return new GraphQLError(message, { extensions: { code, http: { status } } });
};
