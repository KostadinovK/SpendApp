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
            let user = await response.json();
            console.log(user);
            context.redirect("#/login");

        })
        .catch(err => console.log(err));
    }

    return {
        getLogin,
        getRegister,
        postRegister
    };
}();