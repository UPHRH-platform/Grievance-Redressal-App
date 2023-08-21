import { Injectable, } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { HttpService } from "src/app/core";
import { ConfigService, ServerResponse, RequestParam } from "src/app/shared";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

// userService.ts
@Injectable({ providedIn: 'root' })
export class UserService extends HttpService{
  override baseUrl: string;
  private userManagementbaseURL: string;
  constructor(private configService: ConfigService, http: HttpClient) {
    super(http);
    this.userManagementbaseURL = environment.usermanagementApiURL;
  }

  getAllUsers(): Observable<ServerResponse>  {
    const request = {};
    // const  reqParam: RequestParam = { url: this.configService.urlConFig.URLS.USER.GET_ALL_USERS}
    const reqParam: RequestParam = {
      url: this.userManagementbaseURL + this.configService.urlConFig.URLS.USER.GET_ALL_USERS,
      data: {request}
    }
    return this.post(reqParam);
  } 

  updateUser(userDetails: any): Observable<ServerResponse>  {
    const  reqParam: RequestParam = { 
      url: this.userManagementbaseURL + this.configService.urlConFig.URLS.USER.UPDATE_USER,
      data: userDetails
    }
    return this.post(reqParam);
  }

  getUserDetails(id: string): Observable<ServerResponse> {
    const request = {
      userName: id
    }
    const reqParam: RequestParam = {
      url: this.userManagementbaseURL + this.configService.urlConFig.URLS.USER.GET_USERDETAILS_BY_ID,
      data: {request}
    }
    return this.post(reqParam);
  }

  createUser(userDetails: any): Observable<ServerResponse> {
    const reqParam: RequestParam = {
      url: this.userManagementbaseURL + this.configService.urlConFig.URLS.USER.CREATE_USER,
      data: {
        request: userDetails
      }
    }
    return this.post(reqParam);
  }

  // Implement methods for other roles (e.g., isGrievanceNodal(), isNodalOfficer(), isSecretary())
}

