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
        public int TotalProducts { get ; set; }

        [Required]
        public int TotalProductInStock { get; set; }
        
        [Required]
        public double ProductPrice { get ; set;  }

        [Required]
        public double SalestPrice { get ; set;  }


        [JsonIgnore]
        public ICollection<Purchase> Purchases { get; set;}
        
        [JsonIgnore]
        public ICollection<ProductPurchaseHistory> ProductPurchaseHistories { get; set;}


        [JsonIgnore]
        public List<Damage> Damages { get; set; }
        
    }
}