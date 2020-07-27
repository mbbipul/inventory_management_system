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
        public long ProductQuantity { get; set; }
        
        [Required]
        public long PerProductPurchasePrice { get; set; }

        [Required]
        public long PerProductSalesPrice { get; set; }

        [Required]
        public string Date{ get; set;}
        
        [JsonIgnore]
        public Product Product { get ; set; }

        public ICollection<Sales> Sales { get; set;}

    }
}