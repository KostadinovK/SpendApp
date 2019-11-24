const app = Sammy('#main', function(){
    this.use('Handlebars', 'hbs');

    this.get('#/home', (context) => 
    {
        context.partial("../views/common/header.hbs");
    })  
});

(() => {
    app.run('#/home');
})();