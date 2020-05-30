using System;
namespace inventory_rest_api.Models
{
    public class Product
    {
        
        public long ProductId { get; set;}
        public String ProductName { get ; set; }
        public String ProductCode { get ; set; }
        public String ProductType { get ; set; }
        public int ProductQuantity { get ; set; }
        public long ProductPrice { get ; set;  }

    }
}