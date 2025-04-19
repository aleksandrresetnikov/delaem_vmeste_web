import {Elysia} from 'elysia';
import {CompanyService} from '../service/company.service';
import {PostCompanyDto} from '../dto/company.dto';
import {getUserData} from '../middleware/authorization.middleware';
import {backendLink} from '../app';

const companyRoutePrefix = "/company";
const companyRoutes = new Elysia({prefix: companyRoutePrefix, detail: {tags: ["Company"]}});

companyRoutes.get("/", async (ctx) => {
  try {
    return await CompanyService.listCompanies();
  } catch (err) {
    ctx.set.status = 500;
    console.error(err);
    return err;
  }
});

companyRoutes.get("/:id", async (ctx) => {
  try {
    const {id} = ctx.params;
    return await CompanyService.getCompany(+id);
  } catch (err) {
    ctx.set.status = 500;
    console.error(err);
    return err;
  }
});

companyRoutes.post("/", async (ctx) => {
  try {
    // получаем юзера по токену авторизации из хеадера
    const userData = await getUserData(ctx);
    if (!userData) return ctx.set.status = 401;

    if (userData.role === "MEMBER") return ctx.set.status = 403;

    return await CompanyService.createCompany(ctx.body.name, userData.id)
  } catch (err) {
    ctx.set.status = 500;
    console.error(err);
    return err;
  }
}, {body: PostCompanyDto});

companyRoutes.post("/member/:companyId", async (ctx) => {
  try {
    // получаем юзера по токену авторизации из хеадера
    const userData = await getUserData(ctx);
    if (!userData) return ctx.set.status = 401;

    const {companyId} = ctx.params;

    return await CompanyService.addCompanyMember(+companyId, userData.id)
  } catch (err) {
    ctx.set.status = 500;
    console.error(err);
    return err;
  }
});

companyRoutes.post("/leave", async (ctx) => {
  try {
    // получаем юзера по токену авторизации из хеадера
    const userData = await getUserData(ctx);
    if (!userData) return ctx.set.status = 401;

    return await CompanyService.removeCompanyMember(userData, userData.id);
  } catch (err) {
    ctx.set.status = 500;
    console.error(err);
    return err;
  }
});

companyRoutes.delete("/member/:userId", async (ctx) => {
  try {
    // получаем юзера по токену авторизации из хеадера
    const userData = await getUserData(ctx);
    if (!userData) return ctx.set.status = 401;

    const {userId} = ctx.params;

    return await CompanyService.removeCompanyMember(userData, +userId)
  } catch (err) {
    ctx.set.status = 500;
    console.error(err);
    return err;
  }
});

companyRoutes.post("/link/:companyId", async (ctx) => {
  try {
    const {companyId} = ctx.params;
    const companyLink = await CompanyService.makeCompanyLink(+companyId);
    const companyFullLink = `${backendLink}${companyRoutePrefix}/link/${companyLink}`

    return {link: companyFullLink};
  } catch (err) {
    ctx.set.status = 500;
    console.error(err);
    return err;
  }
});

companyRoutes.get("/link/:companyLink", async (ctx) => {
  try {
    const {companyLink} = ctx.params;

    // получаем юзера по токену авторизации из хеадера
    const userData = await getUserData(ctx);
    if (!userData) return ctx.set.status = 401;

    if (userData.companyId) return ctx.set.status = 500;

    await CompanyService.addMemberByLink(userData.id, companyLink);

    return ctx.redirect("/messages");
  } catch (err) {
    ctx.set.status = 500;
    console.error(err);
    return err;
  }
});

export default companyRoutes;