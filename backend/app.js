// importer express
const express = require('express');
const bodyParser = require('body-parser');
// importer mongoose
const mongoose = require('mongoose');
// appeler la methode express
const app = express();
const path = require('path');
// const auth = require('./middleware/auth');


// Roads
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const articleRoutes = require('./routes/article');
const likeRoutes = require('./routes/like');
const commentRoutes = require('./routes/comment');
// const adminRoutes = require('./routes/admin');


require('dotenv').config();
// connection MongoDB
mongoose.connect(process.env.URL_Mongo,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


// headers spécifiques de contrôle d'accès pour empêcher des erreurs CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


app.use(bodyParser.json());

// Api Roads
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/comments', commentRoutes);
app.use("/images", express.static(path.join(__dirname, 'images')));
module.exports = app;





































































