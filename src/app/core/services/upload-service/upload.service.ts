import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServerResponse, RequestParam, ConfigService } from 'src/app/shared';
import { HttpService } from "src/app/core";
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService extends HttpService {
  override baseUrl: string;
  constructor(http: HttpClient, private configService: ConfigService) {
    super(http);
    this.baseUrl = environment.apiUrl;
  }

  uploadFile(fileData: any):  Observable<ServerResponse> {
    const reqParam: RequestParam = {
      url: this.configService.urlConFig.URLS.FILE.UPLOAD,
      data: fileData,
      header: {
        Accept: "*/*",
        "Content-Type": "multipart/form-data",
      }

    }
   return this.post(reqParam);
  }
}
