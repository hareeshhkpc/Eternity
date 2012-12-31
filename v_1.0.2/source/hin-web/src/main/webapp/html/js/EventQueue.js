/** 
 * EventQueue puts the events in queue and it makes events to be processed by 
 * corresponding components one after the other. 
 * With EventQueue events are handled by corresponding components synchronously.
 */
function EventQueue()
{					
	/** queue holds the events to be handled */
	this.queue        = [];	
	
	/**
	 * Adds the events to queue which are raised by components for processing 
	 * @param EventType     : Name of the type of event to be handled
	 * @param eventSource   : Object of component in which event has been triggered
	 * @param eventData     : Object of data from event source which is to be passed to event handler
	 * @param triggerOnWhat : Object of component in which event has to be handled	 
	 * @return void */
	this.postEvent    = postEvent;
	
	/** Starts the EventQueue to process the events in queue 
	 *  @return void*/
	this.start        = start;
	
	/** processQueue processes the events in queue one after the other for every 500ms. 
	 *  If the length of the queue is greater than zero, it takes the first event in queue,
	 *  Processes the same event in queue and removes that event from queue which has been 
	 *  processed and updates the queue. In the next iteration, it again takes first event 
	 *  in updated queue and processes it and removes */
	this.processQueue = processQueue;	
	
	/** timerId keeps count of the number of times EventQueue processed the queue
	 *  @type integer */
	this.timerId      = null;		
	
	/** eventQueue is used to refer the eventQueue class object
	 *  @type EventQueue*/
	var eventQueue = this;
	
	/**
	 * Time to sleep before the next queue processing
	 */
	this.sleepTime = 500;
											
	/* Function definitions */
	
	function postEvent(eventType, eventData, triggerOnWhat, eventSource)
	{
		eventQueue.queue.push({type: eventType, data: eventData, trigger: triggerOnWhat, eventSource: eventSource, broadCaster: null});
		//alert("Queue Updated: Event Count = " + eventQueue.queue.length);
	};
	
	function processQueue()
	{
		//alert("processQu: Count = " + eventQueue.queue.length + ", events=" + eventQueue.toString());
		var qIndex = 0;
		while(eventQueue.queue.length > qIndex)
		{	
			//Gets the First element in queue to process. 
			var queueMemb = eventQueue.queue[qIndex];							
			//alert("Processing index " + qIndex + "=" + queueMemb.type);
			
			//Processes the first element in queue.
			queueMemb.trigger.eventHandler(queueMemb);
			
			//Removes the first element in queue which has been processed and updates the queue.
			eventQueue.queue.splice(qIndex, 1);								 
		}
		eventQueue.timerId = setTimeout ( processQueue, eventQueue.sleepTime );				//Continues processing of new events in queue.
	};
	
	function start()
	{
		eventQueue.timerId = setTimeout ( processQueue, eventQueue.sleepTime );		
	};
	
/*	function toString()
	{
		var qStr = "";
		$.each(eventQueue.queue, function(index, value){
			qStr = qStr + index + "=" + value.type + ", ";
		});
		return qStr;
	}*/
};