using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TransactionsCRUDv2.Data;
using TransactionsCRUDv2.Models;
using TransactionsCRUDv2.DTOs;

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
        public async Task<IActionResult> AddPerson([FromBody] CreatePersonDto personDto)
        {
            var person = new Person
            {
                PersonName = personDto.PersonName,
                PersonAge = personDto.PersonAge
            };

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
                return NotFound("The person does not exist.");
            }

            _appDbContext.Person.Remove(person);
            await _appDbContext.SaveChangesAsync();

            return Ok(person);
        }
    }
}