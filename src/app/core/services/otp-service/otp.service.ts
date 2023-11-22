import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServerResponse, RequestParam, ConfigService } from 'src/app/shared';
import { HttpService } from "src/app/core";
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OtpService extends HttpService {
  override baseUrl: string;
  constructor(http: HttpClient, private configService: ConfigService) {
    super(http);
    this.baseUrl = environment.apiUrl;
  }

  generateOtp(otpReqData: any): Observable<ServerResponse>  {
    const reqParam: RequestParam = {
      url: this.baseUrl + this.configService.urlConFig.URLS.OTP.GENERATE_OTP,
      data: otpReqData,
    }
   return this.post(reqParam);
  }

  generateMobileOtp(mobOtp:any):Observable<ServerResponse> {
    const reqParam: RequestParam = {
      url: this.baseUrl + this.configService.urlConFig.URLS.OTP.GENERATE_MOBILE_OTP,
      data: mobOtp,
    }
   return this.post(reqParam);

  }


}
