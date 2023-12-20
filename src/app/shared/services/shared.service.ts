import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core';
import { environment } from 'src/environments/environment';
import { ConfigService, RequestParam } from 'src/app/shared';

@Injectable({
  providedIn: 'root'
})
export class SharedService extends HttpService {
  override baseUrl: string;

  constructor(
    http: HttpClient, 
    private configService: ConfigService
  ) { 
    super(http);
    this.baseUrl = environment.apiUrl;
  }

  getCouncils() {
    const reqParam: RequestParam = {
      url: this.baseUrl + `${this.configService.urlConFig.URLS.SHARED_URLS.SEARCH_COUNCIL}`,
      data: {}
    }
    return this.get(reqParam);
  }
  getUserTypes() {
    const reqParam: RequestParam = {
      url: this.baseUrl + `${this.configService.urlConFig.URLS.SHARED_URLS.SEARCH_USER_TYPES}`,
      data: {}
    }
    return this.get(reqParam);
  }

  getDepartments() {
    const reqParam: RequestParam = {
      url: this.baseUrl + `${this.configService.urlConFig.URLS.SHARED_URLS.SEARCH_DEPARTMENT}`,
      data: {}
    }
    return this.get(reqParam);
  }

  getUsersByCouncilDetapartmen(councilId: string, departmentId: string) {
    const reqParam: RequestParam = {
      url: this.baseUrl + `${this.configService.urlConFig.URLS.SHARED_URLS.GET_USERS_BY_COUNCIL_DEPARTMENT}departmentId=${departmentId}&councilId=${councilId}`,
      data: {}
    }
    return this.get(reqParam);
  }

}
