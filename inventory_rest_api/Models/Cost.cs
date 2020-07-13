using System.ComponentModel.DataAnnotations;

namespace inventory_rest_api.Models
{
    public class Cost
    {

        [Key]
        public long CostId { get; set; }

        [Required]
        public string CostType { get; set; }

        [Required]
        public string Date { get; set; }

        [Required] 
        public long CostAmount { get; set; }

        public string CostDescription { get; set; }
    }
}