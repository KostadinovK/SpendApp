const app = Sammy('#main', function(){

    this.use('Handlebars', 'hbs');

    //Home
    this.get('#/home', homeController.getHome);

    //Login
    this.get('#/login', userController.getLogin);

    //Register
    this.get('#/register', userController.getRegister);

    //Incomes
    this.get('#/incomes/register', incomeController.getRegister);

    //Payments
    this.get('#/payments/register', paymentController.getRegister);
});

(() => {
    app.run('#/home');
})();