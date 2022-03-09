const asyncMysql = require('../infrastructure/asyncConnection');
const axios = require('axios');

class ListController {
    static async create(req, res) {

        const questionList = req.body;
        const query = 'INSERT INTO lists SET ?';
        const idList = [];
        
        try {
            const db = await asyncMysql();

            for(const question of questionList.questions) {
                const response = await axios.post('http://localhost:31415/questions', question);
                idList.push(response.data.id);
            }

            const values = {
                "title" : questionList.title,
                "description" : questionList.description,
                "questions" : JSON.stringify(idList)
            }

            const result = await db.query(query, values)
            const listId = result[0].insertId;
            await db.end();
            return res.status(201).json({
                "Status": "Created",
                "id": listId
            })
        } catch(error) {
            res.status(500).json(error.message);
        }
    }

    static async readAll(req, res) {
        try{
            const allLists = []

            const db = await asyncMysql();
            const query = 'SELECT * FROM lists'

            const results = await db.query(query);
            const lists = results[0]

            for(const list of lists) {
                const questionList = [];

                const themeIdlist = [];
                const characterIdlist = [];

                const themeList = [];
                const characterList = [];

                for(const questionId of list.questions) {
                    const question = await axios.get(`http://localhost:31415/questions/${questionId}`);
                    questionList.push(question.data);
                    themeIdlist.push(question.data.themeId);
                    characterIdlist.push(question.data.characterId)
                }

                const uniqueThemes = [ ...new Set(themeIdlist)]
                const uniqueCharacters = [ ...new Set(characterIdlist)]

                
                for(const theme of uniqueThemes) {
                    const result = await axios.get(`http://localhost:31415/themes/${theme}`);
                    themeList.push(result.data)
                }
                for(const character of uniqueCharacters) {
                    const result = await axios.get(`http://localhost:31415/characters/${character}`);
                    characterList.push(result.data)
                }

                allLists.push({
                    "title" : list.title,
                    questionList,
                    themeList,
                    characterList,
                    "description" : list.description
                })
            }
            
            res.json(allLists);
        } catch(error) {
            res.status(500).json(error.message);
        } 
    }

    static async readOne(req, res) {
        try{
            const id = req.params.id;
            
            const db = await asyncMysql();
            const query = 'SELECT * FROM lists WHERE id=?'

            const results = await db.query(query, id);
            const list = results[0][0];
            
            const questionList = [];

            const themeIdlist = [];
            const characterIdlist = [];

            const themeList = [];
            const characterList = [];

            for(const questionId of list.questions) {
                const question = await axios.get(`http://localhost:31415/questions/${questionId}`);
                questionList.push(question.data)
                themeIdlist.push(question.data.themeId);
                characterIdlist.push(question.data.characterId)
            }

            const uniqueThemes = [ ...new Set(themeIdlist)]
            const uniqueCharacters = [ ...new Set(characterIdlist)]

            
            for(const theme of uniqueThemes) {
                const result = await axios.get(`http://localhost:31415/themes/${theme}`);
                themeList.push(result.data)
            }
            for(const character of uniqueCharacters) {
                const result = await axios.get(`http://localhost:31415/characters/${character}`);
                characterList.push(result.data)
            }

            res.json({
                "title" : list.title,
                questionList,
                themeList,
                characterList,
                "description" : list.description
            });
        } catch(error) {
            res.status(500).json(error.message);
        } 
    }
}
module.exports = ListController;