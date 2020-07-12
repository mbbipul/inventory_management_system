using System;
using System.ComponentModel.DataAnnotations;

namespace inventory_rest_api.Models
{
    public class Customer
    {

        public long CustomerId { get; set; }

        [Required]
        public String CustomerName { get ; set; }
        public String CustomerEmail { get ; set; }

        [Required]
        public String CustomerContact { get ; set; }

        [Required]
        public String CustomerAddress { get ; set; }

        [Required]
        public String CustomerJoinDate { get ; set ; }

        [Required]
        public String CustomerNID { get; set; }
    }
}