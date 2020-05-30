using System;
namespace inventory_rest_api.Models
{
    public class Employee
    {
        public long EmployeeId { get; }
        public String EmployeeName { get; set;}
        public String EmployeeEmail { get; set; }
        public String EmployeeMobile { get ; set; }
        public String EmployeeAddress { get ; set; }
        public String EmployeeNID { get; set; }
    }
}; 