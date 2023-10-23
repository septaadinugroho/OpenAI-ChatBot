const { OpenAI } = require("openai"); //openai nya
const bodyParser = require("body-parser"); //parser body
const cors = require("cors"); //cross originnya
require("dotenv").config(); //config dotenvnya

const express = require("express"); //expressnya
const path = require("path"); //untuk mengakses folder public

const app = express(); //memanggil fungsi expressnya
const http = require("http"); //require http

const server = http.createServer(app); //createServer

const io = require("socket.io")(server); //mengirim data dari html ke nodejs

const openai = new OpenAI({
  apiKey: process.env.API_TOKEN, // This is also the default, can be omitted
});

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(cors());

io.on("connection", function (socket) {
  socket.on("newuser", function (username) {
    console.log(username);
  });

  socket.on("prompt", function (data) {
    console.log(data);
    const response = openai.completions.create({
      model: "text-davinci-003",
      prompt: data.text,
      temperature: 0.1,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      max_tokens: 256,
    });
    response
      .then((IncomingData) => {
        const message = IncomingData.choices[0].text;
        socket.emit("chatbot", {
          username: "bot",
          text: message,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
