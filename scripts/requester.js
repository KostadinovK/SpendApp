const requester = function(){
    const get = function(url, request){
        request.method = 'GET';
        return makeRequest(url, request);
    }

    const put = function(url, request){
        request.method = 'PUT';
        return makeRequest(url, request);
    }

    const post = function(url, request){
        request.method = 'POST';
        return makeRequest(url, request);
    }

    const del = function(url, request){
        request.method = 'DELETE';
        return makeRequest(url, request);
    }

    const makeRequest = function (url, request) {
        request.headers['Content-Type'] = 'application/json';
        request.mode = 'cors';
        request.credentials = 'include';
       
        return fetch(url, request);
    }

    return {
        get,
        post,
        put,
        del
    }
}();