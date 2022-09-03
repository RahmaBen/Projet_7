//Models
const AuthModel = require("../models/user");

// Required
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const mailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
const pswValidator = require('password-validator');
const sanitize = require('mongo-sanitize');

const validPsw = new pswValidator();
validPsw
  // .is().min(8)
  .is().max(16)
  // .has().uppercase()
  .has().lowercase()
  // .has().digits()
  .has().not().spaces()
  .has().symbols()

// Functions
exports.signup = (req, res, next) => {
  if (mailRegex.test(req.body.email) && validPsw.validate(req.body.password)) {
    //  rendre le hachage imprévisible avec salt

    bcrypt.genSalt(saltRounds, function (saltError, salt) {
      if (saltError) {
        throw saltError
      } else {
        // appeler la fonction de hachage de bcrypt lui passer le mot de pasese par le front
        bcrypt.hash(req.body.password, salt, function (hashError, hash) {
          if (hashError) {
            throw hashError
          } else {

            // enregistrer un nouveau user dans la base de donnée
            const user = new AuthModel({

              ...req.body,
              imageUrl: "/images/default-avatar.png",
              cover: "/images/default-cover.jpg",
              password: hash,
              admin: false,
              registerAt: new Date(),
              postsCount: 0,
              unreadNotify: 0,

            });

            user.save()
              .then(() => { res.status(201).json({ message: 'Utilisateur créé !' }); })
              .catch((error) => { res.status(400).json({ error }); });


          }
        })
      }
    })
  } else {
    res.status(400).json({ error })
  }

};

// se connecter a son compte
exports.login = (req, res, next) => {

  const cleanEmail = sanitize(req.body.email);
  const cleanPassword = sanitize(req.body.password);
  AuthModel.findOne({ email: cleanEmail })
    // la requete s'est bien passé dans la base de donnée
    .then(user => {
      // si l'utulisateur n'existe pas   
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      // comparer la valeur emise par le client avec celle de la base de donnée
      bcrypt.compare(cleanPassword, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            // appeler la fonction sign
            token: jwt.sign(
              { userId: user._id },
              process.env.TOKEN_RANDOM,
              { expiresIn: '24h' }
            ),
            admin: user.admin

          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    // erreur d'execution de la requete dans la base de donnée
    .catch(error => res.status(500).json({ error }));
};



