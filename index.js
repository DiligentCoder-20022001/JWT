const http = require("http");
const app = require("./app");
const server = http.createServer(app); // creates a server based on the app (Express)

const {API_PORT} = process.env;
const port = process.env.PORT || API_PORT; 

server.listen(port, () => {
    console.log("Server up and running at port " + port);
})