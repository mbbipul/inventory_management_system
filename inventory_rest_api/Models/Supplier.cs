using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace inventory_rest_api.Models
{
    public class Supplier
    {
        public long SupplierId { get; set; }

        [Required]
        public long CompanyId { get; set; }

        [Required]
        public string SupplierName { get; set; }

        [Required]
        public string SupplierAddress { get; set; }

        [Required]
        public string SupplierContact { get; set; }

        public string SupplierEmail { get; set; }

        [JsonIgnore]
        public Company Company { get ; set; }

        public long DamageId { get; set; }
        public Damage Damage { get; set; }
    }
}