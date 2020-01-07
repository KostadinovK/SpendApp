const paymentController = function(){

    const isValidIncome = function(params){
        if(params.name === "" || params.name === null ){
            return false;
        }

        if(params.date === "" || params.date === null || Number(params.date.split('-')[0]) < 2015){
            return false;
        }

        if(params.money === "" || Number(params.money) < 0){
            return false;
        }

        if(params.category === undefined || params.category === null ||  Number(params.category) < 0){
            return false;
        }

        return true;
    };

    const getRegister = async function(context) {

        context.loggedIn = globalConstants.IsLoggedIn();
        context.categories = await paymentService.getAllPaymentCategories().then(response => response.json()).catch(err => console.log(err));

        context.loadPartials({
            header: './views/common/header.hbs',
            categories: './views/payments/paymentCategories.hbs',
            category: './views/payments/paymentCategoryView.hbs',
            footer: './views/common/footer.hbs'
        }).then(function(){
            this.partial('./views/payments/register.hbs');
        });
    };

    const postRegister = function(context){

        if(!isValidIncome(context.params)){
            context.redirect("#/incomes/register");
            return;
        }

        context.params.userId = storage.getData(`${globalConstants.AuthToken}`);
        
        paymentService.registerPayment(context.params)
        .then(async response => {
            let res = await response.json();

            let userId = res.UserId;
            let paymentDate = res.Date;
            let paymentAmount = Number(res.Amount);

            let year = Number(dateHelper.getYearFromTimestamp(paymentDate));
            let month = Number(dateHelper.getMonthFromTimestamp(paymentDate));

            let budget = await budgetService.getBudgetByUserIdYearAndMonth(userId, year, month).then(response => response.json()).catch(err => console.log(err));
            
            let startYear;
            let startMonth;
            if (budget.error) {
                let lastBudget = await budgetService.getUserLastBudgetBeforeDate(userId, year, month);

                if (lastBudget === null) {
                    await budgetService.addBudget(userId, 0, year, month).then(response => response.json()).catch(error => console.log(error));
                    
                }else{
                    await budgetService.addBudget(userId, Number(lastBudget.BudgetAmount), year, month).then(response => response.json()).catch(error => console.log(error));
                }

                startYear = year;
                startMonth = month;

            }else{
                startYear = budget.Year;
                startMonth = budget.Month;
            }

            let startDate = new Date(startYear, startMonth - 1);

            let budgets = await budgetService.getUserBudgets(userId).then(response => response.json()).catch(err => console.log(err));

            budgets = budgets.filter(b => {
                let budgetDate = new Date(b.Year, b.Month - 1);

                return budgetDate.getTime() >= startDate.getTime();
            });

            console.log(budgets);

            for (const budget of budgets) {
                let amount = Number(budget.BudgetAmount);
                amount -= paymentAmount;

                await budgetService.editBudget(budget.UserId, amount, budget.Year, budget.Month).then(response => response.json()).catch(error => console.log(error));
            }
            context.redirect('#/home');
        });
        
    };

    const getEdit = async function(context){
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

    const postEdit = function(context){
        let userId = storage.getData('userId');
        context.params.userId = userId;

        paymentService.editPayment(context.params)
        .then(response => {
            response.json();
            context.redirect('#/dashboard');
        })
        .catch(err => console.log(err));
    };

    return {
        getRegister,
        postRegister,
        getEdit,
        postEdit
    };
}();