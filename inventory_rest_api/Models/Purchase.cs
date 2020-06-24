using System;
using System.ComponentModel.DataAnnotations;

namespace inventory_rest_api.Models
{
    public class Purchase
    {

        public long PurchaseId { get ; set; }

        [Required]
        public long SupplierId { get; set;}

        [Required]
        public long ProductId { get; set;}

        [Required]
        public int ProductQuantity { get ; set; }

        [Required]
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:dd-MM-yyyy}", ApplyFormatInEditMode = true)]
        public DateTime PurchaseDate { get; set; }
        
        [Required]
        public long PurchasePrice { get; set; }

        [Required]
        public long PurchasePaymentAmount { get; set; }
        
        [Required]
        public bool PurchasePaidStatus { get; set; }

        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:dd-MM-yyyy}", ApplyFormatInEditMode = true)]
        public DateTime PurchaseDuePaymentDate { get; set;}

        [Required]
        public long PurchaseDiscount { get; set; }


    }
}