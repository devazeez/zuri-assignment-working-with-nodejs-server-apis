const http = require("http");
const os = require("os");
const PORT = 3001;

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Check for GET request
  if (req.method === "GET" && req.url === "/system/info") {
    const delay = Math.floor(Math.random() * 3000);

    setTimeout(() => {
      // Retrieve CPU and OS information
      const userInfo = {
        cpuArchitecture: os.arch(),
        totalMemory: os.totalmem(),
        freeMemory: os.freemem(),
        platform: os.platform(),
        type: os.type(),
        uptime: os.uptime(),
        userInfo: os.userInfo(),
      };
      // Send the user info as JSON response
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(JSON.stringify(userInfo));
      res.end();
    }, delay);
  } else {
    // If the route is not recognized, respond with a 404 error
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(PORT, () => {
  console.log(`Server is currently live on port ${PORT}`);
});