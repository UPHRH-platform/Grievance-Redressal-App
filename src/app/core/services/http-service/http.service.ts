// http.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of as observableOf, Observable, throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { HttpOptions, RequestParam, ServerResponse, Response } from 'src/app/shared';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  /**
   * Contains base Url for api end points
   */
  baseUrl: string;
  
  constructor(private http: HttpClient) {}

 /**
   * for making get api calls
   *
   * @param requestParam interface
   */
 get(requestParam: RequestParam): Observable<ServerResponse> {
  const headers = this.getHeaderWithAuthorization(requestParam);
  const httpOptions: HttpOptions = {
    headers: headers,
    params: requestParam.param
  };
  return this.http.get<Response>(requestParam.url, httpOptions).pipe(
    mergeMap((data: Response) => {
      if (data.status && data.status !== 200) {
        return throwError(() => new Error(data.error));
      }
      const serverRes: ServerResponse ={
        statusInfo: {statusCode: 200, statusMessage: "success"},
        responseData: data.body? data.body : data
      }
      return observableOf(serverRes);
    }));
}

 /**
   * for making post api calls
   * @param {RequestParam} requestParam interface
  */
 uploadFilepost(requestParam: RequestParam): Observable<any> {
  const headers = this.getHeaderWithAuthorization(requestParam);
  const httpOptions: HttpOptions = {
    headers: headers,
    params: requestParam.param
  };
  return this.http.post<Response>(requestParam.url, requestParam.data, httpOptions).pipe(
    mergeMap((data: Response) => {
      if (data.status && data.status !== 200) {
        return throwError(() => new Error(data.error));
      }
      const serverRes: ServerResponse ={
        statusInfo: {statusCode: 200, statusMessage: "success"},
        responseData: data.body? data.body : data
      }
      return observableOf(serverRes);
    }));
}



   /**
   * for making post api calls
   * @param {RequestParam} requestParam interface
  */
   post(requestParam: RequestParam): Observable<ServerResponse> {
    const headers = this.getHeaderWithAuthorization(requestParam);
    const httpOptions: HttpOptions = {
      headers: headers,
      params: requestParam.param
    };
    return this.http.post<Response>(requestParam.url, requestParam.data, httpOptions).pipe(
      mergeMap((data: Response) => {
        if (data.status && data.status !== 200) {
          return throwError(() => new Error(data.error));
        }
        const serverRes: ServerResponse ={
          statusInfo: {statusCode: 200, statusMessage: "success"},
          responseData: data.body? data.body : data
        }
        return observableOf(serverRes);
      }));
  }

  /**
   * for making patch api calls
   *
   * @param {RequestParam} requestParam interface
   *
   */
  patch(requestParam: RequestParam): Observable<ServerResponse> {
    const headers = this.getHeaderWithAuthorization(requestParam);
    const httpOptions: HttpOptions = {
      headers: headers,
      params: requestParam.param
    };
    return this.http.patch<Response>(requestParam.url, requestParam.data, httpOptions).pipe(
      mergeMap((data: Response) => {
        if (data.status !== 200) {
          return throwError(() => new Error(data.error));
        }
        const serverRes: ServerResponse ={
          statusInfo: {statusCode: 200, statusMessage: "success"},
          responseData: data.body
        }
        return observableOf(serverRes);
      }));
  }

  /**
   * for making delete api calls
   * @param {RequestParam} requestParam interface
   */
  delete(requestParam: RequestParam): Observable<ServerResponse> {
    const headers = this.getHeaderWithAuthorization(requestParam);
    const httpOptions: HttpOptions = {
      headers: headers,
      params: requestParam.param,
      body: requestParam.data
    };
    return this.http.delete<Response> (requestParam.url, httpOptions).pipe(
      mergeMap((data: Response) => {
        if (data.status !== 200) {
          return throwError(() => new Error(data.error));
        }
        const serverRes: ServerResponse ={
          statusInfo: {statusCode: 200, statusMessage: "success"},
          responseData: data.body
        }
        return observableOf(serverRes);
      }));
  }

  /**
 * for making PUT api calls
 * @param {RequestParam} requestParam interface
 */
  put(requestParam: RequestParam): Observable<ServerResponse> {
    const headers = this.getHeaderWithAuthorization(requestParam);
    const httpOptions: HttpOptions = {
      headers: headers,
      params: requestParam.param,
    };
    return this.http.put<Response>(requestParam.url, requestParam.data, httpOptions).pipe(
      mergeMap((data: Response) => {
        if (data.status && data.status !== 200) {
          return throwError(() => new Error(data.error));
        }
        const serverRes: ServerResponse ={
          statusInfo: {statusCode: 200, statusMessage: "success"},
          responseData: data.body? data.body : data
        }
        return observableOf(serverRes);
      }));
  }

    /**
   * for preparing headers
   */
    
    private getHeaderWithAuthorization(requestParam: any) {
      let headers: any = {}
      if (requestParam.header) {
        headers = requestParam.header;
        if (headers.Authorization === undefined || headers.Authorization === '' || headers.Authorization === null) {
          const access_token = localStorage.getItem('access_token');
          headers['Authorization'] = `Bearer ${access_token}`
        }
      } else {
        headers = this.getHeader();
      }
      return headers;
    }
    
    private getHeader(headers?: HttpOptions['headers']): HttpOptions['headers'] {
      const access_token = localStorage.getItem('access_token');
      const default_headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`
      };

      if (headers) {
        return { ...default_headers, ...headers };
      } else {
        return { ...default_headers };
      }
    }

}