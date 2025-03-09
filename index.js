import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config(); 

const app = express();
const port = 3000;

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy Chocolate" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async(req, res) => {
 try{
  const result=await db.query("SELECT * FROM items ORDER BY id");
  items=result.rows;
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
 }
 catch (err) {
  console.log(err);
}

 
});

app.post("/add", async(req, res) => {
 try{
  const item = req.body.newItem;
  await db.query("INSERT INTO items (title) VALUES($1)",[item]);

  
  res.redirect("/");

 }catch(err){
  console.log(err);
 }
});

app.post("/edit", async(req, res) => {
  console.log(req.body);
  const newWord=req.body.updatedItemTitle;
  const newId=req.body.updatedItemId;

  try{
    await db.query("UPDATE items SET title= $1 WHERE id= $2",[newWord,newId]);
     res.redirect("/")
  
  }
  catch(err){
    console.log(err);
  }

  
});


app.post("/delete", async(req, res) => {
 
  try{
    const deleteId=req.body.deleteItemId;
  await db.query("DELETE FROM  items WHERE id= $1",[deleteId]);
  res.redirect("/");
  }
  catch(err){
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
