require('dotenv').config()

const express = require('express')
const exphbs = require('express-handlebars');

const app = express ()
const mongoose  = require('mongoose')
const cors = require('cors')

app.use(cors())

app.use('/static', express.static('Public'));
app.engine("hbs", exphbs.engine({
    extname: "hbs",
}));
app.set("view engine", "hbs");
app.set("views", "./views");

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection
db.on('error', (error) => console.log(error))
db.once('open', () => console.log('Connected to DB!'))

app.use(express.json())

const viewRouter = require('./routes/views')
app.use('/pages', viewRouter)

const userDataRouter = require('./routes/userData')
app.use('/userdatas', userDataRouter)

const inventoryRouter = require('./routes/inventory')
app.use('/items', inventoryRouter)

const taskRouter = require('./routes/tasks')
app.use('/tasks', taskRouter)




app.listen(3000, () => console.log('Server is up!'))

