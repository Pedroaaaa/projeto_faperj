const asyncMysql = require('../infrastructure/asyncConnection');

class QuestionController {    
    
    static async create(req, res) {
        
        const question = req.body;
        const query = "INSERT INTO questionlist SET ?;";

        try {

            const db = await asyncMysql();

            if(!question.correct) {
                throw new Error("Column 'correct' cannot be null")
            }

            const values = {
                "prompt" : question.prompt,
                "themeId" : question.themeId,
                "characterId" : question.characterId,
                "difficulty" : question.difficulty
            };
            
            const result = await db.query(query, values);
            const questionId = result[0].insertId;
    
            let index = 0;

            for(const answer of question.answers) {
                const query = "INSERT INTO answers SET ?;";
                let correct = false;
                
                if(index == question.correct) {
                    correct = true; 
                };
                
                const values = {
                    "questionId" : questionId,
                    "answer" : answer,
                    "correct" : correct
                };
                
                await db.query(query, values);
                index++;
            };
            await db.end();
            return res.status(201).json({ "Status": "Created" })
        } catch(error) {
            res.status(500).json({ "Error message": error.message });
        }
    }

    static async readAll(req, res) {
        
        let correct;
        const questionList = [];
        const questionQuery = "SELECT * from questionlist";
        const answerQuery = "SELECT * from answers WHERE questionId =?";
        
        try {

            const db = await asyncMysql();

            const questionsResults = await db.query(questionQuery);
        
            for(const question of questionsResults[0]) {

                const answerList = [];
                const answersResults = await db.query(answerQuery, question.id);
                const answersCleanResults = answersResults[0];

                for(let i = 0; i < answersCleanResults.length; i++) {
                    answerList.push(answersCleanResults[i].answer)
                    if(answersCleanResults[i].correct) {
                        correct = i;
                    };
                };
                questionList.push({
                    "prompt": question.prompt,
                    "answers" : answerList,
                    "correct" : correct,
                    "themeId": question.themeId,
                    "characterId": question.characterId,
                    "difficulty" : question.difficulty
                })
            };
            await db.end();
            return res.json(questionList)
        } catch(error) {
            res.status(500).json({ "Error message": error.message });
        }
    }
}
module.exports = QuestionController;
