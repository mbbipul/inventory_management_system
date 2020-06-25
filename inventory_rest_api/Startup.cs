using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using inventory_rest_api.Models;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace inventory_rest_api
{
    public class Startup
    {
        readonly string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors(options =>
                    {
                        options.AddPolicy(name: MyAllowSpecificOrigins,
                                        builder =>
                                        {
                                            builder.WithOrigins("http://localhost:3000",
                                                                "http://localhost:3001")
                                                                .AllowAnyHeader()
                                                  .AllowAnyMethod();;
                                        });
            });
                    
            services.AddControllers();
            services.AddDbContext<InventoryDbContext>( opt => 
                opt.UseSqlServer(Configuration.GetConnectionString("inventoryDb")));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseCors(MyAllowSpecificOrigins);
            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            using (var scope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                scope.ServiceProvider.GetService<InventoryDbContext>().Database.Migrate();
            }
        //   SeedData.EnsurePopulated(app);
        }
    }
}
