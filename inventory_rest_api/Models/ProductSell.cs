using System.Reflection.Emit;
using System;
namespace inventory_rest_api.Models
{
    public class ProductSell
    {
        public long ProductSellId { get; }
        public Customer Customer { get; }
        public Product Product { get; }
        public int ProductQuantity { get; set; }
        public String ProductSellDate { get; set; }
        public double ProductSellPrice { get; set; }
        public double ProductSellDiscount { get; set; }
        public double ProductSellDue { get; set; }
        public bool ProductSellPayStatus { get;  set; }

    }
}