function toggle_toc(){
  var main = $('#main_div');

  if($('#toggle_toc_icon').hasClass('icon-step-backward')){
    $('#toggle_toc_icon').removeClass('icon-step-backward')
    $('#toggle_toc_icon').addClass('icon-step-forward')
    $('#sidebar_div').hide();
  }else{
    $('#toggle_toc_icon').removeClass('icon-step-forward')
    $('#toggle_toc_icon').addClass('icon-step-backward')
    $('#sidebar_div').show();
  }

  if(main.hasClass('offset3')){
    $('#main_div').removeClass('offset3');
    $('#main_div').addClass('offset0');
  }else{
    $('#main_div').removeClass('offset0');
    $('#main_div').addClass('offset3');
  }
}

function create_elem(tag, child, attrs){
  var elem = $(document.createElement(tag));

  if(typeof(child) === 'string'){
    child = document.createTextNode(child);
  }

  if(child !== null){
    elem.append(child);
  }

  for(var i in attrs){
    elem.attr(i, attrs[i]);
  }
  return elem;
}

function repeated_str(str, count){
  var repeated = '';
  for(var i = 0; i < count; i++){
    repeated += str;
  }
  return repeated;
}

function update_toc(){
  var anchor_idx = 0;
  var ul = $('#sidebar').empty();
  var headers = $('div#wiki_contents h1, h2, h3, h4, h5, h6');

  headers.each(function(i){
    $(headers[i]).attr('id', 'anchor' + anchor_idx);
    var val = $(headers[i]).text();
    var level = parseInt(headers[i].tagName[1]);
    var link = create_elem('a', create_elem('small', val), {'href':'#anchor' + anchor_idx });
    link.html(repeated_str('&nbsp;', (level-1) * 2) + link.html());

    var elem = create_elem('li', link);
    if(level === 1){
      elem.addClass('nav-header');
    }
    ul.append(elem)

    anchor_idx += 1;
  });
}

function decorate_table(){
  var table = $('div#wiki_contents table');
  table.addClass('table')
  table.addClass('table-striped')
  table.addClass('table-bordered')
}

function decorate_h1(){
  var h1 = $('div#wiki_contents h1');
  h1.addClass('wiki_h1');
}

function decorate_h2(){
  var h2 = $('div#wiki_contents h2');

  var first = true;
  h2.each(function(i){
    if(!first){
      var hr = document.createElement('hr');
      $(hr).addClass('h2-end')
      $(h2[i]).before(hr);
    }else{
      first = false;
    }

    var header_div = document.createElement('div');
    var new_h2 = document.createElement('h2');
    $(new_h2).text($(h2[i]).text());
    $(header_div).addClass('page-header');
    $(header_div).append(new_h2);
    $(h2[i]).replaceWith($(header_div));
  })
}

function decorate(){
  decorate_table();
  decorate_h1();
  decorate_h2();
}

function replace_contents(html){
  document.getElementById('wiki_contents').innerHTML = html;
}

var socket = io.connect('http://localhost')
socket.on('news', function(data){
  socket.emit('other', {my: 'data'});
})
socket.on('updated', function(data){
  replace_contents(data.html);
  decorate();
  update_toc();
});
socket.emit('watch', location.pathname);

$(document).ready(function(){
  decorate();
  update_toc();

  $(document).scroll(function(){
    var pos = $(window).scrollTop();
    var headers = $('#wiki_contents h1, h2, h3, h4, h5, h6');
    $(headers.get().reverse()).each(function(i){
      if($(headers[i]).offset().top > pos){
        console.log(headers[i].id);

        var toc_links = $('#sidebar a');
        toc_links.each(function(j){
          if($(toc_links[j]).attr('href') === '#' + headers[i].id){
            $(toc_links[j]).parent().addClass('active');
          }else{
            $(toc_links[j]).parent().removeClass('active');
          }
        })
        return false;
      }
      return true;
    });
  })
})