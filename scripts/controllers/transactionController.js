const transactionController = function(){

    let getTransactionDetails = async function(context){
        context.loggedIn = globalConstants.IsLoggedIn();

        let currencyId = storage.getData('currencyId');
        let currency = await currencyService.getCurrencyById(currencyId).then(resp => resp.json()).catch(err => console.log(err));

        if(currency.Symbol === null || currency.Symbol === ""){
            context.symbol = currency.Code;
        }else{
            context.symbol = currency.Symbol;
        }

        if(context.path.includes('payment')){
            context.transaction = await paymentService.getPaymentById(context.params.id).then(resp => resp.json()).catch(err => console.log(err));
        }else{
            context.transaction = await incomeService.getIncomeById(context.params.id).then(resp => resp.json()).catch(err => console.log(err));
        }

        let day = dateHelper.getDayFromTimestamp(context.transaction.Date);
        let month = dateHelper.getMonthFromTimestamp(context.transaction.Date);
        let year = dateHelper.getYearFromTimestamp(context.transaction.Date);

        context.transaction.date = `${dateHelper.getMonthShortName(month)} ${month}, ${year}`;
        
        if(context.transaction.PaymentCategory){
            context.transaction.icon = context.transaction.PaymentCategory.IconClass;
        }else{
            context.transaction.icon = context.transaction.IncomeCategory.IconClass;
        }

        if(context.transaction.Notes === null){
            context.hasNotes = false;
        }else{
            context.hasNotes = true;
        }

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