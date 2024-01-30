const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) // 10 = Hashage
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save() // Enregistrement dans la base de données
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error })); // Erreur
        })
        .catch(error => res.status(500).json({ error })); // Erreur
    
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) // Recherche de l'utilisateur dans la base de données
        .then(user => {
            if (!user) { // Si l'utilisateur n'est pas trouvé
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password) // Comparaison du mot de passe
                .then(valid => {
                    if (!valid) { // Si le mot de passe est incorrect
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({ // Si le mot de passe est correct
                        userId: user._id,
                        token: jwt.sign( // Création d'un token
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error })); // Erreur
        })
        .catch(error => res.status(500).json({ error })); // Erreur
};