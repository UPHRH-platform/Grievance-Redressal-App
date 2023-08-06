import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServerResponse, ConfigService, RequestParam } from 'src/app/shared';
import { HttpService } from "src/app/core";
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GrievanceService extends HttpService {
  override baseUrl: string;
  private token: string | null;
  private readonly TOKEN_KEY = 'access_token';
  private readonly USER_DATA = "user_data";
  private header = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
  constructor(http: HttpClient, private configService: ConfigService) { 
    super(http);
    this.baseUrl = environment.apiUrl;
    this.token = this.getToken();
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  getAllTickets(request:object): Observable<ServerResponse> {
    console.log(request);
      const reqParam: RequestParam = {
        url: this.configService.urlConFig.URLS.GRIEVANCE_TICKETS.GET_ALL_TICKETS,
        header: {
          ...this.header,
          'Authorization': `Bearer ${this.token}`
        },
        data: {
          ...request
        }
      }
      return this.post(reqParam);
  }

  getTicketsById(request: string): Observable<ServerResponse> {
    const reqParam: RequestParam = {
      url: this.configService.urlConFig.URLS.GRIEVANCE_TICKETS.GET_TICKET_BY_ID+ `? ${request}`,
      header: {
        ...this.header,
        'Authorization': `Bearer ${this.token}`
      },
      data: {}
    }
    return this.get(reqParam);
  }
}
