const globalConstants = function(){
    const ApiAdress = "localhost";
    const ApiPort = 5000;
    const AuthToken = "userId";
    const UsernameToken = "username";
    const IsLoggedIn = () => storage.getData(`${AuthToken}`) !== null;

    return {
        ApiAdress,
        ApiPort,
        AuthToken,
        UsernameToken,
        IsLoggedIn
    }
}();