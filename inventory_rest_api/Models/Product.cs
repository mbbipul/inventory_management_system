using System;
using System.ComponentModel.DataAnnotations;

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
        
        public String ProductDetails { get ; set ; }

    }
}