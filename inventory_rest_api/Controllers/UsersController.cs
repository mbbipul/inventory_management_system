
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using inventory_rest_api.Dtos;
using inventory_rest_api.Helpers;
using inventory_rest_api.Models;
using inventory_rest_api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace inventory_rest_api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : Controller
    {
        private IUserService _userService;
        private IMapper _mapper;
        private readonly AppSettings _appSettings;

        public IOptions<AppSettings> AppSettings { get; }

        public UsersController(
            IUserService userService,
            IMapper mapper,
            IOptions<AppSettings> appSettings){

                _userService = userService;
                _mapper = mapper;
                AppSettings = appSettings;
                _appSettings = appSettings.Value;
        }
 
        [AllowAnonymous]
        [HttpPost("register")]
        public IActionResult Register([FromBody]UserDto userDto)
        {
            // map dto to entity
            var user = _mapper.Map<User>(userDto);
 
            try
            {
                // save 
                _userService.Create(user, userDto.Password);
                return Ok("Successfully create a new user!");
            } 
            catch(AppException ex)
            {
                // return error message if there was an exception
                return BadRequest(ex.Message);
            }
        }
        
        [AllowAnonymous]
        [HttpGet("switch-store/{store}")]
        public IActionResult SwithcStore(int store)
        {
            // map dto to entity
            Response.Cookies.Append(
                "store-info",
                getStoreUrl(store),
                new CookieOptions{
                    Expires = DateTimeOffset.Now.AddMinutes(30)
                }
            );
            return Ok();
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public IActionResult Authenticate([FromBody]UserDto userDto)
        {
            var user = _userService.Authenticate(userDto.UserEmail, userDto.Password);
 
            if (user == null)
                return Unauthorized();
 
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[] 
                {
                    new Claim(ClaimTypes.Name, user.Id.ToString())
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);
 
            var userInfo = new {
                Id = user.Id,
                UserEmail = user.UserEmail,
                FirstName = user.FirstName,
                LastName = user.LastName,
                AdminRole = user.AdminRole,
                HasSuperAdminRole = user.HasSuperAdminRole,
                Token = tokenString
            };

            var loginCookies = Base64Encode(Newtonsoft.Json.JsonConvert.SerializeObject(userInfo)) ;

            Response.Cookies.Append(
                "user-info",
                loginCookies,
                new CookieOptions{
                    Expires = DateTimeOffset.Now.AddMinutes(30)
                }
            );

            Response.Cookies.Append(
                "store-info",
                getStoreUrl(user.AdminRole),
                new CookieOptions{
                    Expires = DateTimeOffset.Now.AddMinutes(30)
                }
            );

            if(user.HasSuperAdminRole == true){
                Response.Cookies.Append(
                    "Bashundhara",
                    loginCookies,
                    new CookieOptions{
                        Expires = DateTimeOffset.Now.AddMinutes(30)
                    }
                );
                Response.Cookies.Append(
                    "Matrivandar",
                    loginCookies,
                    new CookieOptions{
                        Expires = DateTimeOffset.Now.AddMinutes(30)
                    }
                );
                Response.Cookies.Append(
                    "Radhuni_Square",
                    loginCookies,
                    new CookieOptions{
                        Expires = DateTimeOffset.Now.AddMinutes(30)
                    }
                );
            }
            else{
                Response.Cookies.Append(
                    getStoreName(user.AdminRole),
                    loginCookies,
                    new CookieOptions{
                        Expires = DateTimeOffset.Now.AddMinutes(30)
                    }
                );
            }
            
            // return basic user info (without password) and token to store client side
            return Ok("Login Success");
        }
 
        [AllowAnonymous]
        [HttpGet]
        public IActionResult GetAll()
        {
            var users =  _userService.GetAll();
            var userDtos = _mapper.Map<IList<UserDto>>(users);
            return Ok(userDtos);
        }
 
        [AllowAnonymous]
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var user =  _userService.GetById(id);
            var userDto = _mapper.Map<UserDto>(user);
            return Ok(userDto);
        }

        [AllowAnonymous]
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody]UserDto userDto)
        {
            // map dto to entity and set id
            var user = _mapper.Map<User>(userDto);
            user.Id = id;
 
            try
            {
                // save 
                _userService.Update(user, userDto.Password);
                return Ok();
            } 
            catch(AppException ex)
            {
                // return error message if there was an exception
                return BadRequest(ex.Message);
            }
        }
 
        [AllowAnonymous]
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _userService.Delete(id);
            return Ok();
        }

        public static string Base64Encode(string plainText) {
            var plainTextBytes = System.Text.Encoding.UTF8.GetBytes(plainText);
            return System.Convert.ToBase64String(plainTextBytes);
        }

        public string getStoreName(int id){
            switch (id)
            {
                case 0:
                    return "Matrivandar";
                case 1:
                    return "Radhuni_Square";
                case 2:
                    return "Bashundhara";
                default:
                    return "";
            }
        }

        public string getStoreUrl(int id){
            switch (id)
            {
                case 0:
                    return "store1";
                case 1:
                    return "store2";
                case 2:
                    return "store3";
                case 999:
                    return "store1";
                default:
                    return "store1";
            }
        }
    }
}