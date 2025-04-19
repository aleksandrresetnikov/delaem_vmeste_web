import {Elysia} from 'elysia';
import {AuthService} from "../service/auth.service.ts";
import {LoginBodyDto, ProfilePostBodyDto, VerifyBodyDto} from '../dto/auth.dto.ts';
import {getUserData} from '../middleware/authorization.middleware.ts';
import prisma from '../util/prisma.ts';
import {OTPService} from '../service/otp.service.ts';
import {UserProvider} from '../providers/user.provider.ts';

const authRoutes = new Elysia({prefix: "/auth", detail: {tags: ["Auth"]}});

authRoutes.post('/login', async (ctx) => {
  try {
    await AuthService.login(ctx.body.email);

    return ctx.set.status = 204;
  } catch (err) {
    ctx.set.status = 500;
    console.error(err);
    return err;
  }
}, {body: LoginBodyDto});

authRoutes.post('/verify', async (ctx) => {
  try {
    const state = await OTPService.verifyOTP(ctx.body.email, ctx.body.otp);
    if (!state) return ctx.set.status = 401;

    const user = await UserProvider.getByEmail(ctx.body.email);
    if (!user) return false;

    const token = await ctx.jwt.sign({email: ctx.body.email});
    if (!token) return false;

    const session = await AuthService.createSession(token, "", "52.1.52.00", user.id)
    if (!session) return false;

    return {token};
  } catch (err) {
    ctx.set.status = 500;
    console.error(err);
    return err;
  }
}, {body: VerifyBodyDto});

authRoutes.post('/profile', async (ctx) => {
  try {
    const userData = await getUserData(ctx);
    if (!userData || !ctx.body) return ctx.set.status = 401;

    if (ctx.body.role && userData.role || ctx.body.role === "ADMIN") return ctx.set.status = 403;

    const data = {
      ...ctx.body,
      //categories: ctx.body.categories?.join(",")
    }

    await prisma.user.update({
      where: {email: userData.email},
      data
    });

    return ctx.set.status = 204;
  } catch (err) {
    ctx.set.status = 500;
    console.error(err);
    return err;
  }
}, {body: ProfilePostBodyDto});

authRoutes.get('/profile', async (ctx) => {
  try {
    let userData = await getUserData(ctx);
    if (!userData) return ctx.set.status = 401;

    //delete userData.createdAt;
    return userData;
  } catch (err) {
    ctx.set.status = 500;
    console.error(err);
    return err;
  }
});

export default authRoutes;