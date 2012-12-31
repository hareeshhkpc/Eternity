var HIN;
if (!HIN)
	HIN = {};
HIN.HistoryPage = function(appController, pageHolder) {
	historyPage = this;
	this.appController = appController;
	this.processDefinition = null;
	this.messageTypes = [];
	this.selectedStep = null;
	this.pageHolder = "historyPage";
	this.uiInstance = null;
	this.lastOpenPage = null;

};

HIN.HistoryPage.prototype.init = function(callback, page) {
	if (callback) {
		callback(page);
	}
};
HIN.HistoryPage.prototype.pageBeforeLoad = function(messageType, uiGenerator) {
	// alert("HistoryPage pageBeforeLoad : " + uiGenerator);
	uiGenerator.formRender = true;
	uiGenerator.singleForm = true;
	uiGenerator.hideMainHeader();
	uiGenerator.hideAddIcon();
	uiGenerator.hideSubHeader();
	uiGenerator.hideRemoveIcon();

};
HIN.HistoryPage.prototype.addInitialHandler = function(uiGenerator) {
	uiGenerator.formRender = true;
};

HIN.HistoryPage.prototype.addCompleteHandler = function(addNew, messageType,
		message) {
	// alert("addCompleteHandler");
	historyPage.toggleQuestionnairSections();
};
HIN.HistoryPage.prototype.toggleQuestionnairSections=function(){
	
    $('[toggleOption="header"]').each(function() {
            var id = $(this).attr('id');
            var editorType = $(this).attr("editorType");
            $('#' + id).unbind("click", toggleChildSection);
            $('#' + id).bind("click", toggleChildSection);
    });

    function toggleChildSection() {
       
    	var currentPage = $(this).attr('id');
    	 var page = appController.getComponent("RenderingEngine").getChildComponent("Form").getPage();
    	 
    	if(historyPage.lastOpenPage == null){
    		historyPage.lastOpenPage = currentPage;
			$('#' + currentPage + '_child').slideToggle('slow', function() {
				page.pageResized();
			});
		}else{
			if(historyPage.lastOpenPage==currentPage){
				$('#' + historyPage.lastOpenPage + '_child').slideToggle('slow', function() {
					page.pageResized();
				});
				historyPage.lastOpenPage = null;
			}else{
				$('#' + historyPage.lastOpenPage + '_child').slideToggle('slow', function() {
					page.pageResized();
				});
				$('#' + currentPage + '_child').slideToggle('slow', function() {
					page.pageResized();
				});
				historyPage.lastOpenPage = currentPage;
			}
			
		}
    	
    	
    }

}

HIN.HistoryPage.prototype.removeCompleteHandler = function(messageTypeName,
		message) {
	// alert("removeCompleteHandler");
};

HIN.HistoryPage.prototype.lookupSelectionHandler = function(instance,
		conceptLookup) {
	// alert("lookupSelectionHandler");
};

HIN.HistoryPage.prototype.taskHandler = function(message, taskVO, instance) {
	// alert("taskHandler");
/*	historyPage.uiInstance = instance;
	historyPage.saveProcess();*/
	var processObjects = [ historyPage.processDefinition ];
	instance.processTask(processObjects);

};