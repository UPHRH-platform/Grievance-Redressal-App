import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from 'src/app/core';
import { ConfigService, RequestParam } from 'src/app/shared';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService extends HttpService {
  override baseUrl: string;

  constructor(
    http: HttpClient, 
    private configService: ConfigService
  ) { 
    super(http);
    this.baseUrl = environment.apiUrl;
  }

  //#region (Councils)

  saveCouncil(payload: any) {
    const reqParam: RequestParam = {
      url: this.baseUrl + `${this.configService.urlConFig.URLS.CNFIGURATION.SAVE_COUNCIL}`,
      data: payload,
    }
    return this.post(reqParam);
  }

  updateCouncils(payload: any) {
    const reqParam: RequestParam = {
      url: this.baseUrl + `${this.configService.urlConFig.URLS.CNFIGURATION.UPDATE_COUNCIL}`,
      data: payload,
    }
    return this.post(reqParam);
  }

  updateCouncilsStatus(payload: any) {
    const reqParam: RequestParam = {
      url: this.baseUrl + `${this.configService.urlConFig.URLS.CNFIGURATION.UPDATE_COUNCIL_STATUS}`,
      data: payload,
    }
    return this.post(reqParam);
  }
  //#endregion

  //#region (User Types)
  saveUserType(payload: any) {
    const reqParam: RequestParam = {
      url: this.baseUrl + `${this.configService.urlConFig.URLS.CNFIGURATION.SAVE_USER_TYPES}`,
      data: payload,
    }
    return this.post(reqParam);
  }

  updateUserTypes(payload: any) {
    const reqParam: RequestParam = {
      url: this.baseUrl + `${this.configService.urlConFig.URLS.CNFIGURATION.UPDATE_USER_TYPES}`,
      data: payload,
    }
    return this.post(reqParam);
  }

  updateUserTypesStatus(payload: any) {
    const reqParam: RequestParam = {
      url: this.baseUrl + `${this.configService.urlConFig.URLS.CNFIGURATION.UPDATE_USER_TYPES_STATUS}`,
      data: payload,
    }
    return this.post(reqParam);
  }
  //#endregion

  //#region (Department)
  saveDepartment(payload: any) {
    const reqParam: RequestParam = {
      url: this.baseUrl + `${this.configService.urlConFig.URLS.CNFIGURATION.SAVE_DEPARTMENT}`,
      data: payload,
    }
    return this.post(reqParam);
  }

  udpateDepartment(payload: any) {
    const reqParam: RequestParam = {
      url: this.baseUrl + `${this.configService.urlConFig.URLS.CNFIGURATION.UPDATE_DEPARTMENT}`,
      data: payload,
    }
    return this.post(reqParam);
  }

  udpateDepartmentStatus(payload: any) {
    const reqParam: RequestParam = {
      url: this.baseUrl + `${this.configService.urlConFig.URLS.CNFIGURATION.UPDATE_DEPARTMENT_STATUS}`,
      data: payload,
    }
    return this.post(reqParam);
  }
  //#endregion

  //#region (Escalation)
  getEscalationTimes() {
    const reqParam: RequestParam = {
      url: this.baseUrl + `${this.configService.urlConFig.URLS.CNFIGURATION.SEARCH_ESCALATIONTIME}`,
      data: {}
    }
    return this.get(reqParam);
    // return of(this.EscalationTime);
  }

  updateEscalationTime(payload: any) {
    const reqParam: RequestParam = {
      url: this.baseUrl + `${this.configService.urlConFig.URLS.CNFIGURATION.UPDATE_ESCALATIONTIME}`,
      data: payload,
    }
    return this.post(reqParam);
  }

  updateEscalationTimeStatus(payload: any) {
    const reqParam: RequestParam = {
      url: this.baseUrl + `${this.configService.urlConFig.URLS.CNFIGURATION.UPDATE_ESCALATIONTIME_STATUS}userId=${payload.userId}&id=${payload.id}&active=${payload.active}`,
      data: payload,
    }
    return this.post(reqParam);
  }
  //#endregion

}
