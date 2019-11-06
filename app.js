const express = require('express')
const app = express()
app.use(express.json())

// Run DB Setup
require('./db/mongoose')

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
