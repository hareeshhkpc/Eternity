function(head, req) {
   send('[');
   var row; 
   var first = true;
   while (row = getRow()) { 
      x = row.key[1]; 
      if(!first) send(',\n');
      send('{"message":'+JSON.stringify(row.value['content'])+'}'); 
      first = false;
   }
   send(']');
}
