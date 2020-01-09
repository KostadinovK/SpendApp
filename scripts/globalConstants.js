const globalConstants = function(){
    const ApiAdress = "104.248.45.128";
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