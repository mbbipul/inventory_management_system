namespace inventory_rest_api.Models
{
    public class Order
    {
        public long OrderId { get; set; }
        public long CustomerId { get; set; }
        public long ProductId { get; set; }
        public string OrderDate { get; set; }
        public string OrderStaus { get; set; }


    }
}