// Models
const Like = require("../models/like");

// lire tous les likes
exports.findAllLikes = (req, res, next) => {
    Like.find({ articleId: req.params.id })
        .then(likes => {

            res.status(200).json({ data: likes });
        })
        .catch(error => res.status(400).json({ error }));
};


// créer un like
exports.createLike = (req, res, next) => {
    const likeObject = req.body;
    Like.find({
        articleId: req.body.articleId,
        userId: req.body.userId
    })
        .then(likes => {
            if (likes.length === 0) {
                const like = new Like({
                    ...likeObject
                });
                // Enregistrement de l'objet like dans la base de données
                like.save()
                    .then(() => {
                        Like.find({ articleId: req.body.articleId })
                            .then(likes => {
                                res.status(200).json({ like: likes.length });
                            })
                    })
                    .catch(error => res.status(400).json({ error }));
            }

            else {
                Like.deleteOne({
                    articleId: req.body.articleId,
                    userId: req.body.userId
                })
                    .then(likes => {
                        res.status(200).json({ like: likes.length });
                    })
                    .catch(error => res.status(400).json({ message: error.message }));

            }
        }
        )
}
