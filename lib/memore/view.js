function View(){
}

View.prototype.upper_rel_link = function upper_rel_link(depth){
  var base = '..';
  var link = './'
  for(var i = 0; i < depth; i++){
    link += base;
  }
  return link;
}

View.prototype.breadcrumbs = function breadcrumbs(title){
  var links = [];
  var is_dir = false;

  var dirs = title.split('/');
  dirs[0] = 'top';
  if(dirs[dirs.length - 1] === ''){
    dirs.pop();
    is_dir = true;
  }

  var depth = dirs.length - 1;
  if(!is_dir){
    depth -= 1;
  }

  // 現在表示中ページには link を設定しないため別扱い
  var current = {name: dirs.pop()
                ,link: null
                ,is_dir: is_dir};

  for(var i in dirs){
    var elem = { name: dirs[i]
               , link: this.upper_rel_link(depth)};
    links.push(elem);
    depth -= 1;
  }

  links.push(current);
  return links;
;
}

module.exports = View;