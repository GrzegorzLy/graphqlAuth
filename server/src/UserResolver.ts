import 'dotenv/config';
import { Resolver, Query, Mutation, Arg, ObjectType, Field, Ctx, UseMiddleware, Int } from 'type-graphql';
import { User } from './entity/User';
import { hash, compare } from 'bcryptjs';
import { MyContext } from './MyContext';
import { createAccessToken, sendRefreshToken, verifyAccessToken, createRefreshToken } from './auth';
import { isAuth } from './isAuth';
import { getConnection } from 'typeorm';

@ObjectType()
class LoginResponse {
	@Field() accessToken: String;
}

@Resolver()
export class UserResolver {
	@Query(() => String)
	hello() {
		return 'hi';
	}

	@Query(() => String)
	@UseMiddleware(isAuth)
	bye(@Ctx() { payload }: MyContext) {
		console.log(payload);
		return `your id is ${payload!.userId}`;
	}

	@Query(() => [ User ])
	@UseMiddleware(isAuth)
	users() {
		return User.find();
	}

	@Query(() => User, { nullable: true })
	me(@Ctx() context: MyContext) {
		const authorization = context.req.headers['authorization'];
		if (!authorization) {
			return null;
		}
		try {
			const token = authorization.split(' ')[1];
			const payload: any = verifyAccessToken(token);
			return User.findOne(payload.userId);
		} catch (err) {
			return null;
		}
	}

	@Mutation(() => Boolean)
	async RevokeRefreshTokenForUser(
		@Arg('userId', () => Int)
		userId: number,
	) {
		await getConnection().getRepository(User).increment({ id: userId }, 'tokenVersion', 1);
		return true;
	}

	@Mutation(() => Boolean)
	async logout(@Ctx() { res }: MyContext) {
		sendRefreshToken(res, '');
		return true;
	}

	@Mutation(() => LoginResponse)
	async login(
		@Arg('email') email: string,
		@Arg('password') password: string,
		@Ctx() { res }: MyContext,
	): Promise<LoginResponse> {
		const user = await User.findOne({ where: { email } });
		if (!user) {
			throw new Error('Could not fine user');
		}
		const valid = await compare(password, user.password);
		if (!valid) {
			throw new Error('authentication failed!');
		}
		sendRefreshToken(res, createRefreshToken(user));
		return {
			accessToken: createAccessToken(user),
		};
	}

	@Mutation(() => Boolean)
	async register(@Arg('email') email: string, @Arg('password') password: string) {
		try {
			const hashedPassword = await hash(password, 12);
			await User.insert({ email, password: hashedPassword });
		} catch (error) {
			console.log(error);
			return false;
		}

		return true;
	}
}
