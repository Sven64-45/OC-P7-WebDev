const { error } = require('console');
const Book = require('../models/books');
const fs = require('fs');
const path = require('path');

// List des Books
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
}

//Ajouter un Book
exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    console.log(bookObject);
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.compressedFilename}`,
        averageRating: bookObject.ratings[0].grade
    });
    book.save()
        .then(() => res.status(201).json({ message: 'Book enregistré !' }))
        .catch(error => res.status(400).json({ error }));
    }
//modifier un Book
exports.modifyBook = (req, res, next) => {
    const bookObject = req.file ? {
            ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.compressedFilename}`,
        } : { ...req.body };
        delete bookObject._userId;
        Book.findOne({ _id: req.params.id })
           .then((book) => {
               if (book.userId !== req.auth.userId) {
                res.status(401).json({ error: 'Vous n\'êtes pas autorisé à modifier ce livre' });
               } else {
                   if (req.file) {
                       const imagePath = path.join(__dirname, '..', 'images', path.basename(book.imageUrl));
                       fs.unlink(imagePath, (error) => { 
                        if(error) {
                            console.log(error);
                        }
                     });
               }
               Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                   .then(() => res.status(200).json({ message: 'Livre modifié !' }))
                   .catch(error => res.status(401).json({ error }));
              }
            })
        
        .catch(error => res.status(400).json({ error }));
        };

//supprimer un Book
exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => {
            if (book.userId !== req.auth.userId) {
                res.status(401).json({ error: 'Vous n\'êtes pas autorisé à supprimer ce livre' });
            } else {
                const filename = path.join(__dirname, '..', 'images', path.basename(book.imageUrl));
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => res.status(500).json({ error }));
};

// livre unique
exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then(book => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }));
};

// Rating 3 best books
exports.getBestRating = (req, res, next) => {
    Book.find().sort({ averageRating: -1 }).limit(3)
        .then(books => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
};

// Rating un livre
exports.postRating = (req, res, next) => {
    const {userId, ratings} = req.body;
    const user = req.body.userId;

    if (user !== req.auth.userId) {
        res.status(401).json({ error: 'Vous n\'êtes pas autorisé à noter ce livre' });
    }

    //vérifier si le livre est noté entre 0 et 5
    if (ratings[0].grade < 0 || ratings[0].grade > 5) {
        res.status(400).json({ error: 'La note doit être comprise entre 0 et 5' });
    }
 Book.findbyId(req.params.id)
    .then(book => {
        if (!book) {
            return res.status(404).json({ error: 'Livre non trouvé' });
        }

        //vérifier si l'utilisateur a déjà noté le livre
        if (book.ratings.some(rating => rating.userId === userId)) {
            return res.status(400).json({ error: 'Vous avez déjà noté ce livre' });
        }

        //ajouter la note
        book.ratings.push({ userId, grade: ratings[0].grade });

        //calculer la moyenne des notes
        const totalRating = book.ratings.length;
        const sumRating = book.ratings.reduce((acc, rating) => acc + rating.grade, 0);
        const averageRating = sumRating / totalRating;
        book.averageRating = averageRating;

        //sauvegarder le livre
        book.save()
            .then(updateBook => {
                res.status(200).json(updateBook);
            })
            .catch(error => {
                res.status(500).json({ error });
            });
        })
        .catch(error => {
            res.status(500).json({ error });
        });
    };