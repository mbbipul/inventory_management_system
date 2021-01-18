using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace inventory_rest_api.Models
{
    public class ProductPurchaseHistory
    {
        public long ProductPurchaseHistoryId { get; set; }

        [Required]
        public long ProductId { get; set; }

        [Required]
        public int ProductQuantity { get; set; }
        
        [Required]
        public double PerProductPurchasePrice { get; set; }

        [Required]
        public double PerProductSalesPrice { get; set; }

        [Required]
        public string Date{ get; set;}
        
        [JsonIgnore]
        public Product Product { get ; set; }


        [JsonIgnore] 
        public List<SalesProduct> SalesProducts { get; set; }
        [JsonIgnore]
        public PurchaseDueProduct PurchaseDueProduct { get ; set ; }
        
    }
}