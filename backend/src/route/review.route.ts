import {Elysia} from 'elysia';
import {getUserData} from '../middleware/authorization.middleware';
import {ReviewService} from '../service/review.service';
import {PostReviewBodyDto} from '../dto/review.dto';

const reviewRoutes = new Elysia({prefix: "/review", detail: {tags: ["Review"]}});

// ЕНДПОЙНТ ДЛЯ ПОЛУЧЕНИЯ ОТЗЫВОВ ПОЛЬЗОВАТЕЛЯ
reviewRoutes.get("/", async (ctx) => {
  try {
    // получаем чела по токену авторизации
    const userData = await getUserData(ctx);
    if (!userData) return ctx.set.status = 401;

    return ReviewService.getUserReviews(userData.id);
  } catch (err) {
    ctx.set.status = 500;
    console.error(err);
    return err;
  }
});

reviewRoutes.get("/:chatId", async (ctx) => {
  try {
    const {chatId} = ctx.params;

    return ReviewService.getChatReviewsWithUsers(+chatId);
  } catch (err) {
    ctx.set.status = 500;
    console.error(err);
    return err;
  }
});

reviewRoutes.post("/", async (ctx) => {
  try {
    if (ctx.body.rating < 0 || ctx.body.rating > 5) return ctx.set.status = 403;

    // получаем юзера по токену авторизации из хеадера
    const userData = await getUserData(ctx);
    if (!userData) return ctx.set.status = 401;

    const result = await ReviewService.createReview(
        ctx.body.rating,
        userData.id,
        ctx.body.chatId,
        ctx.body.text,
    );

    if (!result) return ctx.set.status = 500;

    return result;
  } catch (err) {
    ctx.set.status = 500;
    console.error(err);
    return err;
  }
}, {body: PostReviewBodyDto});

reviewRoutes.get("/rating/:chatId", async (ctx) => {
  try {
    const {chatId} = ctx.params;

    return ReviewService.getAverageRating(+chatId);
  } catch (err) {
    ctx.set.status = 500;
    console.error(err);
    return err;
  }
});

export default reviewRoutes;