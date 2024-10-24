import { GetAllProductsResponse } from './../../../../models/interfaces/products/response/GetAllProductsResponse';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { ProductsService } from 'src/app/services/products/products.service';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
  styleUrls: [],
})
export class ProductsHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();

  public productList: Array<GetAllProductsResponse> = [];

  constructor(
    private productsService: ProductsService,
    private productsDtTransferService: ProductsDataTransferService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getServiceProductsData();
  }

  getServiceProductsData() {
    const productsLoaded = this.productsDtTransferService.getProductsDatas();

    if (productsLoaded.length > 0) {
      this.productList = productsLoaded;
    } else {
      this.productsService
        .getAllProducts()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response.length > 0) {
              this.productList = response;
              console.log(this.productList);
            }
          },
          error: (error) => {
            console.log(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao buscar produtos',
              life: 2500,
            });
            this.router.navigate(['/dashboard']);
          },
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
