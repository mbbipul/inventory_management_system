
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace inventory_rest_api.Models
{
    public class OrderSales
    {
        public long OrderSalesId { get; set; }
        public long EmployeeId { get; set; }
        public string OrderDate { get; set; }
        public double OrderTotalPrice { get; set; }
        public double OrderPaymentAmount { get; set; }
        public bool OrderPaidStatus { get; set ;}
        public double Commission { get; set; }
        public double Cost { get; set;  }
        public string RouteName { get; set; }

        [JsonIgnore]
        public ICollection<OrderProduct> OrderProduct { get; set; }
        [JsonIgnore]
        public List<OrderPayment> OrderPayments { get; set; }


    }
}