using System.Text.Json.Serialization;

namespace inventory_rest_api.Models
{
    public class PaymentSales
    {
        public long PaymentSalesId { get; set; }
        public long SalesId { get; set; }
        public string PaymentSalesDate { get; set; }
        public double PaymentAmount { get; set; }

        [JsonIgnore]
        public Sales Sales { get; set; }
    }
}