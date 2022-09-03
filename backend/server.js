// importer le package HTTP de Node l'utilisez pour créer un serveur,  
const http = require('http');

// importer notre application express
const app = require('./app');
// dire a l'application express sur quelle port elle doit tourner 
app.set('port', process.env.PORT || 3001);
// appeler la methode createServer du package HTTP
const server = http.createServer(app);

// configurer le serveur pour qu'il écoute soit la variable d'environnement du port soit le port 3000
server.listen(process.env.PORT || 3001);