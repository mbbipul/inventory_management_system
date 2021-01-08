using System.Text.Json.Serialization;

namespace inventory_rest_api.Models
{
    public class OrderProduct
    {
        public long OrderProductId { get; set; }
        public long ProductPurchaseHistoryId { get; set; }

        public long OrderSalesId { get; set; }

        public int ProductQuantityProductQuantity { get ; set; }
        public int ReturnQuantityProductQuantity { get ; set; }
        public int DamageQuantityProductQuantity { get ; set; }
        public long ProductRatePrice { get; set; }

        [JsonIgnore]
        public ProductPurchaseHistory ProductPurchaseHistory { get; set; }

        [JsonIgnore]
        public OrderSales OrderSales { get; set; }

    }
}