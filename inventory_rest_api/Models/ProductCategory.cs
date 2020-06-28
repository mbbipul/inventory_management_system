using System.ComponentModel.DataAnnotations;

namespace inventory_rest_api.Models
{
    public class ProductCategory
    {
        [Key]
        public long ProductCategoryId { get; set ;}

        [Required]
        public string ProductCategoryName { get; set; }
    }
}