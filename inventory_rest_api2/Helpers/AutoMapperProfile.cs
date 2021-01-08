using AutoMapper;
using inventory_rest_api.Dtos;
using inventory_rest_api.Models;

namespace inventory_rest_api.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, UserDto>();
            CreateMap<UserDto, User>();
        }
    }
}