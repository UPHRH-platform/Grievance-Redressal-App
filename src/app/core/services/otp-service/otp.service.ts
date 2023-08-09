import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServerResponse, RequestParam } from 'src/app/shared';
import { HttpService } from "src/app/core";
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OtpService extends HttpService {
  override baseUrl: string;
  constructor(http: HttpClient) {
    super(http);
    this.baseUrl = environment.apiUrl;
  }

  getMobileOtp(): Observable<ServerResponse>  {
   return this.post({url: ""});
  }

  getEmailOtp(): Observable<ServerResponse>  {
    return this.post({url: ""});
  }

  verifyMobileOtp(): Observable<ServerResponse>  {
    return this.post({url: ""});
  }

  verifyEmailOtp(): Observable<ServerResponse>  {
    return this.post({url: ""});
  }

}
