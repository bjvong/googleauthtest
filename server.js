const express = require('express');

const app = express();
const port = process.env.PORT || 8050;

app.use(express.static(__dirname + '/public'));

app.get('/test', (req, res) => {
    res.send('your api is working!');
});

const server = app.listen(port, function() {
    console.log('Server is listening on port ' + port);
});
