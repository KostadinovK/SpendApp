const incomeController = function(){

    const getRegister = async function(context) {
        
        context.loggedIn = globalConstants.IsLoggedIn();
        context.categories = await incomeService.getAllIncomeCategories().then(response => response.json());
        console.log(context.categories);
        context.loadPartials({
            header: './views/common/header.hbs',
            categories: './views/incomes/categories.hbs',
            category: './views/incomes/incomeCategoryView.hbs',
            footer: './views/common/footer.hbs'
        }).then(function(){
            this.partial('./views/incomes/register.hbs');
        });
    }

    return {
        getRegister
    };
}();