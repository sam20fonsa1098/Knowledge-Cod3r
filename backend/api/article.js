const queries = require('./queries');

module.exports = app => {
    const {existsOrError} = app.api.validation;

    const save = (req, resp) => {
        const article = {...req.body};
        if (req.params.id) article.id = req.params.id;

        try {
            existsOrError(article.name, "Nome não informado");
            existsOrError(article.description, "Descrição não informada");
            existsOrError(article.categoryId, "Categoria não informada");
            existsOrError(article.userId, "Autor não informado");
            existsOrError(article.content, "Conteúdo não informado");
        } catch (msg) {
            resp.status(400).send(msg)
        }

        if (article.id) {
            app.db('articles')
                .update(article)
                .where({id: article.id})
                .then(_ => resp.status(204).send())
                .catch(err => resp.status(500).send(err))
        } else {
            app.db('articles')
                .insert(article)
                .then(_ => resp.status(204).send())
                .catch(err => resp.status(500).send(err))
        }
    }

    const remove = async (req, resp) => {
        try {
            const rowsDeleted = await app.db('articles')
                .where({id: req.params.id}).del()
            try {
                existsOrError(rowsDeleted, 'Artigo não foi encontrado.')
            } catch(msg) {
                return resp.status(400).send(msg)    
            }
            resp.status(204).send();
        } catch (msg) {
            resp.status(500).send(msg)
        }
    }

    const limit = 3; //Used for pagination
    const get = async(req, resp) => {
        const page = req.query.page || 1;
        const result = await app.db('articles').count('id').first()
        const count = parseInt(result.count);

        app.db('articles')
            .select("id", "name", "description")
            .limit(limit).offset(page * limit - limit)
            .then(articles => resp.json({data: articles, count, limit}))
            .catch(err => resp.status(500).send(err))
    }

    const getById = (req, resp) => {
        app.db('articles')
            .where({id: req.params.id})
            .first()
            .then(article => {
                article.content = article.content.toString();
                return resp.json(article)
            })
            .catch(err => resp.status(500).send(err))
    }
    
    const getByCategory = async (req, res) => {
        const categoryId = req.params.id
        const page = req.query.page || 1
        const categories = await app.db.raw(queries.categoryWithChildren, categoryId)
        const ids = categories.rows.map(c => c.id)

        app.db({a: 'articles', u: 'users'})
            .select('a.id', 'a.name', 'a.description', 'a.imageUrl', { author: 'u.name' })
            .limit(limit).offset(page * limit - limit)
            .whereRaw('?? = ??', ['u.id', 'a.userId'])
            .whereIn('categoryId', ids)
            .orderBy('a.id', 'desc')
            .then(articles => res.json(articles))
            .catch(err => res.status(500).send(err))
    }

    return {save, remove, get, getById, getByCategory}
}