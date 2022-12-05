import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class ApiService {

  constructor(
    private http: HttpClient,
  ) { }

  BASE_URL = environment.apiUrl;

  getHttpOptions(isJSON = true, authRequire = true) {
    const headers = (isJSON) ? { 'Content-Type': 'application/json' } : {};

    // Login checks here

    return { headers: new HttpHeaders(headers), };
  }

  get(url: string, query: any = {}, authRequire = true): Observable<any> {
    const httpOptions: any = this.getHttpOptions(undefined, authRequire);

    if (query) {
      let httpParams = new HttpParams();

      for (const key in query) {
        if (query.hasOwnProperty(key)) {
          httpParams = httpParams.set(key, query[key]);
        }
      }
      httpOptions['params'] = httpParams;
    }
    // console.log("window.location:", window.location);
    // console.log("BASE_URL:", this.BASE_URL);
    // console.log("URL:", url);
    // console.log("httpOptions:", httpOptions);

    return this.http.get(this.BASE_URL + url, httpOptions);
  }

  post(url: string, body: any, isJSON = true, authRequire = true) {
    const httpOptions = this.getHttpOptions(isJSON, authRequire);
    return this.http.post(this.BASE_URL + url, body, httpOptions);
  }

  put(url: string, body: any, isJSON = true, authRequire = true) {
    const httpOptions = this.getHttpOptions(isJSON, authRequire);
    return this.http.put(this.BASE_URL + url, body, httpOptions);
  }

  patch(url: string, body: any, isJSON = true, authRequire = true) {
    const httpOptions = this.getHttpOptions(isJSON, authRequire);
    return this.http.patch(this.BASE_URL + url, body, httpOptions);
  }

  delete(url: string) {
    const httpOptions = this.getHttpOptions();
    return this.http.delete(this.BASE_URL + url, httpOptions);
  }

  deleteParams(url: string, body: any, isJSON = true) {
    const httpOptions: any = this.getHttpOptions();
    httpOptions["body"] = body

    return this.http.delete(this.BASE_URL + url, httpOptions);
  }
}
