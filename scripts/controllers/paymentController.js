const paymentController = function(){

    const getRegister = function(context) {
        
        context.loadPartials({
            header: './views/common/header.hbs',
            categories: './views/payments/paymentCategories.hbs',
            footer: './views/common/footer.hbs'
        }).then(function(){
            this.partial('./views/payments/register.hbs');
        });
    }

    return {
        getRegister
    };
}();