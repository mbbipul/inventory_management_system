using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace inventory_rest_api.Models
{
    public class Purchase
    {

        public long PurchaseId { get ; set; }

        [Required]
        public long SupplierId { get; set;}

        [Required]
        public long ProductId { get; set;}

        [Required]
        public int ProductQuantity { get ; set; }

        [Required]
        public string PurchaseDate { get; set; }
        
        [Required]
        public long PurchasePrice { get; set; }

        // public long CurrentPurchasePrice
        [Required]
        public long SalesPrice { get; set; }

        [Required]
        public long PurchasePaymentAmount { get; set; }
        
        [Required]
        public bool PurchasePaidStatus { get; set; }

        public string PurchaseDuePaymentDate { get; set;}

        [Required]
        public long PurchaseDiscount { get; set; }

        [JsonIgnore]
        public Product Product { get ; set; }

        [JsonIgnore]
        public PurchaseDueProduct PurchaseDueProduct { get ; set ; }

    }
}