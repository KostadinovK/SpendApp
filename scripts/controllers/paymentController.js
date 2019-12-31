const paymentController = function(){

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
    }

    return {
        getRegister
    };
}();