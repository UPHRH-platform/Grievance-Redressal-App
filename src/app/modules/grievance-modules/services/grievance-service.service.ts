import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConfigService, RequestParam, ServerResponse } from 'src/app/shared';
import { environment } from 'src/environments/environment';
import { HttpService } from "src/app/core";

@Injectable({
  providedIn: 'root'
})
export class GrievanceServiceService extends HttpService {
  override baseUrl: string;
  private token: string | null;
  private readonly TOKEN_KEY = 'access_token';
  private readonly USER_DATA = "user_data";
  constructor(http: HttpClient, private configService: ConfigService) { 
    super(http);
    this.baseUrl = environment.apiUrl;
  }

  createTicket(data?:any): Observable<ServerResponse> {
    // Implement your login API call and get the JWT token
    const reqParam: RequestParam = {
      url: this.configService.urlConFig.URLS.CREATE_TICKET,
      data: data,
      header: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }
    return this.post(reqParam);
  }

  // getTicketById(id:any){
  //   const reqParam : RequestParam = {
  //     url: `${this.configService.urlConFig.URLS.GET_TICKET_BY_ID}${id}`,

  //   }
  //   return this.get(reqParam)
  // }

  /** ticket details and list services */
  
  getAllTickets(request:object): Observable<ServerResponse> {
    console.log(request);
      const reqParam: RequestParam = {
        url: this.configService.urlConFig.URLS.GRIEVANCE_TICKETS.GET_ALL_TICKETS,
        data: {
          ...request
        }
      }
      return this.post(reqParam);
  }

  getTicketsById(id: string): Observable<ServerResponse> {
    const reqParam: RequestParam = {
      url: `${this.configService.urlConFig.URLS.GRIEVANCE_TICKETS.GET_ALL_TICKETS}?id=${id}`,
      data: {}
    }
    return this.get(reqParam);
  }

  updateTicket(request:object): Observable<ServerResponse> {
    console.log(request);
      const reqParam: RequestParam = {
        url: this.configService.urlConFig.URLS.GRIEVANCE_TICKETS.UPDATE_TICKET,
        data: {
          ...request
        }
      }
      return this.post(reqParam);
  }
}


