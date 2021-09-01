const UsersController = require('./controllers/users.controller');
const VerifyUserMiddleware = require('../authorization/middlewares/verify.user.middleware');
const AuthorizationController = require('../authorization/controllers/authorization.controller');

const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');
const config = require('../common/config/env.config');
const UPLOAD_PATH = '/Users/alessandroborsato/touchyOnNextJS/Touchy_API/userFiles'

const cors = require('cors');
const express = require('express');
var multer  = require('multer')
var fs = require('fs')

const app = express();
var upload = multer({ dest: UPLOAD_PATH+'/tmp' })

app.use(cors());
app.options('*', cors());

const ADMIN = config.permissionLevels.ADMIN;

const FREE = config.permissionLevels.NORMAL_USER;


exports.routesConfig = function (app) {
  //registration
  app.post('/users', [
    UsersController.insert,
    VerifyUserMiddleware.hasAuthValidFields,
    VerifyUserMiddleware.isPasswordAndUserMatch,
    AuthorizationController.login
  ]);

  app.post('/getDataUsername', [
    UsersController.fromUsername
  ]);

  app.post('/getProfilePic', [
    UsersController.imageFromUsername
  ]);

  app.post('/uploadProfilePic', upload.single('profilePic'), function (req, res) {
      let profilePicExt //set extension for the uploaded pic
      (req.file.mimetype == 'image/jpeg') ? profilePicExt = '.jpg' : profilePicExt = '.png'
      
      const finalPath = `${UPLOAD_PATH}/${req.file.originalname}/profilePic`;
      
      if (!fs.existsSync(finalPath)){ //create folder recursively given the finalpath
        fs.mkdirSync(finalPath, { recursive: true });
      }
      fs.rename(req.file.path, `${finalPath}/profile${profilePicExt}`, (err) => { 
        if (err) { 
          console.log(err); 
        } 
      });
      res.status(200).send()
  })

  app.post('/uploadPost', upload.single('post'), function (req, res) {
    let profilePicExt //set extension for the uploaded pic
    (req.file.mimetype == 'image/jpeg') ? profilePicExt = '.jpg' : profilePicExt = '.png'
    
    const finalPath = `${UPLOAD_PATH}/${req.file.originalname}/posts/`
    
    if (!fs.existsSync(finalPath)){ //create folder recursively given the finalpath
      fs.mkdirSync(finalPath, { recursive: true });
    }
    
    if(fs.existsSync(finalPath)) {
      fs.readdir(finalPath, (_err, files) => {
        fs.rename(req.file.path, `${finalPath}/${files.length-1}${profilePicExt}`, (err) => { 
          if (err) { 
            console.log(err); 
          } 
        });
        res.status(200).send()
      });
    }
  })

  app.post('/getPost', [
    UsersController.getSinglePost
  ]);
  
  app.get('/users', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
    UsersController.list
  ]);

  app.patch('/users/:userId', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(FREE),
    PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
    UsersController.patchById
  ]);

  app.delete('/users/:userId', [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
    UsersController.removeById
  ]);
};
