const UserModel = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
    res.render('users/register')
}

module.exports.register = async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        const user = new UserModel({ username, email });
        const registeredUser = await UserModel.register(user, password);
        req.logIn(registeredUser, err => {
            if (err) return next(err)
            req.flash('success', 'welcome to the campground')
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', `${e.message}`, 'Please try again');
        res.redirect('/register');
    }
}
module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    const directUrl = res.locals.returnTo || '/campgrounds';
    delete res.locals.returnTo
    req.flash('success', 'welcome back');
    res.redirect(directUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout(err => {
        if (err) return next(err)
        req.flash('success', 'Goodbye')
        res.redirect('/campgrounds');
    });

}