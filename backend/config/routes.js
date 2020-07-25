const admin = require("./admin");

module.exports = app => {
    //Auth Routes
    app.post("/signup", app.api.user.save)
    app.post("/signin", app.api.auth.signin)
    app.post("/validateToken", app.api.auth.validateToken)
    //Users Routes
    app.route("/users")
        .all(app.config.passport.authenticate())
        .post(admin(app.api.user.save))
        .get(admin(app.api.user.get))

    app.route("/users/:id")
        .all(app.config.passport.authenticate())
        .put(admin(app.api.user.save))
        .get(admin(app.api.user.getById))
        .delete(admin(app.api.user.remove))
    //Categories Routes
    app.route('/categories')
        .all(app.config.passport.authenticate())
        .post(admin(app.api.categories.save))
        .get(admin(app.api.categories.get))

    app.route('/categories/tree')
        .all(app.config.passport.authenticate())
        .get(app.api.categories.getTree)

    app.route('/categories/:id')
        .all(app.config.passport.authenticate())
        .get(app.api.categories.getById)
        .put(admin(app.api.categories.save))
        .delete(admin(app.api.categories.remove))
    //Articles Routes
    app.route("/articles")
        .all(app.config.passport.authenticate())
        .get(admin(app.api.article.get))
        .post(admin(app.api.article.save))

    app.route("/articles/:id")
        .all(app.config.passport.authenticate())
        .get(app.api.article.getById)
        .put(admin(app.api.article.save))
        .delete(admin(app.api.article.remove))

    app.route("/categories/:id/articles")
        .all(app.config.passport.authenticate())
        .get(app.api.article.getByCategory)
    //Stats routes
    app.route("/stats")
        .all(app.config.passport.authenticate())
        .get(app.api.stat.get)
}