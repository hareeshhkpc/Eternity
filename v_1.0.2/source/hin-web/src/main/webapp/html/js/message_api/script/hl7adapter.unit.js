var o

function testMeta(){

    function log(data){
       document.write(data.toString());
    }

    function doTest(doc){
  
         result = 0
         ok(doc.getArtifactId() == "PRPA_IN203000HT04")
		 
		 alert(doc.getXMLString());

         var cl = doc.getChildClass("registrationEvent")
         ok(cl.getClassName() == "registrationEvent")

	     var subject = cl.getChildClass("subject");
         ok( subject.getClassName() == "subject")

         ok(subject.getProperty('rimType') == 'PARTICIPATION')

 	     var subsumed = subject.getChildClass("subsumedBy");
         ok(subsumed.getProperty("label") == "Subsumed By")

         ok(subsumed.getField("statusCode")[0].getProperty("label") == "Status Code")

		// Test fieldlist
		var l = cl.getFieldNames();
		ok(l[0] == "id")
		ok(l.length == 2)
			
		// Test classnames
		l = cl.getChildClassNames();
		ok(l.length ==1)
			
		// Test attributes
		l = cl.getPropertyNames();
		ok( l[2] == "tagName");


        // Null
        var c = doc.getChildClass("") 
        ok( c == null)

        c = cl.getField("")
        ok( c.length == 0)

        start()

    }

    function run(){
        stop()
        HL.clearConfigStore(function(){
            HL.clearMessageStore(function(){
                HL.getConfigDocument("PRPA_IN203000HT04",doTest,log,false)
                HL.getConfigDocument("PRPA_IN203000HT04",doTest,log,true)
            })   
        })
    }

    this.run = run
}


var o
function testMessage(){

    function log(data){
       document.write(data.toString());
       start()
    }

    function doTest(doc){
         result = 0

         var msg = doc.createMessage()

         var obj = msg.createObject('registrationEvent')
         ok( obj != null)

         var obj1 = obj.createObject("should_be_null");
		 ok( obj1 == null )
		 obj1 = obj.createObject("subject");
		 ok( obj1 != null)

		 obj11 = obj.createObject("subject");
         var arr = obj.findObject("subject")
         ok( arr.length ==2)
         obj.removeObject(arr[1])
         var arr = obj.findObject("subject")
         ok(arr.length ==1)
         obj1 = arr[0] 

		 var l = msg.findObject("should_be_zero");
		 ok( l.length == 0)
		
		 l = msg.findObject("registrationEvent");
		 ok(l.length == 1);

         l = obj.findObject("should_be_zero");
		 ok( l.length == 0);
		
         l = obj.findObject("subject");
  		 ok( l.length != 0);

		 var s = obj1.getValue("should_be_null");
		 ok( s.length == 0)
		
		 ok( !obj1.setValue("should_throw_exception", ""));
		
		 var obj2 = obj1.createObject("subsumedBy");
      	 ok(obj2.setValue("id", "123"));			
		 ok(obj2.getValue("id")[0] == "123")

		 ok(obj2.setValue("id", ["schalk","willem"]));
		 ok(obj2.getValue("id")[1] == "willem")

         obj2.clearValue("id")
		 ok(obj2.getValue("id").length==0)


         var objValue = obj2.getNewValue("id")
         objValue.setValue("name", "schalk")
         objValue.setValue("surname", "heunis")
		 ok(obj2.getValue("id")[0].getValue("name") == "schalk")

     
		 ok(obj2.setValue("id", [objValue, objValue]));
		 ok(obj2.getValue("id")[1].getValue("name")[0] == "schalk")

         obj.setValue("code","codevalue")         
         obj2.setValue("statusCode","1")      
         ok(msg.validateMessage())
		 
		 alert(msg.getXMLString());

         start() 
     }

    function run(){
        HL.clearConfigStore(function(){
            HL.clearMessageStore(function(){
                HL.getConfigDocument("PRPA_IN203000HT04",doTest,log,false)
            })   
        })
    }

    this.run = run
}

