using System;
using System.ComponentModel.DataAnnotations;

namespace inventory_rest_api.Models
{
    public class Payment
    {
        public long PaymentId { get; set; }

        [Required]
        public string PaymentType { get; set; }

        [Required]
        public long PaymentAmount { get; set; }

        [Required]
        [DataType(DataType.Date)]
        [DisplayFormat(DataFormatString = "{0:dd-MM-yyyy}", ApplyFormatInEditMode = true)]
        public DateTime PaymentDate { get; set;}

    }
}