using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TransactionsCRUDv2.Models;

namespace TransactionsCRUDv2.DTOs
{
    public class CreateTransactionDto
    {
        public string TransactionDescription { get; set; } = string.Empty;

        public decimal TransactionValue { get; set; }

        public TransactionType TransactionType { get; set; }

        public int PersonId { get; set; }
    }
}