function testSmoValue() {
    function log(data){
       document.write(data.toString());
       start()
    }


    function doTest(doc) {
         var msg = doc.createMessage()
         
         var root = msg.createObject('PRPA_MT201000HT03')

         var obj = root.createObject('identifiedPerson')
         ok( obj != null)
         
         var id = obj.getNewValue("id")
         id.setValue("root","SUBSCRIBER_ID")
         id.setValue("extension","1")

         var id = obj.getNewValue("id")
         id.setValue("root","USERNAME")
         id.setValue("extension","heun147")

         var id = obj.getNewValue("id")
         id.setValue("root","PASSWORD")
         id.setValue("extension","cXdlcnR5")

         var ids = obj.getValue("id")
         ok(ids[0].getValue("extension")[0] == "1")

         var ids = obj.getValue("id[2]")
         ok(ids[0].getValue("extension")[0] == "heun147")

         var ids = obj.getValue("id[root='PASSWORD']")
         o = ids
         ok(ids[0].getValue("extension")[0] == "cXdlcnR5")


		 alert(msg.getXMLString());
		 
         start()   



    }

    

    function run(){
        HL.clearConfigStore(function(){
            HL.clearMessageStore(function(){
                HL.getConfigDocument("PRPA_MT201000HT03",doTest,log,false)
            })   
        })
    }
    this.run = run

}



function testLoadAndValidate(){
    var msg1

    function log(data){
       ok(false, "XHR failback")
       start()
    }

    function doLoad1(doc){
        msg1 = doc
        HL.getMessage("SMOTest_load_invalid",doTest,log,false)
    }

    function doTest(msg2){

         ok(msg1.validateMessage())
         msg1.clearMessage()
         ok(! msg2.validateMessage())
         start()
    }

    function run(){
        result = 0
        HL.clearConfigStore(function(){
            HL.clearMessageStore(function(){
                HL.getMessage("SMOTest_load1",doLoad1,log,false)
            })   
        })
        
    }

    this.run = run
}


function testLoadAndSave(){
    function logfail(data){
       ok(false, "XHR failback")
       start()
    }
    function logsuccess(data){
       ok(true, JSON.stringify( data))
    }

    function doTest(msg){
         ok(msg.validateMessage())
         var doc = msg.getConfig()
         ok(doc != null)

 
         var obj = msg.findObject("registrationEvent")[0];          
         msg.setId("SMOTest_load2")
         obj.setValue("id","1111")

         HL.putMessage(msg,logsuccess,logfail )

         var msgNoId = doc.createMessage()
         ok(msgNoId.getId != null)

         
         var msg1 = doc.createMessage("SMOTest_load3")
         var obj1 = msg1.createObject("registrationEvent")
         obj1.setValue("id","1122")
         obj1.setValue("code","A")
         HL.putMessage(msg1,function(data) {
                 logsuccess(data) 
                 HL.getMessage("SMOTest_load3", doLoad3, logfail, false)
         },logfail )

    }
    function doLoad3(msg){
         ok(msg.validateMessage())
         start()
    }

    function run(){
        result = 0
        HL.clearConfigStore(function(){
            HL.clearMessageStore(function(){
                HL.getMessage("SMOTest_load1",doTest,logfail,false)
            })   
        })
        

    }

    this.run = run
}


function testSyncMeta(){
    function testSync(expected,onComplete){
        function onSyncFail(data){
           ok(false)
           onComplete()
        }

        function onSyncComplete(data){
           ok(data.get >= expected.get && data.put==expected.put)     
           onComplete()
        }

        HL.syncMeta(function(data) { onSyncComplete(data)}, onSyncFail)
    }
 
    function run(){
        // reset the sync sync_id, then sync - get all the meta docs, then resync - get 0 docs
        result = 0
        HL.clearConfigStore(function(){
            HL.clearMessageStore(function(){
                HL.resetMetaSync(function() { 
                      testSync({get:1,put:0},function() {
                            testSync({get:0,put:0},start)  
                      })
                })
            })   
        })

    }

    this.run = run
}




