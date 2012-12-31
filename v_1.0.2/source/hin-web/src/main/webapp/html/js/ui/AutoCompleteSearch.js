var HIN;
if (!HIN)
	HIN = {};
HIN.AutoCompleteSearch = function() {
	autoCompleteSearch = this;
};
HIN.AutoCompleteSearch.prototype.showListElement = function(key, value) {
	var htmlEliment = "<li id='list_"
			+ key
			+ "' data-icon='arrow-r' data-iconpos='right'"
			+ " class='ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-d ui-btn-corner-all'>"
			+ "<div class='ui-btn-inner ui-li'>" + "<div class='ui-btn-text' style='padding:5px;'>"
			+ "<a href='#' style='display:table-row' class='ui-link-inherit'>" + value.name + "</a>"
			+ "</div>" + "</div>" + "</li>";
	return htmlEliment;
};
HIN.AutoCompleteSearch.prototype.notificationTemplate = function(targetId,
		result) {
	if (result == null || result.length == 0) {
		targetId
				.append("<div class='ui-btn-inner ui-corner-bottom ui-btn-up-d'><div class='ui-btn-text'>Result not found.</div></div>");
	}
};

HIN.AutoCompleteSearch.prototype.search = function(searchId, targetId,
		searchVO, callback) {
	/****
	 var targetId = "targetId";
	 if(! $('#'+targetId).attr("id")){
	 $('#'+searchId).after("<ul id='targetId' style='width: 30%;position: absolute; z-index: 1000;' data-inset='true' data-role='listview' class='ui-listview ui-listview-inset ui-corner-all ui-shadow'></ul>");
	 }
	 */
		/*searchId.unbind("click", clickHandlor);
		searchId.bind("click", clickHandlor);
		function clickHandlor() {*/
			var conditionMap = new HIN.HashMap();
			/*conditionMap.put("firstName", searchVO.value + "*");
			conditionMap.put("givenName", searchVO.value + "*");
			conditionMap.put("familyName", searchVO.value + "*");
			conditionMap.put("Role", searchVO.role);*/
			var query="+(Role:"+searchVO.role+")";
			if(!appController.getComponent("Context").getUserVo().havePrivilege("adminstration") || appController.getComponent("Context").selectedOrganizationVO.subscriberId !="HINORG"){
				query=query+" +(organizationId:"+appController.getComponent("Context").selectedOrganizationVO.subscriberId+")";
			}
			if(searchVO.value) {
				query=query+"+(firstName:"+searchVO.value+"* givenName:"+searchVO.value+"*  familyName:"+searchVO.value+"*)";
			}
			searchVO.queryString=query;
			targetId.hide();
			searchVO.max = 10;
			appController.getComponent("DataLayer").search(searchVO,
					conditionMap, fillAutoComplete);
		//};
		/****
		searchId.keyup( function(e) {

			var searchValue = searchId.val();
			searchVO.value = searchValue.replace(/^\s+|\s+$/g, "");
			var conditionMap = new HIN.HashMap();

			conditionMap.put("firstName", searchVO.value + "*");
			conditionMap.put("givenName", searchVO.value + "*");
			conditionMap.put("familyName", searchVO.value + "*");
			conditionMap.put("Role", searchVO.role);

			if (e.keyCode == 32 || searchVO.value.length >= searchVO.min) {
				//targetId.removeClass('scrollable-content');
				targetId.hide();
				searchVO.max = 10;
				appController.getComponent("DataLayer").search(searchVO,
						conditionMap, fillAutoComplete);
			} else if (searchVO.value.length <= 0) {
				targetId.html("");
				// targetId.removeClass('scrollable-content');
				targetId.hide();
			}
		});
	*/
	function fillAutoComplete(data) {
		targetId.show();
		// targetId.addClass('scrollable-content');
		targetId.html("");
		$.each(data, function(key, value) {
			searchTemplate(key, value);
		});
		autoCompleteSearch.notificationTemplate(targetId, data);
	}
	;
	function searchTemplate(key, value) {
		//pPhysician
		if(key==0 && targetId.attr("id") !='pPhysicianSuggestions'){
			var all = {"name":"All Physicians"};
			var patientListTemplate = autoCompleteSearch
			.showListElement(key, all);
			targetId.append(patientListTemplate);
			$("#list_" + key).click( function() {
				var physicianVO = new HIN.PhysicianVO();
				physicianVO.name = all.name;
				physicianVO.physicianId = ""; 
				callback(physicianVO);
			});
		}
		key++;
		var patientListTemplate = autoCompleteSearch
				.showListElement(key, value);
		targetId.append(patientListTemplate);
		$("#list_" + key).click( function() {
			targetId.html('');
			// targetId.removeClass('scrollable-content');
				var physicianVO = new HIN.PhysicianVO();
				// physicianVO = value;
				physicianVO.name = value.name;
				physicianVO.physicianId = value.subscriberId;
				physicianVO.prefixName = value.prefixName;
				physicianVO.givenName = value.givenName;
				physicianVO.familyName = value.familyName;
				physicianVO.suffixName = value.suffixName;
				physicianVO.getFullName = value.getFullName;
				callback(physicianVO);

				// callback(profileVO);
			});
	}
	;
	function notificationTemplate(targetId, result) {
		if (result.length == 0) {
			targetId
					.append("<div class='ui-btn-inner ui-corner-bottom ui-btn-up-d'><div class='ui-btn-text'>Result not found.</div></div>");
		}
	}
	;
	function allTemplate(targetId, result) {
		if (result.length == 0) {
			targetId
					.append("<div class='ui-btn-inner ui-corner-bottom ui-btn-up-d'><div class='ui-btn-text'>All</div></div>");
		}
	}
	;
};
HIN.AutoCompleteSearch.prototype.searchServices = function(searchId, targetId,
		callback) {
	searchId.keyup( function() {
		var searchValue = searchId.val();
		var searchStr = searchValue.replace(/^\s+|\s+$/g, "");
		var searchVO = new HIN.SearchVO();

		if (searchStr.length >= 3) {
			targetId.hide();
			// targetId.removeClass('scrollable-content');
			appController.getComponent("DataLayer").searchServices(searchStr,
					serviceLookupClickHandler);
		} else if (searchStr.length <= 0) {
			targetId.html("");
			targetId.hide();
			// targetId.removeClass('scrollable-content');
		}
	});

	function serviceLookupClickHandler(data) {
		targetId.show();
		// targetId.addClass('scrollable-content');
		targetId.html("");
		$.each(data, function(key, value) {
			//TODO
				searchTemplate(key, value);
			});
		autoCompleteSearch.notificationTemplate(targetId, data);
	}
	;
	function searchTemplate(key, value) {
		var patientListTemplate = autoCompleteSearch
				.showListElement(key, value);
		targetId.append(patientListTemplate);
		$("#list_" + key).click( function() {
			targetId.html('');
			// targetId.removeClass('scrollable-content');
				callback( {
					"label" : value.name,
					"value" : value.subscriberId
				});
			});
	}
	;
};
HIN.AutoCompleteSearch.prototype.searchLookup = function(searchId, className,
		callback) {
	var targetId = $("#suggestions");
	searchId.keyup( function(e) {
		var searchValue = searchId.val();
		text = searchValue.replace(/^\s+|\s+$/g, "");
		// targetId.removeClass('scrollable-content');
			targetId.hide();
			loadLookupData(className, function(source) {
				var data = null;
				if (e.keyCode == 32) {
					data = source.sort( function(element) {
						var element_text, re = new RegExp('^' + text, 'i');
						if ($.isPlainObject(element)) {
							element_text = element.label;
						} else {
							element_text = element;
						}
						return re.test(element_text);
					});
				} else if (text.length >= 3) {
					data = source.sort().filter( function(element) {
						var element_text, re = new RegExp('^' + text, 'i');
						if ($.isPlainObject(element)) {
							element_text = element.label;
						} else {
							element_text = element;
						}
						return re.test(element_text);
					});
				} else if (text.length <= 0) {
					targetId.html("");
					targetId.hide();
					// targetId.removeClass('scrollable-content');
				}
				getLookupHandler(data);
			});
		});
	function getLookupHandler(data) {
		if (data) {
			targetId.show();
			// targetId.addClass('scrollable-content');
			targetId.html("");
			$.each(data, function(key, value) {
				searchTemplate(key, value);
			});
		}
		autoCompleteSearch.notificationTemplate(targetId, data);
	}
	;
	function searchTemplate(key, value) {
		var element_obj = null;
		var element_callBack = null;
		if ($.isPlainObject(value)) {
			element_obj = {
				name : value.label
			};
			element_callBack = value.value;
		} else {
			element_obj = {
				name : value
			};
			element_callBack = value;
		}
		var patientListTemplate = autoCompleteSearch.showListElement(key,
				element_obj);
		targetId.append(patientListTemplate);
		$("#list_" + key).click( function() {
			targetId.html('');
			// targetId.removeClass('scrollable-content');
				searchId.val(element_obj.name);
				callback(element_callBack);
			});
	}
	;
	function loadLookupData(className, callBackArray) {
		HL.getStaticContent(AppConstants.Autocomplete.LOOKUP_KEY, callback,
				failback, true, 2);
		function callback(data) {
			if (data) {
				convertArray(data, callBackData);
			} else {
				loadData(callbackWithData, failback);
			}
		}
		;
		function callbackWithData(data) {
			convertArray(data, callBackData);
		}
		;
		function failback() {
			alert("ERROR : Failed when fetch the lookup data.");
		}
		;
		function callBackData(data) {
			callBackArray(data);
		}
		;
	}
	;
	function convertArray(xmlNode, callBackData) {
		var array = new Array();
		var xPath = AppConstants.Autocomplete.XPATH + "'" + className + "']";
		var node = XmlUtil.getXPathResult(xmlNode, xPath, XPathResult.ANY_TYPE);
		var result = node.iterateNext();
		while (result) {
			array.push( {
				label : XmlUtil.attr(result, AppConstants.Autocomplete.LABEL),
				value : XmlUtil.attr(result, AppConstants.Autocomplete.VALUE)
			});
			result = node.iterateNext();
		}
		callBackData(array);
	}
	;
	function loadData(callback, failback) {
		try {
			var xmlNode = XmlUtil
					.loadXml("../resources/lookups/lookupData.xml");
			HL.putStaticContent(AppConstants.Autocomplete.LOOKUP_KEY, xmlNode,
					callback, failback);
			function callback(data) {
				callback(data);
			}
			function failback(data) {
				failback(data);
			}
		} catch (e) {
			alert("Error : When load the Lookup Data :" + e);
		}
	}
	;
};
