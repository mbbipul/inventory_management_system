namespace inventory_rest_api.Dtos
{
    public class UserDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserEmail { get; set; }
        public int AdminRole { get; set; }
        public bool HasSuperAdminRole { get; set; } 
        public string Password { get; set; }
    }
}