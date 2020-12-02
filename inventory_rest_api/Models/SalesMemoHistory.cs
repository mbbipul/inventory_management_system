using System.Collections.Generic;

namespace inventory_rest_api.Models
{
    public class SalesMemoHistory
    {
        public long SalesMemoHistoryId { get; set; }
        public string MemoIssueDate { get; set; }
        public long Id { get; set ; }
        public long CustomerId { get; set; }
        public string SalesIds { get ; set; }
        public string MemoDigitalPrint { get; set; }
        public User User { get; set; }
    }
}