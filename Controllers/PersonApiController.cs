using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TransactionsCRUDv2.Data;

namespace TransactionsCRUDv2.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PersonApiController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;

        public PersonApiController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }
    }
}