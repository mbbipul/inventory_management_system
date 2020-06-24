using System;
using System.ComponentModel.DataAnnotations;

namespace inventory_rest_api.Models
{
    public class Sales
    {
        public long SalesId { get; set; }
        
        [Required]
        public long CustomerId { get; set;}

        [Required]
        public long ProductId { get; set;}

        [Required]
        public int ProductQuantity { get ; set; }

        [Required]
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:dd-MM-yyyy}", ApplyFormatInEditMode = true)]
        public DateTime SalesDate { get; set; }
        
        [Required]
        public long SalesPrice { get; set; }

        [Required]
        public long SalesDueAmount { get; set; }
        
        [Required]
        public bool SalesPaidStatus { get; set; }

        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:dd-MM-yyyy}", ApplyFormatInEditMode = true)]
        public DateTime SalesDuePaymentDate { get; set;}

        [Required]
        public long SalesDiscount { get; set; }


    }
}