var express = require('express');
const routes = require('./routes/routes.js');
const authRoutes = require('./routes/auth');
const cors = require("cors");
const sequelizeConnection = require("./models/index");
const app = express();

sequelizeConnection.sync({ force: false});


app.set('view engine', 'pug');
app.use(cors());
app.use(express.json());

const storage= require("./libs/handystorage.js");
const { truncate } = require('fs');



app.use(express.static('./public'));
app.use(express.static('./covers'));
app.use(express.static('./users'))
app.use((req, res,next) => {
    res.locals.token=storage.state.token;
    res.locals.user=storage.state.email;
    next();
});


app.use("/",routes);
app.use("/auth",authRoutes);

app.listen(3304,() => {
    console.log("server on port 3304")});


