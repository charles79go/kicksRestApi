const functions = require('firebase-functions');
const SneaksAPI = require('sneaks-api');
const sneaks = new SneaksAPI();

const searchProducts = (search, num) => {
    return new Promise((resolve, reject) => {
        // getProducts(keyword, limit, callback) takes in a keyword and limit and returns a product array
        sneaks.getProducts(search, num, function (err, products) {
            if (err) return reject(err);
            resolve(products);
        });
    });
};

const getProdPrices = (styleId) => {
    return new Promise((resolve, reject) => {
        sneaks.getProductPrices('555088-063', function (err, product) {
            if (err) return reject(err);
            resolve(product);
        });
    });
};

const getPopular = (num) => {
    return new Promise((resolve, reject) => {
        sneaks.getMostPopular(num, function (err, products) {
            if (err) return reject(err);
            resolve(products);
        });
    });
};

exports.getKicksInfo = functions.https.onRequest(async (request, response) => {
    let data = request.body;

    let payload = {};

    try {
        if (data.reqType === 'searchProducts') {
            payload = await searchProducts(data.searchText, data.numberOfItems);
        }
        if (data.reqType === 'getProdPrices') {
            payload = await getProdPrices(data.styleId);
        }
        if (data.reqType === 'getPopular') {
            payload = await getPopular(data.numberOfItems);
        }
    } catch (e) {
        payload = { error: e };
    }

    response.send(payload);
});
