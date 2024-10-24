import { Injectable } from '@angular/core';
import { BehaviorSubject, map, take } from 'rxjs';
import { GetAllProductsResponse } from 'src/app/models/interfaces/products/response/GetAllProductsResponse';

@Injectable({
  providedIn: 'root',
})
export class ProductsDataTransferService {
  public productsDataEmiter$ =
    new BehaviorSubject<Array<GetAllProductsResponse> | null>(null);

  public productsDatas: Array<GetAllProductsResponse> = [];

  setProductsDatas(products: Array<GetAllProductsResponse>): void {
    if (products) {
      this.productsDataEmiter$.next(products);
      this.getProductsDatas();
    }
  }

  getProductsDatas() {
    // o take(1) serve para nos desincrevermos após 1 chamada do observable
    this.productsDataEmiter$
      .pipe(
        take(1),
        map((prod) => prod?.filter((p) => p.amount > 0))
      )
      .subscribe({
        next: (response) => {
          if (response) {
            this.productsDatas = response;
          }
        },
      });

    return this.productsDatas;
  }
}
