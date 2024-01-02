import { Roles } from "./";
import { utils, writeFile } from 'xlsx';

export const getRole = (roleName: string) : string => {
    let role = "";
    switch(roleName) {
        case 'SUPERADMIN':
          role= Roles.SUPERADMIN;
          break;
        case 'NODALOFFICER':
          role= Roles.NODALOFFICER;
          break;
        case 'GRIEVANCEADMIN':
          role= Roles.GRIEVANCEADMIN;
          break;
        case 'ADMIN':
          role= Roles.ADMIN;
          break;
      }
    return role;
}

export const getAllRoles = () => {
    const roles = localStorage.getItem('all_roles') ? localStorage.getItem('all_roles') : "[]";
    const allRoles: any[] = roles ? JSON.parse(roles) : [];
    return allRoles;
}

export const getRoleObject = (roleCode: string) => {
    const allRoles = getAllRoles();
    return allRoles.find(role => role.name === roleCode);
}

export const exportToExcel = async (downloadObjects: any) => {
  if (downloadObjects && downloadObjects.objectsList) {
    const workbook = utils.book_new();
    downloadObjects.objectsList.forEach((element: any) => {
      const sheetName = element.sheetName ? element.sheetName : `Sheet ${workbook.SheetNames.length + 1}`
      const worksheet = utils.json_to_sheet([]);
      utils.sheet_add_aoa(worksheet, [element.headers])
      utils.book_append_sheet(workbook, worksheet, sheetName);
      utils.sheet_add_json(worksheet, element.downloadObject, { origin: 'A2', skipHeader: true });
    });
    writeFile(workbook, downloadObjects.fileName ? downloadObjects.fileName : 'data.xlsx');
  }
}