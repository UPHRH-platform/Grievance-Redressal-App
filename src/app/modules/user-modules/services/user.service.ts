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
  constructor(private configService: ConfigService, http: HttpClient) {
    super(http);
    this.baseUrl = environment.apiUrl;
  }

  getAllUsers(): Observable<ServerResponse>  {
    const  reqParam: RequestParam = { url: this.configService.urlConFig.URLS.USER.GET_ALL_USERS}
    return this.get(reqParam);
  } 

  createOrUpdateUser(userDetails: any): Observable<ServerResponse>  {
    const  reqParam: RequestParam = { 
      url: this.configService.urlConFig.URLS.USER.CREATE_UPDATE_USER,
      data: userDetails
    }
    return this.post(reqParam);
  }

  // Implement methods for other roles (e.g., isGrievanceNodal(), isNodalOfficer(), isSecretary())
}

