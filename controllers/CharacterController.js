const asyncMysql = require('../infrastructure/asyncConnection');

class CharacterController {

    static async create() {}

    static async readAll(req, res) {
        
        const query = "SELECT * FROM characterlist";

        try {

            const db = await asyncMysql();

            const Characters = await db.query(query);
            return res.json(Characters[0]);

        } catch(error) {
            return res.status(500).json(error.message);
        }
    }
}
module.exports = CharacterController;