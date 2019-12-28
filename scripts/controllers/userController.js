const userController = function(){

    const getLogin = function(context) {
        context.loggedIn = globalConstants.IsLoggedIn();

        context.loadPartials({
            header: './views/common/header.hbs',
            footer: './views/common/footer.hbs'
        }).then(function(){
            this.partial('./views/user/login.hbs');
        });
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

    const Register = function(context){
        const {username, password, confirmPassword, budget, currency} = context.params;

        console.log(username);
    }

    return {
        getLogin,
        getRegister,
        Register
    };
}();