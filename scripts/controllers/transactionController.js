const transactionController = function(){

    const getTransactionDetails = async function(context){
        context.loggedIn = globalConstants.IsLoggedIn();

        let currencyId = storage.getData('currencyId');
        let currency = await currencyService.getCurrencyById(currencyId).then(resp => resp.json()).catch(err => console.log(err));

        if(currency.Symbol === null || currency.Symbol === ""){
            context.symbol = currency.Code;
        }else{
            context.symbol = currency.Symbol;
        }

        if(context.path.includes('payment')){
            context.transaction = await paymentService.getPaymentById(context.params.id).then(resp => resp.json()).catch(err => console.log(err));
        }else{
            context.transaction = await incomeService.getIncomeById(context.params.id).then(resp => resp.json()).catch(err => console.log(err));
        }

        let day = dateHelper.getDayFromTimestamp(context.transaction.Date);
        let month = dateHelper.getMonthFromTimestamp(context.transaction.Date);
        let year = dateHelper.getYearFromTimestamp(context.transaction.Date);

        context.transaction.date = `${dateHelper.getMonthShortName(month)} ${month}, ${year}`;
        
        if(context.transaction.PaymentCategory){
            context.transaction.icon = context.transaction.PaymentCategory.IconClass;
        }else{
            context.transaction.icon = context.transaction.IncomeCategory.IconClass;
        }

        if(context.transaction.Notes === null){
            context.hasNotes = false;
        }else{
            context.hasNotes = true;
        }

        context.loadPartials({
            header: './views/common/header.hbs',
            footer: './views/common/footer.hbs'
        }).then(function(){
            this.partial('./views/transaction/details.hbs');
        })
    };

    const getDelete = async function(context){

        let userId = storage.getData('userId');
        
        if(context.path.includes('payment')){
            
            let payment = await paymentService.getPaymentById(context.params.id).then(resp => resp.json()).catch(err => console.log(err));
           
            let year = Number(dateHelper.getYearFromTimestamp(payment.Date));
            let month = Number(dateHelper.getMonthFromTimestamp(payment.Date));
            let paymentAmount = Number(payment.Amount);

            let res = await paymentService.deletePayment(context.params.id)
                .then(response => response.json())
                .catch(err => console.log(err));

            if(!res.deleted){
                context.redirect('#/transactions/payment/' + context.params.id);
                return;
            }

            let budgets = await budgetService.getAllBudgetsForEdit(userId, year, month);

            for (const budget of budgets) {
                let amount = Number(budget.BudgetAmount);
                amount += paymentAmount;

                await budgetService.editBudget(budget.UserId, amount, budget.Year, budget.Month).then(response => response.json()).catch(error => console.log(error));
            }
        }else{

            let income = await incomeService.getIncomeById(context.params.id).then(resp => resp.json()).catch(err => console.log(err));

            let year = Number(dateHelper.getYearFromTimestamp(income.Date));
            let month = Number(dateHelper.getMonthFromTimestamp(income.Date));
            let incomeAmount = Number(income.Amount);
            
            let res = await incomeService.deleteIncome(context.params.id)
                .then(response => response.json())
                .catch(err => console.log(err));

            if(!res.deleted){
                context.redirect('#/transactions/income/' + context.params.id);
                return;
            }

            let budgets = await budgetService.getAllBudgetsForEdit(userId, year, month);

            for (const budget of budgets) {
                let amount = Number(budget.BudgetAmount);
                amount -= incomeAmount;

                await budgetService.editBudget(budget.UserId, amount, budget.Year, budget.Month).then(response => response.json()).catch(error => console.log(error));
            }
        }

        context.redirect('#/dashboard');
    }

    return {
        getTransactionDetails,
        getDelete
    };
}();