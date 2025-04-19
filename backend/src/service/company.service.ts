import {CompanyProvider} from '../providers/company.provider';
import {UserProvider} from "../providers/user.provider.ts";

export class CompanyService {
  static async listCompanies() {
    return await CompanyProvider.listAll();
  }

  static async getCompany(id: number) {
    return await CompanyProvider.getByID(id);
  }

  static async createCompany(name: string, ownerId: number) {
    const company = await CompanyProvider.addCompany(name, ownerId, []);
    await UserProvider.update(ownerId, {companyId: company.id});

    return company;
  }

  static async addCompanyMember(companyId: number, userId: number) {
    return await UserProvider.update(userId, {companyId});
  }

  static async removeCompanyMember(editorUserData: any, memberId: number) {
    // @ts-ignore
    const isEditorOwner = editorUserData.ownedCompany?.ownerId == editorUserData.id;

    // если это админ or если свм себя хочет удалить
    const isAdmin = editorUserData.role === "ADMIN";
    if (isAdmin ||
        (editorUserData.id !== memberId && isEditorOwner) ||
        (editorUserData.id === memberId && !isEditorOwner)) {
      return await UserProvider.removeFromCompany(memberId);
    }

    return false;
  }

  static makeCompanyLink = async (companyId: number): Promise<string | false> => {
    const linkData = await CompanyProvider.makeLinkToCompany(companyId);
    if (!linkData) return false;

    return linkData.link;
  }

  static addMemberByLink = async (userId: number, link: string) => {
    const company = await CompanyProvider.getByLink(link);
    if (!company) return false;

    return await UserProvider.update(userId, {companyId: company.id});
  }
}