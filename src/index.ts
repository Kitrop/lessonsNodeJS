import express from 'express'
const app = express()
const port = 3003

app.get('/', (req, res) => {
    res.send('hello world')
})

app.get('/users', (req, res) => {
    res.send('hello!')
})

app.post('/users', (req, res) => {
    res.send('We create user!')
})



app.listen(port, () => {
    console.log(`server started on port ${port}`)
})
