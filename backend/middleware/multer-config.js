// importer multer
const multer = require('multer');
// preparer un dictionnaire des mimetypes qu'on peut avoir depuis le frontend
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};
// un objet pour configurer multer.
const storage = multer.diskStorage({
    // expliquer a multer dans quel dossier trouvé le fichier 
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    // expliquer a multer quel nom de fichier utilisé
    filename: (req, file, callback) => {
        // generer le nouveau nom 
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});
// appeler la methode multer et single: un fichier image unique
module.exports = multer({ storage: storage }).single('image');