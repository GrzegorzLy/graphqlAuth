import jwtDecode from 'jwt-decode';

let accessToken = '';

export const setAccessToken = (token: string) => (accessToken = token);
export const getAccessToken = () => accessToken;
export const fetchAccessToken = () =>
	fetch('http://localhost:4000/refresh_token', { method: 'POST', credentials: 'include' });

export const validateAccessToken = (token: string) => {
	if (!token) return false;
	try {
		const { exp } = jwtDecode(token);
		if (Date.now() >= exp * 1000) {
			return false;
		}
		return true;
	} catch (err) {
		return false;
	}
};
