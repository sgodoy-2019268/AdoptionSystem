import mongoose from "mongoose"

const animalSchema = mongoose.Schema({
    animal: {
        type: String,
        require: true
    },
    species: {
        type: String,
        require: true
    },
    size: {
        type: String,
        require: true
    },
    age: {
        type: String,
        require: true
    },
    sex: {
        type: String,
        require: true
    },
    keeper: {
        type: String,
        require: true
    }
})

export default mongoose.model('user', userSchema)