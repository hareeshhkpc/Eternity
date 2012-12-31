
function Header(calendar, options) {
	var t = this;
	
	
	// exports
	t.render = render;
	t.destroy = destroy;
	t.updateTitle = updateTitle;
	t.activateButton = activateButton;
	t.deactivateButton = deactivateButton;
	t.disableButton = disableButton;
	t.enableButton = enableButton;
	t.enableDisableButton = enableDisableButton;
	t.selectPhysician = selectPhysician;
	t.updatePhysician = updatePhysician;
	t.physicianAlart = physicianAlart;
	t.updateTodayTitle = updateTodayTitle;
	t.activeId = 0;
	// locals
	var element = $([]);
	var tm;
	//var activeId = 0;
	var onSelectPhysician = calendar.onSelectPhysician;


	function render() {		
		if(options.defaultView == 'month') {
			var physicianVO = new HIN.PhysicianVO();
			physicianVO.name = "All Physicians";
			physicianVO.physicianId = "";
			appController.getComponent("Context").setPhysicianVO(physicianVO);
		}
		tm = options.theme ? 'ui' : 'fc';
		var sections = options.header;
		if (sections) {
			element = $("<table class='fc-header' style='width:100%'/>")
				.append(
					$("<tr/>")
						.append(renderSection('left'))
						.append(renderSection('center'))
						.append(renderSection('right'))
				);
			return element;
		}		
	}
	
	
	function destroy() {
		element.remove();
	}
	
	
	function renderSection(position) {
		var e = $("<td class='fc-header-" + position + "'/>");
		var buttonStr = options.header[position];
		if (buttonStr) {
			$.each(buttonStr.split(' '), function(i) {
				if (i > 0) {
					e.append("<span class='fc-header-space'/>");
				}
				var prevButton;
				$.each(this.split(','), function(j, buttonName) {
					//alert(buttonName+" >>> :"+fcViews[buttonName]);
					if (buttonName == 'title') {
						e.append("<span class='fc-header-title'>&nbsp;</span>");						
						if (prevButton) {
							prevButton.addClass(tm + '-corner-right');
						}
						prevButton = null;
					}else{
						var buttonClick;
						if (calendar[buttonName]) {
							buttonClick = calendar[buttonName]; // calendar method
						}
						else if (fcViews[buttonName]) {
							buttonClick = function() {
								button.removeClass(tm + '-state-hover'); // forget why
								calendar.changeView(buttonName);
							};
						}
						if (buttonClick) {
							var icon = options.theme ? smartProperty(options.buttonIcons, buttonName) : null; // why are we using smartProperty here?
							var text = smartProperty(options.buttonText, buttonName); // why are we using smartProperty here?
							var button = $(
								"<span class='fc-button fc-button-" + buttonName + " " + tm + "-state-default'>" +
									"<span class='fc-button-inner'>" +
										"<span class='fc-button-content'>" +
											(icon ?
												"<span class='fc-icon-wrap'>" +
													"<span class='ui-icon ui-icon-" + icon + "'/>" +
												"</span>" :
												text
												) +
										"</span>" +
										"<span class='fc-button-effect'><span></span></span>" +
									"</span>" +
								"</span>"
							);
							if (button) {
								button
									.click(function() {
										if (!button.hasClass(tm + '-state-disabled')) {
											buttonClick();
										}
									})
									.mousedown(function() {
										button
											.not('.' + tm + '-state-active')
											.not('.' + tm + '-state-disabled')
											.addClass(tm + '-state-down');
									})
									.mouseup(function() {
										button.removeClass(tm + '-state-down');
									})
									.hover(
										function() {
											button
												.not('.' + tm + '-state-active')
												.not('.' + tm + '-state-disabled')
												.addClass(tm + '-state-hover');
										},
										function() {
											button
												.removeClass(tm + '-state-hover')
												.removeClass(tm + '-state-down');
										}
									)
									.appendTo(e);
								if (!prevButton) {
									button.addClass(tm + '-corner-left');
								}
								prevButton = button;
							}
						}
					}
				});
				if (prevButton) {
					prevButton.addClass(tm + '-corner-right');
				}
			});
		}
		return e;
	}
	
	
	function updateTitle(html) {
		element.find('.fc-header-title')
			.html(html);
	}
	function updatePhysician(html) {
		element.find('.fc-button-physician').find('.fc-button-content')
			.html(html);
	}
	function updateTodayTitle(html) {
		element.find('.fc-button-today').find('.fc-button-content')
			.html(html);
	}
	
	
	function activateButton(buttonName) {
		element.find('span.fc-button-' + buttonName)
			.addClass(tm + '-state-active');
	}
	
	
	function deactivateButton(buttonName) {
		element.find('span.fc-button-' + buttonName)
			.removeClass(tm + '-state-active');
	}
	
	
	function disableButton(buttonName) {
		element.find('span.fc-button-' + buttonName)
			.addClass(tm + '-state-disabled');
	}
	
	
	function enableButton(buttonName) {
		element.find('span.fc-button-' + buttonName)
			.removeClass(tm + '-state-disabled');
	}
	function enableDisableButton(buttonName){
		if(t.activeId==1){
			deactivateButton(buttonName);	
			t.activeId = 0;
		}else{
			activateButton(buttonName);
			t.activeId = 1;
		}
	}
	function selectPhysician(){
		var selectEl = element.find('.fc-button-physician');
		var phyListelement = element.find('.fc-header-center');	
		var position = selectEl.position();
		if(phyListelement.find('#phyList').html()==null){
			phyListelement.append('<span class="fc-header-physician"><ul id="phyList" class="physician-list" style="top:'+position.top+'px;"></ul></span>');
		}
		var phyList = $('#phyList');
		var searchVO = new HIN.SearchVO();
		searchVO.type=AppConstants.SearchType.PHYSICIAN_PROFILE_SEARCH;
		searchVO.serverURI = "/hin-web/rest/search/entitySearchWithCondtion";
		searchVO.role = "doctor";
		searchVO.messageType = AppConstants.XPaths.Registrtion.MESSAGE_TYPE;//"PRPA_MT201000HT03";
		new HIN.AutoCompleteSearch().search(selectEl, phyList, searchVO, showSelectedValue);
		element.click(function(){phyList.hide();});
		function showSelectedValue(data){
			var physicianVO = new HIN.PhysicianVO();
			physicianVO = data;
			updatePhysician(physicianVO.name);
			phyListelement.find('#blockAlertId').remove();
			appController.getComponent("Context").setConsultant(physicianVO.physicianId);
			appController.getComponent("Context").setPhysicianVO(physicianVO);
			onSelectPhysician();
		}
	}
	function physicianAlart(message){
		var phyListelement = element.find('.fc-header-center');
		var selectEl = element.find('.fc-button-physician');
		var position = selectEl.position();
		var bgStyle = "background-color:red";
		var top = (position.top-40),left=(position.left-100),cssArrow="";
		var blockDiv = element.find('#blockAlertId');
		if(blockDiv.html()==null)
			blockDiv = $("<div id='blockAlertId'></div>");
		var	blockCommentPosition = $('<div class="parentFormdemographicsForm formComment" style="position:absolute;z-index:100;top: '
					+ top
					+ 'px; left: '
					+ left
					+ 'px; margin-top: 0px;opacity:1;"> <div class="alertComment">'+message+"</div>"
					+ '<div id="downArroy" class="alertArrow" style="'
					+ cssArrow + '"> </div>' + '</div>');
			var commentHtml = "";
			var i=0;
			for (i = 10; i > 0; i--) {
				commentHtml += '<div class="line' + i + '" style="' + bgStyle
						+ '"></div>';
			}
			blockCommentPosition.find('#downArroy').append(commentHtml);
			blockDiv.bind("click",removeAlert);
			blockDiv.append(blockCommentPosition);
			phyListelement.append(blockDiv);
			function removeAlert(){
				blockCommentPosition.remove();
			}
	}
	


}
