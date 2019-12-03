const transactionController = function(){

    let getTransactionDetails = function(context){
        context.loadPartials({
            header: './views/common/header.hbs',
            footer: './views/common/footer.hbs'
        }).then(function(){
            this.partial('./views/transaction/details.hbs');
        })
    };

    let getEdit = function(context){
        context.loadPartials({
            header: './views/common/header.hbs',
            categories: './views/payments/paymentCategories.hbs',
            footer: './views/common/footer.hbs'
        }).then(function(){
            this.partial('./views/transaction/edit.hbs');
        })
    };

    return {
        getTransactionDetails,
        getEdit
    };
}();