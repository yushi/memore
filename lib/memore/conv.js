
function MD2Pukiwiki(){
  this.list_level = 0;
  this.list_ordered = false;
}

MD2Pukiwiki.prototype.autoinsert_newline = function autoinsert_newline(txt){
  if(txt === ''){
    return txt;
  }

  if(txt[txt.length -1] !== '\n'){
    txt += '\n';
  }
  return txt;
}

MD2Pukiwiki.prototype.decorate = function decorate(str){
  str = str.replace(/\*\*(.*?)\*\*/g, "''$1''"); //bold
  str = str.replace(/\*(.*?)\*/g, "'''$1'''"); //italic
  str = str.replace(/\[(.*?)\]\((.*?)\)/, "[[$1>$2]]"); //link
  return str;
}

MD2Pukiwiki.prototype.conv = function conv(doc){
  var txt = '';
  for(var i in doc){
    var elem = doc[i];

    if(elem.type === 'heading'){
      txt = this.autoinsert_newline(txt);
      txt += repeat('*', elem.depth) + ' ' + elem.text + '\n';

    }else if(elem.type === 'list_start'){
      this.list_level += 1;
      this.list_ordered = elem.ordered;

    }else if(elem.type === 'list_end'){
      this.list_level -= 1;

    }else if(elem.type === 'list_item_start'){
      txt = this.autoinsert_newline(txt);
      txt += repeat('-', this.list_level) + ' ';

    }else if(elem.type === 'list_item_end'){

    }else if(elem.type === 'text'){
      txt += this.decorate(elem.text);

    }else if(elem.type === 'table'){
      for(var j in elem.header){
        txt += '|' + elem.header[j];
      }
      txt += '|h\n';

      for(var j in elem.cells){
        for(var k in elem.cells[j]){
          var item = this.decorate(elem.cells[j][k]);
          txt += '|' + item;
        }
        txt += '|\n'
      }

    }else if(elem.type === 'space'){

    }else if(elem.type === 'loose_item_start'){

    }else if(elem.type === undefined){

    }else{
      console.log(elem);
    }
  }

  return txt;
}

function repeat(c, num){
  var str = ''
  for(var i = 0; i < num; i++){
    str += c;
  }
  return str;
}

function md2pukiwiki(doc){
  var c = new MD2Pukiwiki();
  return c.conv(doc);
}

module.exports.md2pukiwiki = md2pukiwiki;