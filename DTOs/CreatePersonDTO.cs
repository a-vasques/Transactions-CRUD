
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TransactionsCRUDv2.DTOs
{
    public class CreatePersonDto
    {
        public string PersonName { get; set; } = string.Empty;

        public int PersonAge { get; set; }
    }
}