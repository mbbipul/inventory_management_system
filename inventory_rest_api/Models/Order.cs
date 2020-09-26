namespace inventory_rest_api.Models
{
    public class Order
    {
        public long OrderId { get; set; }
        public long CustomerId { get; set; }
        public long ProductId { get; set; }
        public long SalesId { get; set; }
        public string OrderDate { get; set; }
        public string OrderStaus { get; set; }
        public int OrderProductQuantity { get ; set; }
        public long MiscellaneousCost { get; set; } 

        public Product Product { get; set; }
        public Customer Customer { get; set; } 

    }
}