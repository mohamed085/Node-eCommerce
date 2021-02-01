const Product = require('../model/product');
const Order = require('../model/order');

/**
 * Fetch Elements For Shop View
 * Redirect to Shop View
 */
exports.getIndex = (req, res, next) => {
    Product.find()
        .sort('-createdDate')
        .limit(8)
        .exec()
        .then(products => {
            res.render('shop/index', {
                products: products,
                pageTitle: 'Shop',
                path: '/',
            });
        })
        .catch(err => {
            console.log(err);
        });
};

/**
 * Fetch All Elements For Products View
 * Redirect to Products View
 */
exports.getProducts = (req, res, next) => {
    Product
        .find()
        .then(products => {
            res.render('shop/product-list', {
                products: products,
                pageTitle: 'All Products',
                path: '/products',
                header: "All products"
            });
    })
    .catch(err => {
        console.log(err);
    });
};

/**
 * Fetch One Elements For Product Detail View
 * Redirect to  Product Detail View
 */
exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    console.log(productId);
    Product
        .findById(productId)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products',
            });
        })
        .catch(err => console.log(err));
};

exports.postCategory = (req, res, next) => {
    const category = req.body.category;
    console.log(category);
    Product
        .find({
            category: category
        })
        .then(products => {
            res.render('shop/product-list', {
                products: products,
                pageTitle: 'All Products',
                path: '/products',
                header: category
            });
        })
        .catch(err => {
            console.log(err);
        });
}

/**
 * Fetch Cart Elements
 */
exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user  => {
            const products = user.cart.items;
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Cart',
                products: products,
            })
        })
        .catch(reason => {
            const error = new Error(reason);
            error.httpStatusCode = 500;
            return next(error);
        })

};

/**
 * Add Element to Cart ---> POST REQUEST
 * Redirect to Cart
 */
exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(value => {
            console.log(value);
            res.redirect('/cart');
        })
        .catch(reason => {
            console.log(reason);
            const error = new Error(reason);
            error.httpStatusCode = 500;
            return next(error);
        })
};

/**
 * Delete Element to Cart ---> POST REQUEST
 * Redirect to Cart
 */
exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
        req.user
            .removeFormCart(prodId)
            .then(value => {
                res.redirect('/cart');
            })
            .catch(reason => {
                console.log(reason);
            })
};

/**
 * Create Order ---> POST REQUEST
 * Redirect to Cart
 */
exports.postOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user  => {
            const products = user.cart.items.map(value => {
                return {
                    quantity: value.quantity,
                    product: { ...value.productId._doc }
                }
            });
            const order = new Order({
                products: products,
                user:{
                    email: req.user.email,
                    userId: req.user
                },
                status: 'Charging'
            });
            return order.save();
        })
        .then(value => {
            return req.user.clearCart();
        })
        .then(value => {
            res.redirect('/orders');
        })
        .catch(reason => {
            console.log(reason);
        })
};

/**
* Display All Element in Order View
* Redirect to Cart
*/
exports.getOrders = (req, res, next) => {
    Order.find({
        "user.userId": req.user._id
    })
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Orders',
                orders: orders,
            })
        })
        .catch(reason => {
            console.log(reason);
        })};

exports.getCheckout = (req, res, next) => {

}
