using System.ComponentModel.DataAnnotations;

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

        
    }
}