var HIN;
if (!HIN)
	HIN = {};
HIN.ReviewPage = function(appController, pageHolder) {
	reviewPage = this;
	this.appController = appController;
	this.processDefinition = null;
	this.messageTypes = [];
	this.selectedStep = null;
	this.pageHolder = "reviewPage";
	this.series = new Array();
	this.titleArray = new Array();
	this.dataArray = new Array();
	this.exist = false;
	this.messageCount = 0;

};

HIN.ReviewPage.prototype.init = function(callback, page) {
	if (callback) {
		callback(page);
	}
};

HIN.ReviewPage.prototype.pageBeforeLoad = function(messageType, uiGenerator) {
	uiGenerator.formRender = true;
	uiGenerator.singleForm = true;
	uiGenerator.hideMainHeader();
	uiGenerator.hideAddIcon();
	uiGenerator.hideSubHeader();
	uiGenerator.hideRemoveIcon();

};
HIN.ReviewPage.prototype.addInitialHandler = function(uiGenerator) {
	uiGenerator.formRender = true;
	// alert("addInitialHandler");
};

HIN.ReviewPage.prototype.taskHandler = function(message, taskVO, instance) {
	var processObjects = [ reviewPage.processDefinition ];
	instance.processTask(processObjects);
};

HIN.ReviewPage.prototype.addCompleteHandler = function(addNew, messageType,
		message) {
	this.messageCount += 1;
	// alert("xml=" + XmlUtil.xmlToString(message.message));
	var messages = reviewPage.processDefinition.getStep("Step2")
			.getMessageTypeByType("POLB_MT004000HT01_BloodTest").getMessages();
	if (this.messageCount <= messages.length) {
		var reviewMsg = XmlUtil.getXPathResult(message.message,
				"message/POLB_MT004000HT01_BloodTest");
		var comp = reviewMsg.iterateNext();
		components = XmlUtil.findByName(comp, "component2", false);
		for (i = 0; i < components.length; i++) {
			var testTitle = new Array();
			var testValue = new Array();
			var observationEvent = XmlUtil.findByName(components[i],
					"observationEvent", true);
			var codeNode = XmlUtil.findByName(observationEvent, "code", true);
			var codeValue = XmlUtil.findByName(codeNode, "code", true);
			testTitle.push(XmlUtil.text(codeValue));

			var valueNode = XmlUtil.findByName(observationEvent, "value", true);
			var value = XmlUtil.findByName(valueNode, "value", true);
			if (XmlUtil.text(value) != null) {
				testValue.push(parseInt(XmlUtil.text(value)));

			} else {
				testValue.push(parseInt(0));
			}
			var colorArray = new Array();
			var rangeArray = new Array();
			colorArray.push("orange");
			rangeArray.push("20");
			var test = {
				data : testValue,
				color : colorArray,
				title : testTitle,
				range : rangeArray
			};

			for (ser in this.series) {
				if (this.series[ser].title == test.title[0]) {
					if (XmlUtil.text(value) != null) {
						this.series[ser].data
								.push(parseInt(XmlUtil.text(value)));
						this.exist = true;
					} else {
						this.series[ser].data.push(parseInt(0));
						this.exist = true;
					}
				}
			}
			if (!this.exist && test.title[0] != null) {
				this.series.push(test);
			}
		}
		// alert("series=" + $.toJSON(this.series));
	}
	if (this.messageCount == messages.length) {
		$("#inner-main-head" + message.instanceId).append(
				'<div id="mainChartHeader"></div>');
		for (j in this.series) {
			$("#mainChartHeader").append(
					'<div id="mainChartId' + j + '"></div>');
		}
		var chartdata = new HIN.ChartVO();
		chartdata.testData = this.series;
		chartdata.patientId = '1234';
		chartdata.testDate = new Date();
		chartdata.testType = 'bloodtest';
		chartdata.ymin = 70;
		chartdata.ymax = 250;
		var json = $.toJSON(chartdata);
		// alert("json" + json);
		reviewPage.loadPathData(json);
	}

};

