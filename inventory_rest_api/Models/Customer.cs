using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace inventory_rest_api.Models
{
    public class Customer
    {

        [Key]
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

        
        [JsonIgnore]
        public List<Damage> Damages { get; set; }
    }
}