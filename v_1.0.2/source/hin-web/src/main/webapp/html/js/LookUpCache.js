function LookUpCache(appController, dataLayer) {
	var lookUpCache = this;
	this.className = "LookUpCache";
	this.appController = appController;
	this.dataLayer = dataLayer;
	function cacheLookUpData(callback) {
		getDataFromServer(callback);
	}
	this.cacheLookUpData = cacheLookUpData;
	function getDataFromServer(callback) {
		dataLayer.serviceLayer.loadLookUpDataInToCache(putDataToLocalCache,callback);
	}
	;

	function putDataToLocalCache(lookUpData,callback) {
		if (lookUpData) {
			$.each(lookUpData, function(index, value) {
				HL.saveLookUpData(index, value);
			});
		}
		if(callback){
			callback();
		}
	}
	;

	function loadAllConceptServices(conceptClassName, callBack, instance) {
		  HL.getLookUpData(conceptClassName,
				function(data) {
					if (data) {
						appController.getComponent("RenderingEngine")
								.hidePageLoading();
						appController.getComponent("RenderingEngine")
								.closeModalDialog();
						var allConceptServiceLookup = new HIN.ConceptLookup(
								data);
						callBack(allConceptServiceLookup, instance);
					} else {
						var serviceLayer = appController
								.getComponent("DataLayer").serviceLayer;
						serviceLayer.loadAllConceptServices(conceptClassName,
								callBack, instance);
					}
				});
		 
	}
	;
	this.loadAllConceptServices = loadAllConceptServices;

	function putLoginInfoToLocalCache(userLoginInfo) {
		HL.saveLookUpData("loginInfo", userLoginInfo);
	}
	;
	this.putLoginInfoToLocalCache = putLoginInfoToLocalCache;

	function getLoginInfo(index, callBack) {
		HL.getLookUpData(index, function(data) {
			appController.getComponent("RenderingEngine").hidePageLoading();
			appController.getComponent("RenderingEngine").closeModalDialog();
			callBack(data);
		});
	}
	this.getLoginInfo = getLoginInfo;

	function removeLoginInfo(index) {
		HL.removeLookUpData(index);
	}
	;
	this.removeLoginInfo = removeLoginInfo;

	function searchServices(conceptClassName, callBack) {
		HL.getLookUpData(conceptClassName,
				function(data) {
					if (data) {
						appController.getComponent("RenderingEngine")
								.hidePageLoading();
						appController.getComponent("RenderingEngine")
								.closeModalDialog();
						var allConceptServiceLookup = new HIN.ConceptLookup(
								data);
						callBack(allConceptServiceLookup);
					} else {
						appController.getComponent("ServiceLayer")
								.searchServices(conceptClassName, callBack);
					}
				});
	}
	;
	this.searchServices = searchServices;
}