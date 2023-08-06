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