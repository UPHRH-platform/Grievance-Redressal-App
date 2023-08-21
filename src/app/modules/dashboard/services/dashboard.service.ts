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
    this.baseUrl = environment.usermanagementApiURL;
  }

  getDashboardData(request?:object): Observable<ServerResponse> {
    const reqParam: RequestParam = {
      url: this.baseUrl + this.configService.urlConFig.URLS.DASHBOARD.GET_DASHBOARD_DATA,
      data: {
        ...request
      }
    }
    return this.post(reqParam);
  //   const response = {
  //     "status": 200,
  //     "body": {
  //       "assignmentMatrix": {
  //         "total": 7,
  //         "isOpen": 7,
  //         "isClosed": 7,
  //         "isJunk": 4,
  //         "isEscalated": 0,
  //         "unassigned": 0
  //       },
  //       "resolutionMatrix": [{
  //         "examination": {
  //           "total": 7,
  //           "isOpen": 7,
  //           "isClosed": 7,
  //           "isJunk": 4,
  //           "isEscalated": 0,
  //           "unassigned": 0,
  //           "openTicket": ""
  //         },
  //         "affiliation": {
  //           "total": 7,
  //           "isOpen": 7,
  //           "isClosed": 7,
  //           "isJunk": 4,
  //           "isEscalated": 0,
  //           "unassigned": 0,
  //           "openTicket": '',
  //         }
  //       }],
  //       "performanceIndicators": {
  //         "turnAroundTime": 20,
  //         "escalationPercentage": 10,
  //         "nudgeTicketPercentage": 25,
  //         "ticketpending": 21
  //       }
  //     }
  //   }
  //     // const reqParam: RequestParam = {
  //     //   url: this.configService.urlConFig.URLS.GRIEVANCE_TICKETS.GET_DASHBOARD_DATA,
  //     //   data: {
  //     //     ...request
  //     //   }
  //     // }
  //     // return this.post(reqParam);
  //     return response;
  }
}
