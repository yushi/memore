
/*
 * GET home page.
 */

exports.index = function index(req, res){
  var html;
  if(req.memore.storage.is_dir(req.wiki_path)){
    if(req.path.substr(-1) !== '/'){
      return res.redirect(req.path + '/');
    }
    html = req.memore.storage.get_dirent_html(req.wiki_path);
  }else{
    html = req.memore.storage.get_html(req.wiki_path);
  }

  var locals = {title: req.wiki_path};

  if(html === undefined){
    return res.render('new', {title: req.wiki_path});
  }

  res.render('wikipage', {title: req.wiki_path
                         ,wiki_contents: html})
};