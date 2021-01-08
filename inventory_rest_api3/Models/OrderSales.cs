
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace inventory_rest_api.Models
{
    public class OrderSales
    {
        public long OrderSalesId { get; set; }
        public long EmployeeId { get; set; }
        public string OrderDate { get; set; }
        public long OrderTotalPrice { get; set; }
        public long OrderPaymentAmount { get; set; }
        public bool OrderPaidStatus { get; set ;}
        public long Commission { get; set; }
        public long Cost { get; set;  }

        [JsonIgnore]
        public ICollection<OrderProduct> OrderProduct { get; set; }
        [JsonIgnore]
        public List<OrderPayment> OrderPayments { get; set; }


    }
}