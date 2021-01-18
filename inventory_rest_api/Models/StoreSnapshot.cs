namespace inventory_rest_api.Models
{
    public class StoreSnapshot
    {
        public double GodownStock { get; set; }
        public double CompanyPending { get; set; }
        public double Credit { get; set; }
        public double Cash { get; set; }
        public double Damage { get; set; }

        public double PurchasePrice { get; set; }
        public double TotalPayment { get; set; }
        public double TotalCost { get; set; }
        public double TotalSalary { get; set; }
        public double TotalCommision { get; set; }
        
        public double GetTotalCash (){
            double totalCash = this.GodownStock + this.CompanyPending + this.Credit + this.Cash
                                + this.Damage ;
            return totalCash;
        }

        public double GetTotalDebit (){
            double totalDebit = this.PurchasePrice + this.TotalCost + this.TotalSalary + this.TotalCommision;
            return totalDebit;
        }

        public double GetProfit () {
            return GetTotalCash() - GetTotalDebit();
        }

        public object GetStoreSnapshot(){
            return new {
                this.GodownStock,
                this.CompanyPending,
                this.Credit,
                this.Cash,
                this.Damage,

                this.PurchasePrice,
                this.TotalPayment,
                this.TotalCost,
                this.TotalSalary,
                this.TotalCommision,

                TotalDebit = this.GetTotalDebit(),
                TotalCredit = this.GetTotalCash(),
                NetProfit = this.GetProfit()
            };
        }
    }
}