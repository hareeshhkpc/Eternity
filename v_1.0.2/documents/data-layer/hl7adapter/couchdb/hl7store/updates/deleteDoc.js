function(doc, req) {
   if (req.method !== 'POST') {
	  return [null, 'only POST allowed'];
   }
   if(!doc) {
        doc = {} 
        if(req.id){
              doc._id = req.id
        } else {
              doc._id = req.uuid
        }
    }

   doc.timestamp = new Date();
   doc.content = req.body
   doc.objecttype = req.query.objecttype
   doc.userid = req.query.userid
   doc._deleted = true

   return [doc, JSON.stringify(doc)];
}
