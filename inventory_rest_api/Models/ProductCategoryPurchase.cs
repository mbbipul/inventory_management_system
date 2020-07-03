using System;

namespace inventory_rest_api.Models
{
    public class ProductCategoryPurchase
    {
        public long ProductId { get; set;}
        public String ProductName { get ; set; }
        public String ProductCode { get ; set; }
        public long ProductCategoryId { get ; set; }
        public string ProductCategoryName { get; set; }

        public int ProductQuantity { get ; set; }
        public long ProductPrice { get ; set;  } 
        public long SalestPrice { get ; set;  } //per
        public String ProductDetails { get ; set ; }

        public ProductCategoryPurchase(Product product, ProductCategory productCategory){
            ProductCategoryId = product.ProductCategoryId;
            ProductId = product.ProductId;
            ProductName = product.ProductName;
            ProductCode = product.ProductCode;
            ProductCategoryName = productCategory.ProductCategoryName;
            ProductQuantity = product.ProductQuantity;
            ProductPrice = product.ProductPrice;
            SalestPrice = product.SalestPrice;
            ProductDetails = product.ProductDetails;

        }
    }
}