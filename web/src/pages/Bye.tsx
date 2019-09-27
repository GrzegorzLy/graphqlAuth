import React from 'react';
import { useByeQuery } from '../generated/graphql';

export const Bye: React.FC = () => {
	const { data, error, loading } = useByeQuery({ fetchPolicy: 'network-only' });
	if (loading) {
		return <div>loading...</div>;
	}

	if (error) {
		console.log(error);
		return <div>error</div>;
	}
	return <div>{data && data.bye}</div>;
};
