//Models
const User = require("../models/user");
const Article = require("../models/article");
const Comment = require("../models/comment");
const Like = require("../models/like");

const fs = require('fs');


// afficher tous utilisateurs
exports.findAllUsers = (req, res, next) => {
    User.find()
        .then(users => res.status(200).json({ data: users }))
        .catch(error => res.status(400).json({ error }));
};

// afficher un utilisateur par son id
exports.findOneUser = (req, res, next) => {
    User.findOne({ _id: req.params.id })
        .then(user => res.status(200).json(user))
        .catch(error => res.status(404).json({ error }));
};


//   modifier les informations d'un utilisateur
exports.modifyUser = (req, res, next) => {
    // éléments de la requète
    const name = req.body.name;
    const lastName = req.body.lastName;

    // vérification que tous les champs sont remplis
    if (name === null || name === '' || lastName === null || lastName === '') {
        return res.status(400).json({ 'error': "Les champs 'nom' et 'prénom' doivent être remplis " });
    }

    if (req.file) {
        // recuperer notre objet du base de donnée
        User.findOne({ _id: req.params.id })

            .then((user) => {
                const filename = user.imageUrl.split("/images/")[1];
                if (filename !== "default-avatar.png") {
                    fs.unlink(`images/${filename}`, (err) => {
                        if (err) console.log(err);
                    });
                }
            })
            .catch((error) => console.log(error));

    }
    // gestion d'ajout/modification image de profil
    const userObject = req.file ?
        {
            // creer l'url de l'image
            imageUrl: `/images/${req.file.filename}`,

        }
        : { ...req.body };
    User.updateOne(
        { _id: req.params.id },
        {
            ...userObject,
            _id: req.params.id
        }
    )
        .then(() => res.status(200).json({ message: "Utilisateur modifié !" }))
        .catch((error) => res.status(400).json({ error }));
};


// supprimer un compte
exports.deleteUser = (req, res, next) => {

    User.findOne({ _id: req.params.id })
        .then((user) => {
            if (!user) {
                res.status(404).json({
                    message: 'user non trouvée !'
                });
            } else {
                User.deleteOne({ _id: req.params.id })
                    .then(() => {
                        Article.deleteMany({ userId: req.params.id })
                            .then(() => {
                                Comment.deleteMany({ userId: req.params.id })
                                    .then((result) => res.status(200).json({ message: "User Delete" }))
                                    .catch((error) => res.status(400).json({ error: error }));
                            })
                            .catch((error) => console.log(error));
                    })
                    .catch((error) => res.status(400).json({ error }));
            }
        });
};

