using System.Text.Json.Serialization;

namespace inventory_rest_api.Models
{
    public class PaymentPurchase
    {
        public long PaymentPurchaseId { get; set; }
        public long PurchaseId { get; set; }
        public string PaymentPurchaseDate { get; set; }
        public double PaymentAmount { get; set; }

        [JsonIgnore]
        public Purchase Purchase { get; set; }
    }
}