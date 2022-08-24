const express = require("express");
const mysql = require("promise-mysql");
const app = express();
app.use(express.json());
app.use(express.static(__dirname));

app.listen(8080, () => {
  console.log("Application started and Listening on port 8080");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/getFileData", async (req, res) => {

  var result = [];

  for (var i = 0; i < req.body.length; i++) {
    var rowResult = await getResult(req.body[i])
    console.log(rowResult)
    if (rowResult && rowResult.length > 0) {
      result.push(rowResult)
    }
  }

  res.setHeader('Content-disposition', 'attachment; filename=data.csv');
  res.set('Content-Type', 'application/octet-stream');
  res.status(200).send(result);
});

async function getResult(req) {

  const dbConfig = {
    host: 'localhost',
    port: '3306',
    database: 'profile',
    user: 'user',
    password: 'password',
  };

  let connection;
  try {

    connection = await mysql.createConnection(dbConfig);

    const result = await connection.query(" SELECT * FROM PROFILE WHERE CID = ? AND USERNAME = ? ",
      [
        req.cIdEncrypt,
        req.username
      ]
    );

    var row
    Object.keys(result).forEach(function (key) {
      row = result[key];
    });

    return row ? Object.values(JSON.parse(JSON.stringify(row))) : null;

  } catch (err) {
    console.log(err)
  } finally {
    if (connection && connection.end) connection.end();
  }

}