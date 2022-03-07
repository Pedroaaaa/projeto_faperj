const asyncMysql = require('../infrastructure/asyncConnection');

class ThemeController {

    static async create() {}

    static async readAll(req, res) {
        
        const query = "SELECT * FROM themelist";

        try {

            const db = await asyncMysql();

            const themes = await db.query(query);
            return res.json(themes[0]);

        } catch(error) {
            return res.status(500).json(error.message);
        }
    }
}
module.exports = ThemeController;