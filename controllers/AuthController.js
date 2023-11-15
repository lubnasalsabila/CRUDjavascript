const dbConfig = require('../config/database')
const mysql = require('mysql2')
const jwt = require('jsonwebtoken')
const pool = mysql.createPool(dbConfig)
const {
    responseAuthSuccess,
    responseFailValidate
} = require('../traits/ApiResponse')
const { connect } = require('../routes/book')

pool.on('error', (err) =>{
    console.error(err)
})

const accessTokenSecret = '2023-wikramA-exp'

const register = (req, res) => {
    const data = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    }

    pool.getConnection((err, connection) =>{
        if (err) throw err
       
    })
    //membuat validasi agar user mengisi email, username dan password
    if(data.email == null || data.username == null ||data.password == null){
        responseFailValidate(res, 'Email/Username/Password wajib diiisi')
    } else {

        const query = 'INSERT INTO users SET ?'
        const query2 = `SELECT * FROM users WHERE email='${data.email}' OR username='${data.username}'`

        pool.getConnection(async(err, connection) => {
            if(err) throw err

            var checkUnique = new Promise((resolve) => {
                connection.query(query2, (err, results) => {
                if(err) throw err
    
                if(results.length > 0){ //untuk mengecek username sudah dipakai atau belum
                    res.status(403).json ({
                        message: 'Email/ Username sudah digunakan'
                    })
                } else {
                    resolve()
                }
            })
        })
            await checkUnique.then(() => {
                connection.query(query, [data], (err, results) => {
                    if(err) throw err
    
                    if(results.affectedRows >= 1) {
                        const token = jwt.sign({
                            email: data.email,
                            username: data.username
                        }, accessTokenSecret)   
    
                        responseAuthSuccess(res, token, 'Register successfully', {
                            email: data.email,
                            usernmae: data.username
                        })
                    } else {
                        res.status(500).json({
                            message: 'Failed creating user'
                        })
                    }
                })
            })
            connection.release()
        })
    }
}

const login = ((req, res) => {
    const {email, password} = req.body

    if(email == null || password == null) { //validasi login agar wajib memasukan email dan password
        responseFailValidate(res, 'Email/Password wajib diisi')
    } else {
        const query = `SELECT * FROM users WHERE email = '${email}'
        AND password = '${password}'`

        pool.getConnection((err, connection) => {
            if(err) throw err
            // eksekusi query login
            connection.query(query, (err, results) => {
                if(err) throw err

                if(results.length >= 1) {
                    const user = results.pop()

                    const token = jwt.sign(
                        {
                            email: user.email,
                            username: user.username
                        },
                        accessTokenSecret
                    )

                    responseAuthSuccess(res, token, 'Login successfully', {
                        email: user.email,
                        username: user.username
                    })

                    return 
                } 
                res.status(404).json ({
                    message: 'Email or Password wrong'
                })
            })

            connection.release()
        })
    }
})

module.exports = {
    register,
    login
}