let quiz = require("./quiz.json")
const express = require('express')
const expressApp = express()
const router = express.Router();
const config = require("./config.js")
let jwt  = require('jsonwebtoken')

function verifyJWTToken(token) 
{
  return new Promise((resolve, reject) =>
  {
    jwt.verify(token, config.JWT_SECRET, (err, decodedToken) => 
    {
      if (err || !decodedToken)
      {
        return reject(err)
      }

      resolve(decodedToken)
    })
  })
}

expressApp.get("/quizlist/:id", (req,res)=>{
    try {
        let questions = [];
        for (let index = 0; index < 8 ; index++) {
          var random = Math.floor(Math.random()* quiz[index].length)
          var item = quiz[index][random];
          delete item.percentage
          item.qid = random

          questions.push(item)
        }
       
        res.send(questions)

    } catch (error) {
         res.send({
             message : "تعداد سوالات ۸ است"
         })
    }
})
expressApp.get("/verify/:token", (req,res)=>{
 verifyJWTToken(req.params.token)
    .then(res.send)
    .catch(res.send)
})
expressApp.use('/api', require('./middleware/auth.js'));
expressApp.use('/api', require('./controller/quiz.js')(router));

expressApp.use('/sorting', express.static('public'))

expressApp.listen(8764)
// console.log(quiz[0][0])