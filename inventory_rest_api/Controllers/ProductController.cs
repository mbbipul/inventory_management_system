namespace inventory_rest_api.Controllers
{

    [ApiController]
    [Route("[controller]")]
    public class ProductController : ControllerBase 
    {
        [HttpGet]
        public string Get(){
            return "Hello";
        }
    }
}