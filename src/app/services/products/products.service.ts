import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { map, Observable } from 'rxjs';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';
import { enviroment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private API_URL = enviroment.api_url;
  private JWT_TOKEN = this.cookieService.get('user_info');

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.JWT_TOKEN}`,
    }),
  };

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService
  ) {}

  getAllProducts(): Observable<Array<GetAllProductsResponse>> {
    return this.httpClient
      .get<Array<GetAllProductsResponse>>(
        `${this.API_URL}/products`,
        this.httpOptions
      )
      .pipe(map((product) => product.filter((p) => p?.amount > 0)));
  }
}
