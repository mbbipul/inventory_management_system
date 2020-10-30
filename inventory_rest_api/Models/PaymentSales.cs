using System.Text.Json.Serialization;

namespace inventory_rest_api.Models
{
    public class PaymentSales
    {
        public long PaymentSalesId { get; set; }
        public long SalesId { get; set; }
        public string PaymentSalesDate { get; set; }
        public long PaymentAmount { get; set; }
        public long CustomerId { get; set; }

        [JsonIgnore]
        public Customer Customer { get ; set; }

        [JsonIgnore]
        public Sales Sales { get; set; }
    }
}