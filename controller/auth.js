const bcrypt = require('bcryptjs');

const User = require('../model/user');

exports.getLogin = (req, res, next) => {
    res.render('login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: req.flash('error')
    })
};

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error', 'Invalid email or password');
                return res.redirect('/login');
            }
            bcrypt
                .compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(err => {
                            console.log(err);
                            res.redirect('/');
                        });
                    }
                    res.redirect('/login');
                })
                .catch(err => {
                    console.log(err);
                    res.redirect('/login');
                });
        })
        .catch(err => {
            console.log(err)
        });
};

exports.postRegister = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User
        .findOne({
        email: email
    })
        .then(user => {
            if (user){
                req.flash('error', 'This email already exist');
                return res.redirect('/login');
            }
            return bcrypt
                .hash(password, 12)
                .then(hashPassword => {
                    const newUser = new User({
                        email: email,
                        password: hashPassword,
                        cart: {
                            items: []
                        }
                    })
                    return newUser.save();
                })
                .then(newUser => {
                    req.session.isLoggedIn = true;
                    req.session.user = newUser;
                    res.redirect('/')
                })
        })
        .catch(reason => {
            console.log(reason)
        });
};

exports.postSignOut = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};
