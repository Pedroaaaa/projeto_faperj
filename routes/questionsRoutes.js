const QuestionController = require('../controllers/QuestionController');
const ThemeController = require('../controllers/ThemeController');
const CharacterController = require('../controllers/CharacterController')

module.exports = app => {
    app.route('/questions')
        .get(QuestionController.readAll)
        .post(QuestionController.create)

    app.route('/themes')
        .get(ThemeController.readAll)

    app.route('/characters')
        .get(CharacterController.readAll)

    app.get('*', (req, res) => {
        res.redirect('/questions')
    })
}