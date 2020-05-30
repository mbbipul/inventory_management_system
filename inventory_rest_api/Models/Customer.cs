using System;
namespace inventory_rest_api.Models
{
    public class Customer
    {
        public long CustomerId { get; }
        public String CustomerName { get ; set; }
        public String CustomerEmail { get ; set; }
        public String CustomerMobile { get ; set; }
        public String CustomerAddress { get ; set; }
        public String CustomerNID { get; set; }
    }
}