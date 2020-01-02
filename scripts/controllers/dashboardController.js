const dashboardController = function(){
    
    const getBudget = async function(context, userId){

        let currencyId = storage.getData('currencyId');

        let budget = await budgetService.getUserLastBudget(userId);
        context.amount = Number(budget.BudgetAmount);

        if(context.amount < 0){
            context.hasNegativeBalance = true;
        }else{
            context.hasNegativeBalance = false;
        }

        let currency = await currencyService.getCurrencyById(currencyId).then(resp => resp.json()).catch(err => console.log(err));

        if(currency.Symbol === null || currency.Symbol === ""){
            context.symbol = currency.Code;
        }else{
            context.symbol = currency.Symbol;
        }
    }

    const getBalanceChart = async function (userId) {

        let budgets = await budgetService.getUserBudgets(userId).then(resp => resp.json()).catch(err => console.log(err));

        budgets = budgets.sort((a, b) => {
            if(a.Year > b.Year){
                return 1;
            }else if(a.Year < b.Year){
                return -1;
            }else{
                if(a.Month > b.Month){
                    return 1;
                }else{
                    return -1;
                }
            }
        });

        let labels = [];
        let data = [];

        for (const budget of budgets) {
            let monthName = dateHelper.getMonthName(budget.Month);

            labels.push(`${monthName} ${budget.Year}`);
            data.push(Number(budget.BudgetAmount));
        }

        let balanceContext = document.getElementById("balance-chart");

        let balanceData = {
            labels,
            datasets: [{
                data,
                label: "Balance",
                borderColor: "rgb(76, 161, 144)",
                fill: false
            }]
        };

        let options = {
            responsive: false
        };
        
        let lineChart = new Chart(balanceContext, {
            type: 'line',
            data: balanceData,
            options
        });
    }

    const getCategoriesData = function(categories){
        let res = [];

        for (const category of categories) {
            let data = {};
            data.name = category.Name;
            data.id = category.Id;
            data.count = 0;
            res.push(data);
        }

        return res;
    }

    const getPaymentsChart = async function (userId, options) {

        let paymentsCategories = await paymentService.getAllPaymentCategories().then(r => r.json()).catch(err => console.log(err));

        let categoriesData = getCategoriesData(paymentsCategories);

        let payments = await paymentService.getAllByUserId(userId).then(r => r.json()).catch(err => console.log(err));
        
        for (const payment of payments) {
            for (const category of categoriesData) {
                if(payment.CategoryId === category.id){
                    category.count++;
                }
            }
        }

        let labels = [];
        let data = [];

        for (const category of categoriesData) {
            if(category.count > 0){
                labels.push(category.name);
                data.push(category.count);
            }
        }

        let paymentsData = {
            labels,
            datasets: [{
              data,
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 206, 86)',
                'rgb(75, 192, 192)',
                'rgb(33, 121, 92)',
                'rgb(89, 122, 92)',
                'rgb(125, 155, 88)',
                'rgb(78, 217, 111)',
                'rgb(88, 134, 200)',
                'rgb(100, 220, 155)'
              ],
              borderColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 206, 86)',
                'rgb(75, 192, 192)',
                'rgb(33, 121, 92)',
                'rgb(89, 122, 92)',
                'rgb(125, 155, 88)',
                'rgb(78, 217, 111)',
                'rgb(88, 134, 200)',
                'rgb(100, 220, 155)'
              ],
              borderWidth: 1
            }]
        };

        let ctx = document.getElementById('payments-chart');

        let paymentsChart = new Chart(ctx, {
            type: 'pie',
            data: paymentsData,
            options 
        });
    }

    const getIncomesChart = async function (userId, options) {

        let incomeCategories = await incomeService.getAllIncomeCategories().then(r => r.json()).catch(err => console.log(err));

        let categoriesData = getCategoriesData(incomeCategories);

        let incomes = await incomeService.getAllByUserId(userId).then(r => r.json()).catch(err => console.log(err));
        
        for (const income of incomes) {
            for (const category of categoriesData) {
                if(income.CategoryId === category.id){
                    category.count++;
                }
            }
        }

        let labels = [];
        let data = [];

        for (const category of categoriesData) {
            if(category.count > 0){
                labels.push(category.name);
                data.push(category.count);
            }
        }

        let incomesData = {
            labels,
            datasets: [{
              data,
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 206, 86)',
                'rgb(75, 192, 192)',
                'rgb(33, 121, 92)',
                'rgb(89, 122, 92)',
                'rgb(125, 155, 88)',
                'rgb(78, 217, 111)',
                'rgb(88, 134, 200)',
                'rgb(100, 220, 155)'
              ],
              borderColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 206, 86)',
                'rgb(75, 192, 192)',
                'rgb(33, 121, 92)',
                'rgb(89, 122, 92)',
                'rgb(125, 155, 88)',
                'rgb(78, 217, 111)',
                'rgb(88, 134, 200)',
                'rgb(100, 220, 155)'
              ],
              borderWidth: 1
            }]
        };

        let ctx = document.getElementById('incomes-chart');

        let incomesChart = new Chart(ctx, {
            type: 'pie',
            data: incomesData,
            options 
        });
    }

    const getDashboard = async function(context){

        context.loggedIn = globalConstants.IsLoggedIn();
        let userId = storage.getData(`${globalConstants.AuthToken}`);

        await getBudget(context, userId);
        

        context.loadPartials({
            header: './views/common/header.hbs',
            transactions: './views/transaction/transactions.hbs',
            footer: './views/common/footer.hbs'
        }).then(function(){
            this.partial('./views/dashboard/dashboard.hbs').then(function(){
                
                getBalanceChart(userId);

                let options = {
                    responsive: false,
                    cutoutPercentage: 40
                };

                getPaymentsChart(userId, options);
                getIncomesChart(userId, options);
            })
        });
    }

    return {
        getDashboard
    }
}();