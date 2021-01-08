using System.ComponentModel.DataAnnotations;

namespace inventory_rest_api.Models
{
    public class SalesProduct
    {
        [Key]
        public long SalesProductId { get; set; }
        public long SalesId { get; set; }
        public long ProductPurchaseHistoryId { get; set; }
        public int ProductQuantity { get; set; }
        public long PerProductPrice { get; set; }

        public ProductPurchaseHistory ProductPurchaseHistory { get; set; }
        public Sales Sales { get; set; }
        public SalesDueProduct SalesDueProduct { get; set; }
    }
}