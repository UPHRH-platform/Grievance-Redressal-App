import { Injectable, } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { AuthService, HttpService } from "src/app/core";
import { ConfigService } from "src/app/shared";

// userService.ts
@Injectable({ providedIn: 'root' })
export class UserService extends HttpService{
  override baseUrl: string;
  constructor(private authService: AuthService, private configService: ConfigService, http: HttpClient) {
    super(http);
    this.baseUrl = "";
  }

  getUserRoles(): string[] {
    const token = this.authService.getToken();
    if (token) {
    }
    return [this.configService.rolesConfig.ROLES.GRIEVANCE_NODAL];
  }

  login() {

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

