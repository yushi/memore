var fs = require('fs')
  , marked = require('marked');


function Memore(dir){
  this._dir = dir;
}

Memore.prototype._expand_path = function _expand_path(path){
  return this._dir + path;
}

Memore.prototype.is_dir = function is_dir(path){
  return fs.statSync(this._expand_path(path)).isDirectory();
}

Memore.prototype.get = function get(path){
  var data;
  try{
    data = fs.readFileSync(this._expand_path(path)).toString();
  }catch(e){
    console.log(e);
  }
  return data;
}

Memore.prototype._dirent2html = function dirent2html(path){
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

Memore.prototype.get_dirent_html = function get_dirent_html(path){
  return this._dirent2html(path);
}

Memore.prototype.get_html = function get_md(path){
  var data = this.get(path);
  if(data !== undefined){
    return marked(data);
  }
  return undefined;
}

module.exports = Memore;