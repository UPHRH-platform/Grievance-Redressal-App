import { EventEmitter, Injectable, } from "@angular/core";
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
  public isUserDetailsUpdated = new EventEmitter<Boolean>()
  constructor(private configService: ConfigService, http: HttpClient) {
    super(http);
    this.userManagementbaseURL = environment.usermanagementApiURL;
    this.baseUrl = environment.apiUrl;
  }

  getAllUsers(request: object): Observable<ServerResponse>  {
    // const  reqParam: RequestParam = { url: this.configService.urlConFig.URLS.USER.GET_ALL_USERS}
    const reqParam: RequestParam = {
      url: this.baseUrl + this.configService.urlConFig.URLS.USER.GET_ALL_USERS,
      // header: {
      //   'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJSR3RkMkZzeG1EMnJER3I4dkJHZ0N6MVhyalhZUzBSSyJ9.kMLn6177rvY53i0RAN3SPD5m3ctwaLb32pMYQ65nBdA',
      // },
      data: request
    }
    return this.post(reqParam);
  } 

  updateUser(userDetails: any): Observable<ServerResponse>  {
    const  reqParam: RequestParam = { 
      url: this.baseUrl + this.configService.urlConFig.URLS.USER.UPDATE_USER,
      // header: {
      //   'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJSR3RkMkZzeG1EMnJER3I4dkJHZ0N6MVhyalhZUzBSSyJ9.kMLn6177rvY53i0RAN3SPD5m3ctwaLb32pMYQ65nBdA',
      // },
      data: userDetails
    }
    return this.post(reqParam);
  }

  getUserDetails(id: string): Observable<ServerResponse> {
    // const request = {
    //   userName: id
    // }
    const reqParam: RequestParam = {
      url: `${this.baseUrl + this.configService.urlConFig.URLS.USER.GET_USERDETAILS_BY_ID}?id=${id}`,
      // header: {
      //   'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJSR3RkMkZzeG1EMnJER3I4dkJHZ0N6MVhyalhZUzBSSyJ9.kMLn6177rvY53i0RAN3SPD5m3ctwaLb32pMYQ65nBdA',
      // },
      // data: {request}
    }
    return this.get(reqParam);
  }

  createUser(userDetails: any): Observable<ServerResponse> {
    const reqParam: RequestParam = {
      url: this.baseUrl + this.configService.urlConFig.URLS.USER.CREATE_USER,
      // header: {
      //   'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJSR3RkMkZzeG1EMnJER3I4dkJHZ0N6MVhyalhZUzBSSyJ9.kMLn6177rvY53i0RAN3SPD5m3ctwaLb32pMYQ65nBdA',
      // },
      data: userDetails
    }
    return this.post(reqParam);
  }

  deactivateUser(request: any): Observable<ServerResponse>  {
    const  reqParam: RequestParam = { 
      url: this.baseUrl + this.configService.urlConFig.URLS.USER.DEACTIVATE_USER,
      header: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJSR3RkMkZzeG1EMnJER3I4dkJHZ0N6MVhyalhZUzBSSyJ9.kMLn6177rvY53i0RAN3SPD5m3ctwaLb32pMYQ65nBdA',
      },
      data: request
    }
    return this.post(reqParam);
  }

  activateUser(request: any): Observable<ServerResponse>  {
    const  reqParam: RequestParam = { 
      url: this.baseUrl + this.configService.urlConFig.URLS.USER.ACTIVATE_USER,
      header: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJSR3RkMkZzeG1EMnJER3I4dkJHZ0N6MVhyalhZUzBSSyJ9.kMLn6177rvY53i0RAN3SPD5m3ctwaLb32pMYQ65nBdA',
      },
      data: request
    }
    return this.post(reqParam);
  }

  userDetailsUpdated() {
    this.isUserDetailsUpdated.emit(true);
  }

  // Implement methods for other roles (e.g., isGrievanceNodal(), isNodalOfficer(), isSecretary())
}

