import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import cors from 'cors';
import { UserResolver } from './UserResolver';
import { createConnection } from 'typeorm';
import cookieParser from 'cookie-parser';
import { verifyRefreshToken, createAccessToken, sendRefreshToken } from './auth';
import { User } from './entity/User';

const port = 4000;
(async () => {
	const app = express();
	app.use(cookieParser());
	app.use(
		cors({
			origin: 'http://localhost:3000',
			credentials: true,
		}),
	);
	app.get('/', (_, res) => res.send('helllllllo'));

	app.post('/refresh_token', async (req, res) => {
		const token = req.cookies.jid;
		if (!token) {
			return res.send({ ok: false, accessToken: '' });
		}
		try {
			const { userId, tokenVersion }: any = verifyRefreshToken(token);
			const user = await User.findOne({ id: userId });

			if (!user || user.tokenVersion !== tokenVersion) {
				return res.send({ ok: false, accessToken: '' });
			}
			sendRefreshToken(res, user);
			return res.send({ ok: true, accessToken: createAccessToken(user) });
		} catch (err) {
			console.log(err);
			return res.send({ ok: false, accessToken: '' });
		}
	});

	await createConnection();

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [ UserResolver ],
		}),
		context: ({ req, res }) => ({ req, res }),
	});
	apolloServer.applyMiddleware({ app, cors: false });

	app.listen(port, () => {
		console.log(`express server started at port ${port}`);
	});
})();

// createConnection().then(async connection => {

//     console.log("Inserting a new user into the database...");
//     const user = new User();
//     user.firstName = "Timber";
//     user.lastName = "Saw";
//     user.age = 25;
//     await connection.manager.save(user);
//     console.log("Saved a new user with id: " + user.id);

//     console.log("Loading users from the database...");
//     const users = await connection.manager.find(User);
//     console.log("Loaded users: ", users);

//     console.log("Here you can setup and run express/koa/any other framework.");

// }).catch(error => console.log(error));
