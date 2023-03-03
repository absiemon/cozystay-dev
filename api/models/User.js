const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

    name:{ type: 'string'},
    email:{ type: 'string', unique: true},
    password:{ type: 'string'},
    mobile:{type: 'Number'},
    avatar:{ type: 'string', default:'https://cdn.pixabay.com/photo/2016/11/18/23/38/child-1837375_960_720.png'},
    isAvatar:{type:Boolean, default: false}
})

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;