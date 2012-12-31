function CouchLookups() {
	this.getConceptByConceptClassName = getConceptByConceptClassName;
	this.getConceptsByMatchString = getConceptsByMatchString;
	this.createDocument = createDocument;
	this.deleteDocument = deleteDocument;
	
	/**
	 * Get all concepts under the given conceptClass 
	 * @param conceptClassName : concept class name for which concepts are to be retrieved
	 * @param callback : Callback function called after getting the response from server
	 */

	function getConceptByConceptClassName(conceptClassName, callback) {
		var url = '/couchdb_lookup/_design/lookups/_view/byConceptClassName?includedocs=true&key="'+conceptClassName+'"';
		$.ajax({
			url : url,
			type : "GET",
			data : "",
			contentType : "application/json",
			dataType : "json",
			success : AjaxCallback,
			cache : false,
			error : AjaxFailed
		});

		function AjaxFailed(result) {
			if (result.status == 200 && result.statusText.toUpperCase() == "OK") {
				AjaxCallback(result.responseText);
			} else {
				alert("Error: " + result);
			}
		}
		function AjaxCallback(result) {
			callback(result.rows);
		}

	}
	/**
	 * Get all the concepts by matching the string passed with conceptClass name
	 * @param matchString : string to be matched with conceptClass name
	 * @param callback : Callback function called after getting the response from server
	 */
	function getConceptsByMatchString(matchString, callback){
		var url = '/couchdb_lookup/_design/lookups/_list/matchedConceptClassName/byConceptClassName?matchString='+matchString;
		$.ajax({
			url : url,
			type : "GET",
			data : "",
			contentType : "application/json",
			dataType : "json",
			success : AjaxCallback,
			cache : false,
			error : AjaxFailed
		});

		function AjaxFailed(result) {
			if (result.status == 200 && result.statusText.toUpperCase() == "OK") {
				AjaxCallback(result.responseText);
			} else {
				alert("Error: " + result.responseText);
			}
		}
		function AjaxCallback(result) {
			callback(result.rows);
		}
	}

	/**
	 * To create Document in Database
	 * @param content : content to be saved in document created
	 * @param docid : Document ID of the document to be created
	 * @param callback : Callback function called after getting the response from server
	 */
	function createDocument(content, docid, callback){
		var params = JSON.stringify(content);
		
		var url = '/couchdb_lookup/_design/lookups/_update/createDocument/'+docid+'?params=' + params;
		$.ajax({
			url : url,
			type : "POST",
			data : "",
			contentType : "application/json",
			success : AjaxCallback,
			cache : false,
			error : AjaxFailed
		});

		function AjaxFailed(result) {
			if (result.status == 200 && result.statusText.toUpperCase() == "OK") {
				AjaxCallback(result.responseText);
			} else {
				alert("Error: " + result.responseText);
			}
		}
		function AjaxCallback(result) {
			//alert(result);
			callback(result);
		}
	}
	
	/**
	 * To delete document from database
	 * @param docid : Document ID of the document to be deleted
	 * @param callback : Callback function called after getting the response from server
	 */
	function deleteDocument(docid, callback){
		var url = '/couchdb_lookup/_design/lookups/_update/deleteDocument/'+docid;
		$.ajax({
			url : url,
			type : "POST",
			data : "",
			contentType : "application/json",
			success : AjaxCallback,
			cache : false,
			error : AjaxFailed
		});

		function AjaxFailed(result) {
			if (result.status == 200 && result.statusText.toUpperCase() == "OK") {
				AjaxCallback(result.responseText);
			} else {
				alert("Error: " + result.responseText);
			}
		}
		function AjaxCallback(result) {
			//alert(result);
			callback(result);
		}
	}

}