HIN.ReviewPage.prototype.removeCompleteHandler = function(messageTypeName,
		message) {
	// alert("removeCompleteHandler");
};

HIN.ReviewPage.prototype.lookupSelectionHandler = function(instance,
		conceptLookup, message) {

};
HIN.ReviewPage.prototype.loadPathData = function(json) {
	reviewPage.appController.getComponent("DataLayer").loadChartData(json,
			reviewPage.createChart,this.series);
};

HIN.ReviewPage.prototype.createChart = function(data,series) {
	var review = this;
	var xValue = 100;// X axis starts from
	var yValue = 250;
	var ymin = 70;// Y axis starts from
	var ymax = yValue;//
	var verticalYValueSpace = 75;// Space between vertical lines
	this.pathData = "";
	this.plotData = "";
	this.scale = "";
	this.scalePixel = "";
	this.range = 0.0;
	this.arrowRange = 0.0;
	var xAxisData = new Array();
	var months = [ "Jan", 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
			'Sep', 'Nov', 'Dec' ];

	for (ict in series) {
		pathData = data.pathList[ict].data;
		plotData = data.plotList[ict].data;
		range = data.testRangeMap[ict].range;
		arrowRange = parseFloat(range) + parseFloat(15.13);
		scale = data.scaleList[ict].scaleList;
		scalePixel = data.scalePixel;
		var x = xValue;// x default position
		var y = ymin;// y default position
		var verticalXvalue = x;
		var midPoint = ((x * 2) + verticalYValueSpace) / 2;
		var xmlNode = XmlUtil.loadXml("charts/chart.xml");

		// function for creating vertical Lines
		for ( var i = 0; i < pathData.length + 1; i++) {

			var childBefore = XmlUtil.find(xmlNode, "id", "horizontalLine");
			var pathNode = XmlUtil.find(xmlNode, "id", "verticalLine");
			var clonePath = pathNode.cloneNode(true);
			if (i == 0) {
				ymax += 10;
			} else {
				ymax = yValue;
			}
			var pathNodeId = "M " + verticalXvalue + "," + y + " "
					+ verticalXvalue + "," + (ymax) + "";
			var subpathNode = XmlUtil.find(xmlNode, "id", clonePath.id);
			XmlUtil.attr(subpathNode, "d", pathNodeId);
			childBefore.parentNode.insertBefore(clonePath, childBefore);
			verticalXvalue += verticalYValueSpace;

		}

		// arrow Mark creation
		var arrow = "m "
				+ ((verticalXvalue - verticalYValueSpace) + 30)
				+ ","
				+ (parseFloat(range) + parseFloat(42.5))
				+ " 0,-10.4 -24.98,0 0,-28.65 24.98,0 0,-16.41 26.68,31.23 -26.68,31.23 z";
		var arrowNode = XmlUtil.find(xmlNode, "id", "arrow");
		XmlUtil.attr(arrowNode, "d", arrow);

		// horizontalLine
		var horizontalNodeValue = "m "
				+ (x - 10)
				+ ","
				+ ymax
				+ " "
				+ (((verticalXvalue - verticalYValueSpace) - verticalYValueSpace))
				+ ",0";
		var horizontalNode = XmlUtil.find(xmlNode, "id", "horizontalLine");
		XmlUtil.attr(horizontalNode, "d", horizontalNodeValue);

		// last line
		var lastNodeValue = "m "
				+ (x - 10)
				+ ","
				+ (parseFloat(ymax) + parseFloat(20))
				+ " "
				+ (((verticalXvalue - verticalYValueSpace) - verticalYValueSpace))
				+ ",0";
		var lastNode = XmlUtil.find(xmlNode, "id", "lastXscaleNode");
		XmlUtil.attr(lastNode, "d", lastNodeValue);

		// title
		var titleNode = XmlUtil.find(xmlNode, "id", "title");
		XmlUtil.text(titleNode, series[ict].title);
		XmlUtil.attr(titleNode, "x", (x + 20));
		XmlUtil.attr(titleNode, "y", (y - 45));

		// legend creation

		var legendNode = XmlUtil.find(xmlNode, "id", "legend");
		XmlUtil.attr(legendNode, "x",
				((verticalXvalue - verticalYValueSpace) + 60));
		XmlUtil.attr(legendNode, "y", (y + 20));

		// legend Symbol
		var legendSymbolNode = XmlUtil.find(xmlNode, "id", "legendSymbol");
		XmlUtil.attr(legendSymbolNode, "x",
				((verticalXvalue - verticalYValueSpace) + 60));
		XmlUtil.attr(legendSymbolNode, "y", (y + 30));
		XmlUtil.attr(legendSymbolNode, "fill", series[ict].color);

		// optimum range
		var optimumRangeNode = XmlUtil.find(xmlNode, "id", "optimumRange");
		XmlUtil.attr(optimumRangeNode, "x",
				((verticalXvalue - verticalYValueSpace) + 60));
		XmlUtil.attr(optimumRangeNode, "y", (y + 100));

		// optimum range title 1
		var optimumTitle1Node = XmlUtil.find(xmlNode, "id", "optimumTitle1");
		XmlUtil.attr(optimumTitle1Node, "x",
				((verticalXvalue - verticalYValueSpace) + 70));
		XmlUtil.attr(optimumTitle1Node, "y", (y + 120));

		// optimum range title 2
		var optimumTitle2Node = XmlUtil.find(xmlNode, "id", "optimumTitle2");
		XmlUtil.attr(optimumTitle2Node, "x",
				((verticalXvalue - verticalYValueSpace) + 70));
		XmlUtil.attr(optimumTitle2Node, "y", (y + 140));

		// legend Title
		var legendTitleNode = XmlUtil.find(xmlNode, "id", "legendTitle");
		XmlUtil.attr(legendTitleNode, "x",
				((verticalXvalue - verticalYValueSpace) + 120));
		XmlUtil.attr(legendTitleNode, "y", (y + 40));
		XmlUtil.text(legendTitleNode, series[ict].title);

		// reference Range Creation

		var referenceRangeValue = (verticalXvalue - verticalYValueSpace) - x;
		var referenceRangeNode = XmlUtil.find(xmlNode, "id", "referenceRange");
		XmlUtil.attr(referenceRangeNode, "width", referenceRangeValue);
		XmlUtil.attr(referenceRangeNode, "x", x);
		XmlUtil.attr(referenceRangeNode, "y", range);

		// function for Plotting
		for (i in plotData) {
			var childBefore = XmlUtil.find(xmlNode, "id", "scaleMarker");
			var plotNode = XmlUtil.find(xmlNode, "id", "plot");
			var clonePlot = plotNode.cloneNode(true);
			var plotNodeId = "m "
					+ midPoint
					+ ","
					+ plotData[i]
					+ " c 1.042,0 1.887,-0.88 1.887,-1.98 0,-1.09 -0.845,-1.98 -1.887,-1.98 -1.043,0 -1.887,0.89 -1.887,1.98 0,1.1 0.844,1.98 1.887,1.98 z";
			var subPlotNode = XmlUtil.find(xmlNode, "id", clonePlot.id);
			XmlUtil.attr(subPlotNode, "d", plotNodeId);
			childBefore.parentNode.insertBefore(clonePlot, childBefore);
			midPoint += verticalYValueSpace;
		}
		midPoint = (x + (x + verticalYValueSpace)) / 2;

		// function for Drawing Line path
		/*
		 * for (i in pathData) { if (i == 0) { stringData = "M " + x + "," +
		 * pathData[i] + " L " + midPoint + " " + pathData[i] + ""; } else {
		 * midPoint += verticalYValueSpace; stringData += "," + midPoint + " " +
		 * pathData[i] + ""; } }
		 */

		// function for curve path
		for ( var i = 0; i < pathData.length; i++) {
			xAxisData.push(months[i]);
			if (i == 0) {
				stringData = "M " + x + "," + pathData[i] + " C " + x + ","
						+ pathData[i] + " " + (x + 10) + "," + (pathData[i])
						+ " " + midPoint + " " + pathData[i] + "";
			} else {

				stringData += " C " + (midPoint + 20) + "," + (pathData[i - 1])
						+ " " + (midPoint + 60) + "," + (pathData[i]) + "";

				midPoint += verticalYValueSpace;

				stringData += "," + midPoint + " " + pathData[i] + "";
			}
		}
		var style = "fill:none;stroke:"
				+ series[ict].color
				+ ";stroke-width:4;stroke-linecap:butt;stroke-linejoin:round;stroke-miterlimit:10;stroke-opacity:1;stroke-dasharray:none";
		var pathNode = XmlUtil.find(xmlNode, "id", "path");
		XmlUtil.attr(pathNode, "d", stringData);
		XmlUtil.attr(pathNode, "style", style);

		// scale markers for yAxis Line
		for (i in scalePixel) {
			var childBefore = XmlUtil.find(xmlNode, "id", "scale");
			var pathNode = XmlUtil.find(xmlNode, "id", "scaleMarker");
			var clonePath = pathNode.cloneNode(true);
			var pathNodeId = "m " + (x - 5) + "," + scalePixel[i]
					+ " 3.317,0.01";
			var subpathNode = XmlUtil.find(xmlNode, "id", clonePath.id);
			XmlUtil.attr(subpathNode, "d", pathNodeId);
			childBefore.parentNode.insertBefore(clonePath, childBefore);
			XmlUtil.attr(pathNode, "id", "scale" + (i + 1));
		}

		// y axis Data (scale values)
		for (i in scale) {
			var childBefore = XmlUtil.find(xmlNode, "id", "lastNode");
			var pathNode = XmlUtil.find(xmlNode, "id", "scale");
			var clonePath = pathNode.cloneNode(true);
			var pixel = scalePixel[i] + 3;
			var yAxisScaleNode = XmlUtil.find(xmlNode, "id", "yAxisScale");
			XmlUtil.attr(yAxisScaleNode, "x", x - 25);
			XmlUtil.attr(yAxisScaleNode, "y", pixel);
			childBefore.parentNode.insertBefore(clonePath, childBefore);
			XmlUtil.text(yAxisScaleNode, scale[i]);
		}
		midPoint = (x + (x + verticalYValueSpace)) / 2;

		// X axis Data
		for (i in xAxisData) {
			var childBefore = XmlUtil.find(xmlNode, "id", "lastXscaleNode");
			var pathNode = XmlUtil.find(xmlNode, "id", "xScale");
			var clonePath = pathNode.cloneNode(true);
			var pixel = midPoint;
			childBefore.parentNode.insertBefore(clonePath, childBefore);
			var xScaleNode = XmlUtil.find(xmlNode, "id", "xData");
			XmlUtil.text(xScaleNode, xAxisData[i]);
			XmlUtil.attr(xScaleNode, "x", (pixel - 20));
			XmlUtil.attr(xScaleNode, "y", (ymax + 10));
			midPoint += verticalYValueSpace;
		}
		midPoint = (x + (x + verticalYValueSpace)) / 2;

		// y values on path
		for (i in xAxisData) {
			var childBefore = XmlUtil.find(xmlNode, "id", "lastXscaleNode");
			var pathNode = XmlUtil.find(xmlNode, "id", "plotingValue");
			var clonePath = pathNode.cloneNode(true);
			var pixel = midPoint;
			childBefore.parentNode.insertBefore(clonePath, childBefore);
			var xScaleNode = XmlUtil.find(xmlNode, "id", "plotValue");
			XmlUtil.text(xScaleNode, data.testData[ict].data[i]);
			XmlUtil.attr(xScaleNode, "x", (midPoint - 5));
			XmlUtil.attr(xScaleNode, "y", (plotData[i] - 10));
			midPoint += verticalYValueSpace;
		}
		xAxisData = new Array();
		$("#mainChartId" + ict).html(XmlUtil.xmlToString(xmlNode));
	}
};
