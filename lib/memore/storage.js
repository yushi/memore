var fs = require('fs')
  , marked = require('marked')
  , conv = require('./conv')

function Storage(dir){
  var self = this;

  this._dir = dir;
}

Storage.prototype._expand_path = function _expand_path(path){
  return this._dir + path;
}

Storage.prototype.is_dir = function is_dir(path){
  return fs.statSync(this._expand_path(path)).isDirectory();
}

Storage.prototype.get = function get(path){
  var data;
  try{
    data = fs.readFileSync(this._expand_path(path)).toString();
  }catch(e){
    console.log(e);
  }
  return data;
}

Storage.prototype._dirent2html = function dirent2html(path){
  var dirent = fs.readdirSync(this._expand_path(path));
  var links = [];
  var html = '';
  for(var i in dirent){
    html += '<a href="' +
      './' + dirent[i] +
      '">' +
      dirent[i] +
      '</a><br />'
  }

  return html;
}

Storage.prototype.get_dirent_html = function get_dirent_html(path){
  return this._dirent2html(path);
}

Storage.prototype.get_html = function get_html(path){
  var data = this.get(path);
  if(data !== undefined){
    return marked(data);
  }
  return undefined;
}

Storage.prototype.get_as_pukiwiki = function get_as_pukiwiki(path){
  var data = this.get(path);
  if(data === undefined){
    return undefined;
  }

  var wiki_text = '';
  var doc = marked.lexer(data);
  return conv.md2pukiwiki(doc);
}
module.exports = Storage;