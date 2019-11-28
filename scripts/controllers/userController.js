const userController = function(){

    const getLogin = function(context) {
        
        context.loadPartials({
            header: './views/common/header.hbs',
            footer: './views/common/footer.hbs'
        }).then(function(){
            this.partial('./views/user/login.hbs');
        });
    }

    const getRegister = function(context) {

        context.loadPartials({
            header: './views/common/header.hbs',
            footer: './views/common/footer.hbs'
        }).then(function(){
            this.partial('./views/user/register.hbs');
        });
    }

    return {
        getLogin,
        getRegister
    };
}();