module.exports.validateThing = (req, res, next) => {
    const { error } = thingSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
}

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        	req.session.returnTo = req.originalUrl
       		// req.flash('error', 'You must be signed in');
       		return res.redirect('/login');
    	}
    next();
}
