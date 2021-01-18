using System.Text.Json.Serialization;

namespace inventory_rest_api.Models
{
    public class OrderPayment
    {
        public long OrderPaymentId { get; set; }
        public long OrderSalesId { get; set; }
        public string PaymentOrderSalesDate { get; set; }
        public double PaymentAmount { get; set; }

        [JsonIgnore]
        public OrderSales orderSales { get; set; }
    }
}