function(doc, req) {
  if(doc.objecttype && doc.objecttype == 'smo') {
    return true;
  }

  return false;
}