function testSyncMessages(){
    function testSync(){
        HL.syncMessage(function(data) { onSyncComplete(data)}, onSyncFail)

        function onSyncFail(data){
           ok(false,data)
           start()
        }

        function onSyncComplete(data){
           ok(data.get >= 2 && data.put==0)  
           HL.getMessage("SMOTest_load1",doLoad1,onSyncFail,false)   
        }

        function doLoad1(msg) {
           msg.setId("syncmessages")
           d = msg.findObject('registrationEvent')[0]
           d.setValue('id','2')  
           HL.syncMessage(doNewMessage, onSyncFail)
        }

        function doNewMessage(data){
           ok(data.get == 0 && data.put==1) 

           HL.getConfigDocument("PRPA_IN203000HT04",function(doc) {
               var msg1 = doc.createMessage("SMOTest_load_to_delete")
               var obj1 = msg1.createObject("registrationEvent")
               obj1.setValue("id","1122")
               HL.syncMessage(doDeleteMessage, onSyncFail)
           }, onSyncFail, true)  
        }

        function doDeleteMessage(data){
           ok(data.get == 0 && data.put==1)   
           var msg1 = HL.getMessage("SMOTest_load_to_delete", function(msg){
              HL.deleteMessage(msg, function(data){
                        HL.syncMessage(doResetSyncAndEdit, onSyncFail)
                     }, onSyncFail)
               
           })
        }

        function doResetSyncAndEdit(data){
             ok(data.get == 0 && data.put==0 && data.deleted==1)
             HL.resetMessageSync(function() { 
                 HL.getConfigDocument("PRPA_IN203000HT04",function(doc) {
                   var msg1 = doc.createMessage("syncmessages")
                   var obj1 = msg1.createObject("registrationEvent")
                   obj1.setValue("id","1122")
                   HL.syncMessage(doResetSyncAndDelete, onSyncFail)
                 }, onSyncFail, true)  
             })
        }

        function doResetSyncAndDelete(data){
             ok(data.get == 0 && data.put==1 && data.deleted==0)
             HL.resetMessageSync(function() { 
                   HL.getConfigDocument("PRPA_IN203000HT04",function(doc) {
                       var msg1 = doc.createMessage("SMOTest_load_to_delete")
                       var obj1 = msg1.createObject("registrationEvent")
                       obj1.setValue("id","1122")
                       HL.syncMessage(onSync2Complete, onSyncFail)
                    }, onSyncFail, true) 
             })
        }


        function onSync2Complete(data){
           ok(data.get >= 0 && data.put==1 && data.deleted==0) 
              
           start()
         }

        
    }
 
    function run(){
        // reset the sync sync_id, then sync - get all the message docs, then resync - get 0 docs
        result = 0
        HL.clearConfigStore(function(){
            HL.clearMessageStore(function(){
                HL.resetMessageSync(function() { 
                      testSync()
                })
            })   
        })

    }

    this.run = run
}




function testAutoSave(){
    
    function log(msg){
       ok(false)
       start() 
    }


    function doTest(msg){
       msg.setId('autosavetest')
       d = msg.findObject('registrationEvent')[0]
       d.setValue('id','2')  
       HL.getMessage("autosavetest",checkSetValue, log,true )
    }
    function checkSetValue(msg) { 
         ok(msg.findObject('registrationEvent')[0].getValue('id') == '2') 
         msg.clearMessage()
         HL.getMessage("autosavetest",checkClear, log,true )
     }
     function checkClear(msg) {
         var arr = msg.findObject('registrationEvent')  
         ok(arr.length==0)
         msg.createObject('registrationEvent')
         HL.getMessage("autosavetest",checkCreateObject, log,true)
     }

     function checkCreateObject(msg){
         var arr = msg.findObject('registrationEvent')  
         ok(arr.length==1)
         obj = arr[0].createObject('subject') 
         HL.getMessage("autosavetest",checkObjectCreateObject, log,true)

     }

     function checkObjectCreateObject(msg){
         var arr = msg.findObject('registrationEvent')  
         var objarr = arr[0].findObject('subject') 
         ok(objarr.length==1)
         o = msg
         start() 
     }

    function run(){
        result = 0
        HL.clearConfigStore(function(){
            HL.clearMessageStore(function(){
                HL.getMessage("SMOTest_load1",doTest,log,false)
            })   
        })
    }
    this.run = run
}

function testDeleteDocument(){
     var msg1

     function log(msg){
       ok(false)
       start() 
    }  

   function doCallback(data){
      ok(true)
      start()
   }

   function doTest(msg){
         ok(msg.validateMessage())
         var doc = msg.getConfig()
         ok(doc != null)
         
         msg1 = doc.createMessage("SMOTest_load_to_delete")
         var obj1 = msg1.createObject("registrationEvent")
         obj1.setValue("id","1122")
         HL.deleteMessage(msg1, doDeleteAgain,log)
   }

   function doDeleteAgain(data){
         ok(true) 
         HL.deleteMessage(msg1, doCallback,log)
   }


   function run(){
        result = 0
        HL.clearConfigStore(function(){
            HL.clearMessageStore(function(){
                HL.getMessage("SMOTest_load1",doTest,log,false)
            })   
        })
    }
    this.run = run

}

