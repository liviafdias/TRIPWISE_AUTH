const express = require('express')
const path = require('path');
const cors = require('cors')
require('dotenv').config();
const routes = require('./routes/routes')

const app = express()
app.use(cors({
    origin: '*' 
}));
app.use(express.json())
app.use(routes);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admPagInicial.html'));
});

app.listen(4000, ()=>{
    console.log("Servidor rodando em http://localhost:4000")
})

app.get('/',(request,response)=>{
    response.send("Tripwise")
 })