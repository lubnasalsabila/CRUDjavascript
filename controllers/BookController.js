const mysql = require('mysql2')
const dbConfig = require('../config/database')
const {
    responseNotFound,
    responseSuccess
} = require('../traits/ApiResponse')
const pool = mysql.createPool(dbConfig)

const search = (req, res) => {
    const keyword = req.query.keyword
    

    const query = `SELECT * FROM books WHERE nama LIKE '%${keyword}%'`

    pool.getConnection((err, connection) =>{
        if(err) throw err

        connection.query(query, (err, results) => {
            if(err) throw err

            if(results.length == 0) {
                return res.json ({
                    message : 'Data tidak ditemukan'
                })
            }

            responseSuccess(res, results, 'Book successfully fetched')
        })

        connection.release()
    })
}

const sortBy = (req, res) => {
    const orderBy = req.query.order
    //DESC atau ASC
    const query = `SELECT * FROM books ORDER BY nama ${orderBy} `

    pool.getConnection((err, connection) => {
        if(err) throw err

        connection.query(query, (err, results) => {
            if(err) throw err

            if(results.length == 0 ) {
                responseNotFound(res)
                return
            }

            responseSuccess(res, results, 'Book succesfully fetched')
        })

        connection.release()

    })

}

//
const getBooks = (req, res) => {
    const query = 'SELECT * FROM books;';

    pool.getConnection((err, connection) => {
        if (err) throw err;

        connection.query(query, (err, result) => {
            if (err) throw err;

            responseSuccess(res, result, 'Books succesfully fetched')
        })

        connection.release()
    })
}

//untuk menampilkan data berdasarkan id
const getBook = (req, res) => {
    const id = req.params.id

    const query = `SELECT * FROM books WHERE id=${id}`
    // mengambil koneksi menggunakan pool.getConnection
    pool.getConnection((err, connection) => {
        if(err) throw err

        connection.query(query, (err, results) => {
            if(err) throw err

            if(results.length == 0){
                responseNotFound(res)
                return
            }

            responseSuccess(res, results, 'Book seccesfully  fetched')
        })

        connection.release()
    })
}

const addBook  = (req, res) => {
    const data = {
        name: req.body.name,
        author: req.body.author,
        publisher: req.body.publisher,
        year: req.body.year,
        page_count: req.body.page_count
    }

    const query = 'INSERT INTO books SET ?'

    pool.getConnection((err, connection) => {
        if(err) throw err

        connection.query(query, [data], (err, results) => {
        if(err) throw err

        responseSuccess(res, results, 'Book successfully added')
        })

        connection.release()
    })
}

const updateBook = (req, res) => {
    const id = req.params.id

    const data = {
        name : req.body.name,
        author: req.body.author,
        publisher: req.body.publisher,
        year: req.body.year,
        page_count: req.body.page_count
    }

    const query = `UPDATE books SET ? WHERE id=${id}`

    pool.getConnection((err, connection) => {
        if(err) throw err

        connection.query(query, [data], (err, results) => {
            if(err) throw err
            
            if(results.affectedRows == 0 ) {
                responseNotFound(res)
                return
            } 

            responseSuccess(res, results, 'Book successfully update')
            })
    
        connection.release()
    })
}

const deleteBook = (req, res) => {
    const id = req.params.id

    const query = `DELETE FROM books WHERE id=${id}`

    pool.getConnection((err, connection) => {
        if(err) throw err

        connection.query(query, (err, results) => {
            if(err) throw err 

            if(results.affectedRows == 0){
                responseNotFound(res)
                return
            }

            responseSuccess(res, results, 'Book successfully deleted')
        })
        connection.release()
    })
}

module.exports = {
    getBooks,
    getBook,
    addBook,
    updateBook,
    deleteBook,
    search,
    sortBy
}