const incomeController = function(){

    const getRegister = function(context) {
        
        context.loadPartials({
            header: './views/common/header.hbs',
            categories: './views/incomes/categories.hbs',
            footer: './views/common/footer.hbs'
        }).then(function(){
            this.partial('./views/incomes/register.hbs');
        });
    }

    return {
        getRegister
    };
}();