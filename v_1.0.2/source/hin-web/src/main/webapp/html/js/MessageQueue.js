/** 
 * MessageQueue puts the messages in the data layer to the server using a timer
 */
function MessageQueue()
{					
	/** 
	 * Starts the MessageQueue to process the events in queue 
	 */
	this.start        = start;
	
	this.isProcessing = false;
	
	this.changedIdArray = [];
	
	/** processQueue processes the events in queue one after the other for every 500ms. 
	 *  If the length of the queue is greater than zero, it takes the first event in queue,
	 *  Processes the same event in queue and removes that event from queue which has been 
	 *  processed and updates the queue. In the next iteration, it again takes first event 
	 *  in updated queue and processes it and removes */
	this.processQueue = processQueue;	
	
	/** timerId keeps count of the number of times MessageQueue processed the queue
	 *  @type integer */
	this.timerId      = null;		
	
	/** eventQueue is used to refer the eventQueue class object
	 *  @type MessageQueue*/
	var messageQueue = this;
	
	/**
	 * Time to sleep before the next queue processing
	 */
	this.sleepTime = 3000;
											
	/* Function definitions */
	
	function postEvent(eventType, eventData, triggerOnWhat, eventSource)
	{
		//messageQueue.queue.push({type: eventType, data: eventData, trigger: triggerOnWhat, eventSource: eventSource, broadCaster: null});
		//alert("Queue Updated: Event Count = " + messageQueue.queue.length);
	};
	
	this.scheduleTimer = function(){
		//Continues processing of new events in queue.
		messageQueue.timerId = setTimeout ( messageQueue.processQueue, messageQueue.sleepTime );
	};
	
	function processQueue()
	{
		/*if(messageQueue.isProcessing === true){
			messageQueue.scheduleTimer();
			return;
		}*/
		
		var msgStore = HL.getStore('message');
		
		HL.getChangedDocuments(msgStore, function(changedIds){
			for(var key in changedIds){
				if(key !== 'key'){
					messageQueue.changedIdArray.push(key);
				}				
			}
			
			if(messageQueue.changedIdArray.length > 0){
				messageQueue.isProcessing = true;
				messageQueue.commitChanges();
			}
		});
		
		messageQueue.scheduleTimer();
	};
	
	this.commitChanges = function(){
		var msgStore = HL.getStore('message');
		var id = messageQueue.changedIdArray.shift();
		if(!id){
			messageQueue.isProcessing = false;
			return;
		}
		msgStore.get(id, function(doc){
			if(doc && doc.finished === true){
				messageQueue.postMessage(doc);
			}else{
				
			}
		});
	};
	
	this.ajaxMultipart = new AjaxMultipart();
	this.postMessage = function(doc){
				
		function messagePostSuccess(){
			var msgStore = HL.getStore('message');
			HL.removeChangedDocument(msgStore, doc.key, function(){
				messageQueue.commitChanges();
			});
		};

		if(!doc || !doc.type){
			messageQueue.commitChanges();
		}
		
		var URL = messageQueue.getURL(doc.type);
		if(!URL || URL === null || URL === ''){
			try{
				messagePostSuccess();
			}catch(error){
				messageQueue.isProcessing = false;
			}
		}
		else{
			var callback = {
					handler : messagePostSuccess,
					parameters : []
			};
			messageQueue.ajaxMultipart.multipart(URL, "post", doc.params, {
				message : doc.content
			}, callback);
		}
	};
	
	this.getURL = function(type){
		var URL = "";
		if(type === 'message'){
			URL = AppConstants.URL.WORKFLOW_NEW_TASK_URL;
		}
		else if(type === 'process'){
			URL = AppConstants.URL.PROCESS_SAVE_URL;
		}
		return URL;
	};
	
	function start()
	{
		messageQueue.timerId = setTimeout ( processQueue, messageQueue.sleepTime );		
	};
	
/*	function toString()
	{
		var qStr = "";
		$.each(messageQueue.queue, function(index, value){
			qStr = qStr + index + "=" + value.type + ", ";
		});
		return qStr;
	}*/
};