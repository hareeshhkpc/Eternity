function(head, req) {
   start({
    "headers": {
      "Content-Type": "text/html"
     }
   });
   send('[');
   var row; 
   var first = true;
   while (row = getRow()) { 
      if(!first) send(',\n');
      send(JSON.stringify(row.id)); 
      first = false;
   }
   send(']');
}
