import React, { useState, useEffect } from 'react';
import { Routes } from './Routes';
import { setAccessToken } from './accessToken';

export const App: React.FC = () => {
	const [ loading, setLoading ] = useState(true);
	useEffect(() => {
		fetch('http://localhost:4000/refresh_token', { method: 'POST', credentials: 'include' }).then(async (x) => {
			const data = await x.json();
			if (data && data.ok) {
				setAccessToken(data.accessToken);
			}
			setLoading(false);
		});
	}, []);

	if (loading) {
		return <div>Loading...</div>;
	}
	return <Routes />;
};
