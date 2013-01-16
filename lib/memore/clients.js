var fs = require('fs');

function Clients(data_dir){
  this._data_dir = data_dir;
  this.sockets = {};
  this.watchers = {};
}

Clients.prototype._updated = function _updated(path){
  var self = this;
  return function(event, filename){
    for(var i in self.sockets[path]){
      self.sockets[path][i].emit('updated', self.get_data(path));
    }
  }
}

Clients.prototype.connection_handler = function connection_handler(socket){
  var self = this;
  return function(socket){
    socket.on('watch', function(path){
      if(path.indexOf('/view/') == 0){
        path =  path.substr(5);
        path = decodeURI(path);
      }

      if(!self.sockets[path]){
        self.sockets[path] = [];
        self.watchers[path] = fs.watch(self._data_dir + path,
                                       self._updated(path));
      }
      self.sockets[path].push(socket);

      socket.on('disconnect', function(){
        var idx = self.sockets[path].indexOf(socket);
        self.sockets[path].splice(idx, 1);

        if(self.sockets[path].length !== 0){
          return;
        }

        if(self.watchers[path].length !== 0){
          return;
        }

        self.watchers[path].close();
        delete self.watchers[path]
      });
    })
  }
}

module.exports = Clients;