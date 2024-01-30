const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Définition d'un schéma de modèle pour les livres dans l'application en utilisant Mongoose
const bookSchema = mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true, unique: true },
    author: { type: String, required: true },
    imageUrl: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    ratings: [
        {
            userId: { type: String, required: true },
            grade: { type: Number, required: true }
        }
    ],
    averageRating: { type: Number, required: true }
});

// les titres de livre doivent être uniques
// Plugin Mongoose pour s'assurer que deux livres ne peuvent pas avoir le même titre
bookSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Book', bookSchema);