using System.ComponentModel.DataAnnotations;

namespace inventory_rest_api.Models
{
    public class SalesDueProduct
    {
        public long SalesDueProductId { get; set;}

        [Required]
        public long SalesId { get ; set;}

        [Required]
        public int ProductQuantity { get ; set;}

        public Sales Sales { get ; set ; }
    }
}