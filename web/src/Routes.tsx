import React from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import styled from 'styled-components';
import { Bye } from './pages/Bye';

const Header = styled.header`
	display: flex;
	flex-direction: row;
	justify-content: center;
	> div {
		margin: 1rem;
	}
`;

export const Routes: React.FC = () => {
	return (
		<BrowserRouter>
			<div>
				<Header>
					<div>
						<Link to='/'>Home</Link>
					</div>
					<div>
						<Link to='/login'>Login</Link>
					</div>
					<div>
						<Link to='/register'>Register</Link>
					</div>
					<div>
						<Link to='/bye'>Bye</Link>
					</div>
				</Header>
				<Switch>
					<Route exact path='/' component={Home} />
					<Route exact path='/login' component={Login} />
					<Route exact path='/register' component={Register} />
					<Route exact path='/bye' component={Bye} />
				</Switch>
			</div>
		</BrowserRouter>
	);
};
