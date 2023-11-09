const express = require('express')
const mysql = require('mysql2')
const bookRoute = require('./routes/book')
const authorRoute = require('./routes/author')
const dbConfig = require('./config/database')
const pool = mysql.createPool(dbConfig)

pool.on('error', (err) => {
    console.log(err)
})

const app = express() //inialisasi express
const PORT = 3001 //inialisasi port

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

//membuat parameter harus diawali : diawal contoh = :namaparameter
app.get('/contohparameter/:username/:jurusan/:kelas', (req, res) => {
    res.json(req.params)    
})

app.get('/contohparam', (req, res) => {
    res.json(req.query)
})

app.get('/', (req,res) => {
    res.write('Hellow World!')
    res.end()
})

//unutk memanggil book nya menggunakan route
app.use('/book', bookRoute)
app.use('/author', authorRoute)

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`)
})
