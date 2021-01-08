using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace inventory_rest_api.Models
{
    public class Sales
    {
        public long SalesId { get; set; }
        
        [Required]
        public long CustomerId { get; set;}

        [Required]
        public string SalesDate { get; set; }
        
        [Required]
        public long SalesPrice { get; set; }


        [Required]
        public long SalesPaymentAmount { get; set; }

        [Required]
        public bool SalesPaidStatus { get; set; }


        [JsonIgnore]
        public SalesDueProduct SalesDueProduct { get ; set; }
        

        [JsonIgnore]
        public List<PaymentSales> PaymentSales { get; set; }
        public List<SalesHistory> SalesHistories { get; set; }

        public ICollection<SalesProduct> SalesProducts { get; set; }
        
    }
}