using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace inventory_rest_api.Models
{
    public class Salary
    {
        [Key]
        public long SalaryId { get; set; }

        [Required]
        public long EmployeeId { get; set; } 

        [Required]
        public double SalaryAmount { get; set; }

        [Required]
        public long SalaryPaymentDate { get; set; }

        [JsonIgnore]
        public Employee Employee { get; set; }

    }
}