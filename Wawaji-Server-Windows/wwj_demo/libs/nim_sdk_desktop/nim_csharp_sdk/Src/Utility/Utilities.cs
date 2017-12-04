using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace NimUtility
{
    public class Utilities
    {
        public static string GenerateGuid()
        {
            return Guid.NewGuid().ToString();
        }
    }
}
