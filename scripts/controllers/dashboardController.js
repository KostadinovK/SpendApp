const dashboardController = function(){
    
    const getBudget = async function(context, userId, currencyId){

        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();

        let budget = await budgetService.getBudgetByUserIdYearAndMonth(userId, year, month).then(response => response.json()).catch(err => console.log(err));

        if(budget.error){
            let lastBudget = await budgetService.getUserLastBudgetBeforeDate(userId, year, month);
            await budgetService.addBudget(userId, Number(lastBudget.BudgetAmount), year, month).then(response => response.json()).catch(error => console.log(error));

            budget = await budgetService.getBudgetByUserIdYearAndMonth(userId, year, month).then(response => response.json()).catch(err => console.log(err));
        }
        console.log(budget);
        let budgetAmount = Number(budget.BudgetAmount);

        let payments = await paymentService.getAllByUserId(userId).then(resp => resp.json()).catch(err => console.log(err));
        let incomes = await incomeService.getAllByUserId(userId).then(resp => resp.json()).catch(err => console.log(err));

        let transactions = payments.concat(incomes);

        transactions = transactions.filter(t => {
            let tYear = Number(dateHelper.getYearFromTimestamp(t.Date));
            let tMonth = Number(dateHelper.getMonthFromTimestamp(t.Date));
            let tDay = Number(dateHelper.getDayFromTimestamp(t.Date));

            return t.IsInFuture && tYear === year && tMonth === month && tDay > day;
        });
       
        for (const transaction of transactions) {
            if(transaction.PaymentCategory){
                budgetAmount += Number(transaction.Amount);
            }else{
                budgetAmount -= Number(transaction.Amount);
            }
        }

        context.amount = budgetAmount;

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

    const getTransactions = async function(context, userId, currencyId){

        let currency = await currencyService.getCurrencyById(currencyId).then(resp => resp.json()).catch(err => console.log(err));
        let payments = await paymentService.getAllByUserId(userId).then(resp => resp.json()).catch(err => console.log(err));
        
        let incomes = await incomeService.getAllByUserId(userId).then(resp => resp.json()).catch(err => console.log(err));
        
        let transactions = payments.concat(incomes).sort((a, b) => {
            if(a.Date > b.Date){
                return -1;
            }else{
                return 1;
            }
        });

        for (const transaction of transactions) {

            let day = dateHelper.getDayFromTimestamp(transaction.Date);
            let month = dateHelper.getMonthFromTimestamp(transaction.Date);
            let year = dateHelper.getYearFromTimestamp(transaction.Date);

            transaction.date = `${dateHelper.getMonthShortName(month)} ${day}, ${year}`;

            if(currency.Symbol === null || currency.Symbol === ""){
                transaction.symbol = currency.Code;
            }else{
                transaction.symbol = currency.Symbol;
            }

            if(transaction.IncomeCategory){
                transaction.icon = transaction.IncomeCategory.IconClass;
            }else{
                transaction.icon = transaction.PaymentCategory.IconClass;
            }   
        }

        context.transactions = transactions.slice(0, 20);
    }

    const getDashboard = async function(context){

        context.loggedIn = globalConstants.IsLoggedIn();

        let userId = storage.getData(`${globalConstants.AuthToken}`);
        let currencyId = storage.getData('currencyId');
    
        await getBudget(context, userId, currencyId);
        await getTransactions(context, userId, currencyId);

        context.loadPartials({
            header: './views/common/header.hbs',
            transactions: './views/transaction/transactions.hbs',
            transaction: './views/transaction/transaction.hbs',
            footer: './views/common/footer.hbs'
        }).then(function(){
            this.partial('./views/dashboard/dashboard.hbs').then(function(){
                
                chartService.getBalanceChart(userId);

                let options = {
                    responsive: false,
                    cutoutPercentage: 40
                };

                chartService.getPaymentsChart(userId, options, null, 'payments-chart');
                chartService.getIncomesChart(userId, options, null, 'incomes-chart');
            })
        });
    };

    return {
        getDashboard
    }
}();