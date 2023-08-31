import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of as observableOf, Observable } from 'rxjs';
import { ServerResponse, ConfigService, RequestParam } from 'src/app/shared';
import { HttpService } from "src/app/core";
import { environment } from '../../../../environments/environment';

// authService.ts
@Injectable({ providedIn: 'root' })
export class AuthService extends HttpService{
  override baseUrl: string;
  private userManagementbaseURL: string;
  private readonly TOKEN_KEY = 'access_token';
  private readonly USER_DATA = "user_data";
  private readonly ALL_ROLES = "all_roles";

  constructor(http: HttpClient, private configService: ConfigService,) {
    super(http);
    this.baseUrl = environment.apiUrl;
    this.userManagementbaseURL = environment.usermanagementApiURL;
  }

  login(username: string, password: string): Observable<ServerResponse> {
    // Implement your login API call and get the JWT token
    const reqParam: RequestParam = {
      url: this.baseUrl + this.configService.urlConFig.URLS.LOGIN,
      data: {username,password},
      header: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
    return this.post(reqParam);
  }

  generateOTP(username: string): Observable<ServerResponse> {
    const reqParam: RequestParam = {
      url: this.userManagementbaseURL + this.configService.urlConFig.URLS.LOGIN_GENERATE_OTP,
      data: {username},
      header: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJSR3RkMkZzeG1EMnJER3I4dkJHZ0N6MVhyalhZUzBSSyJ9.kMLn6177rvY53i0RAN3SPD5m3ctwaLb32pMYQ65nBdA',
      }
    }
    return this.post(reqParam);
  }

  loginWithOTP(email: string, otp: any): Observable<ServerResponse> {
    const reqParam: RequestParam = {
      url: this.userManagementbaseURL + this.configService.urlConFig.URLS.OTP_LOGIN,
      header: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJSR3RkMkZzeG1EMnJER3I4dkJHZ0N6MVhyalhZUzBSSyJ9.kMLn6177rvY53i0RAN3SPD5m3ctwaLb32pMYQ65nBdA',
      },
      data: {
        email: email,
        otp: otp
      }
    }
    return this.post(reqParam);
  }

  // getUserRoles(): string[] {
  //   const token = this.getToken();
  //   let userRole = [];
  //   if (token) {
  //     const userData= this.getUserData();
  //     userRole = userData.roles;
  //   }
  //   // return userRole;
  //   return [this.configService.rolesConfig.ROLES.ADMIN];
  // }

  getUserRoles(): string[] {
    const token = this.getToken();
    let role = '';
    if (token) {
      const userData= this.getUserData();
      const userRole = userData.userRepresentation.attributes.role[0];
      switch(userRole) {
        case 'SUPERADMIN':
          role= this.configService.rolesConfig.ROLES.SUPERADMIN;
          break;
        case 'NODALOFFICER':
          role= this.configService.rolesConfig.ROLES.NODALOFFICER;
          break;
        case 'GRIEVANCEADMIN':
          role= this.configService.rolesConfig.ROLES.GRIEVANCEADMIN;
          break;
        case 'ADMIN':
          role= this.configService.rolesConfig.ROLES.ADMIN;
          break;
      }
    }
    return [role];
    // return [this.configService.rolesConfig.ROLES.ADMIN];
  }

  getAllRoles(): Observable<ServerResponse> {
    const res = {
      statusInfo: {statusCode: 200, statusMessage: "success"},
      responseData: [
        {
            "id": 1,
            "name": "GRIEVANCEADMIN",
            "orgId": 1
        },
        {
            "id": 2,
            "name": "SUPERADMIN", //secretary
            "orgId": 1
        },
        {
            "id": 3,
            "name": "NODALOFFICER",
            "orgId": 1
        },
        {
          "id": 4,
          "name": "ADMIN",
          "orgId": 1,
        }
    ]
    }
    return observableOf(res);
    // return this.get({url: this.configService.urlConFig.URLS.GET_ALL_ROLES});
  }

  saveAllRoles(roles: any): void {
    localStorage.setItem(this.ALL_ROLES,JSON.stringify(roles));
  }

  saveUserData(userData: any):void {
    this.saveToken(userData?.accessToken);
    localStorage.setItem(this.USER_DATA,JSON.stringify(userData));
  }

  getUserData() {
    const userData = localStorage.getItem(this.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  }

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_DATA);
    localStorage.removeItem(this.ALL_ROLES);
  }

  isLoggedIn(): boolean{
    return !!this.getToken();
  }
}

