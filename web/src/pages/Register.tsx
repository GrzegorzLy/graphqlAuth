import React, { useState } from 'react';
import { useRegisterMutation } from '../generated/graphql';
import { RouteComponentProps } from 'react-router';

export const Register: React.FC<RouteComponentProps> = ({ history }) => {
	const [ email, setEmail ] = useState('');
	const [ password, setPassword ] = useState('');
	const [ submit ] = useRegisterMutation();

	const onSubmit = async (e: any) => {
		e.preventDefault();
		await submit({ variables: { email, password } });
		history.push('/');
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
					<button type='submit'>Submit</button>
				</div>
			</form>
		</div>
	);
};
