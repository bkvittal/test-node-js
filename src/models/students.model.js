const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let StudentsSchema = new Schema({
    first_name: {type: String, required: true, max: 100},
    last_name: {type: String, required: true, max: 100},
});


// Export the model
module.exports = mongoose.model('Students', StudentsSchema);