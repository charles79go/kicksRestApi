const functions = require('firebase-functions');
const corsHandler = require('cors')({ origin: true });
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

exports.searchProducts = functions.https.onRequest(
    async (request, response) => {
        corsHandler(request, response, async () => {
            let { searchText, numberOfItems } = request.query;

            let payload = {};

            try {
                payload = await searchProducts(searchText, numberOfItems);
            } catch (e) {
                payload = { error: e, message: '(ctch in srvr)' };
            }

            response.send(payload);
        });
    }
);

exports.getProductPrices = functions.https.onRequest(
    async (request, response) => {
        corsHandler(request, response, async () => {
            let { styleId } = request.query;

            let payload = {};

            try {
                payload = await getProdPrices(styleId);
            } catch (e) {
                payload = { error: e, message: '(ctch in srvr)' };
            }

            response.send(payload);
        });
    }
);

exports.getTrending = functions.https.onRequest(async (request, response) => {
    corsHandler(request, response, async () => {
        let { numberOfItems } = request.query;

        let payload = {};

        try {
            payload = await getPopular(numberOfItems);
        } catch (e) {
            payload = { error: e, message: '(ctch in srvr)' };
        }

        response.send(payload);
    });
});
