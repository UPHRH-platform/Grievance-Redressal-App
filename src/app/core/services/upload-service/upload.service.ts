import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServerResponse, RequestParam, ConfigService } from 'src/app/shared';
import { AuthService, HttpService } from "src/app/core";
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService extends HttpService {
  override baseUrl: string;
  private token: any;
  constructor(http: HttpClient, private configService: ConfigService, private authService: AuthService) {
    super(http);
    this.baseUrl = environment.apiUrl;
     this.token = this.authService.getToken();
  }

  uploadFile(fileData: any):  Observable<ServerResponse> {
    console.log("fileData =>", fileData);
    const reqParam: RequestParam = {
      url: this.baseUrl + this.configService.urlConFig.URLS.FILE.UPLOAD,
      data: fileData,
      header: {
        'Accept': '*/*',
      }
    }
   return this.post(reqParam);
  }
}
