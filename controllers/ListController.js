const axios = require('axios');

class ListController {
    static async readAll(req, res) {
        try{
            const questionList = await axios.get('http://faperj.ddns.net:31415/questions');
            const themeList = await axios.get('http://faperj.ddns.net:31415/themes');
            const characterList = await axios.get('http://faperj.ddns.net:31415/characters');
            res.json({
                questionList : questionList.data,
                themeList : themeList.data,
                characterList : characterList.data
            });
        } catch(error) {
            res.status(500).json(error.message);
        } 
    }
}
module.exports = ListController;