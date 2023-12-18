import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService, RequestParam, Response, ServerResponse } from 'src/app/shared';
import { environment } from 'src/environments/environment';
import { HttpService } from "src/app/core";

@Injectable({
  providedIn: 'root'
})
export class DashboardService  extends HttpService {
  override baseUrl: string;
  constructor(http: HttpClient, private configService: ConfigService) { 
    super(http);
    this.baseUrl = environment.apiUrl;
  }

  getDashboardData(request?:object): Observable<ServerResponse> {
    const reqParam: RequestParam = {
      url: this.baseUrl + this.configService.urlConFig.URLS.DASHBOARD.GET_DASHBOARD_DATA,
      data: {
        ...request
      }
    }
    return this.post(reqParam);
  }

  getUsersByCouncilDetapartmen(councilId: string, departmentId: string) {
    const reqParam: RequestParam = {
      url: this.baseUrl + `${this.configService.urlConFig.URLS.DASHBOARD.GET_USERS_BY_COUNCIL_DEPARTMENT}departmentId=${departmentId}&councilId=${councilId}`,
      data: {}
    }
    return this.get(reqParam);
  }
}
