const incomeController = function(){

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
        context.categories = await incomeService.getAllIncomeCategories().then(response => response.json()).catch(err => console.log(err));
        
        context.loadPartials({
            header: './views/common/header.hbs',
            categories: './views/incomes/categories.hbs',
            category: './views/incomes/incomeCategoryView.hbs',
            footer: './views/common/footer.hbs'
        }).then(function(){
            this.partial('./views/incomes/register.hbs');
        });
    };

    const postRegister = function(context){

        if(!isValidIncome(context.params)){
            console.log('Params are invalid!')
            context.redirect("#/incomes/register");
            return;
        }

        context.params.userId = storage.getData(`${globalConstants.AuthToken}`);
        
        incomeService.registerIncome(context.params)
        .then(async response => {
            let res = await response.json();
            context.redirect('#/home');
        });
        
    };

    return {
        getRegister,
        postRegister
    };
}();