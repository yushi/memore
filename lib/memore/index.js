var fs = require('fs')
  , marked = require('marked')
  , Clients = require('./clients')
  , Storage = require('./storage')
  , View = require('./view');

function Memore(dir){
  var self = this;

  this._dir = dir;

  this.clients = new Clients(this._dir);
  this.clients.get_data = function(path){
    return {html: self.storage.get_html('/' + path)}
  }

  this.storage = new Storage(dir);
  this.view = new View();
}

module.exports = Memore;