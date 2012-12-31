function(doc) {
  if(doc.objecttype && doc.objecttype == 'smo'){
       emit([doc.artifactid, doc.timestamp],doc);
   }
}
