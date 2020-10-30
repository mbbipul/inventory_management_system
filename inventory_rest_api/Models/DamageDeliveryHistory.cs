using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace inventory_rest_api.Models
{
    public class DamageDeliveryHistory
    {
        public long DamageDeliveryHistoryId { get; set; }
        
        [Required]
        public long DamageId { get; set; }

        [Required] long DeliveryDate { get; set; }

        [Required]
        public int DeliverProductQuantity { get; set; }

        [JsonIgnore]
        public Damage Damage { get; set; }
    }
}