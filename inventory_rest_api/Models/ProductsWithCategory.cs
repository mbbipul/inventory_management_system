using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Collections;

namespace inventory_rest_api.Models
{
    public class ProductsWithCategory
    {
        public long ProductId { get; set;}
        public String ProductName { get ; set; }
        public String ProductCode { get ; set; }
        public long ProductCategoryId { get ; set; }
        public string ProductCategoryName { get; set; }
        public int TotalProducts { get ; set; }
        public int TotalProductInStock { get; set; }
        public long ProductPrice { get ; set;  } 
        public long SalestPrice { get ; set;  } //per
        public String ProductDetails { get ; set ; }
        public ICollection<Purchase> Purchases { get; set; }
        public ICollection<Sales> Saleses { get; set; }

        public ProductsWithCategory(Product product, ProductCategory productCategory){
            ProductCategoryId = product.ProductCategoryId;
            ProductId = product.ProductId;
            ProductName = product.ProductName;
            ProductCode = product.ProductCode;
            ProductCategoryName = productCategory.ProductCategoryName;
            TotalProducts = product.TotalProducts;
            TotalProductInStock = product.TotalProductInStock;
            ProductPrice = product.ProductPrice;
            SalestPrice = product.SalestPrice;
            ProductDetails = product.ProductDetails;
            Purchases = product.Purchases;
            Saleses = product.Saleses;
        }
    }
}