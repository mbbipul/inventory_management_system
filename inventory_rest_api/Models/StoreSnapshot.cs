namespace inventory_rest_api.Models
{
    public class StoreSnapshot
    {
        public long GodownStock { get; set; }
        public long CompanyPending { get; set; }
        public long Credit { get; set; }
        public long Cash { get; set; }
        public long Damage { get; set; }

        public long PurchasePrice { get; set; }
        public long TotalPayment { get; set; }
        public long TotalCost { get; set; }
        public long TotalSalary { get; set; }
        public long TotalCommision { get; set; }

        
        public long GetTotalCash (){
            long totalCash = this.GodownStock + this.CompanyPending + this.Credit + this.Cash
                                + this.Damage ;
            return totalCash;
        }

        public long GetTotalDebit (){
            long totalDebit = this.PurchasePrice + this.TotalCost + this.TotalSalary + this.TotalCommision;
            return totalDebit;
        }

        public long GetProfit () {
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