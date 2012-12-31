/**
 * Login is a child component of Rendering Engine which displays the login page
 * to user to login and captures the user login information and sends same
 * information to rendering engine for further processing.
 */

function NavigationLine(renderingEngine) {
	this.eventHandler = eventHandler;
	this.className = "NavigationLine";

	this.loadUI = loadUI;
	var renderingEngine = renderingEngine;
	var navigationLine = this;
	var placeHolder = "navigationLine";

	function eventHandler(event) {

	}
	;

	this.loadUI = loadUI;
	function loadUI() {

	}
	;

	this.setNavigationLine = setNavigationLine;
	function setNavigationLine(childStepName) {
		var childStepId = formNavigationLine(childStepName);
		return childStepId;
	}
	;

	function formNavigationLine(childStepName) {
		var navigationMap = renderingEngine.getComponent("Context")
				.getNavigationMap();
		if (!navigationMap)
			navigationMap = new HIN.HashMap();
		if (navigationMap.length() === 0) {
			removeNavigationLine();
			var childStep = createChildStep(0, childStepName);
			$('#' + placeHolder).html(childStep);
			navigationMap.put(childStepName, 0);
			childStepId = generateID(0);
		} else {
			if (navigationMap.get(childStepName)) {
				childStepId = reformNavigationLine(childStepName, navigationMap);
			} else {
				childStepId = createNewNavigationLine(childStepName,
						navigationMap);
			}
		}
		return childStepId;
	}
	;

	function createNewNavigationLine(childStepName, navigationMap) {
		var position = navigationMap.length();
		for ( var index = 0; index < position; index++) {
			removeBreadCrumb(index);
		}
		var childStep = createChildStep(position, childStepName);
		$('#' + placeHolder).append(childStep);
		navigationMap.put(childStepName, position);
		renderingEngine.getComponent("Context").setNavigationMap(navigationMap);
		var childStepId = generateID(position);
		return childStepId;
	}
	;

	this.reformNavigationLine = reformNavigationLine;
	function reformNavigationLine(childStepName, navigationMap) {
		var positionObject = navigationMap.get(childStepName);
		var reformedNavMap = new HIN.HashMap();
		var position = positionObject.value;
		var navigationMapLength = navigationMap.length();
		for ( var index = 0; index < navigationMapLength; index++) {
			if (index <= position) {
				var map = navigationMap.getItemAt(index);
				var key = map.key;
				var value = map.value;
				reformedNavMap.put(key, value);
				if (index == position) {
					addBreadCrumb(index)
				} else {
					removeBreadCrumb(index);
				}
				continue;
			} else {
				removeChildStep(index);
			}
		}
		renderingEngine.getComponent("Context")
				.setNavigationMap(reformedNavMap);
		var childStepId = generateID(position);
		return childStepId;
	}
	;

	this.createChildStep = createChildStep;
	function createChildStep(position, childStepName) {
		var childStep = "";
		if ($('#navigationLine').children().length > 0) {
			childStep = "<li class='form-header-left-name' id='arrowNavigation"
					+ position + "' style='display: inline'>></li>";
		}
		childStep += "<li class='form-header-left-name bcrumb-current' id='childStepNavigation"
				+ position + "' style='display: inline'>";
		childStep += childStepName;
		childStep += '</li>';
		return childStep;

	}
	;

	this.removeChildStep = removeChildStep;
	function removeChildStep(position) {
		$("#childStepNavigation" + position).unbind("click");
		$("#childStepNavigation" + position).remove();
		$("#arrowNavigation" + position).remove();

	}
	;

	this.removeNavigationLine = removeNavigationLine;
	function removeNavigationLine() {
		$('#navigationLine').html('');
		renderingEngine.getComponent("Context").clearNavigationMap();
	}
	;

	function removeLastChildStep() {
		var navigationMap = renderingEngine.getComponent("Context")
				.getNavigationMap();
		var navigationMapLength = navigationMap.length();
		var position = navigationMapLength - 1;
		removeChildStep(position);
		var reformedNavMap = new HIN.HashMap();
		for ( var index = 0; index < position; index++) {
			var map = navigationMap.getItemAt(index);
			var key = map.key;
			var value = map.value;
			reformedNavMap.put(key, value);
		}
		renderingEngine.getComponent("Context")
				.setNavigationMap(reformedNavMap);
	}
	;

	function removeBreadCrumb(position) {
		$('#childStepNavigation' + position).removeClass('bcrumb-current');
	}
	;

	function addBreadCrumb(position) {
		$('#childStepNavigation' + position).addClass('bcrumb-current');
	}
	;

	this.generateID = generateID;
	function generateID(position) {
		var childStepId = "childStepNavigation" + position;
		return childStepId;
	}
	;
}
