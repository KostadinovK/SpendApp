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

            let amount = Number(res.Amount);
            let userId = res.UserId;
            let year = Number(dateHelper.getYearFromTimestamp(res.Date));
            let month = Number(dateHelper.getMonthFromTimestamp(res.Date));

            let budget = await budgetService.getBudgetByUserIdYearAndMonth(userId, year, month).then(response => response.json()).catch(err => console.log(err));
        
            if(budget.error){
                let lastBudget = await budgetService.getUserLastBudget(userId);
                
                if(lastBudget === null){
                    await budgetService.addBudget(userId, amount, year, month).then(response => response.json()).catch(error => console.log(error));
                }else{
                    let oldAmount = Number(lastBudget.BudgetAmount);
                    await budgetService.addBudget(userId, oldAmount - amount, year, month).then(response => response.json()).catch(error => console.log(error));
                }
            }else{
                let oldAmount = Number(budget.BudgetAmount);

                await budgetService.editBudget(userId, oldAmount - amount, year, month).then(response => response.json()).catch(error => console.log(error));
            }
            context.redirect('#/home');
        });
        
    };

    return {
        getRegister,
        postRegister
    };
}();