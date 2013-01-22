function update_toc(){
  var ul = $('#toc').empty();
  ul.append("<li>a</li>");
  ul.append("<li>b</li>");
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
})