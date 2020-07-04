using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace inventory_rest_api.Models
{
    public class Product
    {
        
        public long ProductId { get; set;}

        [Required]
        public String ProductName { get ; set; }

        [Required]
        public String ProductCode { get ; set; }

        [Required]
        public long ProductCategoryId { get ; set; }

        [Required]
        public int ProductQuantity { get ; set; }

        [Required]
        public long ProductPrice { get ; set;  }
        public long SalestPrice { get ; set;  }

        public String ProductDetails { get ; set ; }

        [JsonIgnore]
        public ProductCategory ProductCategories { get ; set;}
        public ICollection<Purchase> Purchases { get; set;}
    }
}