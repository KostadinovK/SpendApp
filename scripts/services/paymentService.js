const paymentService = function(){

    const baseUrl = `http://${globalConstants.ApiAdress}:${globalConstants.ApiPort}`;

    const getAllPaymentCategories = function(){
        const url = baseUrl + '/paymentCategories';

        const request = {
            headers: {}
        };

        return requester.get(url, request);
    };

    const registerPayment = function(params){
        const url = baseUrl + '/payments';
        
        const payment = {
            amount: params.money,
            date: params.date,
            name: params.name,
            categoryId: params.category,
            userId: params.userId
        };

        const request = {
            headers: {},
            body: JSON.stringify(payment)
        };

        return requester.post(url, request);
    };

    const getAllByUserId = function(userId){
        const url = baseUrl + `/payments/user/${userId}`;

        const request = {
            headers: {}
        };

        return requester.get(url, request);
    };

    const getPaymentById = function(id){
        const url = baseUrl + `/payments/${id}`;

        const request = {
            headers: {}
        };

        return requester.get(url, request);
    };

    return {
        getAllPaymentCategories,
        registerPayment,
        getAllByUserId,
        getPaymentById
    };
}();