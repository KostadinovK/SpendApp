const globalConstants = function(){
    const ApiAdress = "192.168.0.120";
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