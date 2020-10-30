using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace inventory_rest_api.Models
{
    public class DamageReceptionHistory
    {
        public long DamageReceptionHistoryId { get; set; }
        
        [Required]
        public long DamageId { get; set; }

        [Required] long ReceptionDate { get; set; }

        [Required]
        public int RecievedProductQuantity { get; set; }

        [JsonIgnore]
        public Damage Damage { get; set; }

    }
}