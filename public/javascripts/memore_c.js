function replace_contents(html){
  document.getElementById('wiki_contents').innerHTML = html;
}

var socket = io.connect('http://localhost')
socket.on('news', function(data){
  socket.emit('other', {my: 'data'});
})
socket.on('updated', function(data){
  replace_contents(data.html);
});
socket.emit('watch', location.pathname);
