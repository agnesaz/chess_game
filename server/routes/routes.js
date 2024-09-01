module.exports = app => {

    // Route handler for the home page
    app.get('/', (req, res) => {
        res.render('index');
    });

    // Route handler for creating or joining a game as White
    app.get('/white', (req, res) => {
        res.render('game', {
            color: 'white'
        });
    });

    // Route handler for creating or joining a game as Black
    app.get('/black', (req, res) => {
        if (!games[req.query.code]) {
            return res.redirect('/?error=invalidCode');
        }

        res.render('game', {
            color: 'black'
        });
    });
};