const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    permissionLevel: Number,
    username: String
});

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
userSchema.set('toJSON', {
    virtuals: true
});

userSchema.findById = function (cb) {
    return this.model('Users').find({id: this.id}, cb);
};

const User = mongoose.model('Users', userSchema);


exports.findByEmail = (email) => {
    return User.find({email: email});
};

exports.findByUsername = (username) => {
  return User.find({username: username});
};

exports.findById = (id) => {
  return User.find({id: id});
};

exports.createUser = (userData) => {
    const user = new User(userData);
    return user.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        User.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, users) {
                if (err) {
                    reject(err);
                } else {
                    resolve(users);
                }
            })
    });
};

exports.patchUser = (id, userData) => {
    return User.findOneAndUpdate({
        _id: id
    }, userData);
};

exports.removeById = (userId) => {
    return new Promise((resolve, reject) => {
        User.deleteMany({_id: userId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};

