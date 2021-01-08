using System.Collections.Generic;

namespace inventory_rest_api.Models
{
    public class SalesMemo
    {
        public long SalesMemoId { get; set; }
        public string MemoDate { get; set; }
        public List<MemoWithSales> MemoWithSales { get; set; }

    }
}