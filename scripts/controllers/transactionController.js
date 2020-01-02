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

    const getPaymentEdit = async function(context){
        context.loggedIn = globalConstants.IsLoggedIn();
        context.categories = await paymentService.getAllPaymentCategories().then(response => response.json()).catch(err => console.log(err));

        let payment = await paymentService.getPaymentById(context.params.id).then(r => r.json()).catch(err => console.log(err));
        
        payment.Date = payment.Date.split('T')[0];

        context.transaction = payment;
        if(context.transaction.PaymentCategory){
            context.transaction.category = context.transaction.PaymentCategory.Id;
        }else{
            context.transaction.category = context.transaction.IncomeCategory.Id;
        };

        context.loadPartials({
            header: './views/common/header.hbs',
            categories: './views/payments/paymentCategories.hbs',
            category: './views/payments/paymentCategoryView.hbs',
            footer: './views/common/footer.hbs'
        }).then(function(){
            this.partial('./views/transaction/edit.hbs');
        })
    };

    const getIncomeEdit = async function(context){

        context.loggedIn = globalConstants.IsLoggedIn();
        context.categories = await incomeService.getAllIncomeCategories().then(response => response.json()).catch(err => console.log(err));

        let income = await incomeService.getIncomeById(context.params.id).then(r => r.json()).catch(err => console.log(err));
        
        income.Date = income.Date.split('T')[0];

        context.transaction = income;
        if(context.transaction.PaymentCategory){
            context.transaction.category = context.transaction.PaymentCategory.Id;
        }else{
            context.transaction.category = context.transaction.IncomeCategory.Id;
        };

        context.loadPartials({
            header: './views/common/header.hbs',
            categories: './views/incomes/categories.hbs',
            category: './views/incomes/incomeCategoryView.hbs',
            footer: './views/common/footer.hbs'
        }).then(function(){
            this.partial('./views/transaction/edit.hbs');
        })
    };

    const getDelete = async function(context){

        if(context.path.includes('payment')){
            
            let payment = await paymentService.getPaymentById(context.params.id).then(resp => resp.json()).catch(err => console.log(err));
            console.log(payment);
            let year = Number(dateHelper.getYearFromTimestamp(payment.Date));
            let month = Number(dateHelper.getMonthFromTimestamp(payment.Date));
            let amount = Number(payment.Amount);

            let res = await paymentService.deletePayment(context.params.id)
                .then(response => response.json())
                .catch(err => console.log(err));

            if(!res.deleted){
                context.redirect('#/transactions/payment/' + context.params.id);
            }

            let userId = storage.getData('userId');
            let budget = await budgetService.getBudgetByUserIdYearAndMonth(userId, year, month).then(response => response.json()).catch(err => console.log(err));
        
            if(budget.error){
                return null;
            }else{
                let newAmount = Number(budget.BudgetAmount) + amount;

                await budgetService.editBudget(userId, newAmount, year, month).then(response => response.json()).catch(error => console.log(error));
            }
        }else{

            let income = await incomeService.getIncomeById(context.params.id).then(resp => resp.json()).catch(err => console.log(err));

            let year = Number(dateHelper.getYearFromTimestamp(income.Date));
            let month = Number(dateHelper.getMonthFromTimestamp(income.Date));
            let amount = Number(income.Amount);
            
            let res = await incomeService.deleteIncome(context.params.id)
                .then(response => response.json())
                .catch(err => console.log(err));

            if(!res.deleted){
                context.redirect('#/transactions/income/' + context.params.id);
            }

            let userId = storage.getData('userId');
            let budget = await budgetService.getBudgetByUserIdYearAndMonth(userId, year, month).then(response => response.json()).catch(err => console.log(err));
            if(budget.error){
                console.log(budget.error);
            }else{
                let newAmount = Number(budget.BudgetAmount) - amount;

                await budgetService.editBudget(userId, newAmount, year, month).then(response => response.json()).catch(error => console.log(error));
            }
        }

        context.redirect('#/dashboard');
    }

    return {
        getTransactionDetails,
        getIncomeEdit,
        getPaymentEdit,
        getDelete
    };
}();