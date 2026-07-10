using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TransactionsCRUDv2.Data;
using TransactionsCRUDv2.Models;

namespace TransactionsCRUDv2.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TotalsApiController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;

        public TotalsApiController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        [HttpGet]
        public async Task<IActionResult> GetTotals()
        {
            var people = await _appDbContext.Person
                .Select(person => new
                {
                    person.PersonId,
                    person.PersonName,
                    person.PersonAge,

                    TotalIncome = _appDbContext.Transaction
                        .Where(t => t.PersonId == person.PersonId && t.TransactionType == TransactionType.Income)
                        .Sum(t => t.TransactionValue),

                    TotalExpenses = _appDbContext.Transaction
                        .Where(t => t.PersonId == person.PersonId && t.TransactionType == TransactionType.Expense)
                        .Sum(t => t.TransactionValue)
                })
                .ToListAsync();

            var peopleTotals = people.Select(person => new
            {
                person.PersonId,
                person.PersonName,
                person.PersonAge,
                person.TotalIncome,
                person.TotalExpenses,
                Balance = person.TotalIncome - person.TotalExpenses
            }).ToList();

            var generalTotalIncome = peopleTotals.Sum(p => p.TotalIncome);
            var generalTotalExpenses = peopleTotals.Sum(p => p.TotalExpenses);

            var result = new
            {
                People = peopleTotals,
                GeneralTotals = new
                {
                    TotalIncome = generalTotalIncome,
                    TotalExpenses = generalTotalExpenses,
                    Balance = generalTotalIncome - generalTotalExpenses
                }
            };

            return Ok(result);
        }
    }
}