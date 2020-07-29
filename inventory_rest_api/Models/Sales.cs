using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace inventory_rest_api.Models
{
    public class Sales
    {
        public long SalesId { get; set; }
        
        [Required]
        public long CustomerId { get; set;}

        [Required]
        public long ProductId { get; set;}

        [Required]
        public long ProductPurchaseHistoryId { get; set;}

        [Required]
        public int ProductQuantity { get ; set; }

        [Required]
        public string SalesDate { get; set; }
        
        [Required]
        public long SalesPrice { get; set; }


        [Required]
        public long SalesPaymentAmount { get; set; }

        [Required]
        public long SalesDueAmount { get; set; }
        
        [Required]
        public bool SalesPaidStatus { get; set; }

        public string SalesDuePaymentDate { get; set;}

        [Required]
        public long SalesDiscount { get; set; }

        [JsonIgnore]
        public Product Product { get ; set; }

        [JsonIgnore]
        public ProductPurchaseHistory ProductPurchaseHistory { get ; set; }


    }
}