var obj1
function testMandatoryTags(){
     function log(data){
       ok(false)
       start() 
    }  

   function doTest(doc){
         var cl = doc.getChildClass("POCD_MT000040HT01")
         ok(cl.getClassName() == "POCD_MT000040HT01")
         
         var msg = doc.createMessage()
         var obj  = msg.findObject("POCD_MT000040HT01")
         ok(obj.length == 0) 

         obj1 = msg.createObject("POCD_MT000040HT01")
         var obj2  = obj1.findObject("recordTarget")
         ok(obj2.length == 1) 
         
         // test that it does not repopulate
         obj1.populateObject()  
         var obj2  = obj1.findObject("recordTarget")
         ok(obj2.length == 1) 

         // multiple level
         var obj3 = obj2[0].findObject("patientRole")
         ok(obj3.length == 1) 

      start()
   }



    function run(){
        result = 0 
        HL.clearConfigStore(function(){
            HL.clearMessageStore(function(){
                HL.getConfigDocument("POCD_MT000040HT01",doTest,log,false)
            })   
        })
    }

    this.run = run
}


function testValidation(){
     function log(data){
       ok(false)
       start() 
    }  

   function doTest(doc){

       var msg = doc.createMessage("testValidation")     
       ok(msg.validateMessage())  //empty message

       var obj = msg.createObject("POCD_MT000040HT01")
       ok(!msg.validateMessage())  //root Element - no fields should fail

       obj.setValue("id","1")
       obj.setValue("code","C")
       obj.setValue("effectiveTime","12:00")
       obj.setValue("confidentialityCode","A")

       var recordTarget = obj.findObject("recordTarget")[0]
       var patientRole = recordTarget.findObject("patientRole")[0]
       patientRole.setValue("id","1")
       var author = obj.findObject("author")[0] 
       author.setValue("time","12:00")
       var assignedAuthor = author.findObject("assignedAuthor")[0]
       assignedAuthor.setValue("id","1")

       var custodian = obj.findObject("custodian")[0] 
       var assignedCustodian = custodian.findObject("assignedCustodian")[0] 
       var representedCustodianOrganization = assignedCustodian.findObject("representedCustodianOrganization")[0]
       representedCustodianOrganization.setValue("id","1")

       var component = obj.findObject("component")[0] 
       var structuredBody = component.findObject("structuredBody")[0] 
       var component = structuredBody.findObject("component")[0]
       var section = component.findObject("section")[0]
       var entry = section.createObject("entry")
       var observation = entry.findObject("observation")[0]
       observation.setValue("code","A")
       ok(msg.validateMessage())  //Message with all valid childObjects and Fields
       
       entry.removeObject(observation)
       ok(!msg.validateMessage())  //Missing child object

       observation = entry.createObject("observation")
       ok(!msg.validateMessage())  //Missing field
       observation.setValue("code","A")
       ok(msg.validateMessage())  //OK

       observation.setValue("code",["A","B"])
       ok(!msg.validateMessage())  //maxOccurs=1

       observation.setValue("code",["A"])
       ok(msg.validateMessage())  //OK

       var observation2 = entry.createObject("observation")
       ok(!msg.validateMessage())  //Duplicate observation - maxOccurs=1
       

       start()
   }

    function run(){
        result = 0 
        HL.clearConfigStore(function(){
            HL.clearMessageStore(function(){
                HL.getConfigDocument("POCD_MT000040HT01",doTest,log,false)
            })   
        })
    }
    this.run = run

}


function testValidHL7(){
     function log(data){
       ok(false)
       start() 
    }  

   function doTest(doc){

       var msg = doc.createMessage("hl7test")     
       var obj = msg.createObject("PRPA_MT410001HT02")

        obj.setValue('id', {"root":"1.2.3.4", "extension":"1"})
        obj.setValue('code', {"code":"1554-5", "codeSystemName":"LN", "codeSystem":"2.16.840.1.113883.6.1", "displayName":"GLUCOSE^POST 12H CFST:MCNC:PT:SER/PLAS:QN", "originalText":"some text"})
        obj.setValue('statusCode', {"code":"complete"})
		
	
		subject = obj.findObject("subject")[0]
		patient = subject.findObject("patient")[0]
		patient.setValue("id",{"root":"5.6.7.8","extension":"1"})
		
        responsibleParty = obj.findObject("responsibleParty")[0]
		assignedEntityOrganization = responsibleParty.findObject("assignedEntityOrganization")[0]
		assignedOrganization = assignedEntityOrganization.findObject("assignedOrganization")[0]
		assignedOrganization.setValue("id",{"root":"5.6.7.8","extension":"1"});
        ok(msg.validateMessage())
        HL.syncMessage(function(data) { onSyncComplete(data)}, onSyncFail)


   }
   function onSyncComplete(data){
       ok(data.put==1)  
       start()       
   }

   function onSyncFail(data){
       ok(false)
       start()       
   }

    function run(){
        result = 0 
        HL.clearConfigStore(function(){
            HL.clearMessageStore(function(){
                HL.getConfigDocument("PRPA_MT410001HT02",doTest,log,false)
            })   
        })
    }
    this.run = run

}
