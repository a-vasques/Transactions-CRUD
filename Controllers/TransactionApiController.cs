using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TransactionsCRUDv2.Data;
using TransactionsCRUDv2.Models;
using TransactionsCRUDv2.DTOs;

namespace TransactionsCRUDv2.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionApiController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;

        public TransactionApiController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        [HttpPost]
        public async Task<IActionResult> AddTransaction([FromBody] CreateTransactionDto transactionDto)
        {
            var person = await _appDbContext.Person.FindAsync(transactionDto.PersonId);

            if (person == null)
            {
                return BadRequest("The person does not exist.");
            }

            if (person.PersonAge < 18 && transactionDto.TransactionType == TransactionType.Income)
            {
                return BadRequest("Minors can only add expenses.");
            }

            var transaction = new Transaction
            {
                TransactionDescription = transactionDto.TransactionDescription,
                TransactionValue = transactionDto.TransactionValue,
                TransactionType = transactionDto.TransactionType,
                PersonId = transactionDto.PersonId
            };

            _appDbContext.Transaction.Add(transaction);
            await _appDbContext.SaveChangesAsync();

            return Ok(transaction);
        }

        [HttpGet]
        public async Task<IActionResult> GetTransactions()
        {
            var transactions = await _appDbContext.Transaction
                .Include(t => t.Person)
                .ToListAsync();

            return Ok(transactions);
        }
    }
}