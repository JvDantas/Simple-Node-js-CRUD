const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const handlebars = require('express-handlebars')


const app = express();
const urlencodeParser = bodyParser.urlencoded({ extended: false })

const sql = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'jvdantas',
    port: 3306,

})
sql.query('use nodejs')

// Configs 
app.engine("handlebars", handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/js', express.static('js'))
app.use('/css', express.static('css'))
app.use('/img', express.static('img'))


//Start server
app.listen(3000, function (req, res) {
    console.log('Servidor esta rodando na porta 3000')
})


//Routes and Tampletes
app.get("/", function (req, res) {
    // res.send("Essa é minha pagina inicial")
    // res.sendFile(__dirname + "/index.html") mandar um html
    res.render('index');

})

// Cadastro 
app.get("/inserir", function (req, res) {
    res.render("inserir")
})

// View
app.get("/select/:id?", function (req, res) {
    if (!req.params.id) {
        sql.query('select * from user order by id asc', function (erro, results, fields) {
            res.render('select', { data: results })
        })
    } else {
        sql.query('select * from user where id=? order by id asc', [req.params.id], function (erro, results, fields) {
            res.render('select', { data: results })
            console.log(results)
        })
    }
})
//Form de inserção de dados
app.post("/controllerForm", urlencodeParser, function (req, res) {
    sql.query("insert into user values (?,?,?)", [req.body.id, req.body.name, req.body.age])
    res.render('controllerForm', { name: req.body.name })
})

//delete
app.get("/delete/:id", function (req, res) {
    sql.query("delete from user where id=?", [req.params.id]);
    res.render('delete')
})

//update
app.get("/update/:id", function (req, res) {
    sql.query("select * from user where id=?", [req.params.id], function (error, results, fields) {
        res.render('update', { id: results[0].id, name: results[0].name, age: results[0].age })
    })
})
//Form de update
app.post("/update/controllerUpdate", urlencodeParser, function (req, res) {
    sql.query("update user set name=?, age=? where id=?", [req.body.name, req.body.age, req.body.id]);
    res.render('controllerUpdate');
})





