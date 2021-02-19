using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using inventory_rest_api.Models;
using System.Collections;

namespace inventory_rest_api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly InventoryDbContext _context;

        public OrdersController(InventoryDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<IEnumerable> GetOrderSales(){
            var query = from os in _context.OrderSales
                        select new {
                            Date = AppUtils.DateTime(os.OrderDate).ToShortDateString(),
                            OrderSales = os
                        };
            return query.AsEnumerable()
                .GroupBy( os =>
                    os.Date,
                    (key,g) => new {
                        Date = key,
                        Data = g.Select(os => os.OrderSales)
                                .GroupBy(
                                    os => os.EmployeeId,
                                    (key,g) => new {
                                        EmployeeId = key,
                                        Data = g.ToList()
                                    }
                                ).ToList()
                    }
                ).ToList();
        }

        [HttpGet("order-sales-payment-due")]
        public async Task<ActionResult<IEnumerable>> GetSalesPaymentDue(long id){

            var query = from orderSales in _context.OrderSales where orderSales.OrderPaidStatus == false
                        join employee in _context.Employees
                            on orderSales.EmployeeId equals employee.EmployeeId
                        select new {
                            orderSales.OrderSalesId,
                            employee.EmployeeId,
                            employee.EmployeeName,
                            orderSales.OrderDate,
                            orderSales.OrderPaidStatus,
                            OrderPaymentDue = orderSales.OrderTotalPrice - orderSales.OrderPaymentAmount,
                           
                            orderSales.OrderTotalPrice,
                        }; 
            return await query.ToListAsync();
            
        }

        [HttpGet("nn/{date}")]
        public async Task<ActionResult<IEnumerable>> GetOrderSalesByDate(string date){
            DateTime dateTime = AppUtils.DateTime(date);
            List<Employee> employees = await _context.Employees.ToListAsync();
            
            List<EmployeeOrderWithProdutctByDate> employeeOrderWithProdutctByDates = new List<EmployeeOrderWithProdutctByDate>();

            foreach (Employee employee in employees)
            {
                var orderSalesQuery =   from os in _context.OrderSales
                                        select new {
                                            Date = AppUtils.DateTime(os.OrderDate).ToShortDateString(),
                                            os.EmployeeId,
                                            OrderSales = os
                                        };
                OrderSales orderSales =     orderSalesQuery.AsEnumerable()
                                            .Where(os => os.Date == dateTime.ToShortDateString())
                                            .Where(os => os.EmployeeId == employee.EmployeeId)
                                            .Select(os => os.OrderSales)
                                            .FirstOrDefault();
                if(orderSales != null){
                    List<OrderProduct> orderProducts = await _context.OrderProducts.Where(op => op.OrderSalesId == orderSales.OrderSalesId).OrderBy(op => op.ProductPurchaseHistoryId).ToListAsync();
                    List<OrderProductInfo> orderProductInfos = new List<OrderProductInfo>();
                    
                    foreach (OrderProduct orderProduct in orderProducts)
                    {
                        var product1 =  from pph in _context.ProductPurchaseHistories
                                            join pro in _context.Products
                                                on pph.ProductId equals pro.ProductId
                                            select new {
                                                pph.ProductPurchaseHistoryId,
                                                pro
                                            };
                        Product product = product1.AsEnumerable()
                                            .Where(p => p.ProductPurchaseHistoryId == orderProduct.ProductPurchaseHistoryId)
                                            .Select(p => p.pro)
                                            .First();
                        OrderProductInfo orderProductInfo = new OrderProductInfo {
                            Product = product,
                            OrderProduct = orderProduct,
                            Pph =  _context.ProductPurchaseHistories
                                        .Where(pph => pph.ProductPurchaseHistoryId == orderProduct.ProductPurchaseHistoryId)
                                        .FirstOrDefault()
                        };
                        orderProductInfos.Add(orderProductInfo);

                    }
                    EmployeeOrderWithProdutctByDate employeeOrderWithProdutctBy = new EmployeeOrderWithProdutctByDate{
                        Employee = employee,
                        OrderSales = orderSales,
                        OrderProductInfos = orderProductInfos
                    };
                    employeeOrderWithProdutctByDates.Add(employeeOrderWithProdutctBy);
                }

            }

            return employeeOrderWithProdutctByDates;
        }

        // [HttpGet("is-order-exist/{employeeId}")]
        // public  ActionResult<Boolean> CheckIsOrderExits(long employeeId){
        //     DateTime today = DateTime.Today;
        //     var query = from os in _context.OrderSales
        //                 where os.EmployeeId == employeeId
        //                 select new {
        //                     Day = AppUtils.DateTime(os.OrderDate).Day,
        //                     AppUtils.DateTime(os.OrderDate).Month,
        //                     AppUtils.DateTime(os.OrderDate).Year 
        //                 };

        //     var seelctBydate = query.AsEnumerable().Where(os => os.Day == today.Day && os.Month == today.Month 
        //                 && os.Year == today.Year).ToList();

        //     return seelctBydate.Count() > 0;
        // }

        [HttpGet("order-sales-by-employeeid/{employeeId}")]
        public async  Task<ActionResult<Object>> GetOrderSalesByEmpId(long employeeId){
            DateTime today = DateTime.Today;
            var orderSales = from os in _context.OrderSales
                        where os.EmployeeId == employeeId
                        select new {
                            os.OrderSalesId,
                            os.EmployeeId,
                            os.OrderPaidStatus,
                            os.OrderTotalPrice,
                            os.OrderPaymentAmount,
                            os.Commission,
                            os.Cost,
                            os.RouteName,
                            Day = AppUtils.DateTime(os.OrderDate).Day,
                            AppUtils.DateTime(os.OrderDate).Month,
                            AppUtils.DateTime(os.OrderDate).Year ,
                            Date = AppUtils.DateTime(os.OrderDate).ToShortDateString()
                        };

            var orderSalesBydate = orderSales.AsEnumerable().Where(os => os.Day == today.Day && os.Month == today.Month 
                        && os.Year == today.Year && os.EmployeeId == employeeId).ToList();
                        
            var query = from product in _context.Products
                            .Include(p => p.ProductPurchaseHistories)
                        select new {
                            ProductId = product.ProductId,
                            ProductName = product.ProductName,
                            ProductCode = product.ProductCode,
                            TotalProducts = product.TotalProducts,
                            TotalProductInStock = product.TotalProductInStock,
                            ProductPrice = product.ProductPrice,
                            SalestPrice = product.SalestPrice,
                            PurHis = product.ProductPurchaseHistories
                        };
            List<Object> orderPros = new List<Object>();

            var allProducts = await query.ToListAsync();
            foreach (var item in allProducts)
            {
                var pphs = item.PurHis;
                List<Object> pphswithOrderInfo = new List<Object>();
                foreach (var pph in pphs)
                {
                    if(orderSalesBydate.Count() > 0){
                        var orderSalesId = orderSalesBydate.First().OrderSalesId;
                        
                        List<OrderProduct> orderProduct = _context.OrderProducts.
                                                    Where( 
                                                        op => op.OrderSalesId == orderSalesId &&
                                                        op.ProductPurchaseHistoryId == pph.ProductPurchaseHistoryId
                                                        ).ToList();
                        if (orderProduct.Count() > 0){
                            var pphOrder = new {
                                pph.ProductPurchaseHistoryId,
                                pph.PerProductPurchasePrice,
                                pph.PerProductSalesPrice,
                                pph.ProductId,
                                pph.ProductQuantity,
                                pph.Date,
                                orderSalesId,
                                orderProduct.First().OrderProductId,
                                orderProduct.First().DamageQuantityProductQuantity,
                                orderProduct.First().ProductQuantityProductQuantity,
                                orderProduct.First().ReturnQuantityProductQuantity,
                                orderProduct.First().ProductRatePrice
                            };
                            pphswithOrderInfo.Add(pphOrder);
                        }else{
                            var pphOrder = new {
                                pph.ProductPurchaseHistoryId,
                                pph.PerProductPurchasePrice,
                                pph.PerProductSalesPrice,
                                pph.ProductId,
                                pph.ProductQuantity,
                                pph.Date,
                                orderSalesId = -387827,
                                OrderProductId = -34,
                                DamageQuantityProductQuantity = 0,
                                ProductQuantityProductQuantity = 0,
                                ReturnQuantityProductQuantity = 0,
                                ProductRatePrice = 0
                            };
                            pphswithOrderInfo.Add(pphOrder);
                        }
                       
               
                    } else if (await _context.Employees.FindAsync(employeeId) != null){
                         var pphOrder = new {
                                pph.ProductPurchaseHistoryId,
                                pph.PerProductPurchasePrice,
                                pph.PerProductSalesPrice,
                                pph.ProductId,
                                pph.ProductQuantity,
                                pph.Date,
                                orderSalesId = -387827,
                                OrderProductId = -56,
                                DamageQuantityProductQuantity = 0,
                                ProductQuantityProductQuantity = 0,
                                ReturnQuantityProductQuantity = 0,
                                ProductRatePrice = 0
                            };
                            pphswithOrderInfo.Add(pphOrder);
                    }

                } 
                if (orderSalesBydate.Count() > 0 || await _context.Employees.FindAsync(employeeId) != null){
                    var orderPro = new {
                            item.ProductId,
                            item.ProductName,
                            item.ProductCode,
                            item.TotalProducts,
                            item.TotalProductInStock,
                            item.ProductPrice,
                            item.SalestPrice,
                            PurHis = pphswithOrderInfo
                    };
                    orderPros.Add(orderPro);

                } 

            }
            var orderSalesInfo = orderSalesBydate.Count() > 0 ? orderSalesBydate.First() : null;

            return  new {
                orderSalesInfo,
                Products = orderPros.ToList()
            };
        }

        [HttpGet("order-sales-by-date-employeeid/{employeeId}-{date}")]
        public async  Task<ActionResult<Object>> GetOrderSalesByEmpId(long employeeId,long date){
            DateTime today = AppUtils.DateTime(date);
            var orderSales = from os in _context.OrderSales
                        where os.EmployeeId == employeeId
                        select new {
                            os.OrderSalesId,
                            os.EmployeeId,
                            os.OrderPaidStatus,
                            os.OrderTotalPrice,
                            os.OrderPaymentAmount,
                            os.Commission,
                            os.Cost,
                            os.RouteName,
                            Day = AppUtils.DateTime(os.OrderDate).Day,
                            AppUtils.DateTime(os.OrderDate).Month,
                            AppUtils.DateTime(os.OrderDate).Year ,
                            Date = AppUtils.DateTime(os.OrderDate).ToShortDateString()
                        };

            var orderSalesBydate = orderSales.AsEnumerable().Where(os => os.Day == today.Day && os.Month == today.Month 
                        && os.Year == today.Year && os.EmployeeId == employeeId).ToList();
                        
            var query = from product in _context.Products
                            .Include(p => p.ProductPurchaseHistories)
                        select new {
                            ProductId = product.ProductId,
                            ProductName = product.ProductName,
                            ProductCode = product.ProductCode,
                            TotalProducts = product.TotalProducts,
                            TotalProductInStock = product.TotalProductInStock,
                            ProductPrice = product.ProductPrice,
                            SalestPrice = product.SalestPrice,
                            PurHis = product.ProductPurchaseHistories
                        };
            List<Object> orderPros = new List<Object>();

            var allProducts = await query.ToListAsync();
            foreach (var item in allProducts)
            {
                var pphs = item.PurHis;
                List<Object> pphswithOrderInfo = new List<Object>();
                foreach (var pph in pphs)
                {
                    if(orderSalesBydate.Count() > 0){
                        var orderSalesId = orderSalesBydate.First().OrderSalesId;
                        
                        List<OrderProduct> orderProduct = _context.OrderProducts.
                                                    Where( 
                                                        op => op.OrderSalesId == orderSalesId &&
                                                        op.ProductPurchaseHistoryId == pph.ProductPurchaseHistoryId
                                                        ).ToList();
                        if (orderProduct.Count() > 0){
                            var pphOrder = new {
                                pph.ProductPurchaseHistoryId,
                                pph.PerProductPurchasePrice,
                                pph.PerProductSalesPrice,
                                pph.ProductId,
                                pph.ProductQuantity,
                                pph.Date,
                                orderSalesId,
                                orderProduct.First().OrderProductId,
                                orderProduct.First().DamageQuantityProductQuantity,
                                orderProduct.First().ProductQuantityProductQuantity,
                                orderProduct.First().ReturnQuantityProductQuantity,
                                orderProduct.First().ProductRatePrice
                            };
                            pphswithOrderInfo.Add(pphOrder);
                        }else{
                            var pphOrder = new {
                                pph.ProductPurchaseHistoryId,
                                pph.PerProductPurchasePrice,
                                pph.PerProductSalesPrice,
                                pph.ProductId,
                                pph.ProductQuantity,
                                pph.Date,
                                orderSalesId = -387827,
                                OrderProductId = -34,
                                DamageQuantityProductQuantity = 0,
                                ProductQuantityProductQuantity = 0,
                                ReturnQuantityProductQuantity = 0,
                                ProductRatePrice = 0
                            };
                            pphswithOrderInfo.Add(pphOrder);
                        }
                       
               
                    } else if (await _context.Employees.FindAsync(employeeId) != null){
                         var pphOrder = new {
                                pph.ProductPurchaseHistoryId,
                                pph.PerProductPurchasePrice,
                                pph.PerProductSalesPrice,
                                pph.ProductId,
                                pph.ProductQuantity,
                                pph.Date,
                                orderSalesId = -387827,
                                OrderProductId = -56,
                                DamageQuantityProductQuantity = 0,
                                ProductQuantityProductQuantity = 0,
                                ReturnQuantityProductQuantity = 0,
                                ProductRatePrice = 0
                            };
                            pphswithOrderInfo.Add(pphOrder);
                    }

                } 
                if (orderSalesBydate.Count() > 0 || await _context.Employees.FindAsync(employeeId) != null){
                    var orderPro = new {
                            item.ProductId,
                            item.ProductName,
                            item.ProductCode,
                            item.TotalProducts,
                            item.TotalProductInStock,
                            item.ProductPrice,
                            item.SalestPrice,
                            PurHis = pphswithOrderInfo
                    };
                    orderPros.Add(orderPro);

                } 

            }
            var orderSalesInfo = orderSalesBydate.Count() > 0 ? orderSalesBydate.First() : null;

            return  new {
                orderSalesInfo,
                Products = orderPros.ToList()
            };
        }


        [HttpGet("order-sales-by-ids/{employeeId}")]
        public async Task<ActionResult<IEnumerable>> GetOrderSales(List<OrderSalesIdsWthEmpId> orderSalesIdsWthEmpIds){
            
            List<EmployeeOrderWithProdutctByDate> employeeOrderWithProdutctByDates = new List<EmployeeOrderWithProdutctByDate>();

            foreach (OrderSalesIdsWthEmpId orderSalesIdsWthEmpId in orderSalesIdsWthEmpIds)
            {
                Employee  employee = await _context.Employees.FindAsync(orderSalesIdsWthEmpId.EmployeeId);
                
                OrderSales orderSales = orderSalesIdsWthEmpId.OrderSales;

                List<OrderProduct> orderProducts = await _context.OrderProducts.Where(op => op.OrderSalesId == orderSales.OrderSalesId).ToListAsync(); 

                List<OrderProductInfo> orderProductInfos = new List<OrderProductInfo>();

                foreach (OrderProduct orderProduct in orderProducts)
                {
                    ProductPurchaseHistory pph = _context.ProductPurchaseHistories.Find(orderProduct.ProductPurchaseHistoryId);
                    Product product = _context.Products.Find(pph.ProductId);

                    OrderProductInfo orderProductInfo = new OrderProductInfo {
                        Product = product,
                        OrderProduct = orderProduct,
                        Pph = pph
                    };
                    orderProductInfos.Add(orderProductInfo);
                }

                List<long> orderSalesProductIds = orderProductInfos.Select(opi => opi.OrderProduct.ProductPurchaseHistory.ProductId).ToList();
                List<Product> extendProducts = await _context.Products.Where(p => !orderSalesProductIds.Contains(p.ProductId)).ToListAsync();
                List<OrderProductInfo> extendOrderProductInfos = new List<OrderProductInfo>();
                
                foreach (Product item in extendProducts)
                {
                    List<ProductPurchaseHistory> pphs = await _context.ProductPurchaseHistories.Where(pph => pph.ProductId == item.ProductId).ToListAsync();

                    foreach (ProductPurchaseHistory pph in pphs)
                    {
                        OrderProduct orderProduct = new OrderProduct {
                            ProductPurchaseHistoryId = pph.ProductPurchaseHistoryId,
                            ProductQuantityProductQuantity = 0,
                            ReturnQuantityProductQuantity = 0,
                            DamageQuantityProductQuantity = 0,
                            ProductRatePrice = 0
                        };

                        OrderProductInfo orderProductInfo = new OrderProductInfo {
                            Product = item,
                            OrderProduct = orderProduct,
                            Pph = pph
                        };
                        extendOrderProductInfos.Add(orderProductInfo);
                        
                    }
                }
                orderProductInfos.AddRange(extendOrderProductInfos);

                EmployeeOrderWithProdutctByDate employeeOrderWithProdutctByDate = new EmployeeOrderWithProdutctByDate{
                    Employee = employee,
                    OrderSales = orderSales,
                    OrderProductInfos = orderProductInfos
                } ;

                employeeOrderWithProdutctByDates.Add(employeeOrderWithProdutctByDate);
            }

            List<EmployeeOrderWithProdutctByDate> exEmployeeOrderWithProdutctByDates = new List<EmployeeOrderWithProdutctByDate>();

            List<Employee> employees = await _context.Employees
                                                .Where( 
                                                    e => !employeeOrderWithProdutctByDates
                                                        .Select(em => em.Employee.EmployeeId)
                                                        .ToList().Contains(e.EmployeeId)
                                                ).ToListAsync();
            
            foreach (Employee employee in employees){
                OrderSales orderSales = new OrderSales {
                    OrderSalesId = -9999998,
                    EmployeeId = employee.EmployeeId,
                    OrderTotalPrice = 0,
                    OrderDate = orderSalesIdsWthEmpIds.First().OrderSales.OrderDate,
                    OrderPaymentAmount = 0,
                    OrderPaidStatus = false,
                    Commission = 0,
                    Cost = 0
                };
                
                List<OrderProductInfo> orderProductInfos = new List<OrderProductInfo>();

                foreach (Product item in await _context.Products.ToListAsync())
                {
                    List<ProductPurchaseHistory> pphs = await _context.ProductPurchaseHistories.Where(pph => pph.ProductId == item.ProductId).ToListAsync();

                    foreach (ProductPurchaseHistory pph in pphs)
                    {
                        OrderProduct orderProduct = new OrderProduct {
                            OrderProductId = -999999988,
                            ProductPurchaseHistoryId = pph.ProductPurchaseHistoryId,
                            ProductQuantityProductQuantity = 0,
                            ReturnQuantityProductQuantity = 0,
                            DamageQuantityProductQuantity = 0,
                            ProductRatePrice = 0
                        };

                        OrderProductInfo orderProductInfo = new OrderProductInfo {
                            Product = item,
                            OrderProduct = orderProduct,
                            Pph = pph
                        };
                        orderProductInfos.Add(orderProductInfo);
                        
                    }
                }
                EmployeeOrderWithProdutctByDate employeeOrderWithProdutctByDate = new EmployeeOrderWithProdutctByDate{
                    Employee = employee,
                    OrderSales = orderSales,
                    OrderProductInfos = orderProductInfos
                } ;
                exEmployeeOrderWithProdutctByDates.Add(employeeOrderWithProdutctByDate);
  
            }
            employeeOrderWithProdutctByDates.AddRange(exEmployeeOrderWithProdutctByDates);
            return employeeOrderWithProdutctByDates;
        }
        [HttpPost]
        public async Task<ActionResult> PostOrderSales(OrderWithProdutct orderWithProdutct){
            await PostOrderSalesD(orderWithProdutct);

            return Ok("Successfully");
        }
        
        [HttpPut]
        public async Task<ActionResult> PutOrderSales(OrderWithProdutct orderWithProdutct){
            OrderSales orderSales = orderWithProdutct.OrderSales;
            if(orderSales.OrderSalesId < 0){
                await PostOrderSalesD(orderWithProdutct);
                return Ok("Successfully");
            }

            OrderSales preOrderSales = await _context.OrderSales.FindAsync(orderSales.OrderSalesId);
            bool payStatus = false;
            
            preOrderSales.OrderPaymentAmount += orderSales.OrderPaymentAmount;

            if (orderSales.OrderTotalPrice - preOrderSales.OrderPaymentAmount == 0 ){
                payStatus = true;
            }

            preOrderSales.OrderPaidStatus = payStatus;
            preOrderSales.OrderTotalPrice = orderSales.OrderTotalPrice;
            preOrderSales.Commission = orderSales.Commission;
            preOrderSales.Cost = orderSales.Cost;
            preOrderSales.RouteName = orderSales.RouteName;

            OrderPayment orderPayment = new OrderPayment {
                OrderSalesId = preOrderSales.OrderSalesId,
                PaymentOrderSalesDate = AppUtils.GetCurrentUnixTimestampMillis(),
                PaymentAmount =  orderSales.OrderPaymentAmount
            };

            _context.OrderPayments.Add(orderPayment);
            _context.OrderSales.Update(preOrderSales);
        
            
            foreach (OrderProduct orderProduct in orderWithProdutct.OrderProducts)
            {
                if(orderProduct.OrderProductId < 0){
                    orderProduct.OrderSalesId = orderSales.OrderSalesId;
                    await PostOrderProduct(orderProduct);
                }else{
                    OrderProduct preOrderProduct = _context.OrderProducts.Find(orderProduct.OrderProductId);
                    ProductPurchaseHistory proPurHis = _context.ProductPurchaseHistories
                                    .First( pph => pph.ProductPurchaseHistoryId == orderProduct.ProductPurchaseHistoryId);
                    Product product =  _context.Products.Find(proPurHis.ProductId);

                    int preProQuan = preOrderProduct.ProductQuantityProductQuantity - preOrderProduct.ReturnQuantityProductQuantity;
                    int currProQuan = orderProduct.ProductQuantityProductQuantity - orderProduct.ReturnQuantityProductQuantity;

                    if (currProQuan > preProQuan){
                        proPurHis.ProductQuantity -= currProQuan-preProQuan;
                        product.TotalProductInStock -= currProQuan-preProQuan;
                    }else if (currProQuan < preProQuan){
                        proPurHis.ProductQuantity += preProQuan - currProQuan;  
                        product.TotalProductInStock += preProQuan - currProQuan;  

                    }

                    _context.ProductPurchaseHistories.Update(proPurHis);
                    _context.Products.Update(product);
                    
                    preOrderProduct.ProductQuantityProductQuantity = orderProduct.ProductQuantityProductQuantity;
                    preOrderProduct.ReturnQuantityProductQuantity = orderProduct.ReturnQuantityProductQuantity;
                    preOrderProduct.DamageQuantityProductQuantity = orderProduct.DamageQuantityProductQuantity;
                    preOrderProduct.ProductRatePrice = orderProduct.ProductRatePrice;

                    _context.OrderProducts.Update(preOrderProduct);
                }
                
            }
            await _context.SaveChangesAsync();

            return Ok("Successfully");
        }

        [HttpPut("order-sales-payment-due/{id}-{amount}")]
        public async Task<ActionResult<string>> PutSalesPaymentDue(long id,long amount,OrderPayment orderPayment){
            OrderSales sales = await _context.OrderSales.Where( s => s.OrderSalesId == id).FirstAsync();

            if (amount == (sales.OrderTotalPrice - sales.OrderPaymentAmount)){
                sales.OrderPaidStatus = true;
               
            }
            sales.OrderPaymentAmount += amount;

            _context.OrderSales.Update(sales);
            _context.OrderPayments.Add(orderPayment);

            await _context.SaveChangesAsync(); 
            return "Successfully update";


        }

        [HttpGet("ordersalesonly")]
        public async Task<ActionResult<IEnumerable>> OrdersSales(){
            return await _context.OrderSales.ToListAsync();
        }

        [HttpGet("deleteallsales")]
        public async Task<ActionResult> DeleteOrder(){
            _context.OrderSales.RemoveRange(await _context.OrderSales.ToListAsync());
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpGet("deleteallsales/{id}")]
        public async Task<ActionResult> DeleteOrderById(long id){
            _context.OrderSales.Remove(await _context.OrderSales.FindAsync(id));
            await _context.SaveChangesAsync();
            return Ok();
        }
        
        private async Task PostOrderSalesD(OrderWithProdutct orderWithProdutct){
            OrderSales orderSales = new OrderSales{
                EmployeeId = orderWithProdutct.OrderSales.EmployeeId,
                OrderDate = AppUtils.GetCurrentUnixTimestampMillis(),
                OrderTotalPrice = orderWithProdutct.OrderSales.OrderTotalPrice,
                OrderPaymentAmount = orderWithProdutct.OrderSales.OrderPaymentAmount,
                OrderPaidStatus = orderWithProdutct.OrderSales.OrderPaidStatus,
                Commission = orderWithProdutct.OrderSales.Commission,
                Cost = orderWithProdutct.OrderSales.Cost,
                RouteName = orderWithProdutct.OrderSales.RouteName
            } ; 

            _context.OrderSales.Add(orderSales);

            await _context.SaveChangesAsync();
            
             OrderPayment orderPayment = new OrderPayment {
                OrderSalesId = orderSales.OrderSalesId,
                PaymentOrderSalesDate = AppUtils.GetCurrentUnixTimestampMillis(),
                PaymentAmount =  orderSales.OrderPaymentAmount
            };

            _context.OrderPayments.Add(orderPayment);
            
            await _context.SaveChangesAsync();

            foreach (OrderProduct item in orderWithProdutct.OrderProducts)
            {
                item.OrderSalesId = orderSales.OrderSalesId;
                await PostOrderProduct(item);
               
            }
            await _context.SaveChangesAsync();

        }

        private async Task PostOrderProduct(OrderProduct op){
            // Console.WriteLine(op.ProductRatePrice);

            OrderProduct orderProduct = new OrderProduct {
                OrderSalesId = op.OrderSalesId,
                ProductPurchaseHistoryId = op.ProductPurchaseHistoryId,
                ProductQuantityProductQuantity = op.ProductQuantityProductQuantity,
                ReturnQuantityProductQuantity = op.ReturnQuantityProductQuantity,
                DamageQuantityProductQuantity = op.DamageQuantityProductQuantity,
                ProductRatePrice = op.ProductRatePrice
            };
            ProductPurchaseHistory proPurHis = await _context.ProductPurchaseHistories
                                .FirstAsync( pph => pph.ProductPurchaseHistoryId == orderProduct.ProductPurchaseHistoryId);
            proPurHis.ProductQuantity -= orderProduct.ProductQuantityProductQuantity-orderProduct.ReturnQuantityProductQuantity;  
                
            Product product =  _context.Products.Find(proPurHis.ProductId);
            product.TotalProductInStock -= orderProduct.ProductQuantityProductQuantity-orderProduct.ReturnQuantityProductQuantity;

            _context.ProductPurchaseHistories.Update(proPurHis);
            _context.Products.Update(product);
            _context.OrderProducts.Add(orderProduct);
        }

        private bool isOrderExists(long employeeId){
             DateTime today = DateTime.Today;
            var query = from os in _context.OrderSales
                        where os.EmployeeId == employeeId
                        select new {
                            Day = AppUtils.DateTime(os.OrderDate).Day,
                            AppUtils.DateTime(os.OrderDate).Month,
                            AppUtils.DateTime(os.OrderDate).Year 
                        };

            var seelctBydate = query.AsEnumerable().Where(os => os.Day == today.Day && os.Month == today.Month 
                        && os.Year == today.Year).ToList();

            return seelctBydate.Count() > 0;
        }
    }

    

    public class OrderWithProdutct{
        public OrderSales OrderSales { get; set; }
        public List<OrderProduct> OrderProducts { get; set; }
    }

    public class EmployeeOrderWithProdutctByDate {
        public Employee Employee { get; set; }
        public OrderSales OrderSales { get; set; }
        public List<OrderProductInfo> OrderProductInfos { get; set; }
    }

    public class OrderProductInfo {
        public Product Product { get; set; }
        public OrderProduct OrderProduct { get; set; }
        public ProductPurchaseHistory Pph { get; set; }
    }

    public class OrderSalesIdsWthEmpId {
        public long EmployeeId { get; set; }
        public OrderSales OrderSales { get; set; }
    }

    
}
