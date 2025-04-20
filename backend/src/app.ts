// Импорт библиотек
import Elysia from 'elysia';
import {swagger} from '@elysiajs/swagger';
import {cors} from '@elysiajs/cors';
import { staticPlugin } from '@elysiajs/static';
import jwt from "@elysiajs/jwt";
import 'dotenv/config';

import packageJSON from "./../package.json";

import colors from "colors";
import AuthRoute from "./route/auth.route.ts";
import ChatRoute from "./route/chat.route.ts";
import CompanyRoute from "./route/company.route.ts";
import ReviewRoute from "./route/review.route.ts";
import {Logestic} from 'logestic';
import { WebRTCService } from './service/webrtc.service.ts';
import * as fs from "node:fs";

export const backendLink = "http://localhost:8000";
const app = new Elysia();

console.log("");
console.log(colors.inverse("Delaem Vmeste " + packageJSON.version));
console.log("");

async function bootstrap() {
  // Middleware для логирования
  app.use(Logestic.preset('fancy'));

  // JWT
  app.use(
      jwt({
        name: 'jwt',
        secret: process.env.JWT_SECRET || ""
      })
  );

  // Подключение Swagger (доступен по /swagger)
  app.use(swagger(
      {
        documentation: {
          info: {
            title: 'Вместе Лучше',
            version: '1.0.0'
          }
        }
      }
  ));

  // Preflight fix
  app.options("*", (ctx) => {
    ctx.set.status = 204;
    return '204 No Content';
  });

  // Middleware для защиты
//   app.onBeforeHandle(async (ctx: Context) => {
//     // Проверка авторизации
//     let chk = await authorizationMiddleware(ctx);
//     if (!chk) return ctx.error(401, "Unauthorized");
//   })

  // Настройка CORS
  app.use(cors({
    credentials: true,
    origin: 'http://tula.vyatkaowls.ru',
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"]
  }));

  // Подключение роутов
  app.group("/api", (app) =>
      app
          .use(AuthRoute)
          .use(ChatRoute)
          .use(CompanyRoute)
          .use(ReviewRoute)
  );

  if(!fs.existsSync("files/")){
    fs.mkdirSync("files");
  }

  app.use(staticPlugin({
    prefix: "/files",
    assets: "files"
  }));

  // Gодключаем WebRTP:
  WebRTCService.runRtcServer();

  // Едем
  app.listen(8000, () => {
    console.log(`Server started on ${backendLink}...`);
  });
}

bootstrap();