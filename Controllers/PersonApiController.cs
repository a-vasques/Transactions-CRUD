using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TransactionsCRUDv2.Data;
using TransactionsCRUDv2.Models;

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

        [HttpPost]
        public async Task<IActionResult> AddPerson(Person person)
        {
            _appDbContext.Person.Add(person);
            await _appDbContext.SaveChangesAsync();

            return Ok(person);
        }

        [HttpGet]
        public async Task<IActionResult> GetPerson()
        {
            var person = await _appDbContext.Person.ToListAsync();

            return Ok(person);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePerson(int id)
        {
            var person = await _appDbContext.Person.FindAsync(id);

            if (person == null)
            {
                return NotFound(person);
            }

            _appDbContext.Person.Remove(person);
            await _appDbContext.SaveChangesAsync();

            return Ok(person);
        }

        [HttpPost]
        public async Task<IActionResult> AddTransaction(Transaction transaction)
        {
            _appDbContext.Transaction.Add(transaction);
            await _appDbContext.SaveChangesAsync();

            return Ok(transaction);
        }

        [HttpGet]
        public async Task<IActionResult> GetTransaction()
        {
            var transaction = await _appDbContext.Transaction.ToListAsync();

            return Ok(transaction);
        }
    }
}