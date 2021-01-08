using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using inventory_rest_api.Models;

namespace inventory_rest_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SalesMemoController : ControllerBase
    {
        private readonly InventoryDbContext _context;

        public SalesMemoController(InventoryDbContext context)
        {
            _context = context;
        }

        // GET: api/SalesMemo
        
    }
}
