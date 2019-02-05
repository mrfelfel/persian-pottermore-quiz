module.exports = function(router) {
    router.get('/quiz/:id/:num/:answer', function(req, res) {

        res.json({data: 'Hello World!'});
    });

    return router;
}