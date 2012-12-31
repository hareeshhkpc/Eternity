function(doc, req) {
  if(doc.objecttype && doc.objecttype == req.query.objecttype && doc.userid == req.query.userid) {
  if (doc.params && doc.objecttype == 'smo'){
	var myObject = eval('(' + doc.params + ')');
	if(myObject && myObject.finish== true ){
	return false;
	}
  }
  return true;
}
return false;
}
