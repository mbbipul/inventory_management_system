using System.Text.Json.Serialization;

namespace inventory_rest_api.Models
{
    public class SalesHistory
    {
        public long SalesHistoryId { get; set; }
        public long SalesId { get; set ;}
        public int ProductQuantity { get; set; }
        public string DeliveryDate { get; set; }

        [JsonIgnore]
        public Sales Sales { get; set; }
    }
}