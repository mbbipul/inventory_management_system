using System.Collections.Generic;

namespace inventory_rest_api.Models
{
    public class User
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserEmail { get; set; }
        public int AdminRole { get; set; }
        public bool HasSuperAdminRole { get; set; } 
        public byte[] PasswordHash { get; set; }
        public byte[] PasswordSalt { get; set; }

        public List<SalesMemoHistory> SalesMemoHistories { get; set; }
    }
}