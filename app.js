const express = require('express')
const app = express()
app.use(express.json())

// Run DB Setup
require('./Models/Ticket')
require('./Models/Book')
require('./Models/User')
require('./db/mongoose')
// Routes
app.use('/user', require('./routes/userRoute'))
app.use('/books', require('./routes/bookRoute'))
app.use(require('./routes/ticketRoute'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
