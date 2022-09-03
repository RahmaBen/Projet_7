// Models
const Comment = require("../models/comment");


// créer un commentaire
exports.createComment = (req, res, next) => {

    const commentObject = req.body;
    // Création d'un nouvel objet commentaire
    const comment = new Comment({
        ...commentObject,
        createdAt: new Date()
    });
    // Enregistrement de l'objet commentaire dans la base de données
    comment.save()
        .then(() => {
            Comment.find({ articleId: req.body.articleId })
                .then((comments) => { res.status(200).json(comments); })
        })
        .catch(error => res.status(400).json({ error }));
}

// supprimer un commentaire
exports.deleteComment = (req, res, next) => {
    Comment.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Commentaire supprimé !' }))
        .catch(error => res.status(400).json({ message: error.message }));
};

// lire tous les commentaires
exports.findAllComments = (req, res, next) => {

    Comment.find({ articleId: req.params.id })
        .then(comments => {

            res.status(200).json({ data: comments });
        })
        .catch(error => res.status(400).json({ error }));
};