const globalConstants = function(){
    const ApiAdress = "localhost";
    const ApiPort = 5000;
    const AuthCookie = "test_cookie";
    const IsLoggedIn = () => document.cookie.indexOf(`${AuthCookie}`) !== -1;

    return {
        ApiAdress,
        ApiPort,
        AuthCookie,
        IsLoggedIn
    }
}();