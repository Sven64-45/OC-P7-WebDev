const express = require('express');
const router = express.Router();

// Importation des middlewares
const auth = require('../middleware/auth');
const multer = require('../middleware/multer');
const sharp = require('../middleware/sharp');

// Importation des controllers
const booksCtrl = require('../controllers/books');

// Route GET avoir tous les livres
router.get('/', booksCtrl.getAllBooks);

// Route GET bestrating
router.get('/bestrating', booksCtrl.getBestRating);

// Route GET avoir un livre
router.get('/:id', booksCtrl.getOneBook);

// Route POST pour envoyer le rating d'un livre
router.post('/:id/rating', auth, booksCtrl.postRating);

// Route POST pour créer un livre
router.post('/', auth, multer, sharp, booksCtrl.createBook);

// Route PUT pour modifier le livre
router.put('/:id', auth, multer, sharp, booksCtrl.modifyBook);

// Route DELETE pour supprimr le livre
router.delete('/:id', auth, booksCtrl.deleteBook);

module.exports = router;
