using System.Collections.Generic;

namespace inventory_rest_api.Models
{
    public class Damage
    {
        public long DamageId { get; set; }
        public long ProductId { get; set; }
        public long CustomerId { get; set; }
        public long EmployeeId { get; set; }
        public long SupplierId { get; set; }
        public string DamageRetDate { get ; set; }
        public int ProductQuantity { get; set; }
        public double DamageProductAmount { get; set; }
        public string DamageSentToCompanyStatus { get ; set; }
        public string DamageSentToCompanyDate { get ; set; }
        public string DamageRetFromCompanyDate { get ; set; }
        public double DamageRetFromComAmount { get ; set; }
        public int DamageRetComProQuantity { get; set; }
        public bool DamageRetComProQuantityDueStatus { get; set; }

        public double DamgeReturnCompanyDueAmount { get; set; }
        public bool DamgeReturnCompanyDuePaymentStatus { get; set; }

        public string DamgeReturnCompanyDueDate { get; set; }

        //relation 
        public Product Product { get; set; }
        public Customer Customer { get; set; }
        public Employee Employee { get; set; }
        public Supplier Supplier { get; set; }
        public List<DamageReceptionHistory> DamageReceptionHistories { get; set; }
        public List<DamageDeliveryHistory> DamageDeliveryHistories { get; set; }

    }
}