import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { HttpService } from 'src/app/core';
import { ConfigService, RequestParam } from 'src/app/shared';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService extends HttpService {
  override baseUrl: string;

  councils = [
    {
      id: 1,
      councilName: 'UPSMF',
      isActive: true,
    },
    {
      id: 2,
      councilName: 'UPDC',
      isActive: false,
    }
  ];

  userTypes = [
    {
      userType: 'public',
      isActive: true,
      id: 1,
    },
    {
      userType: 'other',
      isActive: false,
      id: 2,
    },
    {
      userType: 'student',
      isActive: true,
      id: 3,
    },
  ];

  Departments = [
    {
      id: 1,
      councilName: 'UPSMF',
      department: 'Billing',
      isActive: true,
    },
    {
      id: 2,
      councilName: 'UPDC',
      department: 'Exams',
      isActive: false,
    }
  ];

  EscalationTime = [
    {
      id: 1,
      authority: 'UPSMF security',
      email: 'nodal@yopmail.com',
      escalationTime: '3',
      isActive: true,
    },
    {
      id: 2,
      authority: 'UPSMF security',
      email: 'secratory@yopmail.com',
      escalationTime: '7',
      isActive: false,
    }
  ];

  constructor(
    http: HttpClient, 
    private configService: ConfigService
  ) { 
    super(http);
    this.baseUrl = environment.apiUrl;
  }

  //#region (Councils)
  getCouncils() {
    const reqParam: RequestParam = {
      url: this.baseUrl + `${this.configService.urlConFig.URLS.CNFIGURATION.SEARCH_COUNCIL}`,
      data: {}
    }
    return this.get(reqParam);
    // return of(this.councils);
  }

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
  getUserTypes() {
    const reqParam: RequestParam = {
      url: this.baseUrl + `${this.configService.urlConFig.URLS.CNFIGURATION.SEARCH_USER_TYPES}`,
      data: {}
    }
    return this.get(reqParam);
    // return of(this.userTypes);
  }

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
  getDepartments() {
    const reqParam: RequestParam = {
      url: this.baseUrl + `${this.configService.urlConFig.URLS.CNFIGURATION.SEARCH_DEPARTMENT}`,
      data: {}
    }
    return this.get(reqParam);
    // return of(this.Departments);
  }

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
      url: this.baseUrl + `${this.configService.urlConFig.URLS.CNFIGURATION.UPDATE_ESCALATIONTIME_STATUS}`,
      data: payload,
    }
    return this.post(reqParam);
  }
  //#endregion

}
