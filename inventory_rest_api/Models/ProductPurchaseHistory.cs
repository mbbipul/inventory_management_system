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
        public long PurchaseId { get; set; }

        [Required]
        public long PerProductPurchasePrice { get; set; }

        [JsonIgnore]
        public Product Product { get ; set; }

        [JsonIgnore]
        public Purchase Purchase { get ; set; }


    }
}