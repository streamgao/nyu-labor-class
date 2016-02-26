
var md5 = require('md5');
var userStorage = require('node-persist');
userStorage.initSync();


// var method = User.prototype;
function User(username) {
  this.data = {};
  this.username = username;

  // which "table" should we store the data in?
  this.table = "users";

  this.load = function() {
    if(this.username === undefined) {
      this.data = {};
      return null;
    }

    // do we have this user in the db already?
    var user = userStorage.getItemSync(this.getKey());
    
    // if not, save it
    if(!user) {
      this.update({
        username: this.username,
        key: this.getKey()
      });
    }
    else {
      this.data = user;
    }
    return this;
  };

  /* If we have the data:
   *  - laod the user and return it
   *  - otherwise, returns 
   */
  this.loadByKey = function(key) {
    var _data = userStorage.getItemSync(key);
    if(_data) {
      this.username = _data.username;
      this.data = _data;
      return this;
    }
    return null;
  },

  this.update = function(d) {
    for(var prop in d) {
      this.data[prop] = d[prop];
    }
    this.data.key = this.getKey();
    userStorage.setItemSync(this.data.key, this.data);
  };

  this.getKey = function() {
    var k = this.table + "-" + this.getHash(this.username);
    console.log("getting key: %s" , k );
    return k;
  }

  this.getHash = function(s) {
    console.log("Getting hash: " + s);
    console.log("md5(%s) == %s",  s, md5(s));
    return md5(s);
  };

  this.load();
}

module.exports = User;
