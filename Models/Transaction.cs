using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TransactionsCRUDv2.Models
{
    public enum TransactionType
    {
        Expense = 1,
        Income = 2
    }
    public class Transaction
    {
        public int TransactionId { get; set; }
        public string TransactionDescription { get; set; }
        public decimal TransactionValue { get; set; }
        public TransactionType TransactionType { get; set; }
        public int PersonId { get; set; }
        public Person Person { get; set; }
    }
}