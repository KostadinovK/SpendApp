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
            
            let year = res.RegisterTimestamp.split('-')[0];
            let month = res.RegisterTimestamp.split('-')[1];
            
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