const homeController = function() {
    
    const getHome = function(context){
        context.loggedIn = globalConstants.IsLoggedIn();
        context.username = storage.getData(`${globalConstants.UsernameToken}`);

        context.loadPartials({
            header: './views/common/header.hbs',
            footer: './views/common/footer.hbs'
        }).then(function() {
            this.partial('./views/home/cta.hbs');
        });
    }

    return {
        getHome
    };
}();