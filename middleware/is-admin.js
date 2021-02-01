module.exports = (req, res, next) => {
    if (req.isAdmin){
        next();
    }else {
        res.redirect('/404')
    }
}