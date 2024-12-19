const http = require("http");

const PORT = 3400;

const routes = (req, res) => {
  console.log(`Received request for: ${req.url}`); // Debugging statement

  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.write("Hello world");
    res.end();
  } else if (req.url === "/api/courses") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify([1, 2, 3]));
    res.end();
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.write("Not Found");
    res.end();
  }
};

const server = http.createServer(routes);

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
