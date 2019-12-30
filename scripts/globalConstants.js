const globalConstants = function(){
    const ApiAdress = "localhost";
    const ApiPort = 5000;
    const AuthToken = "userId";
    const IsLoggedIn = () => storage.getData(`${AuthToken}`) !== null;

    return {
        ApiAdress,
        ApiPort,
        AuthToken,
        IsLoggedIn
    }
}();