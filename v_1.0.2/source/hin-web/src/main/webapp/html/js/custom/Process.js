/**
 * Process is a child component of Rendering Engine which displays the process
 * page to user as per the process definition and sends same information to
 * rendering engine for further processing.
 */

function Process(renderingEngine) {

	/**
	 * Handles the events from components
	 * 
	 * @param event
	 */
	this.eventHandler = eventHandler;
	this.className = "Process";

	this.loadUI = loadUI;
	this.loadProcess = loadProcess;
	this.updateProcess = updateProcess;

	var renderingEngine = renderingEngine;
	var process = this;

	/** processDefinition holds the current selected process definition. */
	this.processDefinition = null;
	/** steps holds the steps of current selected process definition. */
	this.steps = [];
	/** processDivisions holds the divisions based on the steps */
	this.processDivisions = [];
	this.processDivisionSelected = null;
	/** right holds the ui right position value */
	this.right = 0;
	/** left holds the ui left position value */
	this.left = 0;
	/** innerHeight holds the ui innerHeight value */
	this.innerHeight = "auto";
	/** outerHeight holds the ui outerHeight value */
	this.outerHeight = "auto";

	/**
	 * iframe holds true or false value, based on that UI will be decided to
	 * render using iframe or not .
	 */
	this.iframe = false;

	this.getProcessDefinition = getProcessDefinition;
	this.setProcessDefinition = setProcessDefinition;

	this.getProcessName = getProcessName;
	this.setProcessName = setProcessName;
	/* this.definition = new HIN.ProcessDefinition(); */
	this.processName = null;
	this.type = null;
	this.processId = null;

	this.getProcessId = getProcessId;
	this.setProcessId = setProcessId;

	/** collapsed holds true or false value, based on that UI will be rendered. */
	this.collapsed = false;
	this.slideDelay = 0;
	this.prevSelectedNavigationId = null;
	this.prevSelectedGroupName = null;

	// this.stepsMap = new HIN.HashMap();
	this.groupNameMap = new HIN.HashMap();
	/* Function definitions */
	this.loadProcess = loadProcess;
	this.lastSelectedEvent = null;

	this.toggleStepPage = toggleStepPage;
	this.slideBackToProcessForm = slideBackToProcessForm;
	this.slideInitializeForm = slideInitializeForm;
	this.initializeForm = initializeForm;
	this.backToProcessForm = backToProcessForm;
	this.slideRight = slideRight;
	this.slideLeft = slideLeft;
	this.updateContext = updateContext;
	this.mCustomScrollbars = mCustomScrollbars;
	this.updateProcessView = updateProcessView;

	function eventHandler(event) {
		// alert("inside workflow event handler: " + event.type);
		if (event.type == AppConstants.Event.PROCESS_PAGE_LOAD_EVENT) {
			this.processName = event.data.processName;
			this.type = event.data.type;
			this.processId = event.data.processId;
			$('#left-side').removeClass('patient-home-bg');
			$('#left-side').removeClass('licensee-home-bg');
			$('#left-side').addClass('left-side-bg');
			renderingEngine.iconChange();
			// alert(this.processName);
			if (this.processName == "PatientRegistration") {
				renderingEngine.getComponent("Context").setRegistrationType(
						AppConstants.RegistrationType.PATIENT_REGISTRATION);
				renderingEngine.getComponent("Context").setPatient(null);
				renderingEngine.getComponent("Context").setStaff(null);
				renderingEngine.getComponent("Context").setOrganization(null);
			} else if (this.processName == "StaffRegistration") {
				renderingEngine.getComponent("Context").setRegistrationType(
						AppConstants.RegistrationType.STAFF_REGISTRATION);
				renderingEngine.getComponent("Context").setPatient(null);
				renderingEngine.getComponent("Context").setStaff(null);
				renderingEngine.getComponent("Context").setOrganization(null);
			} else if (this.processName == "LicenseeRegistration") {
				/*
				 * alert("process.js PROCESS_PAGE_LOAD_EVENT" +
				 * event.data.processName);
				 */
				renderingEngine.getComponent("Context").setRegistrationType(
						AppConstants.RegistrationType.LICENSEE_REGISTRATION);
				renderingEngine.getComponent("Context").setPatient(null);
				renderingEngine.getComponent("Context").setStaff(null);
			} else if (this.processName == "SignUp") {
				/*
				 * alert("process.js PROCESS_PAGE_LOAD_EVENT" +
				 * event.data.processName);
				 */
				renderingEngine.getComponent("Context").setRegistrationType(
						AppConstants.RegistrationType.SIGN_UP);
				renderingEngine.getComponent("Context").setPatient(null);
				renderingEngine.getComponent("Context").setStaff(null);
				renderingEngine.getComponent("Context").setOrganization(null);
			}
			loadUI();
		} else if (event.type == AppConstants.Event.PROCESS_PAGE_BIND_EVENT) {
			process.updateContext();
			$('#terminateProcess').unbind("click", terminateProcessHandler);
			$('#terminateProcess').bind("click", terminateProcessHandler);

			$('#main').trigger('create');
		} else if (event.type == AppConstants.Event.PROCESS_PAGE_DEFINITION_FILL_DATA) {
			this.processDefinition = event.data.processDefinition;
			this.loadProcess();

		} else if (event.type == AppConstants.Event.PROCESS_PAGE_RENDER) {
			// alert(event.type);
			this.loadProcess();
		} else if (event.type == AppConstants.Event.PROCESS_PAGE_RESPONSE) {

		} else if (event.type == AppConstants.Event.PROCESS_PAGE_ERROR) {

		}
	}
	;

	function updateContext() {
		var patientId; // =
		// renderingEngine.getComponent("Context").getPatient();
		var patientVO = renderingEngine.getComponent("Context").getPatientVO();
		if (patientVO)
			patientId = patientVO.subscriberId;
		var staffId;// = renderingEngine.getComponent("Context").getStaff();
		var staffVO = renderingEngine.getComponent("Context").getStaffVo();
		if (staffVO)
			staffId = staffVO.subscriberId;

		var organizationId;// renderingEngine.getComponent("Context").getOrganization();

		var selectedOrganizationVO = appController.getComponent("Context")
				.getSelectedOrganizationVO();
		if (selectedOrganizationVO != null) {
			organizationId = selectedOrganizationVO.subscriberId;
		}

		// alert(patientId + " : " + staffId + " : " + organizationId);

		if (patientId) {
			$('#patientHomeIcon').show();
			$('#patientHomeIcon').unbind("click", loadPatientHomeIcon);
			$('#patientHomeIcon').bind("click", loadPatientHomeIcon);
			$('#staffHomeIcon').hide();
			$('#licenseeHomeIcon').hide();
			$("#patientHomeIcon").hover(
					function() {
						$('#patientHomeIcon').removeClass('home-icon-link')
								.addClass('home-icon-link-hover');
					},
					function() {
						$('#patientHomeIcon').removeClass(
								'home-icon-link-hover').addClass(
								'home-icon-link');
					});

		} else if (staffId) {
			$('#staffHomeIcon').show();
			$('#staffHomeIcon').unbind("click", loadStaffHomeIcon);
			$('#staffHomeIcon').bind("click", loadStaffHomeIcon);
			$('#patientHomeIcon').hide();
			$('#licenseeHomeIcon').hide();
			$("#staffHomeIcon").hover(
					function() {
						$('#staffHomeIcon').removeClass('home-icon-link')
								.addClass('home-icon-link-hover');
					},
					function() {
						$('#staffHomeIcon').removeClass('home-icon-link-hover')
								.addClass('home-icon-link');
					});

		} else if (organizationId) {
			$('#licenseeHomeIcon').show();
			$('#licenseeHomeIcon').unbind("click", loadLicenseeHomeIcon);
			$('#licenseeHomeIcon').bind("click", loadLicenseeHomeIcon);
			$('#patientHomeIcon').hide();
			$('#staffHomeIcon').hide();
			$("#licenseeHomeIcon").hover(
					function() {
						$('#licenseeHomeIcon').removeClass('home-icon-link')
								.addClass('home-icon-link-hover');
					},
					function() {
						$('#licenseeHomeIcon').removeClass(
								'home-icon-link-hover').addClass(
								'home-icon-link');
					});

		} else {
			// alert("empty");
		}

	}
	;

	/**
	 * Load the html page and bind the ui events.
	 */
	function loadUI() {

		renderingEngine.loadPage("pages/process/process.html", "form",
				AppConstants.Event.PROCESS_PAGE_BIND_EVENT);

		// $('.left-side-content').css('height', '525px');
		appController.getComponent("RenderingEngine").fireEvent(
				AppConstants.Event.RESIZE);
	}
	;
	function loadPatientHomeIcon() {
		renderingEngine
				.fireEvent(AppConstants.Event.PATIENT_HOME_PAGE_LOAD_EVENT);
		// alert("home clicked");
		/*
		 * var processNavHeight = $(".ui-left-top").css('height');
		 * processNavHeight = parseInt(processNavHeight);
		 */
		// alert("Inside Process:" + processNavHeight);
		/*
		 * renderingEngine.getChildComponent("Resize").setCurrentHeight(
		 * processNavHeight);
		 */
		/*
		 * appController.getComponent("RenderingEngine").fireEvent(
		 * AppConstants.Event.RESIZE);
		 */
	}
	;
	function loadStaffHomeIcon() {
		renderingEngine
				.fireEvent(AppConstants.Event.STAFF_HOME_PAGE_LOAD_EVENT);
		/*
		 * appController.getComponent("RenderingEngine").fireEvent(
		 * AppConstants.Event.RESIZE);
		 */
	}
	;
	function loadLicenseeHomeIcon() {
		renderingEngine
				.fireEvent(AppConstants.Event.LICENSEE_HOME_PAGE_LOAD_EVENT);
		/*
		 * appController.getComponent("RenderingEngine").fireEvent(
		 * AppConstants.Event.RESIZE);
		 */
	}
	;

	/**
	 * Load the process.
	 */
	function loadProcess() {

		process.updateContext();
		process.collapsed = false;
		if (process.processDefinition) {
			var navigationName = "";
			if (process.processDefinition.description) {
				navigationName = process.processDefinition.description;
			} else {
				navigationName = process.processName;
			}
			loadFormNavigationLine(navigationName);
			renderingEngine.getChildComponent("Form").setIframe(process.iframe);
			process.processDivisions.splice(0, process.processDivisions.length);
			process.steps.splice(0, process.steps.length);
			process.prevSelectedNavigationId = null;
			process.processDivisionSelected = null;
			process.updateProcessView();
		} else {
			alert("Process definition is not available");
		}

	}
	;
	/**
	 * Generate or update the process UI
	 */
	function updateProcessView() {

		// if(process.processDefinition.processName==="Accounts" ||
		// process.processDefinition.processName==="Appointments")
		process.processDefinition.updateStatus();

		var steps = process.processDefinition.steps;

		var stepGroup = null;

		process.groupNameMap.clearItems();
		for ( var index = 0; index < steps.length; index++) {
			var groupName = steps[index].groupName;
			if ((process.processDefinition.processName === "Profile")
					&& (groupName === "Roles" || groupName === "Permission")) {
				continue;
			}
			if (steps[index].stepName.indexOf("Hidden_") > -1) {
				continue;
			}

			var map = process.groupNameMap.get(groupName);
			if (!map) {
				stepGroup = new HIN.StepGroup();
				stepGroup.groupName = steps[index].groupName;
				stepGroup.addStep(steps[index]);

				process.groupNameMap.put(groupName, stepGroup);
			} else {
				map.value.addStep(steps[index]);
			}
		}

		var processLeftNavigationHtml = "";
		var processNavigationHtml = "";
		var groupHeight = 0;
		var groupStatusClass = "current";
		var groupNamesArray = [];
		var stepsNameArray = [];
		var selectClass = "";
		var navSelectedClass = "";
		for ( var mapIndex = 0; mapIndex < process.groupNameMap.length(); mapIndex++) {
			var map = process.groupNameMap.getItemAt(mapIndex);
			var groupName = map.key;
			var stepGroup = map.value;
			var subStepsArray = [];
			groupStatusClass = stepGroup.getState();
			/* alert(groupStatusClass); */
			var groupActualHeight = 88 * parseInt(stepGroup.steps.length);
			groupHeight = 0;
			if (groupActualHeight < 88) {
				groupActualHeight = 88;
			}
			for ( var index = 0; index < stepGroup.steps.length; index++) {
				var step = stepGroup.steps[index];
				var height = 24;// 83;
				var actualHeight = 0;
				var messageTypesLength = step.getMessageTypes().length;// 1;
				var perRow = 2;
				var col = 2;
				subStepsArray.push({
					stepName : step.stepName,
					stepStatus : step.state
				});
				if (messageTypesLength > (perRow * col)) {
					perRow = perRow + (messageTypesLength % (perRow * col));
					// alert(perRow);
				}

				var statusClass = step.state;
				for ( var i = 0; i < messageTypesLength; i++) {
					if (i < perRow)
						actualHeight = actualHeight + height;
				}

				if (actualHeight < 88) {
					actualHeight = 88;
				}

				groupHeight += actualHeight;

				/* Process UI Right */
				process.processDivisions.push(step.stepName);
				stepsNameArray.push({
					stepName : step.stepName,
					groupName : step.groupName,
					stepStatus : statusClass,
					groupStatus : groupStatusClass
				})

				var descriptionAlignClass = "";
				if (messageTypesLength == 1) {
					descriptionAlignClass = "align-center";
				}

				/*
				 * var style = "height:auto"; alert("step.messageGroups.length() : " +
				 * step.messageGroups.length());
				 */
				if (step.messageGroups.length() < 7 || !step.stepStatusInfo) {
					style = "height:88px"
				}

				processNavigationHtml += '<div class="ui-box ui-box-align shadow '
						+ statusClass
						+ ' process " style="'
						+ style
						+ '"  id="'
						+ step.stepName
						+ '"   groupName="'
						+ step.groupName
						+ '"    ><div class="ui-box-spacing '
						+ descriptionAlignClass
						+ ' "><span class="ui-box-head">'
						+ step.longDescription
						+ '</span><fieldset class="ui-grid-a ui-box-spacing">';
				// <div class="ui-box ui-box-align current"> <div
				// class="ui-box-spacing">
				var initial = true;
				var style = [];
				style.push("a");
				style.push("b");
				// style.push("c");
				var styleIndex = 0;
				if (messageTypesLength > 1) {
					var splitFloatValue = step.messageGroups.length() / 2;
					var split = parseInt(splitFloatValue);

					if (split < splitFloatValue) {
						split = split + 1;
					}

					if (step.messageGroups.length() < 3)
						split = -1;

					for (i = 0; i < step.messageGroups.length(); i++) {

						if (split == i) {
							// split = 0;
							styleIndex++
							// if (i % perRow == 0 && !initial) {
							processNavigationHtml += '</ul></div>';
						}

						if (i == 0 || split == i) {
							// if (i % perRow == 0 || i == 0) {
							processNavigationHtml += '<div class="ui-block-'
									+ style[styleIndex]
									+ '"><ul class="ui-workflow">';
						}

						var map = step.messageGroups.getItemAt(i);
						// alert(map.key + " : " + map.value);
						if (step.stepStatusInfo) {
							if (map) {
								var label = map.key;
								// label = label.replace(/\s+/g, '`');
								processNavigationHtml += '<li>' + label;

								var object = map.value;

								if (object.count > 1)
									processNavigationHtml += ' [ '
											+ object.count + ' ]';
								/*
								 * processNavigationHtml += ' Finish : ' +
								 * object.messageType.finished;
								 */

								if (object.messageType.finished == true) {
									processNavigationHtml += '<div class="ui-tick-grey"><img src="images/tick_grey.png" /></div>';
								}

								processNavigationHtml += '</li>';
							}
						}

						if (i - 1 == step.messageGroups.length()) {
							processNavigationHtml += '</ul></div>';
						}

						if (styleIndex == 2) {
							styleIndex = 0;
						}
						initial = false;
					}
				}

				processNavigationHtml += '</div></div></div><div class="inner-right-form ui-header-corner-top shadow" id="child_'
						+ step.stepName
						+ '"  style="display:none;height:auto;padding-bottom:4px;"><div class="header_bg ui-header-corner-top ui-page-header-text" >'
						+ step.longDescription
						+ ' <div id="'
						+ step.stepName
						+ '_pageActions" style="float:right;width:70%;">'
						/*
						 * + '<div class="ui-process-button">TEST1</div>' + '<div
						 * class="ui-process-button">TEST2</div>'
						 */
						+ '</div></div>';
				var rightSideActionMenu = false;
				if (process.processDefinition.processName === "Accounts") {
					if (step.stepName == "Step1" || step.stepName == "Step3")
						rightSideActionMenu = true;
				}
				if (process.processDefinition.processName === "LicenseeAccounts") {
					if (step.stepName == "Step1" || step.stepName == "Step2")
						rightSideActionMenu = true;
				}
				if (process.iframe)
					processNavigationHtml += '<div style="height:auto;border:1px solid #FF0000" id="child_'
							+ step.stepName
							+ '_form">'
							+ step.stepName
							+ '</div>';
				else {

					processNavigationHtml += '<div id="mcs_container_left"><div class="customScrollBox"><div class="container"><div class="content">';
					if (rightSideActionMenu == true) {
						processNavigationHtml += '<div id="divPrimary'
								+ step.stepName
								+ '" class="ui-left-side-forms" style="width:92%">';
					} else {
						processNavigationHtml += '<div id="divPrimary'
								+ step.stepName
								+ '" class="ui-left-side-forms" style="width:99%">';
					}

					processNavigationHtml += '<div class="ui-inner-display-box ui-header-corner-top" style="height:auto;display:none" id="child_top_'
							+ step.stepName
							+ '_form"></div>'
							+ '<div class="ui-inner-display-box ui-header-corner-top" style="height:auto" id="child_'
							+ step.stepName + '_form"></div></div></div>';

					if (rightSideActionMenu == true) {
						processNavigationHtml += '<div id="divSecondary'
								+ step.stepName
								+ '" class="ui-right-side-icons" >'
								+ '<div id="imgInvoice'
								+ step.stepName
								+ '" class="other invoice invoice-icon" style="display:none"></div><div id="imgInvoiceText'
								+ step.stepName
								+ '" class="ui-invoice-icon-text" style="display:none">Add to Invoice</div>'
								+ '<div id="imgGenerateInvoice'
								+ step.stepName
								+ '" class="other generate-invoice" style="display:none;"></div><div  id="imgGenerateInvoiceText'
								+ step.stepName
								+ '" class="ui-invoice-icon-text"  style="display:none;">Generate Invoice</div>'
								+ '<div id="imgReceipt'
								+ step.stepName
								+ '" class="other generate-receipt" style="display:none;"></div><div  id="imgReceiptText'
								+ step.stepName
								+ '" class="ui-invoice-icon-text"  style="display:none;">Generate Receipt</div>'
								+ '</div>';
					}

					processNavigationHtml += '</div></div><div class="dragger_container" style="display: none"><div class="dragger"></div></div></div></div>';
					processNavigationHtml += '</div>';
				}

			}
			groupNamesArray.push({
				groupName : groupName,
				steps : subStepsArray,
				groupStatus : groupStatusClass
			});
			/*
			 * if (parseInt(stepGroup.steps.length) !== 1) { groupHeight =
			 * groupHeight + 10 (parseInt(stepGroup.steps.length) - 1);
			 * groupHeight = groupHeight + 1 ((parseInt(stepGroup.steps.length) *
			 * 2) - 2); }
			 */
			var marginTop = "";
			marginTop = (groupHeight / 2) - 41.5;
			var displayGroupName = groupName.replace(/_/g, " ");
			if (mapIndex == (process.groupNameMap.length() - 1)) {
				processLeftNavigationHtml += '<div class="ui-nav shadow nav-'
						+ groupStatusClass
						+ '  leftprocess" style="height:'
						+ groupHeight
						+ 'px"   id="processnav-'
						+ groupName
						+ '" ><div  class="rotate-text processnav" style="text-align:center;margin-top:'
						+ marginTop + '" >' + displayGroupName
						+ ' <div id="arrow-' + groupName
						+ '"></div></div></div>';

			} else {
				processLeftNavigationHtml += '<div class="ui-nav ui-box-align shadow nav-'
						+ groupStatusClass
						+ '  leftprocess" style="height:'
						+ groupHeight
						+ 'px"   id="processnav-'
						+ groupName
						+ '" ><div  class="rotate-text processnav" style="text-align:center;margin-top:'
						+ marginTop
						+ '" >'
						+ displayGroupName
						+ ' <div class="arrow-selection" id="arrow-'
						+ groupName + '"></div></div></div>';
			}
		}
		//
		// alert(processLeftNavigationHtml);
		$("#processLeftNavigation").html(processLeftNavigationHtml);

		/*
		 * $("#processLeftNavigation").find() groupActualHeight
		 */
		$("#processNavigation").html(processNavigationHtml);
		mCustomScrollbars();

		/*
		 * var processNavHeight = $(".ui-left-top").css('height');
		 * processNavHeight = parseInt(processNavHeight);
		 */
		// alert("Inside Process:" + processNavHeight);
		/*
		 * renderingEngine.getChildComponent("Resize").setCurrentHeight(
		 * processNavHeight);
		 */
		appController.getComponent("RenderingEngine").fireEvent(
				AppConstants.Event.RESIZE);

		var grpName = null;
		var height = 0;
		var spacing = 0;
		$.each(stepsNameArray, function(key, value) {
			var stepName = value.stepName;
			var groupName = value.groupName;
			groupName = groupName.replace(/\s+/g, '_');
			if (grpName != groupName) {
				height = 0;
				spacing = 0;
			} else {
				spacing += 7;
			}
			var stepheight = $("#processNavigation").find("#" + stepName).css(
					"height");
			height += parseInt(stepheight);
			height += spacing;

			$("#processLeftNavigation").find("#processnav-" + groupName).css(
					"height", height);

			var fontLength = (height / 2) - 41.5;

			$("#processLeftNavigation").find("#processnav-" + groupName).find(
					".rotate-text").css("margin-top", fontLength);
			grpName = groupName;
			// alert(height);

		});

		$.each(stepsNameArray,
				function(key, value) {
					var stepName = value.stepName;
					var groupName = value.groupName;
					$("#" + stepName)
							.hover(
									function() {
										selectClass = $("#" + stepName).attr(
												'class');
										navSelectedClass = $(
												"#processnav-" + groupName)
												.attr('class');
										$(this).addClass('hover').removeClass(
												value.stepStatus);
										$("#processnav-" + groupName).addClass(
												'hover').removeClass(
												"nav-" + value.groupStatus);
									},
									function() {

										$(this).addClass(selectClass)
												.removeClass('hover');
										$("#processnav-" + groupName).addClass(
												navSelectedClass).removeClass(
												'hover');
									});

				});

		$.each(groupNamesArray, function(key, groupValue) {
			var selectClasses = [];
			$("#processnav-" + groupValue.groupName).hover(
					function() {
						navSelectedClass = $(
								"#processnav-" + groupValue.groupName).attr(
								'class');
						$("#processnav-" + groupValue.groupName).addClass(
								'hover').removeClass(
								"nav-" + groupValue.groupStatus);
						$.each(groupValue.steps, function(index, step) {
							selectClasses.push({
								selectClass : $("#" + step.stepName).attr(
										'class'),
								stepName : step.stepName
							});
							$("#" + step.stepName).addClass('hover')
									.removeClass(step.stepStatus);
						});
					},
					function() {
						$(this).addClass(navSelectedClass).removeClass('hover')
						$.each(selectClasses, function(index, value) {
							$("#" + value.stepName).addClass(value.selectClass)
									.removeClass('hover')
						});
					});
		});

		/*
		 * var processNavigationHeight = $("#processNavigation").css("height");
		 * processNavigationHeight = processNavigationHeight.substring(0,
		 * processNavigationHeight.length - 2); var finalHeight =
		 * parseInt(processNavigationHeight); var ultHeight = $(window).height() -
		 * 50; // alert("finalHeight : " + finalHeight); if (finalHeight >= 460) {
		 * 
		 * $('.left-side-content').css('height', finalHeight + 30);
		 * $('.ui-left-top').css('height', finalHeight);
		 * $('.right-side-content').css('height', finalHeight + 30);
		 * 
		 * $('#mcs_container').css('height', finalHeight - 50);
		 * $(".dragger_container").css('height', finalHeight - 50);
		 * renderingEngine.getChildComponent("Search").mCustomScrollbars(); }
		 * else { // $('.left-side-content').css('height', '525px');
		 * $('.ui-left-top').css('height', '450px');
		 * 
		 * $('#mcs_container').css('height', '394px');
		 * $(".dragger_container").css('height', '390px');
		 * renderingEngine.getChildComponent("Search").mCustomScrollbars(); }
		 */

		renderingEngine.registerClickEvent('.process', toggleStepPage);// slideInitializeForm);
		renderingEngine.registerClickEvent('.leftprocess', toggleStepPage);// initializeForm);
		/*
		 * renderingEngine.registerClickEvent('formNavigationLine',
		 * slideBackToProcessForm);
		 */

	}

	/**
	 * Toggle the ui by clicking on the left side navigation menu.
	 */
	function toggleStepPage(event) {

		var id = this.id;
		// alert(id);

		if (id.indexOf("processnav-") > -1) {
			if (process.processDefinition.description) {
				navigationName = process.processDefinition.description;
			} else {
				navigationName = process.processName;
			}
			loadFormNavigationLine(navigationName);
			process.updateProcessView();
		}

		for ( var mapIndex = 0; mapIndex < process.groupNameMap.length(); mapIndex++) {
			var map = process.groupNameMap.getItemAt(mapIndex);
			var groupName = map.key;
			$('#processLeftNavigation').find('#arrow-' + groupName)
					.removeClass("rotate-image ui-selection-arrow");
		}

		var groupName = null;
		if (id.indexOf("processnav-") > -1) {
			groupName = id.substring(id.indexOf("processnav-") + 11, id.length);
			var map = process.groupNameMap.get(groupName);
			var stepGroup = map.value;
			var steps = stepGroup.steps;
			if (steps.length > 0) {
				if (!process.prevSelectedNavigationId
						|| groupName != process.prevSelectedGroupName)
					id = steps[0].stepName;
				else
					id = process.prevSelectedNavigationId;
			}
			process.prevSelectedGroupName = groupName;
		}
		// alert(id + " : " + process.prevSelectedNavigationId + " : " +
		// groupName);

		if (!groupName) {
			groupName = $(this).attr("groupName");
			process.prevSelectedGroupName = groupName;
		}

		$('#processLeftNavigation').find('#arrow-' + groupName).addClass(
				"rotate-image ui-selection-arrow");

		if (id == process.prevSelectedNavigationId) {
			for ( var mapIndex = 0; mapIndex < process.groupNameMap.length(); mapIndex++) {
				var map = process.groupNameMap.getItemAt(mapIndex);
				var groupName = map.key;
				$('#processLeftNavigation').find('#arrow-' + groupName)
						.removeClass("rotate-image ui-selection-arrow");
			}
			process.slideBackToProcessForm(event, null);
			// $(this).find('#arrow-'+groupName).addClass("rotate-image
			// ui-selection-arrow");
		} else {
			// alert("Close");
			process.slideInitializeForm(event, id);
			// process.collapsed = true;
		}

		// initializeForm();
		// mCustomScrollbars();
	}
	;

	function slideInitializeForm(event, id) {
		process.slideDelay = 200;
		if (!id)
			id = this.id;
		if (id)
			process.initializeForm(event, id);
	}
	;

	function slideBackToProcessForm(event, callback) {
		var navigationName = "";
		if (process.processDefinition.description) {
			navigationName = process.processDefinition.description;
		} else {
			navigationName = process.processName;
		}
		loadFormNavigationLine(navigationName);
		process.updateContext();
		process.updateProcessView();
		process.slideDelay = 200;
		process.backToProcessForm(event, callback);
	}
	;
	function initializeForm(event, targetId) {

		var id = targetId;
		if (!id)
			id = this.id;

		if (id.indexOf("processnav-") > -1) {
			id = id.substring(id.indexOf("-") + 1, id.length).trim();
		}

		if (id == process.prevSelectedNavigationId) {// Click the same
			// navigation
			// link more than once
			// return;
			// alert("Same");
			return;
		}

		if (process.processDivisionSelected) {
			// alert(process.processDivisionSelected);
			$('#child_' + process.processDivisionSelected).css('display',
					'none');
		}

		if (!process.collapsed)
			process.slideRight();

		var selectedStep = null;
		for ( var index = 0; index < process.processDefinition.steps.length; index++) {
			var step = process.processDefinition.steps[index];

			if (id == step.stepName) {
				selectedStep = step;
				break;
			}
		}

		if (!selectedStep) {
			selectedStep = process.processDefinition.steps[0]
		}
		var stepNameDescription = selectedStep.longDescription;
		if (stepNameDescription)
			loadStepNavigationLine(stepNameDescription);
		renderingEngine.getEventQueue().postEvent(
				AppConstants.Event.FORM_PAGE_LOAD_EVENT, selectedStep,
				renderingEngine, process);
		process.slideDelay = 0;

		process.prevSelectedNavigationId = id;
		process.collapsed = true;

		for ( var index = 0; index < process.processDivisions.length; index++) {
			$('#' + process.processDivisions[index]).css('display', 'none');
		}

		$('#child_' + id + '_form').html("");

		// alert(id);
		process.processDivisionSelected = id;
		$('#child_' + id).css('display', 'block');

		renderingEngine.getChildComponent("Form").setPlaceHolder(
				'child_' + id + '_form');
	}
	;

	function slideRight() {
		getUIDimensions();

		var width = "98%";
		$('.right-side-content').css('display', 'none')
		// $('.left-side-content').css('width', width + "px");
		/* $('.inner-right').css('width', '94.5%'); */
		$('.inner-right').removeClass('inner-right').addClass(
				'slide-inner-right');
		$(".left-side-content").animate({
			width : width
		}, process.slideDelay);

		$(".right-side-content").animate({
			width : 0,
		}, process.slideDelay);
		// $('.left-side-content').css('height', 'auto');
		// $('.ui-left-top').css('height', 'auto');

		$('.home-icon-link').css('display', 'none');
		$('#left-side').removeClass('left-side-bg');
	}

	function backToProcessForm(event, callback) {
		// alert("backToProcessForm");

		/*
		 * if (!process.collapsed) return;
		 */
		process.prevSelectedNavigationId = null;
		// alert("back");
		if (process.collapsed)
			process.slideLeft();

		$('#left-side').addClass('left-side-bg');

		for ( var index = 0; index < process.processDivisions.length; index++) {
			$('#' + process.processDivisions[index]).css('display', 'block');
		}

		// $('#child_' + process.processDivisionSelected).html("");

		$('#child_' + process.processDivisionSelected).css('display', 'none');

		process.slideDelay = 0;
		process.collapsed = false
		// alert("callback : " + callback);
		if (callback) {
			callback();
		}
	}
	;

	function slideLeft() {
		// alert("slideLeft");
		// $('.right-side-content').css('width', process.right + "px")
		$('.right-side-content').css('display', 'block')
		// $('.left-side-content').css('width', process.left + "px")
		/* $('.inner-right').css('width', '70%'); */
		$('.slide-inner-right').removeClass('slide-inner-right').addClass(
				'inner-right');

		$(".left-side-content").animate({
			width : process.left
		}, process.slideDelay);

		$(".right-side-content").animate({
			width : process.right,
		}, process.slideDelay);

		// $('.left-side-content').css('height', process.outerHeight);
		/* $('.ui-left-top').css('height', process.innerHeight); */
		// $('.home-icon-link').css('display', 'block');
		process.updateContext();
	}

	function getUIDimensions() {
		var right = $('.right-side-content').css('width');
		var innerHeight = $('.ui-left-top').css('height');
		// var outerHeight = $('.left-side-content').css('height');
		var left = $('.left-side-content').css('width');
		process.right = right.substring(0, right.length - 2);
		process.left = left.substring(0, left.length - 2);
		process.innerHeight = innerHeight;
		// process.outerHeight = outerHeight;
		// alert(process.innerHeight);
		// alert(process.left + ", " + process.right);
		var parentWidth = $('.left-side-content').offsetParent().width();
		var percent = 100 * process.left / parentWidth;
		process.left = percent + "%";

		parentWidth = $('.right-side-content').offsetParent().width();
		percent = 100 * process.right / parentWidth;
		process.right = percent + "%";
	}
	;

	/**
	 * Which update process view whenever modify the selected the process
	 * definition
	 */
	function updateProcess() {

		// backToProcessForm();
		process.slideBackToProcessForm(null, process.loadProcess);// process.lastSelectedEvent);//
		// (loadProcess);
		// this.loadProcess();
	}
	;

	function terminateProcessHandler(event) {
		// slideBackToProcessForm(null, null);
		renderingEngine.getChildComponent("Process").slideBackToProcessForm(
				null, null);
		// process.slideBackToProcessForm(null, null);
		// renderingEngine.fireEvent(AppConstants.Event.PROCESS_PAGE_RENDER);
	}
	;

	/**
	 * Return selected process definition.
	 * 
	 * @returns
	 */
	function getProcessDefinition() {
		return this.processDefinition;
	}
	;
	/**
	 * Set the selected process definition.
	 * 
	 * @param processDefinition
	 * 
	 */
	function setProcessDefinition(processDefinition) {
		this.processDefinition = processDefinition;
	}
	;

	function getProcessName() {
		return this.processName;
	}
	;
	function setProcessName(processName) {
		this.processName = processName;
	}
	;
	function getProcessId() {
		return this.processId;
	}
	;
	function setProcessId(processId) {
		this.processId = processId;
	}
	;

	/**
	 * Custom scrollbar for extra results.
	 */
	function mCustomScrollbars() {
		$("#mcs_container_left").mCustomScrollbar("vertical", 0, "easeOutCirc",
				0, "auto", "yes", "yes", 0);
	}
	;

	function loadFormNavigationLine(navigationLineName) {
		var navigationLine = renderingEngine
				.getChildComponent("NavigationLine");
		var navigationLineId = navigationLine
				.setNavigationLine(navigationLineName);
		$('#' + navigationLineId).unbind("click", slideBackToProcessForm);
		$('#' + navigationLineId).bind("click", slideBackToProcessForm);
	}

	function loadStepNavigationLine(navigationLineName) {
		var navigationLine = renderingEngine
				.getChildComponent("NavigationLine");
		var navigationLineId = navigationLine
				.setNavigationLine(navigationLineName);
	}
	;
}
