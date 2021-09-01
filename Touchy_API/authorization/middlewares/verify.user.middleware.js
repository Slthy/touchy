const UserModel = require('../../users/models/users.model');
const crypto = require('crypto');
const fs = require('fs');
const config = require('../../common/config/env.config');
const UPLOAD_PATH = config.uploadPath

exports.hasAuthValidFields = (req, res, next) => {
  let errors = [];

  if (req.body) {
    if (!req.body.username) {
      errors.push('Missing username field');
    }
    if (!req.body.password) {
      errors.push('Missing password field');
    }

    if (errors.length) {
      return res.status(400).send({
        errors: errors.join(',')
      });
    } else {
      return next();
    }
  } else {
    return res.status(400).send({
      errors: 'Missing username and password fields'
    });
  }
};

exports.isPasswordAndUserMatch = (req, res, next) => {
  UserModel.findByUsername(req.body.username)
    .then((user) => {
      if (!user[0]) {
        res.status(404).send({});
      } else {
        let passwordFields = user[0].password.split('$');
        let salt = passwordFields[0];
        let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
        let numberOfPosts
        const pathToPosts = UPLOAD_PATH + '/' + req.body.username + '/posts'
        if (!fs.existsSync(pathToPosts)) { //create folder recursively given the finalpath
          fs.mkdirSync(pathToPosts, {
            recursive: true
          });
        }
        fs.access(pathToPosts, fs.F_OK, (err) => {
          if (err) {
            console.log(err)
          }
          fs.readdir(pathToPosts, (err, files) => {
            numberOfPosts = files.length;
            if (hash === passwordFields[1]) {
              req.body = {
                username: user[0].username,
                name: user[0].firstname + ' ' + user[0].lastname,
                permissionLevel: user[0].permissionLevel,
                numberOfPosts: numberOfPosts
              };
              return next();
            } else {
              return res.status(400).send({
                errors: ['Invalid username or password']
              });
            }
          });
        })
      }
    });
};