using System.Text.Json.Serialization;

namespace inventory_rest_api.Models
{
    public class PaymentPurchase
    {
        public long PaymentPurchaseId { get; set; }
        public long PurchaseId { get; set; }
        public string PaymentPurchaseDate { get; set; }
        public long PaymentAmount { get; set; }
        public long SupplierId { get; set; }

        [JsonIgnore]
        public Supplier Supplier { get ; set; }

        [JsonIgnore]
        public Purchase Purchase { get; set; }
    }
}