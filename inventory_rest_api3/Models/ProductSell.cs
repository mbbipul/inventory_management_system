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
        public long ProductSellPrice { get; set; }
        public long ProductSellDiscount { get; set; }
        public long ProductSellDue { get; set; }
        public bool ProductSellPayStatus { get;  set; }

    }
}