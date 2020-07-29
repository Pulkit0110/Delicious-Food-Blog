exports.get404 = (req, res, next) => {
    let firstName = null;
    let username = null;
    if(req.user) {
        firstName = req.user.firstName;
        username = req.user.username;
    } 
    return res.render('error/404', {
        path: '/404',
        firstName: firstName,
        username: username
    });
}

exports.get500 = (req, res, next) => {
    let firstName = null;
    let username = null;
    if(req.user) {
        firstName = req.user.firstName;
        username = req.user.username;
    } 
    return res.render('error/500', {
        path: '/500',
        firstName: firstName,
        username: username
    });
}
