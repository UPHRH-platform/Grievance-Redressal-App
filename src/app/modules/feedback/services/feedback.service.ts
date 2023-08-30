import { Injectable, } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { HttpService } from "src/app/core";
import { ConfigService, ServerResponse, RequestParam } from "src/app/shared";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

// userService.ts
@Injectable({ providedIn: 'root' })
export class FeedbackService extends HttpService{
  override baseUrl: string;
  constructor(private configService: ConfigService, http: HttpClient) {
    super(http);
    this.baseUrl = environment.apiUrl;
  }

  saveFeedack(feedbackDetails: any): Observable<ServerResponse>  {
    const  reqParam: RequestParam = { 
      url: this.baseUrl + this.configService.urlConFig.URLS.FEEDBACK.SAVE,
      data: feedbackDetails,
    }
    return this.post(reqParam);
  }
}

