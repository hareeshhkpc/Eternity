function AjaxMultipart() {
	this.multipart = multipart;
	var renderingEngine = null;
	
	/*
	 * callback: { handler: function(){} parameters: [] }
	 * 
	 * 
	 * callback.handler(callback.parameters)
	 */
	function multipart(url, method, formData, fileData, callback) {
		try {
			renderingEngine = appController.getComponent("RenderingEngine");
			if(renderingEngine){
				renderingEngine.showBusy();
			}
			
			var xml = new XMLHttpRequest();
			var args = arguments;
			var context = this;
			var multipart = "";
			xml.open(method, url, true);

			// alert("Connection Open");

			if (method.search(/post/i) != -1) {
				// alert("post"); return;
				var boundary = Math.random().toString().substr(2);
				xml.setRequestHeader("content-type",
						"multipart/form-data; charset=utf-8; boundary="
								+ boundary);
				for ( var key in formData) {
					multipart += "--"
							+ boundary
							+ "\r\ncontent-Disposition: form-data; name="
							+ key
							+ "\r\ncontent-type: application/octet-stream\r\n\r\n"
							+ formData[key] + "\r\n";
				}

				// alert("Form Fields: " + multipart);

				for ( var key in fileData) {
					multipart += "--" + boundary
							+ "\r\ncontent-disposition: form-data; name=" + key
							+ "; filename=" + key + ".xml"
							+ "\r\ncontent-type: text/plain\r\n\r\n"
							+ fileData[key] + "\r\n";
				}
				multipart += "--" + boundary + "--\r\n";
				//alert("Form Fields: " + multipart);
			}

			xml.onreadystatechange = function() {
				try {
					
					if (xml.readyState == 4) {
						context.txt = xml.responseText;
						context.xml = xml.responseXML;
						//alert("Test Response: " + xml.responseXML);
						if (callback != null) {
							//if(callback.parameters)
							//callback.parameters.push(xml.responseXML);
							//alert("callback.parameters : "+callback.parameters);
							callback.handler(callback.parameters)
						}
					}
				} catch (e) {
					renderingEngine = appController.getComponent("RenderingEngine");
					if(renderingEngine){
						renderingEngine.showFailure();
					}

					msg = AppUtil.getErrorDetails(e,
							"There was some error in sending message: ");
					alert("There was some error in sending message: "+e);
				}
			}

			// alert("Sending request");
			xml.send(multipart);
			renderingEngine = appController.getComponent("RenderingEngine");
			if(renderingEngine){
				renderingEngine.showIdle();
			}
		} catch (e) {
			renderingEngine = appController.getComponent("RenderingEngine");
			if(renderingEngine){
				renderingEngine.showFailure();
			}
			
			msg = AppUtil.getErrorDetails(e,
					"There was some error in sending message: ");
			alert("There was some error in sending message:"+e);
		}

	}
};
