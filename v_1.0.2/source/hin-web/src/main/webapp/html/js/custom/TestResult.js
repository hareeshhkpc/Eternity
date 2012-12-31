function TestResult(renderingEngine) {

	this.eventHandler = eventHandler;
	this.className = "TestResult";

	this.loadUI = loadUI;

	var testResult = this;
	var appController = appController;

	function eventHandler(event) {

	}
	;

	function loadUI() {
		var searchVO = new HIN.SearchVO();
		searchVO.type = AppConstants.SearchType.ARCHIVE_SEARCH;
		renderingEngine.getComponent("Context").setSearchVO(searchVO);
		renderingEngine.loadPage("pages/testresult/archivesearch.html", "search",
				AppConstants.Event.ARCHIVE_SEARCH_PAGE_BIND_EVENTS);
		renderingEngine.setLeftHeaderInfo("");

	}
	;

}