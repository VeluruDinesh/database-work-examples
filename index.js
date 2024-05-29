import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"permalist",
  password:"Dinesh@123",
  port:"5433"
});
db.connect();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  const items= await db.query("select * from items order by title asc");
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items.rows,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  const result= await db.query("insert into items(title) values($1)",[item]);
  res.redirect("/");
});

app.post("/edit", async(req, res) => {
  const title=req.body.updatedItemTitle;
  const id=req.body.updatedItemId;
  const result= await db.query("update items set title=$1 where id=$2",[title,id]);

res.redirect("/");
});

app.post("/delete", async(req, res) => {
  const id=req.body.deleteItemId;
  const result= await db.query("delete from items where id=$1",[id]);
  res.redirect("/");

  
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
