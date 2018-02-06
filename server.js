const express = require('express')
const app = express()
module.exports = function(path, port){
    app.use(express.static(path))

    app.all('*',function(req,res,next){
        console.log(req.url)
        next()
    })

    app.listen(port,function(){
        console.log(`serving on ${port}`)
    })
}
