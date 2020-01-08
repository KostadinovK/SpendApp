const userController = function(){

    function isDataValid(params){
        if(params.username.length < 3
            || params.password.length < 3
            || params.password !== params.confirmPassword
            || params.budget.length === 0)
        {
                return false;
        }

        return true;
    }
    const getLogin = function(context) {
        context.loggedIn = globalConstants.IsLoggedIn();

        context.loadPartials({
            header: './views/common/header.hbs',
            footer: './views/common/footer.hbs'
        }).then(function(){
            this.partial('./views/user/login.hbs');
        });
    }

    const postLogin = function(context){

        if(context.params.username.length < 3 || context.params.password.length < 3){
            context.redirect("#/login");
            return;
        }
        
        userService.login(context.params)
        .then(async response => {
            let res = await response.json();

            if(res.error){
                console.log(res.error);
                context.redirect("#/login");
                return;
            }

            storage.saveData('username', res.Username);
            storage.saveData(`${globalConstants.AuthToken}`, res.Id);
            storage.saveData(`currencyId`, res.CurrencyId);

            let payments = await paymentService.getAllByUserId(res.Id).then(resp => resp.json()).catch(err => console.log(err));
            let incomes = await incomeService.getAllByUserId(res.Id).then(resp => resp.json()).catch(err => console.log(err));

            let date = new Date();

            let transactions = payments.concat(incomes);
            
            transactions = transactions.filter(t => {
                let tYear = Number(dateHelper.getYearFromTimestamp(t.Date));
                let tMonth = Number(dateHelper.getMonthFromTimestamp(t.Date)) - 1;
                let tDay = Number(dateHelper.getDayFromTimestamp(t.Date));

                let tDate = new Date(tYear, tMonth, tDay);

                return t.IsInFuture === true && tDate.getTime() <= date.getTime();
            });
            console.log(transactions);

            for (const transaction of transactions) {
                transaction.IsInFuture = false;
                
                let params = {
                    id: transaction.Id,
                    money: Number(transaction.Amount),
                    date: transaction.Date,
                    name: transaction.Name,
                    notes: transaction.Notes,
                    category: transaction.CategoryId,
                    isInFuture: transaction.IsInFuture,
                    userId: res.Id
                };

                if (transaction.PaymentCategory) {

                    await paymentService.editPayment(params)
                        .then(response => {
                            response.json();
                        })
                        .catch(err => console.log(err));
                } else {
                    await incomeService.editIncome(params)
                        .then(response => {
                            response.json();
                        })
                        .catch(err => console.log(err));
                }
            }

            context.redirect("#/home");
        })
        .catch(err => console.log(err));
    }

    const getRegister = async function(context) {
        context.loggedIn = globalConstants.IsLoggedIn();

        context.currencies = await currencyService.getCurrencies().then(currencies => currencies.json());
    
        context.loadPartials({
            header: './views/common/header.hbs',
            footer: './views/common/footer.hbs'
        }).then(function(){
            this.partial('./views/user/register.hbs');
        });
    }

    const postRegister = function(context){

        if(!isDataValid(context.params)){
            context.redirect("#/register");
            return;
        }

        context.params.budget = Number(context.params.budget);
        context.params.currency = Number(context.params.currency);

        userService.register(context.params)
        .then(async response => {
            let res = await response.json();
            if(res.error){
                context.redirect("#/register");
                return;
            }
            
            let year = dateHelper.getYearFromTimestamp(res.RegisterTimestamp);
            let month = dateHelper.getMonthFromTimestamp(res.RegisterTimestamp);
            
            if(Number(res.BudgetAmount) < 0){
                context.redirect('#/register');
                return;
            }

            budgetService.addBudget(res.Id, res.BudgetAmount, year, month)
            .then(async response => {
                await response.json();
                context.redirect('#/login');
            });
        })
        .catch(err => console.log(err));
    }

    

    const getLogout = function(context){
        userService.logout()
        .then(response => {
            storage.deleteData('username');
            storage.deleteData(`${globalConstants.AuthToken}`);
            storage.deleteData(`currencyId`);
            
            context.redirect("#/home");
        })
        .catch(err => console.log(err));
        
    }

    return {
        getLogin,
        postLogin,
        getRegister,
        postRegister,
        getLogout
    };
}();