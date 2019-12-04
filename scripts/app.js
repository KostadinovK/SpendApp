const app = Sammy('#main', function(){

    this.use('Handlebars', 'hbs');

    //Home
    this.get('#/home', homeController.getHome);

    //Dashboard
    this.get('#/dashboard', dashboardController.getDashboard);

    this.get('#/timeline', timelineController.getTimeline);

    //Login
    this.get('#/login', userController.getLogin);

    //Register
    this.get('#/register', userController.getRegister);

    //Incomes
    this.get('#/incomes/register', incomeController.getRegister);

    //Payments
    this.get('#/payments/register', paymentController.getRegister);

    this.get('#/transactions/:id', transactionController.getTransactionDetails);
    this.get('#/transactions/:id/edit', transactionController.getEdit);
});

(() => {
    app.run('#/home');
})();