using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace inventory_rest_api.Models
{
    public class MemoWithSales
    {
        public long MemoWithSalesId { get; set; }
        public long SalesId { get; set;}
        public long SalesMemoId { get; set; } 

        [JsonIgnore]
        public SalesMemo SalesMemo { get; set; }

        [JsonIgnore]
        public Sales Sales { get; set; }
    }
}