const http = require('http');
const url = require('url');
const { parse } = require('querystring');

let db = [];

const server = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url, true);
    const { pathname } = reqUrl;

    if (req.method === 'POST' && pathname === '/') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { title, comedian, year } = JSON.parse(body);
            const id = db.length + 1;
            const joke = { id, title, comedian, year };
            console.log(joke)
            db.push(joke);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              message: "Successfully added a new joke",
              data: joke
            }));
        });
    } else if (req.method === 'GET' && pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(({
          message: "Jokes returned successfully",
          data: db
        })));
    } else if (req.method === 'PATCH' && pathname.startsWith('/joke/')) {
        const id = parseInt(pathname.split('/')[2]);
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const { title, comedian, year } = JSON.parse(body);
            db = db.map(joke => {
                if (joke.id === id) {
                    joke.title = title;
                    joke.comedian = comedian;
                    joke.year = year;
                }
                return joke;
            });
            const updatedJoke = db.find(joke => joke.id === id);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              message: "Successfully updated joke",
              data: updatedJoke
            }));
        });
    } else if (req.method === 'DELETE' && pathname.startsWith('/joke/')) {
        const id = parseInt(pathname.split('/')[2]);
        const deletedJoke = db.find(joke => joke.id === id);
        db = db.filter(joke => joke.id !== id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          message: "Successfully deleted joke",
          data: deletedJoke
        }));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
