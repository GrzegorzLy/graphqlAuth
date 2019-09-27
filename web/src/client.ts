import { getAccessToken, setAccessToken, validateAccessToken, fetchAccessToken } from './accessToken';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink, Observable } from 'apollo-link';
import { TokenRefreshLink } from 'apollo-link-token-refresh';

const cache = new InMemoryCache({});

const requestLink = new ApolloLink(
	(operation, forward) =>
		new Observable((observer) => {
			let handle: any;
			Promise.resolve(operation)
				.then((operation) => {
					const accessToken = getAccessToken();
					if (accessToken) {
						operation.setContext({
							headers: {
								authorization: `bearer ${accessToken}`,
							},
						});
					}
				})
				.then(() => {
					handle = forward(operation).subscribe({
						next: observer.next.bind(observer),
						error: observer.error.bind(observer),
						complete: observer.complete.bind(observer),
					});
				})
				.catch(observer.error.bind(observer));

			return () => {
				if (handle) handle.unsubscribe();
			};
		}),
);

export const client = new ApolloClient({
	link: ApolloLink.from([
		new TokenRefreshLink({
			accessTokenField: 'accessToken',
			isTokenValidOrUndefined: () => validateAccessToken(getAccessToken()),
			fetchAccessToken: () => fetchAccessToken(),
			handleFetch: (accessToken) => setAccessToken(accessToken),
			handleError: (err) => {
				console.warn('Your refresh token is invalid. Try to relogin');
				console.error(err);
			},
		}),
		onError(({ graphQLErrors, networkError }) => {
			console.log(graphQLErrors);
			console.log(networkError);
		}),
		requestLink,
		new HttpLink({
			uri: 'http://localhost:4000/graphql',
			credentials: 'include',
		}),
	]),
	cache,
});
