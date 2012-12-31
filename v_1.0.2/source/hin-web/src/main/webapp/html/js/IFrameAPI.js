function IFramePageApi(iFrameURL, parentContainerID, iFrameHTML) {
	var thisObject = this;
	this.iFrameURL = iFrameURL;

	if (!iFrameURL) {
		throw "Required parameter 'iFrameURL' missing.";
	}

	if (!parentContainerID) {
		throw "Required parameter 'parentContainerID' missing.";
	}

	this.parentContainer = $('#' + parentContainerID);

	IFramePageApi.html = '<div id="testFrame" style="height: 150px; width: 50%">'
			+ '<iframe id="testIFrame" name="testIFrame" scrolling="auto" '
			+ 'height="100%" width="100%" src="" frameborder="0"></iframe>'
			+ '</div>';

	this.iFrameDOM = $((iFrameHTML) ? iFrameHTML : IFramePageApi.html);
	this.callBackAfterFrameLoad = null;
	this.paramsToIFrame = null;
	this.frameObject = null;

	this.loadIFrame = function(paramsToIFrame, callBackAfterFrameLoad) {
		thisObject.callBackAfterFrameLoad = callBackAfterFrameLoad;
		thisObject.paramsToIFrame = paramsToIFrame;
		thisObject.parentContainer.append(thisObject.iFrameDOM);

		/*
		 * //alert("Buttons: " + $(html).find('#xmlBtn').length);
		 * thisObject.iFrameDOM.find('#xmlBtn').unbind('click', showXml);
		 * thisObject.iFrameDOM.find('#xmlBtn').bind('click', showXml);
		 * 
		 * thisObject.iFrameDOM.find('#removeBtn').unbind('click', removeXml);
		 * thisObject.iFrameDOM.find('#removeBtn').bind('click', removeXml);
		 * 
		 * function showXml(){ var childWin =
		 * thisObject.frameObject.contentWindow; childWin.showXml(); };
		 * 
		 * function removeXml(){ thisObject.iFrameDOM.remove();
		 * thisObject.iFrameDOM = null; };
		 */

		thisObject.iFrameDOM.find('iframe').unbind('load', afterFrameLoad);
		thisObject.iFrameDOM.find('iframe').bind('load', afterFrameLoad);

		function afterFrameLoad() {
			var childWin = this.contentWindow;
			thisObject.frameObject = this;

			if (!childWin.onLoadComplete) {
				throw "Required interface method 'onLoadComplete' is missing in the page loaded in iframe.";
			}
			childWin.onLoadComplete(thisObject.paramsToIFrame);
			if (thisObject.callBackAfterFrameLoad) {
				thisObject.callBackAfterFrameLoad.apply(thisObject);
			}
		}

		thisObject.parentContainer.trigger("create");

		thisObject.iFrameDOM.find('iframe').attr('src', thisObject.iFrameURL);
		return thisObject;
	};

	this.removeIFrame = function(callBackAfterFrameRemove) {
		thisObject.iFrameDOM.remove();
		thisObject.iFrameDOM = null;
		if (callBackAfterFrameRemove) {
			callBackAfterFrameRemove.apply(thisObject);
		}
	};

	return thisObject;
};