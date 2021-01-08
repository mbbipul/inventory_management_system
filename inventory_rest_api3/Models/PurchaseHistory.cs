using System.Text.Json.Serialization;

namespace inventory_rest_api.Models
{
    public class PurchaseHistory
    {
        public long PurchaseHistoryId { get; set; }
        public long PurchaseId { get; set ;}
        public int ProductQuantity { get; set; }
        public string ReceptionDate { get; set; }

        [JsonIgnore]
        public Purchase Purchase { get; set; }



    }
}