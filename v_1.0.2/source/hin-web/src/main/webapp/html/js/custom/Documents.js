function Documents(renderingEngine) {
	this.eventHandler = eventHandler;
	this.loadTimeLine = loadTimeLine;
	this.className = "Documents";
	this.loadUI = loadUI;
	var currentYear = "";
	var currentMonth = "";
	var currentType = "";
	this.fetchDocumentMessage = fetchDocumentMessage;
	this.downloadUploadedDocuments = downloadUploadedDocuments;
	var renderingEngine = renderingEngine;
	var documents = this;
	var colorArray = new Array();

	/* Function definitions */

	function eventHandler(event) {
		if (event.type == AppConstants.Event.DOCUMENTS_PAGE_BIND_EVENTS) {
			
		}else if(event.type == AppConstants.Event.DOCUMENTS_FETCH_MESSAGE_ID_RESPONSE){
			fillDocumentsDetails(event.data.result);
			$('#yearLeft').unbind("click");
			$('#yearLeft').bind("click", function() {
				var startYear = Number(currentYear) - 1;
				loadTimeLine(startYear);
				currentYear = startYear;
				fetchDocumentMessageForAllMonths();
			});
			$('#yearRight').unbind("click");
			$('#yearRight').bind("click", function() {
				var startYear = Number(currentYear) + 1;
				loadTimeLine(startYear);
				currentYear = startYear;
				fetchDocumentMessageForAllMonths();
			});
			
			$('.ui-documents-month').unbind("click");
			$('.ui-documents-month').bind("click", function() {
				currentMonth = $(this).find('.ui-timeline-month').attr('id');
				fetchDocumentMessage();
			});
			
			$('#startYear').unbind("click");
			$('#startYear').bind("click", function() {
				currentMonth = "";
				var startYear = parseInt($('#startYear').html());
				fetchDocumentMessageForAllMonths();
			});
			
		}

	}
	;

	function loadUI() {
		$("#left-side").addClass("document-home-bg").removeClass("patient-home-bg");
		currentYear = new Date().getFullYear();
		currentMonth = "";
		currentType = "";
		loadLegends(currentYear);
		loadTimeLine(currentYear);
		fetchDocumentMessageForAllMonths();
	}
	;
	
	function fetchDocumentMessage(){
		var documentsVO = new HIN.DocumentsVO();
		documentsVO.patientId = renderingEngine.getComponent("Context").getPatientVO().subscriberId;
		documentsVO.documentFromDate = new Date(currentYear, currentMonth, 1).getTime();
		documentsVO.documentToDate = new Date(currentYear, Number(currentMonth)+1, 0, 23, 59, 59).getTime();
		documentsVO.documentType = currentType;
		renderingEngine.getEventQueue().postEvent(
				AppConstants.Event.DOCUMENTS_FETCH_MESSAGE_ID_REQUEST, {
					documentsVO : documentsVO
				}, renderingEngine, documents);
	}
	function fetchDocumentMessageForAllMonths(){
		var documentsVO = new HIN.DocumentsVO();
		documentsVO.patientId = renderingEngine.getComponent("Context").getPatientVO().subscriberId;
		documentsVO.documentFromDate = new Date(currentYear, 0, 1).getTime();
		documentsVO.documentToDate = new Date(currentYear, 12, 0, 23, 59, 59).getTime();
		documentsVO.documentType = currentType;
		renderingEngine.getEventQueue().postEvent(
				AppConstants.Event.DOCUMENTS_FETCH_MESSAGE_ID_REQUEST, {
					documentsVO : documentsVO
				}, renderingEngine, documents);
	}
	function loadLegends(startYear){
		appController.getComponent("DataLayer").documentsLegend(startYear, function(data){
			$.each(data, function(index, legendValue) {
				$('.legend-labels').append('<li id="legend'+index+'"><div class="legend-labels-data">'+legendValue+'</div><span class="ui-'+legendValue+'-color"></span></li>');
				$("#legend"+index).unbind("click");
				$("#legend"+index).bind("click", function() {
					currentType = legendValue;
					if(currentMonth == ""){
						fetchDocumentMessageForAllMonths();
					}else{
						fetchDocumentMessage();
					}
				});
			});
		});
	}
	function loadTimeLine(startYear){
		var patientId = renderingEngine.getComponent("Context").getPatientVO().subscriberId;
		appController.getComponent("DataLayer").documentsTimeLine(startYear, patientId, function(data){
			$('#mainDocuments').find('#startYear').html(startYear);
			var monthArray = new Array();
			$('.ui-timeline-month').empty();
			$.each(data, function(key, value) {
				$.each(value, function(index, timeLineValue) {
					$('#'+key).append('<div class="ui-'+timeLineValue+'-color ui-document-timeline"></div>');
				});
			});
			
		});
	}
	
	function fillDocumentsDetails(result){
		$('#documentRow').nextAll('div').remove();
		$.each(result, function(key, documentVO) {
			var documentRow = $('#documentsRowDetailsValue').find("#documentRow").clone();
			if(Number(key)%2==0){
				$(documentRow).removeClass("ui-grid-row2-bgcolor").addClass('ui-grid-row1-bgcolor');
			}else {
				$(documentRow).removeClass("ui-grid-row1-bgcolor").addClass('ui-grid-row2-bgcolor');
			}
			$(documentRow).attr("id", 'documentRow' + key);
			$(documentRow).css("display","block");
			$(documentRow).append('<div class="ui-'+documentVO.documentType+'-color ui-type-dec">&nbsp;</div>');
			$(documentRow).append('<div class="ui-dmt-block-a ui-dmt-border">'+documentVO.documentDate+'</div>');
			$(documentRow).append('<div class="ui-dmt-block-b ui-dmt-border">'+documentVO.documentName+'</div>');
			$(documentRow).append('<div class="ui-dmt-block-c ui-dmt-border">'+documentVO.documentType+'</div>');
			$(documentRow).append('<div class="ui-dmt-block-d">'+documentVO.documentFileSize+'KB</div>');
			$('#documentRow').after($(documentRow));
			$('#documentRow' + key).unbind("click");
			$('#documentRow' + key).bind("click", function() {
				downloadUploadedDocuments(documentVO.messageId);
			});
		});
	}
	function downloadUploadedDocuments(messageId){
		appController.getComponent("DataLayer").downloadUploadedDocuments(messageId);
	}
}