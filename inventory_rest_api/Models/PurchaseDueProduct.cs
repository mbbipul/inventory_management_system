using System.ComponentModel.DataAnnotations;

namespace inventory_rest_api.Models
{
    public class PurchaseDueProduct
    {
        public long PurchaseDueProductId { get; set;}

        [Required]
        public long ProductId { get; set; }

        [Required]
        public long SupplierId { get; set; }

        [Required]
        public int ProductQuantity { get ; set;}
    }
}