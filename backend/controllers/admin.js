
//Models
const User = require("../models/user");
const Article = require("../models/article");
//  supprimer un utilisateur
exports.deleteUser = (req, res, next) => {
    User.findOne({ _id: req.params.id })
        .then((user) => {
            if (!user) {
                res.status(404).json({
                    message: 'user non trouvée !'
                });
            }

            else {

                User.deleteOne({ _id: req.params.id })
                    .then(() => {
                        Article.deleteMany({ _id: req.params.id })
                    })
                    .then(() => {
                        res.status(200).json({ message: 'Utilisateur suprimé!' })
                    })

                    .catch(error => res.status(400).json({ message: error.message }));
                ;


            }
        }

        )
        .catch(error => res.status(500).json({ message: error.message }));
};
