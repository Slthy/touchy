const UserModel = require('../models/users.model');
const crypto = require('crypto');
const fs = require('fs');
const config = require('../../common/config/env.config');
const basePath = config.uploadPath


exports.insert = (req, res, next) => {
  let salt, hash;
  salt = crypto.randomBytes(16).toString('base64');
  hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
  UserModel.findByEmail(req.body.email)
    .then((result) => {
      if (result == '') {
        UserModel.findByUsername(req.body.username)
          .then((result) => {
            if (result == '') {
              UserModel.createUser({
                  firstname: req.body.firstname,
                  lastname: req.body.firstname,
                  email: req.body.email,
                  password: salt + "$" + hash, //not using req.body because next modules require clear password 
                  username: req.body.username,
                  permissionLevel: 1
                })
                .then(() => next());
            } else res.status(403).send({
              error: "already registred user with this username"
            });
          });
      } else res.status(403).send({
        error: "already registred user with this email"
      });
    });
};

exports.fromUsername = (req, res) => {
  let pathToPosts
  pathToPosts = `${basePath}/${req.body.username}/posts/`;
  let numberOfPosts
  if (fs.existsSync(pathToPosts)) {
    fs.readdir(pathToPosts, (_err, files) => {
      numberOfPosts = files.length;
    });
  }
  UserModel.findByUsername(req.body.username)
    .then((result) => {
      if (result == '') {
        res.status(404).send({
          error: "can't find a user with this user"
        });
      } else res.status(200).send({
        username: result[0].username,
        name: result[0].firstname + ' ' + result[0].lastname,
        permissionLevel: result[0].permissionLevel,
        numberOfPosts: numberOfPosts
      });
    });
};

exports.imageFromUsername = (req, res) => {
  const username = req.body.username
  const filepathPng = `${basePath}/${username}/profilePic/profile.png`;
  const filepathJpeg = `${basePath}/${username}/profilePic/profile.jpg`;
  if (fs.existsSync(filepathJpeg)) {
    fs.access(filepathJpeg, fs.F_OK, (_err) => {
      res.status(200).sendFile(filepathJpeg)
    })
  } else if (fs.existsSync(filepathPng)) {
    fs.access(filepathPng, fs.F_OK, (_err) => {
      res.status(200).sendFile(filepathPng)
    })
  } else res.status(404).send({
    error: 'file not found'
  })
};

exports.getSinglePost = (req, res) => {
  const username = req.body.username
  const id = req.body.id
  const filepathPng = `${basePath}/${username}/posts/${id}.png`;
  const filepathJpeg = `${basePath}/${username}/posts/${id}.jpg`;
  if (fs.existsSync(filepathJpeg)) {
    fs.access(filepathJpeg, fs.F_OK, (_err) => {
      res.status(200).sendFile(filepathJpeg)
    })
  } else if (fs.existsSync(filepathPng)) {
    fs.access(filepathPng, fs.F_OK, (_err) => {
      res.status(200).sendFile(filepathPng)
    })
  } else res.status(404).send({
    error: 'file not found'
  })
};

exports.list = (req, res) => {
  let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
  let page = 0;
  if (req.query) {
    if (req.query.page) {
      req.query.page = parseInt(req.query.page);
      page = Number.isInteger(req.query.page) ? req.query.page : 0;
    }
  }
  UserModel.list(limit, page)
    .then((result) => {
      res.status(200).send(result);
    })
};

exports.patchById = (req, res) => {
  let requestSuccess = ['OK', 'Low permissionLevel', 'Unhandled error']
  let requestSuccessCode = requestSuccess[2]
  if (req.body.password) {
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
    req.body.password = salt + "$" + hash;
  }
  if (req.body.permissionLevel) {
    UserModel.findById(req.params.userId)
      .then((result) => {
        if (result.permissionLevel >= 7) {
          requestSuccessCode = requestSuccess[0]

          UserModel.patchUser(req.params.userId, req.body)
            .then((_result) => {
              res.status(204).send();
            });
        } else {
          requestSuccessCode = requestSuccess[1]
          res.status(403).send({
            "error": "you don't have the access to this resource. Your permission code: " + result.permissionLevel
          });
        }
        console.log('[*] PatchById request from: ' + req.params.userId + ' Result: ' + requestSuccessCode)
      });
  }

};

exports.removeById = (req, res) => {
  UserModel.removeById(req.params.userId)
    .then((_result) => {
      res.status(204).send({});
    });
};