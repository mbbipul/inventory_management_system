using System.ComponentModel.DataAnnotations;

namespace inventory_rest_api.Models
{
    public class PurchaseDueProduct
    {
        public long PurchaseDueProductId { get; set;}

        [Required]
        public long PurchaseId { get ; set;}

        [Required]
        public long ProductPurchaseHistoryId { get ; set;}

        [Required]
        public int ProductQuantity { get ; set;}

        public Purchase Purchase { get ; set ; }
        public ProductPurchaseHistory ProductPurchaseHistory { get ; set ; }

    }
}