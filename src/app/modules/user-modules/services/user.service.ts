import { Injectable } from "@angular/core";
import { AuthService } from "src/app/core/services/auth-service/auth.service";
import { Roles } from "src/app/shared/config/roles.config";

// userService.ts
@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private authService: AuthService) {}

  getUserRoles(): string[] {
    const token = this.authService.getToken();
    if (token) {
      const decodedToken = jwt_decode<any>(token);
      // return decodedToken.roles || [];
    }
    return [Roles.GRIEVANCE_NODAL];
  }

  isAdmin(): boolean {
    const roles = this.getUserRoles();
    return roles.includes('Admin');
  }

  // Implement methods for other roles (e.g., isGrievanceNodal(), isNodalOfficer(), isSecretary())
}
function jwt_decode<T>(token: string) {
  throw new Error("Function not implemented.");
}

