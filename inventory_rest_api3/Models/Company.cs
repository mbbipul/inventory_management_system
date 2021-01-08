using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace inventory_rest_api.Models
{
    public class Company
    {
        public long CompanyId { get; set; }

        [Required]
        public string CompanyName { get; set; }

        [Required]
        public string CompanyAddress { get; set; }

        [Required]
        public string CompanyContact { get; set; }

        public ICollection<Supplier> Suppliers { get ; set ;}
        
    }
}