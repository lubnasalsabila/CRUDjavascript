const mysql = require('mysql2')
const dbConfig = require('../config/database')
const {
    responseNotFound,
    responseSuccess
} = require('../traits/ApiResponse')
const pool = mysql.createPool(dbConfig)
//
const getAuthors = (req, res) => {
    const query = 'SELECT * FROM authors;';

    pool.getConnection((err, connection) => {
        if (err) throw err;

        connection.query(query, (err, result) => {
            if (err) throw err;

            responseSuccess(res, result, 'Author succesfully fetched')
        })

        connection.release()
    })
}

//untuk menampilkan data berdasarkan id
const getAuthor = (req, res) => {
    const id = req.params.id

    const query = `SELECT * FROM authors WHERE id=${id}`
    // mengambil koneksi menggunakan pool.getConnection
    pool.getConnection((err, connection) => {
        if(err) throw err

        connection.query(query, (err, results) => {
            if(err) throw err

            if(results.length == 0){
                responseNotFound(res)
                return
            }

            responseSuccess(res, results, 'Author seccesfully  fetched')
        })

        connection.release()
    })
}

const addAuthor  = (req, res) => {
    const data = {
        name: req.body.name,
        email: req.body.email,
        alamat: req.body.alamat,
        umur: req.body.umur,
        media_sosial: req.body.media_sosial
    }

    const query = 'INSERT INTO authors SET ?'

    pool.getConnection((err, connection) => {
        if(err) throw err

        connection.query(query, [data], (err, results) => {
        if(err) throw err

        responseSuccess(res, results, 'Author successfully added')
        })

        connection.release()
    })
}

const updateAuthor = (req, res) => {
    const id = req.params.id

    const data = {
        name : req.body.name,
        email: req.body.email,
        alamat: req.body.alamat,
        umur: req.body.umur,
        media_sosial: req.body.media_sosial
    }

    const query = `UPDATE authors SET ? WHERE id=${id}`

    pool.getConnection((err, connection) => {
        if(err) throw err

        connection.query(query, [data], (err, results) => {
            if(err) throw err
            
            if(results.affectedRows == 0 ) {
                responseNotFound(res)
                return
            } 

            responseSuccess(res, results, 'Author successfully update')
            })
    
        connection.release()
    })
}

const deleteAuthor = (req, res) => {
    const id = req.params.id

    const query = `DELETE FROM authors WHERE id=${id}`

    pool.getConnection((err, connection) => {
        if(err) throw err

        connection.query(query, (err, results) => {
            if(err) throw err 

            if(results.affectedRows == 0){
                responseNotFound(res)
                return
            }

            responseSuccess(res, results, 'Author successfully deleted')
        })
        connection.release()
    })
}

module.exports = {
    getAuthors,
    getAuthor,
    addAuthor,
    updateAuthor,
    deleteAuthor
}