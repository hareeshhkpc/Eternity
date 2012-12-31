var reportRenderer = null;
function loadConsultationPage(indiactorID, coordinates, score_Array) {
	reportRenderer = new ReportRenderer($());
	var indicatorContainer = createIndicatorContainer();
	var svgdoc = XmlUtil.stringToXml(indicatorContainer);
	reportRenderer.setSVGDoc(svgdoc);

	var svgContent = reportRenderer.createIndicatorConsultationPageEditable(score_Array, coordinates);
	
	//var svgContent = XmlUtil.xmlToString(svgdoc);
	//reportRenderer.appendSVG();
	$('#' + indiactorID).html(XmlUtil.xmlToString(svgContent));
}

function createIndicatorContainer() {
	var svgContainer = '<svg  xmlns="http://www.w3.org/2000/svg" width="800" height="100">';
	svgContainer += '</svg>';
	return svgContainer;
}

