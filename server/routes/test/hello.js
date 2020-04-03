
module.exports = function(app){
    app.get("/hello/:user",(req, res) => {
        res.status(200).send({msg:`Hello ${req.params.user} !`});
    });
    app.get("/hello/",(req, res) => {
        res.status(200).send({msg:`Hello unamed user !. Try /hello/username for a personalized mesage ^^ !`});
    });
}