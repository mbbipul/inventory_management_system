using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace inventory_rest_api.Models
{
    public class Employee
    {
        [Key]
        public long EmployeeId { get; set;}

        [Required]
        public String EmployeeName { get; set;}
        
        [Required]
        public String EmployeeContact { get ; set; }

        [Required]
        public String EmployeeAddress { get ; set; }

        [Required]
        public String Date { get ; set; }

        public ICollection<Salary> Salaries { get; set;}

        [JsonIgnore]
        public List<Damage> Damages { get; set; }
    }
}; 