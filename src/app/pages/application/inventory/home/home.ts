import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { DshBaseLayout } from "../../../../components/dashboard/dsh-base-layout/dsh-base-layout";
import { CurrencyPipe } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { DatePickerModule } from 'primeng/datepicker';
import { DynamicTable } from '../../../../components/dynamic-table/dynamic-table';
import { DynamicTableModel } from '../../../../model/components/dynamic-table.model';
import { ProductService } from '../../../../services/pages/application/inventory/product.service';
import { CategoryService } from '../../../../services/pages/application/inventory/category.service';
import { PurchaseOrderService } from '../../../../services/pages/application/inventory/purchase-order.service';
import { StockMovementService } from '../../../../services/pages/application/inventory/stock-movement.service';

@Component({
  selector: 'app-home',
  imports: [
    DshBaseLayout,
    CurrencyPipe,
    ChartModule,
    DatePickerModule,
    DynamicTable
  ],
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {

  private _productService = inject(ProductService);
  private _categoryService = inject(CategoryService);
  private _purchaseOrderService = inject(PurchaseOrderService);
  private _stockMovementService = inject(StockMovementService);
  private _cdr = inject(ChangeDetectorRef);

  Counting = {
    total_product: 0,
    total_category: 0,
    total_purchase_order: 0
  };

  StockMovementChart = {
    datasource: {} as any,
    options: null as any
  };

  MonthlyInfo: any[] = [];

  TableProps: DynamicTableModel.ITable = {
    id: 'product',
    title: 'Daftar Produk',
    description: 'Daftar lengkap seluruh produk anda',
    column: [
      {
        id: 'sku',
        title: 'SKU',
        type: DynamicTableModel.IColumnType.TEXT,
        width: '150px'
      },
      {
        id: 'name',
        title: 'Nama Produk',
        type: DynamicTableModel.IColumnType.TEXTWITHDESCRIPTION,
        description: 'category.name'
      },
      {
        id: 'current_stock',
        title: 'Stok',
        type: DynamicTableModel.IColumnType.TEXT,
        width: '100px'
      },
      {
        id: 'unit',
        title: 'Satuan',
        type: DynamicTableModel.IColumnType.TEXT,
        width: '100px'
      },
      {
        id: 'selling_price',
        title: 'Harga Jual',
        type: DynamicTableModel.IColumnType.TEXT,
        width: '150px'
      },
      {
        id: 'status',
        title: 'Status',
        type: DynamicTableModel.IColumnType.BUTTON_ICON,
        button_icon: {
          title: 'status',
          icon_class: 'pi pi-circle-fill',
          icon_color: 'status_color',
          use_parsing_func: false,
        },
        width: '150px'
      },
      {
        id: 'created_at',
        title: 'Tanggal Dibuat',
        type: DynamicTableModel.IColumnType.DATETIME,
        width: '180px'
      },
    ],
    datasource: [],
    filter: [
      {
        id: 'name',
        title: 'Nama Produk',
        type: DynamicTableModel.IColumnType.TEXT,
        value: ''
      },
      {
        id: 'sku',
        title: 'SKU',
        type: DynamicTableModel.IColumnType.TEXT,
        value: ''
      },
      {
        id: 'category_id',
        title: 'Kategori',
        type: DynamicTableModel.IColumnType.DROPDOWN,
        value: '',
        select_props: {
          datasource: [],
          name: 'name',
          value: 'id'
        }
      },
      {
        id: 'status',
        title: 'Status',
        type: DynamicTableModel.IColumnType.DROPDOWN,
        value: '',
        select_props: {
          datasource: [
            { id: 'available', title: 'Tersedia' },
            { id: 'low-stock', title: 'Stok Menipis' },
            { id: 'out-of-stock', title: 'Habis' }
          ],
          name: 'title',
          value: 'id'
        }
      },
    ],
    sort: [
      {
        id: 'name',
        title: 'Nama Produk',
        value: ''
      },
      {
        id: 'current_stock',
        title: 'Stok',
        value: ''
      },
    ],
    toolbar: [
      { id: 'detail', icon: 'pi pi-info', title: 'Detail' },
      { id: 'edit', icon: 'pi pi-pencil', title: 'Edit' },
      { id: 'delete', icon: 'pi pi-trash', title: 'Hapus' },
    ],
    paging: true,
    custom_button: [
      { id: 'add', title: 'Tambah Produk', icon: 'pi pi-plus' }
    ]
  };

  ngOnInit(): void {
    this.initChart();
    this.loadCounting();
    this.loadLowStockProducts();
    this.loadProductList();
    this.loadCategories();
  }

  private loadCounting() {
    // Total Product
    this._productService.getAll().subscribe((products) => {
      this.Counting.total_product = products.length;
    });

    // Total Category
    this._categoryService.getAll().subscribe((categories) => {
      this.Counting.total_category = categories.length;
    });

    // Total PO Value
    this._purchaseOrderService.getAll().subscribe((pos) => {
      this.Counting.total_purchase_order = pos
        .filter((po: any) => po.status === 'RECEIVED')
        .reduce((sum: number, po: any) => sum + (po.total_amount || 0), 0);
    });
  }

  private loadLowStockProducts() {
    this._productService.getLowStockProducts().subscribe((products) => {
      this.MonthlyInfo = products.slice(0, 5); // ambil 5 produk dengan stok menipis
    });
  }

  private loadProductList() {
    this._productService.getAll().subscribe((products) => {
      console.log("Products from service =>", products);

      const mappedData = products.map((item: any) => {
        // Pastikan category ada
        const categoryName = item.category?.name || item.category || '-';

        return {
          ...item,
          'category.name': categoryName, // Untuk TEXTWITHDESCRIPTION
          status: item.current_stock > item.min_stock ? 'Tersedia' :
            item.current_stock > 0 ? 'Stok Menipis' : 'Habis',
          status_color: item.current_stock > item.min_stock ? '#10b981' :
            item.current_stock > 0 ? '#f59e0b' : '#ef4444'
        };
      });

      // Reassign entire object to trigger change detection
      this.TableProps = {
        ...this.TableProps,
        datasource: mappedData
      };

      console.log("Table datasource =>", this.TableProps.datasource);
      console.log("First item =>", this.TableProps.datasource[0]);
    });
  }

  private loadCategories() {
    this._categoryService.getAll().subscribe((categories) => {
      const categoryFilter = this.TableProps.filter?.find(f => f.id === 'category_id');
      if (categoryFilter && categoryFilter.select_props) {
        categoryFilter.select_props.datasource = categories;
      }
    });
  }

  private initChart() {
    this._stockMovementService.getAll().subscribe((movements) => {
      const last7Days = this.getLast7Days();
      const stockIn: number[] = [];
      const stockOut: number[] = [];

      last7Days.forEach(date => {
        const dayMovements = movements.filter((m: any) =>
          this.isSameDay(new Date(m.movement_date), date)
        );

        const inQty = dayMovements
          .filter((m: any) => m.type === 'IN')
          .reduce((sum: number, m: any) => sum + m.quantity, 0);

        const outQty = dayMovements
          .filter((m: any) => m.type === 'OUT')
          .reduce((sum: number, m: any) => sum + m.quantity, 0);

        stockIn.push(inQty);
        stockOut.push(outQty);
      });

      const textColor = getComputedStyle(document.documentElement).getPropertyValue('--p-text-color');
      const textColorSecondary = getComputedStyle(document.documentElement).getPropertyValue('--p-text-muted-color');
      const surfaceBorder = getComputedStyle(document.documentElement).getPropertyValue('--p-content-border-color');

      this.StockMovementChart.datasource = {
        labels: last7Days.map(d => d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })),
        datasets: [
          {
            label: 'Stock Masuk',
            data: stockIn,
            backgroundColor: '#10b981',
            borderColor: '#059669',
            borderWidth: 1
          },
          {
            label: 'Stock Keluar',
            data: stockOut,
            backgroundColor: '#ef4444',
            borderColor: '#dc2626',
            borderWidth: 1
          }
        ]
      };

      this.StockMovementChart.options = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
          tooltip: {
            mode: 'index',
            intersect: false
          },
          legend: {
            labels: {
              color: textColor
            }
          }
        },
        scales: {
          x: {
            stacked: false,
            ticks: {
              color: textColorSecondary
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false
            }
          },
          y: {
            stacked: false,
            ticks: {
              color: textColorSecondary
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false
            }
          }
        }
      };
    });
  }

  private getLast7Days(): Date[] {
    const days: Date[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    return days;
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }
}
