import React, { useState } from 'react';
import { useLoginMutation } from '../generated/graphql';
import { RouteComponentProps } from 'react-router';
import { setAccessToken, getAccessToken } from '../accessToken';

export const Login: React.FC<RouteComponentProps> = ({ history }) => {
	const [ email, setEmail ] = useState('');
	const [ password, setPassword ] = useState('');
	const [ submit ] = useLoginMutation();

	const onSubmit = async (e: any) => {
		e.preventDefault();
		const { data } = await submit({ variables: { email, password } });
		if (data) {
			setAccessToken(data.login.accessToken);
			console.log(getAccessToken());
		}
	};
	return (
		<div>
			<form onSubmit={onSubmit}>
				<div>
					<input value={email} onChange={(e) => setEmail(e.target.value)} type='email' placeholder='email' />
				</div>
				<div>
					<input
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						type='password'
						placeholder='password'
					/>
				</div>
				<div>
					<button type='submit'>Login</button>
				</div>
			</form>
		</div>
	);
};
