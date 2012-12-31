/**
 * Application Controller is main component which controls the application. It
 * has child components like Rendering Engine, Data Layer, Context and
 * IMCommunication. It catches the events from all of its components and
 * broadcasts the same events to all its components except the component from
 * which that event triggers and which broadcasts that event. If required it
 * handles the events here itself.
 */

function ApplicationController(mobile) {
	/**
	 * className is used to refer the ApplicationController class name in other
	 * components
	 */
	this.className = "ApplicationController";

	/** eventQueue is used to add the events in queue to handle */
	this.eventQueue = new EventQueue();

	/** It makes the event queue to be available in Application Controller */
	this.getEventQueue = getEventQueue;

	/**
	 * Broadcasts the events to components
	 * 
	 * @param event
	 *            its an object that contains event name, event source, data to
	 *            be passed with event, where it has to be handled
	 * @return void
	 */
	this.broadcastEvent = broadcastEvent;

	/**
	 * Handles the events from other components
	 * 
	 * @param event :
	 *            Its an object that contains event name, event source, data to
	 *            be passed with event, where it has to be handled
	 * @return void
	 */
	this.eventHandler = eventHandler;

	this.getComponent = getComponent;

	/** appContoller is a private variable used to refer the current class object */
	var appController = this;

	/**
	 * Array of objects of child components Which holds the objects of
	 * RenderingEngine, DataLayer, Context
	 */
	var childComponents = new Array();

	/* Pushing objects of child components to components array */
	childComponents.push(new RenderingEngine(appController));
	childComponents.push(new DataLayer(appController));
	childComponents.push(new Context(appController));
	// childComponents.push(new IMCommunication(appController));

	/*
	 * Start the EventQueue to process the events. It processes the events added
	 * to EventQueue for every 500ms
	 * 
	 * @see EventQueue
	 */
	this.eventQueue.start();

	this.fireEvent = fireEvent;

	/*
	 * Post APPLICATION_INITIALIZED event to EventQueue to process. Here we are
	 * calling postEvent method in EventQueue class using getEventQueue method
	 * in application controller class
	 */
	appController.getEventQueue().postEvent(
			AppConstants.Event.APPLICATION_INITIALIZED, {}, appController,
			appController);

	/* Function definitions */
	function getComponent(componentClassName) {
		for (componentIndex = 0; componentIndex < childComponents.length; componentIndex++) {
			if (componentClassName == childComponents[componentIndex].className) {
				return childComponents[componentIndex];
			}
		}
	}

	function broadcastEvent(event) {
		// alert("ApplicationController broadCast: " + event.type + " Event
		// Source: " + event.eventSource.className)
		$
				.each(
						childComponents,
						function(index, component) {
							// alert("Current Class selected in APP broadCast: "
							// + component.className);
							if (component.className != event.eventSource.className
									&& (event.broadCaster == null || event.broadCaster.className != component.className)) {
								clone = AppUtil.getEvenClone(event);
								clone.broadCaster = appController;
								component.eventHandler(clone);
							} else {
								// alert("ApplicationController broadCastNot
								// firing on: " + value.className);
							}

						})
	}
	;

	function getEventQueue() {
		return appController.eventQueue;
	}
	;

	function eventHandler(event) {
		// alert("event handler in app controller");

		/*
		 * if (event.type == AppConstants.Event.OPEN_CONTACT) { alert("App :
		 * "+AppConstants.Event.OPEN_CONTACT);
		 * appController.getEventQueue().postEvent(AppConstants.Event.OPEN_CONTACT,
		 * {contactData: event.data.contactData, loginData:
		 * event.data.loginData}, appController, contacts); } else {
		 */
		broadcastEvent(event);
		// }
	}
	;

	function fireEvent(eventName) {

		appController.getEventQueue().postEvent(eventName, {}, appController,
				appController);
	}
	;

}