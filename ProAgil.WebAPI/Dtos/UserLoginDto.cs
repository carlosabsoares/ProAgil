using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ProAgil.API.Dtos
{
    public class UserLoginDto
    {
        public string UserName { get; set; }
        public string Password { get; set; }

        public UserLoginDto()
        {}

        public UserLoginDto(string userName, string password)
        {
            UserName = userName;
            Password = password;
        }
    }
}
