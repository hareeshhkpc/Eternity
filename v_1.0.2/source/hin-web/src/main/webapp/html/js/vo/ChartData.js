var HIN;
if (!HIN)
	HIN = {};
HIN.ChartData = function() {
	chartData = this;
	this.monthValue = new Array();
};
HIN.ChartData.prototype.getElastometerChart = function(data, series, id, name,
		age) {
	var review = this;
	var xValue = 100;// X axis starts from
	var yValue = 350;
	var ymin = 50;// Y axis starts from
	var ymax = yValue;//
	var verticalYValueSpace = 85;// Space between vertical lines
	this.pathData = "";
	this.plotData = "";
	this.scale = "";
	this.scalePixel = "";
	this.range = 0.0;
	this.arrowRange = 0.0;
	var xAxisData = [ '<20', '20-29', '30-39', '40-49', '50-59', '60>' ];

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
		var xmlNode = XmlUtil.loadXml("charts/chartEstometer.xml");
		for ( var ii = 1; ii <= 6; ii++) {
			var LinearGradientNode = XmlUtil.find(xmlNode, "id",
					"myLinearGradient" + ii);
			XmlUtil
					.attr(LinearGradientNode, "id", "myLinearGradient" + ii
							+ id);
		}

		// patient Name
		var titleNode = XmlUtil.find(xmlNode, "id", "title");
		var patientName = "Name:" + name + "(" + age + ")";
		XmlUtil.text(titleNode, patientName);
		XmlUtil.attr(titleNode, "x", (x + 80));
		XmlUtil.attr(titleNode, "y", (y - 25));
		// percentage title
		var percentage = XmlUtil.find(xmlNode, "id", "percentage");
		XmlUtil.text(percentage, "(%)");
		XmlUtil.attr(percentage, "x", (x - 75));
		XmlUtil.attr(percentage, "y", (y + 35));
		// age title
		var ageNode = XmlUtil.find(xmlNode, "id", "age");
		XmlUtil.text(ageNode, "Age");
		XmlUtil.attr(ageNode, "x", (x + 244));
		XmlUtil.attr(ageNode, "y", (ymax + 48));

		// function for creating vertical Lines
		for ( var i = 0; i < pathData.length + 1; i++) {
			if (i == 0) {
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
			} else {
				verticalXvalue += verticalYValueSpace;

				var rectangleStyle = 'fill:url(#myLinearGradient' + i + id
				'); stroke: #005000; stroke-width: 0;';

				var childBefore = XmlUtil.find(xmlNode, "id", "horizontalLine");
				var pathNode = XmlUtil.find(xmlNode, "id", "referenceRange");
				var clonePath = pathNode.cloneNode(true);
				var vertivalRangeNode = XmlUtil.find(xmlNode, "id",
						"referenceRange");
				XmlUtil.attr(vertivalRangeNode, "x",
						(verticalXvalue - parseFloat(55)));
				XmlUtil.attr(vertivalRangeNode, "y", y);
				XmlUtil.attr(vertivalRangeNode, "width", 40);
				XmlUtil.attr(vertivalRangeNode, "style", rectangleStyle);
				XmlUtil.attr(vertivalRangeNode, "height",
						(yValue - parseFloat(50)));
				childBefore.parentNode.insertBefore(clonePath, childBefore);
			}
		}
		// horizontalLine
		/* (((verticalXvalue - verticalYValueSpace) - verticalYValueSpace)) */
		var horizontalNodeValue = "m " + (x - 10) + "," + yValue + " " + 510
				+ ",0";
		var horizontalNode = XmlUtil.find(xmlNode, "id", "horizontalLine");
		XmlUtil.attr(horizontalNode, "d", horizontalNodeValue);

		midPoint = (x + (x + verticalYValueSpace)) / 2;

		// function for curve path
		for ( var i = 0; i < pathData.length; i++) {
			midPoint += verticalYValueSpace;
		}

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
			XmlUtil.attr(yAxisScaleNode, "x", x - 30);
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
			XmlUtil.attr(xScaleNode, "x", (pixel - 11));
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
			if (data.testData[ict].data[i] == 0) {
				XmlUtil.text(xScaleNode, "");
			} else {
				var percentageNodeValue = "m " + 100 + ","
						+ (plotData[i] - parseFloat(1.5)) + " "
						+ (midPoint - parseFloat(64.5)) + ",0";
				var percentageLineNode = XmlUtil.find(xmlNode, "id",
						"percentageLine");
				XmlUtil.attr(percentageLineNode, "d", percentageNodeValue);
				XmlUtil.text(xScaleNode, data.testData[ict].data[i]);
			}
			XmlUtil.attr(xScaleNode, "x", (midPoint + parseFloat(40)));

			XmlUtil.attr(xScaleNode, "y", (plotData[i] + 5));
			midPoint += verticalYValueSpace;
		}

	}

	return XmlUtil.xmlToString(xmlNode);
};

HIN.ChartData.prototype.getObservationValue = function(observationVO, callBack) {
	/*
	 * alert("observationArray" + observationArray); alert("callBack=" +
	 * callBack);
	 */

	chartData.loadObservationValue(observationVO, function(observationDatas,
			status) {

		callBack(observationDatas);
		/* alert("valuein chartd" + value); */
		/*
		 * finalObservation.push({ "messageType" : messageType, "testName" :
		 * testName, "testValue" : value });
		 */
		/* alert("status" + status); */
		/* if (status == "success") { */
		/*
		 * alert("finalObservation" + $.toJSON(observationData)); for (i in
		 * observationData) { for (j in observationData[i].observationValue) {
		 * var finalObservation = new Array(); finalObservation .push({
		 * "messageType" : observationData[i].messageType, "testName" :
		 * observationData[i].testName, "testValue" :
		 * observationData[i].observationValue[j].testValue, "testDate" :
		 * observationData[i].observationValue[j].testDate });
		 * alert("finalarray" + finalObservation); } }
		 * 
		 * callBack(finalObservation);
		 */
		/* } */

	});

	// alert("finalObservation11" + $.toJSON(finalObservation));
};

HIN.ChartData.prototype.loadObservationValue = function(observationVO, callBack) {
	/* alert("loadObservationValue" + callBack); */
	var alterDatas = null;

	var patientVO = appController.getComponent("Context").getPatientVO();
	observationVO.patientId = patientVO.subscriberId;
	observationVO.organizationId=appController.getComponent("Context").getSelectedOrganizationVO().subscriberId;
	/* alert("observationVO" + $.toJSON(observationVO)); */

	var json = $.toJSON(observationVO);
	var jqxhr = $
			.getJSON("/hin-web/rest/chart/observations", {
				json : json
			}, function(data) {
				// alert("dataa" + $.toJSON(data));
				alterDatas = data;
			})
			.success(
					function() {
						for ( var index = 0; index < alterDatas.length; index++) {
							var dateValues = new Array();
							var testValueIndex = 0;
							for ( var j = 0; j < alterDatas[index].observationValue.length; j++) {
								var testValueArray = alterDatas[index].observationValue[j];
								var dateString = testValueArray.testDate;
								// only latest 12 test values
								if (testValueIndex < 12
										&& testValueArray.testValue) {
									dateValues.push({
										date : dateString,
										value : testValueArray.testValue
									});
									testValueIndex++;
								}
							}
							// alert("final" + $.toJSON(dateValues));
							alterDatas[index].observationValue = dateValues;
						}
						callBack(alterDatas, "success");
					}).error(function(hello) {
				alert("error");
			}).complete(function() {

			});

};
