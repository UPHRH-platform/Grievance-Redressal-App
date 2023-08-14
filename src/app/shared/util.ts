import { Roles } from "./";

export const getRole = (roleName: string) : string => {
    let role = "";
    switch(roleName) {
        case 'SUPERADMIN':
          role= Roles.SECRETARY;
          break;
        case 'NODALOFFICER':
          role= Roles.NODAL_OFFICER;
          break;
        case 'GRIEVANCEADMIN':
          role= Roles.GRIEVANCE_NODAL;
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