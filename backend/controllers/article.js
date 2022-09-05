// Models
const Article = require("../models/article");
const Comment = require("../models/comment");



// lire tous les posts
exports.findAllArticles = (req, res, next) => {
    Article.find().sort({ createdAt: 'desc' })
        .then(articles => {
            res.status(200).json({ data: articles });
        })
        .catch(error => res.status(400).json({ error }));
};

// créer un post
exports.createArticle = (req, res, next) => {
    // éléments de la requète
    const articleObject = JSON.parse(req.body.article);
    const content = articleObject.content;
    // Création d'un nouvel objet article
    if (req.file) {
        const articleF = new Article({
            ...articleObject,
            createdAt: new Date(),
            imageUrl: `/images/${req.file.filename}`,
        });
        // // Enregistrement de l'objet article dans la base de données
        articleF.save()
            .then(() => res.status(201).json({ message: 'Article créé !' }))
            .catch(error => res.status(400).json({ error }));
    } else {
        const article = new Article({
            ...articleObject,
            createdAt: new Date(),
        });
        // // Enregistrement de l'objet article dans la base de données
        article.save()
            .then(() => res.status(201).json({ message: 'Article créé !' }))
            .catch(error => res.status(400).json({ error }));
    }

};

// afficher les posts crée par le user
exports.findArticlesByUserId = (req, res, next) => {
    Article.find({ userId: req.params.id }).sort({ createdAt: 'desc' })
        .then(articles => {
            res.status(200).json({ data: articles });
        })
        .catch(error => res.status(400).json({ error }));
};



// afficher un seul post
exports.findOneArticle = (req, res, next) => {
    Article.findOne({ _id: req.params.id })
        .then(article => { res.status(200).json(article) })
        .catch(error => res.status(404).json({ error }));
};


//   modifier un post
exports.modifyArticle = (req, res, next) => {
    // éléments de la requète
    const articleObject = JSON.parse(req.body.article);
    const content = articleObject.content;

    if (req.file) {
        // recuperer notre objet du base de donnée
        Article.findOne({ _id: req.params.id })

            .then((article) => {
                const filename = article.imageUrl.split("/images/")[1];
                if (filename) {
                    fs.unlink(`images/${filename}`, (err) => {
                        if (err) console.log(err);
                    });
                }
            })
            .catch((error) => console.log(error));
    }

    const articleObjectEdit = req.file ?
        {
            ...articleObject,
            imageUrl: `/images/${req.file.filename}`

        }
        : { ...articleObject };

    Article.updateOne(
        { _id: req.params.id },
        { ...articleObjectEdit }
    )
        .then(() => res.status(200).json({ message: 'Article modifié !' }))
        .catch(error => res.status(400).json({ error }));
};


// supprimer un post
exports.deleteArticle = (req, res, next) => {
    Article.deleteOne({ _id: req.params.id })
        .then(() => {
            Comment.deleteMany({ articleId: req.params.id })
                .then((result) => res.status(200).json({ message: "Article Delete" }))
                .catch((error) => res.status(400).json({ error: error }));
        })
        .catch((error) => console.log(error));
};

