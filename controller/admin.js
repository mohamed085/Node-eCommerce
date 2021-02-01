const Product = require('../model/product');
const Order = require('../model/order');


/**
 * Redirect to Products View
 */
exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('admin/products', {
                products: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
            });
        })
        .catch(err => {
            console.log(err);
        });
};

/**
 * Redirect to Add Products View
 */
exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-products', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    });
};

/**
 * Add New Product ---> POST REQUEST
 * Redirect to Products View
 */
exports.postAddProduct = (req, res, next) => {
    const image1 = req.files['imageURL1'][0];
    const image2 = req.files['imageURL2'][0];
    const image3 = req.files['imageURL3'][0];
    const image4 = req.files['imageURL4'][0];
    const imageURL1 = image1.path;
    const imageURL2 = image2.path;
    const imageURL3 = image3.path;
    const imageURL4 = image4.path;
    const product = new Product({
        title: req.body.title,
        mainCategory : req.body.mainCategory,
        category: req.body.category,
        description: req.body.description,
        price: req.body.price,
        imageURL1: imageURL1,
        imageURL2: imageURL2,
        imageURL3: imageURL3,
        imageURL4: imageURL4,
        createdDate: Date.now(),
        userId: req.user._id
    })

    product.save()
        .then(value => {
            res.redirect('/admin/products')
        })
        .catch(reason => {
            console.log(reason)
    })
};

/**
 * Redirect to Edit Product View
 */
exports.getEditProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId)
        .then(product => {
            if (!product){
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                product: product,
            });
        })
        .catch(err => console.log(err));
};

/**
 * Edit Product View  ---> POST REQUEST
 * Redirect to Products View
 */
exports.postEditProduct = (req, res, next) => {
    const productId = req.body.productId;
    const image1 = req.files['imageURL1'][0];
    const image2 = req.files['imageURL2'][0];
    const image3 = req.files['imageURL3'][0];
    const image4 = req.files['imageURL4'][0];
    const imageURL1 = image1.path;
    const imageURL2 = image2.path;
    const imageURL3 = image3.path;
    const imageURL4 = image4.path;
    Product.findById(productId)
        .then(product => {
            product.title = req.body.title;
            product.category = req.body.category;
            product.mainCategory = req.body.mainCategory;
            product.description = req.body.description;
            product.price = req.body.price;
            product.imageURL1 = imageURL1;
            product.imageURL2 = imageURL2;
            product.imageURL3 = imageURL3;
            product.imageURL4 = imageURL4;
            return product.save()
        })
        .then(result => {
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
};

/**
 * Delete Product ---> POST REQUEST
 * Redirect to Products View
 */
exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.findByIdAndRemove(productId)
        .then(result => {
            console.log('DELETED PRODUCT!');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err)
        });
};

exports.getOrders = (req, res, next) => {
    Order.find()
        .then(orders => {
            res.render('admin/orders', {
                orders: orders,
                pageTitle: 'Admin Orders',
                path: '/admin/orders',
            });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postEditOrders = (req, res, next) => {
    const orderId = req.body.orderId;
    Order.findById(orderId)
        .then(order => {
            order.status = req.body.status;
            return order.save()
        })
        .then(value => {
            res.redirect('/admin/orders');
        })
        .catch(err => {
            console.log(err);
        });

}
