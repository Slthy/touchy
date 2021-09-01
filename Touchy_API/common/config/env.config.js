module.exports = {
    "port": 3600,
    "appEndpoint": "http://localhost:3600",
    "apiEndpoint": "http://localhost:3600",
    "uploadPath": "/Users/alessandroborsato/touchyOnSvelteKit/Touchy_API/userFiles",
    "mongodbAddress": "mongodb://localhost:27017/rest-tutorial",
    "jwt_secret": "myS33!!creeeT",
    "jwt_expiration_in_seconds": 36000,
    "environment": "dev",
    "permissionLevels": {
      "NORMAL_USER": 1,
      "VIP_USER": 2,
      "ADMIN": 7
    }
};