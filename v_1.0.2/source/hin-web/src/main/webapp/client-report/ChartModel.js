var HIN;
if (!HIN)
	HIN = {};
HIN.ChartModel = function() {
	chartModel = this;
	this.observationVOs = null;
};

HIN.ChartModel.prototype.getChart = function(series, titleArray, callBackData) {
	var seriesList = [ {
		data : [ 0 ],
		color : [ "orange" ],
		title : [ "Weight" ],
		range : [ "0", "40" ]
	} ];
	var chartdata = new HIN.ChartVO();
	chartdata.chartSeries = series;
	chartdata.testData = seriesList;
	chartdata.titleArray = titleArray;
	chartdata.patientId = '1234';
	chartdata.testDate = new Date();
	chartdata.testType = "Testosterone";
	chartdata.ymin = 70;
	chartdata.ymax = 170;
	var json = $.toJSON(chartdata);
	// alert("josn" + json);

	chartModel.loadPathData(json, series, titleArray, function(node) {
		if (callBackData) {
			callBackData(node);
		}

	});
};

HIN.ChartModel.prototype.loadPathData = function(json, series, titleArray,
		callBack) {
	var alterData = null;
	var jqxhr = $.post("/hin-web/rest/chart/chartSvgController", {
		json : json
	}, function(data) {
		/* alert("data" + $.toJSON(data)); */
		alterData = data;
	}).success(function() {
		if (callBack) {
			callBack(alterData);
		}
	}).error(function() {
		/* alert("error in loading chart" + $.toJSON(titleArray)); */
	}).complete(function() {

	});

};
HIN.ChartModel.prototype.getXAxisData = function(messageType, testName) {
	var temp = 0;
	for ( var index = 0; index < this.observationVOs.length; index++) {
		var valueArray = new Array();
		var observationVO = this.observationVOs[index];
		if (observationVO.messageType == messageType
				&& observationVO.testName == testName) {
			if (observationVO.observationValue.length > 0) {
				for (i in observationVO.observationValue) {
					valueArray.push(observationVO.observationValue[i].date);
				}
				/* alert("dateArray" + valueArray); */
				return valueArray;
			} else {
				return [];
			}
		}
	}
}

HIN.ChartModel.prototype.getChartData = function(messageType, testName) {
	var temp = 0;
	// alert("data" + $.toJSON(thisObject.observationVOs));
	for ( var index = 0; index < this.observationVOs.length; index++) {
		var valueArray = new Array();
		var observationVO = this.observationVOs[index];
		if (observationVO.messageType == messageType
				&& observationVO.testName == testName) {
			if (observationVO.observationValue.length > 0) {
				for (i in observationVO.observationValue) {
					valueArray.push(observationVO.observationValue[i].value);

				}
				$.each(valueArray, function(key, value) {
					if (!value) {
						valueArray[key] = 0;
					}
				});
				/* alert("valueArray" + valueArray); */
				return valueArray;
			} else {
				return [ 0 ];
			}
		}
	}
}
HIN.ChartModel.prototype.checkForGrayedOut = function(messageType, testName) {
	// alert("testName" + testName);
	for ( var index = 0; index < this.observationVOs.length; index++) {
		// alert("data" + $.toJSON(thisObject.observationVOs));
		var valueArray = new Array();
		var observationVO = this.observationVOs[index];
		if (observationVO.messageType == messageType
				&& observationVO.testName == testName) {
			if (!observationVO.observationValue.length > 0) {
				return [ "#a7a9ac" ];
			}
		}

	}
};
