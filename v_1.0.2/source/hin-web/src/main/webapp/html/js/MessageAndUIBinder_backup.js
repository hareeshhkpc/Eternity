/**
 * Class MessageLoader - Used to load the message in the UI and save the data
 * back to the message
 * 
 * @returns MessageAndUIBinder
 * @author Administrator
 */
function MessageAndUIBinder(parentContainerID, messageObject, messageTypeID) {

	var messageAndUIBinder = this;
	updatePathfield = new UpdatePathfield();
	this.parentContainerID = parentContainerID;
	this.messageObject = messageObject;
	this.messageTypeID = messageTypeID;
	this.nodeCollection = [];

	this.editorDOM = "<html><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=ISO-8859-1\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><link rel=\"stylesheet\" href=\"../html/js/jquery.mobile-1.0.1.min.css\" /><!-- <link rel=\"stylesheet\" href=\"../html/css/hin.css\" /> --><link rel=\"stylesheet\" href=\"../html/css/violet.css\" /><link rel=\"stylesheet\" href=\"../html/css/mobile.css\" /><script src=\"../html/js/jquery-1.6.4.min.js\"></script><script src=\"../html/js/jquery.json-2.3.js\"></script><script src=\"../html/js/jquery.mobile-1.0.1.min.js\"></script><script src=\"../html/js/jqm.autoComplete-1.4.js\"></script></head> <body>    <div data-role=\"page\" class=\"ui-align-text\">   <div class=\"ui-form-fields\">        <div style=\"float: left;\" id=\"EDImageEditor\" uiRole=\"editor\">    <img id=\"EDthumbnailBox\" alt=\"Patient Image\" src=\"images/user.png\" width=\"100px\" onclick=\"$('#EDthumbnail').trigger('click')\" >    <input type=\"file\" id=\"EDthumbnail\" dataType=\"ED\" editorType=\"EDImage\" dataField=\"true\" style=\"display:none\" />   </div>     <div id=\"PNCompleteEditor\" uiRole=\"editor\">    <!-- <div id=\"PNCompleteEditor\" uiRole=\"editor\" style=\"width:70%;float:left;\"> -->     <label id=\"PNCompleteEditorLabel\">Name:</label>               <input readonly=\"readonly\" id=\"PNDisplayValue\" type=\"text\" dataType=\"PN\" editorType=\"PNComplete\" hasToggle=\"true\"/>            <div data-role=\"none\" class=\"ui-align-text ui-form-border ui-subEditor\" id=\"SubEditor\">      <label>Name Type:</label>       <div id=\"comboDiv\">       <select type=\"multiple\" id=\"select-nameUse\" name=\"select-choice-1\"  dataField=\"true\"  data-native-menu=\"false\"></select>      </div>            <label>Title:</label>       <div id=\"comboDiv\">       <select type=\"multiple\" id=\"select-prefix\" name=\"select-choice-1\"  dataField=\"true\"  data-native-menu=\"false\"></select>      </div>             <label>Given Name:</label>        <input type=\"text\" id=\"PNgiven\" value=\"\" dataField=\"true\" />              <label>Family Name:</label>       <input type=\"text\" id=\"PNfamily\" value=\"\" dataField=\"true\" />              <label>Suffix:</label>       <input type=\"text\" id=\"PNsuffix\" value=\"\" dataField=\"true\" />     </div>    </div>        <div id=\"PNCompleteName\" uiRole=\"editor\">     <!-- <label id=\"PNCompleteEditorLabel\">Name:</label> -->               <input readonly=\"readonly\" id=\"PNDisplayValue\" type=\"text\" dataType=\"PN\" editorType=\"PNCompleteNameDisplay\" hasToggle=\"false\"/>            <div data-role=\"none\" class=\"ui-align-text ui-form-border ui-subEditor\" id=\"SubEditor\" style=\"display:none\">      <label>Name Type:</label>       <div id=\"comboDiv\">       <select type=\"multiple\" id=\"select-nameUse\" name=\"select-choice-1\"  dataField=\"true\"  data-native-menu=\"false\"></select>      </div>            <label>Title:</label>       <div id=\"comboDiv\">       <select type=\"multiple\" id=\"select-prefix\" name=\"select-choice-1\"  dataField=\"true\"  data-native-menu=\"false\"></select>      </div>             <label>Given Name:</label>        <input type=\"text\" id=\"PNgiven\" value=\"\" dataField=\"true\" />              <label>Family Name:</label>       <input type=\"text\" id=\"PNfamily\" value=\"\" dataField=\"true\" />              <label>Suffix:</label>       <input type=\"text\" id=\"PNsuffix\" value=\"\" dataField=\"true\" />     </div>    </div>            <!-- <div id=\"IIEditor\" uiRole=\"editor\" style=\"width:70%;float:left;\"> -->    <div id=\"IIEditor\" uiRole=\"editor\">     <label id=\"IIEditorLabel\">ID:</label>         <input id=\"IIDisplayValue\" type=\"text\" dataType=\"II\" editorType=\"II\" hasToggle=\"true\"/>           <div data-role=\"none\" class=\"ui-align-text ui-form-border ui-subEditor\" id=\"SubEditor\">       <label id=\"IIrootLabel\">Root:</label>        <input readonly=\"readonly\" type=\"text\" id=\"IIroot\" value=\"\" dataField=\"true\" />           <label id=\"IIextensionLabel\">Extension:</label>        <input type=\"text\" id=\"IIextension\" value=\"\" dataField=\"true\" />               <label id=\"IIassigningAuthorityNameLabel\">Assigning Authority Name:</label>        <input type=\"text\" id=\"IIassigningAuthorityName\" value=\"\" dataField=\"true\" />      </div>          </div>        <div id=\"IIUserNameEditor\" uiRole=\"editor\">     <label id=\"IIUserNameEditorLabel\">ID:</label>         <input id=\"IIUserNameDisplayValue\" type=\"hidden\" dataType=\"II\" editorType=\"IIUserName\" hasToggle=\"true\"/>           <div  data-role=\"none\" class=\"ui-align-text\">        <input type=\"hidden\" id=\"IIUserNameRoot\" value=\"\" dataField=\"true\" />           <input type=\"text\" id=\"IIUserNameExtension\" value=\"\" dataField=\"true\" data-prompt-position=\"topRight\"/>       <input type=\"hidden\" id=\"IIUserNameAssigningAuthorityName\" value=\"\" dataField=\"true\" />     </div>          </div>         <div id=\"IIPasswordEditor\" uiRole=\"editor\">     <label id=\"IIPasswordEditorLabel\">ID:</label>         <input id=\"IIPasswordDisplayValue\" type=\"hidden\" dataType=\"II\" editorType=\"IIPassword\" hasToggle=\"true\"/>           <div  data-role=\"none\" class=\"ui-align-text\">        <input type=\"hidden\" id=\"IIPasswordRoot\" value=\"\" dataField=\"true\" />           <input type=\"password\" id=\"IIPasswordExtension\" value=\"\" dataField=\"true\" data-prompt-position=\"topRight\" />       <input type=\"hidden\" id=\"IIPasswordAssigningAuthorityName\" value=\"\" dataField=\"true\" />     </div>          </div>        <div id=\"CSEditor\" uiRole=\"editor\">     <label id=\"CSEditorLabel\">Status:</label>         <input id=\"CSDisplayValue\" type=\"text\" dataType=\"CS\" editorType=\"CS\" hasToggle=\"true\"/>     <div data-role=\"none\" class=\"ui-align-text ui-form-border ui-subEditor\" id=\"SubEditor\">       <label>Status:</label>        <input type=\"text\" id=\"CSstatusCode\" value=\"\" dataField=\"true\" />      </div>    </div>    <div id=\"TSEditor\" uiRole=\"editor\">     <label id=\"TSEditorLabel\">Birth Time:</label>     <input id=\"TSDisplayValue\" type=\"hidden\" dataType=\"TS\" editorType=\"TS\" hasToggle=\"true\" />     <div data-role=\"none\" class=\"ui-align-text\">            <!-- <label>Birth Time:</label> -->         <!-- <input type=\"text\" readonly=\"readonly\" id=\"TSbirthTime\" value=\"\" dataField=\"true\" date=\"true\" data-role=\"datebox\" data-options='{\"mode\": \"flipbox\"}'/> -->                       <input type=\"text\" data-options='{\"mode\":\"flipbox\", \"noButtonFocusMode\":true, \"dateFormat\": \"YYYY-MM-DD\"}' data-role=\"datebox\" id=\"TSbirthTime\"   value=\"\" dataField=\"true\"                class=\"ui-input-text ui-body-d ui-shadow-inset ui-corner-all ui-icon-datebox\" readonly=\"readonly\">        </div>    </div>         <div id=\"TELEditor\" uiRole=\"editor\">     <label id=\"TELEditorLabel\">Telecoms:</label>         <input readonly=\"readonly\" id=\"TELDisplayValue\" type=\"text\" dataType=\"TEL\" editorType=\"TEL\" hasToggle=\"true\" />     <div data-role=\"none\" class=\"ui-align-text ui-form-border ui-subEditor\" id=\"SubEditor\">      <label>Telecom Type:</label>          <select type=\"multiple\" id=\"select-telecomUse\" dataField=\"true\" name=\"select-choice-1\" data-native-menu=\"false\"></select>                 <label>Telecom:</label>        <input type=\"text\" id=\"TELvalue\" value=\"\" dataField=\"true\" />      </div>    </div>         <div id=\"ADEditor\" uiRole=\"editor\">     <label id=\"ADEditorLabel\">Address:</label>         <input readonly=\"readonly\" id=\"ADDisplayValue\" type=\"text\" dataType=\"AD\" editorType=\"AD\" hasToggle=\"true\"/>     <div data-role=\"none\" class=\"ui-align-text ui-form-border ui-subEditor\" id=\"SubEditor\">        <label>House Number:</label>         <input type=\"text\" id=\"ADhouseNumber\" value=\"\" dataField=\"true\" />                   <label>Street Name:</label>         <input type=\"text\" id=\"ADstreetName\" value=\"\" dataField=\"true\" />                   <label>City :</label>         <div id=\"searchDiv\" style=\"width: 97%;\">         <!-- <input type=\"text\" id=\"select-city\" value=\"\" dataField=\"true\" /> -->         <input data-inline=\"true\" value=\"\" id=\"select-city\" type=\"text\" data-type=\"search\"                      dataField=\"true\" placeholder=\"Search city...\">               <ul id=\"select-cityList\" data-theme=\"v\" data-role=\"listview\" class=\"ui-search-lookup\"></ul>          </div>                      <label>State:</label>          <div id=\"searchDiv\" style=\"width: 97%;\">         <!-- <input type=\"text\" id=\"select-state\" value=\"\" dataField=\"true\" />  -->          <input data-inline=\"true\" value=\"\" id=\"select-state\" type=\"text\" data-type=\"search\"                      dataField=\"true\" placeholder=\"Search state...\">               <ul id=\"select-stateList\" data-theme=\"b\" data-role=\"listview\" class=\"ui-search-lookup\"></ul>          </div>                     <label>Country:</label>         <div id=\"searchDiv\" style=\"width: 97%;\">         <!-- <input type=\"text\" id=\"select-country\" value=\"\" dataField=\"true\" />  -->          <input data-inline=\"true\" value=\"\" id=\"select-country\" type=\"text\" data-type=\"search\"                      dataField=\"true\" placeholder=\"Search country...\">               <ul id=\"select-countryList\" data-theme=\"b\" data-role=\"listview\" class=\"ui-search-lookup\"></ul>          </div>                   <label>Postal Code:</label>         <input type=\"text\" id=\"ADpostalCode\" value=\"\" dataField=\"true\" />               </div>    </div>         <div id=\"CEEditor\" style=\"width:50%\" uiRole=\"editor\">     <label id=\"CEEditorLabel\">Gender:</label>              <input id=\"CEDisplayValue\" type=\"hidden\" dataType=\"CE\" editorType=\"CE\" hasToggle=\"true\"/>             <div id=\"comboDiv\">        <select id=\"select-choice\" name=\"select-choice-1\"  dataField=\"true\"  data-native-menu=\"false\" type=\"multiple\">       </select>       </div>     </div>               </div>      <hr/>        <div id=\"CVListCheckBoxEditor\" uiRole=\"editor\">     <fieldset class=\"ui-grid-a\">      <div class=\"ui-block-a\" style=\"float:left; margin-top:10px\">       <input id=\"CVListCheckBox\" type=\"checkbox\" dataField=\"true\" />      </div>      <div class=\"ui-block-b\" style=\"padding-left:20%; margin-top: -12px;\">        <label id=\"CVListCheckBoxLabel\" type=\"label\"></label>      </div>     </fieldset>     <!-- Used for lookup's coming from concepts -->     <!-- <div id=\"CVListCheckBox\" dataField=\"true\">     </div> -->    </div>    <hr/><hr/>            <!----Do not add uiRole=\"editor\"---->        <div   id=\"GridEditor\">       <div id=\"editorWrapper\" uiRole=\"gridContent\" style=\"padding-bottom: 5px\">           <label id=\"gridLabel\"> </label>      <fieldset class=\"ui-grid-b\">       <div class=\"ui-block-a\" id=\"editor\" style=\"width: 96%;\">        <!--  <input readonly=\"readonly\" style=\"width: 100%\" id=\"IVL_TSDisplayValue\" type=\"text\" dataType=\"IVL_TS\" editorType=\"IVL_TS\"  hasToggle=\"true\"/> -->       </div>       <div class=\"ui-block-b\" id=\"button\" style=\"width: 2%; vertical-align: top;\">        <div id=\"addButton\"  style=\"display: block;\">         <img src=\"images/add.png\"/>         </div>        <div id=\"removeButton\"  style=\"display: block;\">          <img src=\"images/delete.png\"/>         </div>       </div>      </fieldset>     </div>    </div>       <hr/>       <div id=\"IVL_TSEditor\" uiRole=\"editor\">     <label id=\"IVL_TSEditorLabel\">Effective Time:</label>     <input readonly=\"readonly\" id=\"IVL_TSDisplayValue\" type=\"text\" dataType=\"IVL_TS\" editorType=\"IVL_TS\"  hasToggle=\"true\"/>     <div data-role=\"none\" class=\"ui-align-text ui-form-border ui-subEditor\" id=\"SubEditor\">       <label>Start Date:</label>         <input type=\"text\" readonly=\"readonly\" id=\"IVL_TSlow\" value=\"\" dataField=\"true\" date=\"true\" data-role=\"datebox\" data-options='{\"mode\": \"calbox\"}'/>         <br>         <br>         <label>End Date:</label>         <input type=\"text\" readonly=\"readonly\" id=\"IVL_TShigh\" value=\"\" dataField=\"true\" date=\"true\" data-role=\"datebox\" data-options='{\"mode\": \"calbox, \"dateFormat\": \"%B %d, %Y\"}'/>        </div>    </div>               <div id=\"CVListEditor\" uiRole=\"editor\">     <label id=\"CVListEditorLabel\">Race Code:</label>     <input id=\"CVListDisplayValue\" type=\"hidden\" dataField=\"true\"/>     <!-- <select type=\"multiple\" id=\"select-choice\" name=\"select-choice-1\"  dataField=\"true\"  data-native-menu=\"false\" >     </select>  -->      <div id=\"comboDiv\">       <select id=\"select-choice\" name=\"select-choice-1\"  dataField=\"true\"  data-native-menu=\"false\" type=\"multiple\">      </select>     </div>        </div>        <div id=\"CDLabelEditor\" uiRole=\"editor\">     <label id=\"CDLabelEditorLabel\" type=\"label\" >Just a label</label>         <input id=\"CDLabelEditorLabelHidden\" type=\"hidden\" dataField=\"true\" dataType=\"CD\" editorType=\"CDLabel\" />    </div>        <div id=\"PQInplaceEditor\" uiRole=\"editor\">     <input id=\"PQInplaceDisplayValue\" type=\"text\" labelField=\"CDLabelEditorLabelHidden\" dataField=\"true\" dataType=\"PQ\" hasToggle=\"true\" editorType=\"PQInplace\" />    </div>         <div id=\"MOInplaceEditor\" uiRole=\"editor\">     <input id=\"MOInplaceDisplayValue\" type=\"text\" labelField=\"CDLabelEditorLabelHidden\" dataField=\"true\" dataType=\"MO\"  editorType=\"MOInplace\" />    </div>         <div id=\"PQInplaceComboEditor\" uiRole=\"editor\">      <input id=\"PQInplaceComboDisplayValue\" type=\"hidden\"/>     <div id=\"comboDiv\">      <select type=\"multiple\" id=\"select-choice\" name=\"select-choice-1\"  dataField=\"true\"  data-native-menu=\"false\"               labelField=\"CDLabelEditorLabelHidden\">      </select>      </div>     </div>        <div id=\"CalendarEditor\" uiRole=\"editor\">     <input id=\"calendarData\" type=\"text\" dataType=\"IVL_TS\" editorType=\"Calendar\" hasToggle=\"true\" dataField=\"true\"/>       <input id=\"cFrom\" type=\"hidden\" dataField=\"true\"/>     <input id=\"cTo\" type=\"hidden\" dataField=\"true\"/>    </div>    <div id=\"CDInplaceEditor\" uiRole=\"editor\">     <input id=\"commentsValue\" type=\"text\" dataField=\"true\" dataType=\"CD\" editorType=\"CDInplace\" />    </div>    <div id=\"CEInplaceEditor\" uiRole=\"editor\">     <input id=\"reasonValue\" type=\"text\" dataField=\"true\" dataType=\"CE\"  editorType=\"CEInplace\" />    </div>    <div id=\"PQBooleanEditor\"  uiRole=\"editor\">    <div class=\"ui-grid-a\" data-role=\"controlgroup\" style=\"margin-bottom:25px;\"  hasToggle=\"true\">     <div class=\"ui-block-a\">      <div style=\"float:left\">       <label>Yes</label>      </div>      <div style=\"float:left;margin-top:4px;margin-left:-15px\">       <input type=\"radio\" name=\"radioEditor\" id=\"radioEditor1\" value=\"1\" dataField=\"true\" labelField=\"CDLabelEditorLabelHidden\"/>      </div>      </div>      <div class=\"ui-block-b\">      <div style=\"float:left\">         <label>No</label>             </div>      <div style=\"float:left;margin-top:4px;margin-left:-15px\">       <input type=\"radio\" name=\"radioEditor\" id=\"radioEditor2\" value=\"0\" dataField=\"true\" labelField=\"CDLabelEditorLabelHidden\"/>      </div>      </div>      </div>    </div>   <div id=\"PhysicianLookupEditor\" uiRole=\"editor\">    <div id=\"searchDiv\">      <input type=\"text\" id=\"pPhysician\" placeholder=\"Search\" editorType=\"PhysicianLookup\" dataField=\"true\"/>      <input id=\"consultant\" type=\"hidden\" dataField=\"true\"/>     <ul data-role=\"listview\" data-inset=\"true\" style=\"width: 30%;position: absolute; z-index: 1000;\"></ul>    </div>    </div>      <div id=\"ServiceLookupEditor\" uiRole=\"editor\">    <div id=\"searchDiv\">      <input type=\"text\" id=\"sService\" placeholder=\"Search\" dataType=\"CD\" hasToggle=\"true\" editorType=\"ServiceLookup\" dataField=\"true\"/>     <ul data-role=\"listview\" data-inset=\"true\" style=\"width: 30%;position: absolute; z-index: 1000;\" dataField=\"true\"></ul>    </div>    </div>        <!-- Three Textbox editor  -->    <div id=\"CVListThreeTextboxEditor\" uiRole=\"editor\">   <div>    <label id=\"CVListThreeTextboxEditorLabel\">Surgery:</label>   </div>   <input id=\"CVListThreeTextboxDisplayValue\" type=\"text\" dataType=\"CVList\" hasToggle=\"true\" />     <div data-role=\"none\" class=\"ui-align-text ui-form-border ui-subEditor\" id=\"SubEditor\">    <label id=\"CVListTextboxYearLabel\">Year </label>     <input type=\"text\" id=\"CVListTextboxYear\" value=\"\" dataField=\"true\" />         <label id=\"CVListTextboxReasonLabel\">Reason</label>     <input type=\"text\" id=\"CVListTextboxReason\" value=\"\" dataField=\"true\" />         <label id=\"CVListTextboxHospitalLabel\">Hospital</label>     <input type=\"text\" id=\"CVListTextboxHospital\" value=\"\" dataField=\"true\" />   </div>  </div>  <!-- Two Textbox editor  -->    <div id=\"CVListTwoTextboxEditor\" uiRole=\"editor\">   <div>    <label id=\"CVListTwoTextboxEditorLabel\">Allergies:</label>   </div>   <input id=\"CVListTwoTextboxDisplayValue\" type=\"text\"    dataType=\"CVList\" hasToggle=\"true\" />   <div data-role=\"none\"    class=\"ui-align-text ui-form-border ui-subEditor\" id=\"SubEditor\">    <label id=\"CVListTextboxDrugLabel\">Name the Drug </label> <input     type=\"text\" id=\"CVListTextboxDrug\" value=\"\" dataField=\"true\" /> <label     id=\"CVListTextboxReactionLabel\">Reaction You Had</label>      <input type=\"text\" id=\"CVListTextboxReaction\" value=\"\" dataField=\"true\" />   </div>  </div>  <!-- Single Textbox editor  -->  <div id=\"CVListTextboxEditor\" uiRole=\"editor\">    <label id=\"CVListTextboxEditorLabel\">Health</label>    <input type=\"text\" id=\"CVListTextboxHealth\" value=\"\" dataField=\"true\" />  </div>  <!--TextArea editor  -->  <div id=\"CVListTextareaEditor\" uiRole=\"editor\" >   <label id=\"CVListTextareaEditorLabel\">List</label>         <textarea type=\"text\" name=\"textarea\" id=\"CVListTextareaList\"  value=\"\" dataField=\"true\" rows=\"20\"> </textarea>  </div>    <!-- Boolean editor  -->    <div id=\"CVListBooleanEditor\" uiRole=\"editor\">  <label id=\"CVListBooleanLabel\"></label>    <fieldset class=\"ui-grid-b\" style=\"margin-top:10px;\">    <div class=\"ui-block-a\">     <fieldset class=\"ui-grid-b\">      <div class=\"ui-block-a\">       <input type=\"radio\" labelfield=\"CDLabelEditorLabelHidden1\" datafield=\"true\" value=\"1\" id=\"radioEditor1\" name=\"radioEditor\">      </div>      <div class=\"ui-block-b\" style=\"margin-left: -40px; margin-top: -5px;\">       Yes      </div>     </fieldset>     </div>    <div class=\"ui-block-b\">    <fieldset class=\"ui-grid-b\">      <div class=\"ui-block-a\">       <input type=\"radio\" name=\"radioEditor\" id=\"radioEditor2\" value=\"0\" dataField=\"true\" labelField=\"CDLabelEditorLabelHidden\" />      </div>      <div class=\"ui-block-b\" style=\"margin-left: -40px; margin-top: -5px;\">       No      </div>     </fieldset>           </div>   </fieldset>   </div>  <!-- CVList Calender -->    <div  id=\"CVListCalenderEditor\" uiRole=\"editor\">   <label id=\"CVListCalenderLabel\">Birth Time:</label>   <input id=\"CVListCalenderDisplayValue\" type=\"hidden\"/>   <div data-role=\"none\" class=\"ui-align-text\">            <input type=\"text\" readonly=\"readonly\" id=\"CVListCalenderbirthTime\" value=\"\" dataField=\"true\" date=\"true\" data-role=\"datebox\" data-options='{\"mode\": \"flipbox\",\"noButtonFocusMode\":true}'/>           </div>     </div>  <!-- CVList Slider -->    <div id=\"CVListSliderEditor\" uiRole=\"editor\">   <div style=\"padding-bottom:9px;\">     <label id=\"CVListSliderLabel\"></label>   </div>   <div>    <div class=\"increment\">Very unhealthy</div>    <div class=\"increment\">     <a href=\"#\" data-role=\"button\" data-icon=\"arrow-l\"      data-iconpos=\"notext\" data-theme=\"v\" data-inline=\"true\"      id=\"decrementHealth\"></a>            <input type=\"hidden\" id=\"numericHealthHidden\" value=\"\"  dataField=\"true\"/>       <span id=\"numericHealth\" type=\"text\">1</span>           <a href=\"#\" data-role=\"button\"      data-icon=\"arrow-r\" data-iconpos=\"notext\" data-theme=\"v\"      data-inline=\"true\" id=\"incrementHealth\"></a>    </div>    <div class=\"decrement\">Very healthy</div>   </div>   <br/><br/><br/>  </div>     <div id=\"EDBooleanEditor\" uiRole=\"editor\">    <div class=\"ui-grid-a\" data-role=\"none\" style=\"margin-bottom:25px;\">     <div class=\"ui-block-a\" data-role=\"none\">      <div style=\"float:left\">      <label id=\"label1\" for=\"radioEditor1\">Yes</label>      </div>      <div style=\"float:left;margin-top:4px;margin-left:-15px\">       <input type=\"radio\" name=\"radioEditor\" id=\"radioEditor1\" value=\"1\" dataField=\"true\" labelField=\"CDLabelEditorLabelHidden\"/>      </div>      </div>      <div class=\"ui-block-b\" data-role=\"none\">      <div style=\"float:left\">         <label id=\"label2\" for=\"radioEditor2\">No</label>      </div>      <div style=\"float:left;margin-top:4px;margin-left:-15px\">       <input type=\"radio\" name=\"radioEditor\" id=\"radioEditor2\" value=\"0\" dataField=\"true\" labelField=\"CDLabelEditorLabelHidden\"/>      </div>      </div>      </div>   </div>   <div id=\"EDTextBoxEditor\" uiRole=\"editor\">     <input id=\"EDDisplayValue\" type=\"text\" dataField=\"true\" dataType=\"ED\"  editorType=\"EDTextBox\" />   </div>      <div id=\"ONEditor\" uiRole=\"editor\">    <label id=\"ONEditorLabel\">Name:</label>        <input readonly=\"readonly\" id=\"ONDisplayValue\" type=\"text\" dataType=\"ON\" editorType=\"ON\" hasToggle=\"true\"/>    <div data-role=\"none\" class=\"ui-align-text ui-form-border ui-subEditor\" id=\"SubEditor\">      <label>Name Type:</label>      <div id=\"comboDiv\">      <select type=\"multiple\" id=\"ONuse\" name=\"select-choice-1\"  dataField=\"true\"  data-native-menu=\"false\"></select>     </div>     <label>Name:</label>         <input type=\"text\" id=\"ONprefix\" value=\"\" dataField=\"true\" />    </div>   </div>         <div id=\"EntityLookupEditor\" uiRole=\"editor\">     <input id=\"consultant\" type=\"hidden\"/>     <div id=\"searchDiv\">      <input type=\"text\" id=\"EntityDisplayValue\" placeholder=\"Search\" dataField=\"true\"/>      <ul id=\"entityList\" data-role=\"listview\" data-inset=\"true\" style=\"width: 30%;position: absolute; z-index: 1000;\"></ul>    </div>      </div>      <div id=\"STEditor\" uiRole=\"editor\">    <label id=\"STEditorLabel\">Job Title.:</label>        <input id=\"STDisplayValue\" type=\"hidden\" dataType=\"ST\" editorType=\"ST\" hasToggle=\"true\"/>    <input type=\"text\" id=\"STtext\" value=\"\" dataField=\"true\" />    </div>      <div id=\"EDCheckBoxEditor\" uiRole=\"editor\">    <input id=\"EDCheckBoxDisplayValue\" type=\"checkbox\" dataField=\"true\" />    <label id=\"EDCheckBoxLabel\" type=\"label\"  dataField=\"true\"></label>    </div>      <div id=\"EDSpanEditor\" uiRole=\"editor\">    <span id=\"EDSpan\" dataField=\"true\"></span>   </div>      <div id=\"CDCheckBoxEditor\" uiRole=\"editor\" style=\"width:70%;float:left;\">    <div style=\"width:20%;float:left;margin-top:5px;\">    <input id=\"CDCheckBoxDisplayValue\" type=\"checkbox\" dataField=\"true\" />    </div>    <div style=\"width:70%;float:left\">    <label id=\"CDCheckBoxLabel\" type=\"label\"></label>    </div>    </div>   <div id=\"CDEditor\" style=\"width:50%\" uiRole=\"editor\">     <label id=\"CDEditorLabel\">:</label>              <input id=\"CDDisplayValue\" type=\"hidden\" dataType=\"CD\" editorType=\"CD\" hasToggle=\"true\"/>             <div id=\"comboDiv\">        <select id=\"select-choice\" name=\"select-choice-1\"  dataField=\"true\"  data-native-menu=\"false\" type=\"multiple\">       </select>       </div>     </div>         <div id=\"CESearchEditor\" uiRole=\"editor\">     <label id=\"CESearchLabel\"></label>       <div id=\"searchDiv\" style=\"width: 100%;\">       <input data-inline=\"true\" value=\"\" id=\"select-dose\" type=\"text\" data-type=\"search\"                    dataField=\"true\" placeholder=\"Search\">             <ul id=\"select-doseList\" data-theme=\"v\" data-role=\"listview\" class=\"ui-search-lookup\"></ul>        </div>    </div>   <div id=\"IIPermissionEditor\" uiRole=\"editor\">   <input id=\"IIPermissionEditorDisplayValue\" type=\"hidden\"    dataType=\"II\" editorType=\"IIPermission\" hasToggle=\"true\" /> <label    type=\"label\" for=\"permissionlabel\" id=\"IIPermissionRoot\"></label> <input    type=\"checkbox\" id=\"IIPermissionExtension\" value=\"\" dataField=\"true\" />   <input type=\"hidden\" id=\"IIPermissionAssigningAuthorityName\" value=\"\"    dataField=\"true\" />  </div>  </div>  </body></html>";


	 // Lookup handler to load and display all lookups of this message
	 
	this.lookupHandler = null;
	this.bindLookups = bindLookups;
	var bindPhysicianLookups = new Array();
	var bindServiceLookups = new Array();
	var physicianLookupMap = new HIN.HashMap();
	var serviceLookupMap = new HIN.HashMap();

	this.updateNullFlavour = updateNullFlavour;
	this.retrieveNullFlavor = retrieveNullFlavor;
	this.makeQueryForLucene = makeQueryForLucene;
	//this.makeQueryForCassandra=makeQueryForCassandra;
	
	this.getIIXml = getIIXml;
	this.getTSXml = getTSXml;
	this.getEDXml = getEDXml;
	this.getIVL_TSXml = getIVL_TSXml
	this.getPNXml = getPNXml;
	this.getCSXml = getCSXml;
	this.getTELXml = getTELXml;
	this.getADXml = getADXml;
	this.getCEXml = getCEXml;
	this.getCVListXml = getCVListXml;
	this.getCVXml = getCVXml;
	this.getPQXml = getPQXml;
	this.getCDXml = getCDXml;
	this.getONXml = getONXml;
	this.getSTXml = getSTXml;
	this.getMOXml = getMOXml;
	this.getRTO_PQ_PQXml = getRTO_PQ_PQXml;
	this.getRTO_MO_PQXml = getRTO_MO_PQXml;
	
	this.getIIObject = getIIObject;
	this.getPNObject = getPNObject;
	this.getTSObject = getTSObject;
	this.getEDObject = getEDObject;
	this.getIVL_TSObject = getIVL_TSObject;
	this.getCSObject = getCSObject;
	this.getTELObject = getTELObject;
	this.getADObject = getADObject;
	this.getCEObject = getCEObject;
	this.getCVListObject = getCVListObject;
	this.getPQObject = getPQObject;
	this.getCDObject = getCDObject;
	/*this.getCVObject = getCVObject;*/
	this.getONObject = getONObject;
	this.getSTObject = getSTObject;
	this.getMOObject = getMOObject;
	this.getRTO_PQ_PQObject = getRTO_PQ_PQObject;
	this.getRTO_MO_PQObject = getRTO_MO_PQObject;
	
	this.getPNCompleteUI = getPNCompleteUI;
	this.getIIUI = getIIUI;
	this.getIIUserNameUI = getIIUserNameUI;
	this.getIIPasswordUI = getIIPasswordUI;
	this.getCVListCheckBoxUI = getCVListCheckBoxUI;
	this.getCSUI = getCSUI;
	this.getTELUI = getTELUI;
	this.getADUI = getADUI;
	this.getCEUI = getCEUI;
	this.getCDUI = getCDUI;
	this.getCVListThreeTextboxUI = getCVListThreeTextboxUI;
	this.getCVListTwoTextboxUI = getCVListTwoTextboxUI;
	this.getCVListTextboxUI = getCVListTextboxUI;
	this.getCVListTextareaUI = getCVListTextareaUI;
	this.getGridUI = getGridUI;
	this.getEDImageUI = getEDImageUI;
	this.getTSUI = getTSUI;
	this.getIVL_TSUI = getIVL_TSUI;
	this.getCVListUI = getCVListUI;
	this.getPQInplaceUI = getPQInplaceUI;
	this.getCDLabelUI = getCDLabelUI;
	this.getPQInplaceComboUI = getPQInplaceComboUI;
	this.getCalendarUI = getCalendarUI;
	this.getPQBooleanUI = getPQBooleanUI;
	this.getEDBooleanUI = getEDBooleanUI;
	this.getEDTextBoxUI = getEDTextBoxUI;
	this.getCDInplaceUI = getCDInplaceUI;
	this.getCEInplaceUI = getCEInplaceUI;
	this.getPhysicianLookupUI = getPhysicianLookupUI;
	this.getServiceLookupUI = getServiceLookupUI;
	this.getCVListCalenderUI = getCVListCalenderUI;
	this.getCVListSliderUI = getCVListSliderUI;
	this.getCVListBooleanUI = getCVListBooleanUI;
	this.getEDCheckBoxUI = getEDCheckBoxUI;
	this.getONUI = getONUI;
	this.getEntityLookupUI = getEntityLookupUI;
	this.getEDSpanUI = getEDSpanUI;
	this.getSTUI = getSTUI;
	this.getCSInplaceUI = getCSInplaceUI;
	this.getMOInplaceUI= getMOInplaceUI;
	this.getCDCheckBoxUI = getCDCheckBoxUI;
	this.getCESearchUI  = getCESearchUI;

	this.getPNCompleteValues = getPNCompleteValues;
	this.getIIValues = getIIValues;
	this.getCSValues = getCSValues;
	this.getTELValues = getTELValues;
	this.getADValues = getADValues;
	this.getCEValues = getCEValues;
	this.getTSValues = getTSValues;
	this.getIVL_TSValues = getIVL_TSValues;
	this.getCVListThreeTextboxValues = getCVListThreeTextboxValues;
	this.getCVListTwoTextboxValues = getCVListTwoTextboxValues;
	this.getCVListTextboxValues = getCVListTextboxValues;
	this.getCVListTextareaValues = getCVListTextareaValues;
	this.getCalendarValues = getCalendarValues;
	this.getPhysicianLookupValues = getPhysicianLookupValues;
	this.getPQInplaceValues = getPQInplaceValues;
	this.getPQBooleanValues = getPQBooleanValues;
	this.getONValues = getONValues;
	this.getCSInplaceValues = getCSInplaceValues;
	this.getSTValues = getSTValues;

	this.createMessageObjects = createMessageObjects;
	this.readMessageObjects = readMessageObjects;
	this.readValueFromMessage = readValueFromMessage;
	this.writeValueToMessage = writeValueToMessage;
	this.createNodeAtIndex = createNodeAtIndex;
	this.loadDataOntoForm = loadDataOntoForm;
	this.updateFieldValueToMessage = updateFieldValueToMessage;
	this.updateSingleFieldToMessage = updateSingleFieldToMessage;
	this.bindFieldEvents = bindFieldEvents;
	this.toggleEditor = toggleEditor;
	this.addGridEditor = addGridEditor;
	this.removeRow = removeRow;
	this.getEditoValues = getEditoValues;
	this.checkInstanceObject = checkInstanceObject;
	this.loadDataToEditor = loadDataToEditor;
	this.getIIPermissionUI = getIIPermissionUI;
	
	this.setSMOValue = setSMOValue;
	this.setPNSMOValue = setPNSMOValue;
	this.getPNSMOValue = getPNSMOValue;

	var fieldMap = [];
	/**
	 * used to bind all the fields in the Dom which have the attribute  dataField="true" 
	 */
	function bindFieldEvents() {
		//alert("bind");
		$('#' + messageAndUIBinder.parentContainerID).find('[dataField="true"]').unbind('change', messageAndUIBinder.updateFieldValueToMessage);
		$('#' + messageAndUIBinder.parentContainerID).find('[dataField="true"]').bind('change', messageAndUIBinder.updateFieldValueToMessage);
		$('#' + messageAndUIBinder.parentContainerID).find('[hasToggle="true"]').unbind('click', messageAndUIBinder.toggleEditor);
		$('#' + messageAndUIBinder.parentContainerID).find('[hasToggle="true"]').bind('click', messageAndUIBinder.toggleEditor);
		$('#' + messageAndUIBinder.parentContainerID).find('span[dataField="true"]').unbind('DOMSubtreeModified', messageAndUIBinder.updateFieldValueToMessage);
		$('#' + messageAndUIBinder.parentContainerID).find('span[dataField="true"]').bind('DOMSubtreeModified',messageAndUIBinder.updateFieldValueToMessage);
		$("#signUpForm").validationEngine('attach', {
			bindMethod : "live"
		});
		$("#staffRegistrationForm").validationEngine('attach', {
			bindMethod : "live"
		});
	};

	/**
	 * On change of any field in the DOM with the attribute dataField="true" this method is executed, 
	 * field values are fetched and an "instanceObject" is updated with these values
	 * This "instanceObject" is passed to  writeValueToMessage() to update the XML
	 */
	function updateFieldValueToMessage() {
		var parentDiv  =  $(this).closest('[uiRole="editor"]')[0];// $('#'+parentContainerID);
		var isEditorDiv  =  $(parentDiv).closest('[isEditor="true"]');
		if(isEditorDiv && isEditorDiv.length > 0){
			isEditorDiv = isEditorDiv[0];
		}
		if(isEditorDiv && $(isEditorDiv).attr('groupId')){		
			var groupId = $(isEditorDiv).attr('groupId');
			
			// Empty the nodeCollection in first place
			messageAndUIBinder.nodeCollection = [];
			var pathFields = null;
			var tagName = null;
			
			// We got a groupId. Need to collect xml nodes of all othem and make a batch write to the message.
			$('#' + messageAndUIBinder.parentContainerID).find('[groupId=' + groupId + ']').each(function(key, uiField){
				var fieldInEditor = $(uiField).find('[dataField="true"]')[0];
				
				pathFields = $(fieldInEditor).attr('pathFields').split(',');
				tagName    = $(fieldInEditor).attr('tagName');
				
				var writeImmediate = false;
				messageAndUIBinder.updateSingleFieldToMessage(fieldInEditor, writeImmediate);
			});
			
			// Batch update message
			// alert("nodeCollection: " + messageAndUIBinder.nodeCollection.length);
			
			// Batch update of EMPID & ROLE_NAME
			messageAndUIBinder.createMessageObjects(pathFields, tagName);
		}
		else{
			var writeImmediate = true;
			messageAndUIBinder.updateSingleFieldToMessage(this, writeImmediate);
		}
	};
	
	function updateSingleFieldToMessage(fieldInEditor, writeImmediate){
		var thisID     = $(fieldInEditor).attr('id');
		var value      = $(fieldInEditor).val();
		var type       = $(fieldInEditor).attr('dataType');
		var tagName    = $(fieldInEditor).attr('tagName');
		var fields     = $(fieldInEditor).attr('fields').split(',');
		var parentDiv  =  $(fieldInEditor).closest('[uiRole="editor"]')[0];// $('#'+parentContainerID);
		var pathFields = $(fieldInEditor).attr('pathFields').split(',');
		var labelField = $(fieldInEditor).attr('labelField');
		
		if (labelField) {
			$('#' + messageAndUIBinder.parentContainerID).find('#' + labelField).trigger("change");
		}

		var instanceObject = [];
		var nullSet       = true;
		var image         = false; 
		
		$.each(fields,function(key, fieldId) { 
				
			    image = false;
				if ($(parentDiv).find('#' + fieldId).attr("type") == "file") {
						image = true;
						var oFReader = new FileReader(), rFilter = /^(image\/bmp|image\/cis-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x-cmu-raster|image\/x-cmx|image\/x-icon|image\/x-portable-anymap|image\/x-portable-bitmap|image\/x-portable-graymap|image\/x-portable-pixmap|image\/x-rgb|image\/x-xbitmap|image\/x-xpixmap|image\/x-xwindowdump)$/i;
						var oFile = document.getElementById(fieldId).files[0];
						
						if (!rFilter.test(oFile.type)) {
								alert("You must select a valid image file!");
								return;
						}
						
						oFReader.readAsDataURL(oFile);
						oFReader.onload = function(oFREvent) { 
							$(parentDiv).find('#' + fieldId + "Box").attr("src", oFREvent.target.result);
							instanceObject.push((fieldId === 'null') ? null: oFREvent.target.result);
	
							$.each(instanceObject,function(key, value) {
								if (value && value !== null || $.trim(value) !== '') {
									nullSet = false;
								}
							});
	
							if (nullSet === true) {
								instanceObject = [ {'nullFlavor' : 'NI'} ];
							}
							
							messageAndUIBinder.writeValueToMessage(tagName, pathFields, type,instanceObject, writeImmediate);
						};
				 }
	
				else if ($(parentDiv).find('#' + fieldId).attr('type') == 'text'|| $(parentDiv).find('#' + fieldId).attr('type') == 'hidden'||
						 $(parentDiv).find('#' + fieldId).attr('type') == 'multiple' || $(parentDiv).find('#' + fieldId).attr('type') == 'password') {
					instanceObject.push((fieldId === 'null') ? null: $(parentDiv).find('#' + fieldId).val());
				} 
			    
				else if ($(parentDiv).find('#' + fieldId).attr('type') == 'date') {
					instanceObject.push((fieldId === 'null') ? null: $(parentDiv).find('#' + fieldId).val());
				}
	
				else if ($(parentDiv).find('#' + fieldId).attr('type') == 'label' && type === 'CVList') {
					instanceObject.push($(parentDiv).find('#' + fieldId).text());
					instanceObject.push($(parentDiv).find('#' + fieldId).text());
				}
	
				else if ($(parentDiv).find('#' + fieldId).attr('type') == 'label') {
					instanceObject.push($(parentDiv).find('#' + fieldId).text());
				}
	
				else if ($(parentDiv).find('#' + fieldId).attr('type') == 'checkbox' && type === 'CVList') {
					//alert("in cvlist");
					if ($(parentDiv).find('#' + fieldId).is(":checked")) {
							instanceObject.push($(parentDiv).find('#' + fieldId).val());
							instanceObject.push($(parentDiv).find('#' + fieldId).val());
					 } 
					 else {
							instanceObject.push(null);
							instanceObject.push(null);
						}
				}
				
				else if ($(parentDiv).find('#' + fieldId).attr('type') == 'checkbox' && type === 'II') {
					if ($(parentDiv).find('#' + fieldId).is(":checked")) {
							instanceObject.push('1');
							
					 } 
					 else {
							instanceObject.push('0');
							
						}
				}
				
				/*CHECK BOX UPDATE XML */
				else if ($(parentDiv).find('#' + fieldId).attr('type') == 'checkbox') {					
					//alert("in check box: "+ $(parentDiv).find('#' + fieldId).val());
					if ($(parentDiv).find('#' + fieldId).is(":checked")) {
							instanceObject.push($(parentDiv).find('#' + fieldId).val());
					 } 
					 else {
							instanceObject.push(null);
						}
				}
				
				
			 else if ($(parentDiv).find('#' + fieldId).attr('type') == 'radio') {
				// alert("in radio");
				if ($(parentDiv).find('#' + fieldId).is(':checked')) {
					instanceObject.push($(parentDiv).find('#' + fieldId).val());
					
					if($(parentDiv).find('#' + fieldId).attr('dataType') == 'CVList'){
						instanceObject.push($(parentDiv).find('#' + fieldId).val());
					}	
				} 
				/*else {
					instanceObject.push(null);
				}*/
			}
	
			else {
				instanceObject.push((fieldId === 'null') ? null: $(parentDiv).find('#' + fieldId).text());
			}
	
		});

		if (image == false) {
			$.each(instanceObject, function(key, value) {
				if (value && value !== null || $.trim(value) !== '') {
					nullSet = false;
				}
			});
	
			if (nullSet === true) {
				instanceObject = [ {'nullFlavor' : 'NI'} ];
			}
	
			messageAndUIBinder.writeValueToMessage(tagName, pathFields, type, instanceObject, writeImmediate);
		}
	};

	/**
	 * Used to create the the Xml node to be updated to the message,
	 * it calls the get XML methods based on the datatype of the node to be created 
	 * @param : 
	 *    tagName: Name of the node to be created 
	 *    pathFields: Path where the node has to be updated (varies based on the config file used) 
	 *    type: dataType of the node being updated 
	 *    instanceObject: Object that contains the values retrieved from the UI
	 *    writeImmediate: Whether to write the value immediately to message or keep in nodeCollection
	 */
	function writeValueToMessage(tagName, pathFields, type, instanceObject, writeImmediate) {
		//alert("in write");
		messageAndUIBinder.checkInstanceObject(instanceObject, tagName);
		var node = instanceObject;
		var methodName = ('get' + type + 'Xml');
		
		/*if (methodName in messageAndUIBinder) {
			try {
				eval('node = messageAndUIBinder.' + methodName
						+ '(tagName, instanceObject)');
			} catch (error) {
				// Error occured. Better return
				return;
			}
		}*/
		
		if(writeImmediate != undefined && writeImmediate === false){
			// Push the node to write as batch
			messageAndUIBinder.nodeCollection.push({node: node, type: type});
		}
		else{
			messageAndUIBinder.createMessageObjects(pathFields, tagName, node, type);
		}
		
	}

	/**
	 *  retrieves the node from the message based on the on the tagName and pathField, 
	 *  calls the get object method based on the dataType, where the values from the xml node are update to an object 
	 *  @param:
	 *      tagName: name of the tag to be found in the message 
	 *      pathFields: Path at which the node has to be found in the message 
	 *      type: Data type of the node to be found
	 *  @return : returns teh "instanceObject" which has all the values retrieved from the XML Node          
	 */
	function readValueFromMessage(tagName, pathFields, type, node) {
		var instanceObject = [];

		if (node === null) {
			console.log("null returned from messageAndUIBinder.readMessageObjects()");
			return instanceObject;
		}

		var methodName = ('get' + type + 'SMOValue');

		if (methodName in messageAndUIBinder) {
			try {
				eval('instanceObject = messageAndUIBinder.' + methodName
						+ '(node)');
			} catch (error) {
				instanceObject = [];
			}
		}
		
		//messageAndUIBinder.checkInstanceObject(instanceObject, tagName);
		
		return instanceObject;
	};
	
	function checkInstanceObject(instanceObject, tagName){
		var inst = "";
		$(instanceObject).each(function(key, val){
			inst += val + ",";
		});
	}

	/**
	 * creats the UI by loading all the editors
	 * @param: 
	 *   lookupHandler : an object of lookupHandler.js, this helps in loading the lookups after editor load
	 */
	function loadDataOntoForm(lookupHandler) {
		//alert("in load");
		messageAndUIBinder.lookupHandler = lookupHandler;
		
		editors = $('#' + messageAndUIBinder.parentContainerID).find('[isEditor="true"]');
		if(editors && editors.length > 0){
			processEditors(0, editors);
		}


		/**
		 * iterates through "editorsArray" and calls the loadEditor() to load the editor 
		 * @param index : index for the "editorsArray" 
		 * @param editorsArray : Its an array of HTML Fragments which contain the attribute isEditor="true"
		 */
		function processEditors(index, editorsArray){
			loadEditor(editorsArray[index++], function(){
				if(index < editorsArray.length){
					processEditors(index, editorsArray);
				}
				else{
				}
			});
		}

		/**
		 * loads the editor for HTML Fragment based on its "editorType"
		 * @param editorObject : HTML Fragment which has the required info for the editor to load 
		 * @param callbackAfterEditorLoad : callBack function being after each editor load 
		 */
		function loadEditor(editorObject, callbackAfterEditorLoad) {
			var dataType     = $(editorObject).attr('dataType');
			var editorType   = $(editorObject).attr('editorType');
			var configParams = $(editorObject).attr('configParams');
			

			try {
				eval('var configParamsObj=' + configParams);
			} catch (error) {
				alert("Invalid JSON config params from the form: "
						+ configParams);
				return;
			}

			var methodName = ('get' + editorType + 'UI');
		
			if (methodName in messageAndUIBinder) {
				try {
					eval('messageAndUIBinder.' + methodName
							+ '(editorObject, configParamsObj)');
				} catch (error) {
					return;
				}
				
			}
			
			if($(editorObject).attr('editorType') == 'Grid'){
				var pathField  = $(editorObject).attr('pathFields').split(',');
				var tagName    = $(editorObject).attr('tagName');
				var pathFields = '';
				var found      = [];
				var res;
				
				for(var j = 0; j < pathField.length; j++ ){
					if(pathField[j] && pathField[j] !== "")
						pathFields +=  pathField[j]+"/";
				 }

				var xpath      = "//"+pathFields+tagName;
				var result = XmlUtil.getXPathResult(messageAndUIBinder.messageObject.getXML(), xpath,  XPathResult.ORDERED_NODE_ITERATOR_TYPE);
				
				while (res = result.iterateNext()){
				  found.push(res);
				 }
				
			   for(var i = 0; i < (found.length-1); i++){
				   $(editorObject).find("#addButton").trigger("click");
			    }

			}
			
			if(callbackAfterEditorLoad){
				callbackAfterEditorLoad();
			}
		}


		/**
		 * binding the fields, to load look up values 
		 */
		messageAndUIBinder.bindLookups(callbackAfterLookupLoading);

		
		function processGroupFields(groupIdMap){
			$.each(groupIdMap,function(index,groupId){
				
				var fieldGroupArray = $('#' + messageAndUIBinder.parentContainerID).find('[groupId=' + groupId + ']');
				
				//alert("fieldGroupArray: "+fieldGroupArray.length+"  groupId: "+groupId);
				
				if(fieldGroupArray.length > 0){
					var groupEle = fieldGroupArray[0];
					var fieldInEditor = $(groupEle).find('[dataField="true"]')[0];
					
					/* to make sure the editor is loaded brfore loadDataToEditor() is called */
					if(fieldInEditor){
						var type               = $(groupEle).attr('dataType');
						var tagName            = $(groupEle).attr('tagName');
						var pathFields          = $(groupEle).attr('pathFields');
						if(pathFields){
						 pathFields  = pathFields.split(',');
						}
						else{
							pathFields = [];
						}
						messageAndUIBinder.nodeCollection =  messageAndUIBinder.readMessageObjects(pathFields, tagName);
						
						$.each(fieldGroupArray, function(key, uiField){
							//alert("in each " + messageAndUIBinder.nodeCollection);
							var fieldInEditor = $(uiField).find('[dataField="true"]')[0];
							
							var instanceObject = null;
							
							var type               = $(fieldInEditor).attr('dataType');
							var tagName            = $(fieldInEditor).attr('tagName');
							var pathFields         = $(fieldInEditor).attr('pathFields').split(',');
							if(messageAndUIBinder.nodeCollection){
								//alert("messageAndUIBinder.nodeCollection: "+ messageAndUIBinder.nodeCollection.length);
								if(fieldGroupArray.length == 1){
									var node = messageAndUIBinder.nodeCollection;
								}
								else{
									var node = messageAndUIBinder.nodeCollection[key];
								}
								
							}
							
							if(node){
								instanceObject = messageAndUIBinder.readValueFromMessage(tagName, pathFields, type, node);
								
								//alert("instanceObject: "+instanceObject);
								
								messageAndUIBinder.fieldMap = [];
								messageAndUIBinder.loadDataToEditor(uiField, instanceObject);
							}
							
						});
				   }	
				}
			});
			
			
		}
		
		
		/**
		 * loads the data from the the message to each html fragment from the DOM that has the attr isEditor="true"
		 */
		function callbackAfterLookupLoading() {
			var fieldGroupArray = [];
			var editors = [];
			var groupIdMap = [];
			
			$('#' + messageAndUIBinder.parentContainerID).find('[isEditor="true"]').each(function(key, editor){
				if($(editor).attr('groupId')){
					
					if (groupIdMap.indexOf($(editor).attr('groupId')) > -1) {
						
					} else {
						groupIdMap.push($(editor).attr('groupId'));
					}
					
					
				}else{
					editors.push(editor);
				}
			});
			
			
			processGroupFields(groupIdMap);
			
			$.each(editors,function() {
				var instanceObject = null;
				
				var type               = $(this).attr('dataType');
				var tagName            = $(this).attr('tagName');
				//var pathFields         = $(this).attr('pathFields').split(',');
				var pathFields          = $(this).attr('pathFields');
				
				if(pathFields){
					pathFields  = pathFields.split(',');
				}
				else{
					pathFields = [];
				}
				
				node =  messageAndUIBinder.readMessageObjects(pathFields, tagName);
				instanceObject = messageAndUIBinder.readValueFromMessage(tagName,pathFields,type,node);
				//alert("instanceObject: "+instanceObject);
				messageAndUIBinder.fieldMap = [];
				messageAndUIBinder.loadDataToEditor($(this), instanceObject);
			});

			try {
		       $('#' + messageAndUIBinder.parentContainerID).find('select').selectmenu('refresh', true);
	        } catch (e) {
	        	
	        }

	        loadEditorValues();
		};

		/**
		 *  To bind all the fields in the Dom which have the attribute dataField="true" 
		 */
		messageAndUIBinder.bindFieldEvents();

		/**
		 *  Added to load the value into the display text box on load of the message 
		 */
		function loadEditorValues() {
			$('#' + messageAndUIBinder.parentContainerID).find('[isEditor="true"]').each(function() {
				var editor = $(this);
				var editorFragment = $(this).find("[uiRole='editor']")[0];

				if (editorFragment) {
					var editorType = editor.attr("editorType");
					messageAndUIBinder.getEditoValues(editorFragment, editorType);
				}
			});
		};
	};

	/**
	 * Loades data to each editor from the from the meaasge XML 
	 * @param htmlFragment : HTML Fragment which contains the editor.
	 */
	function loadDataToEditor(htmlFragment, instanceObject){
		
		alert(instanceObject)
		
		var editorFragment = htmlFragment;
		$(editorFragment).find('[dataField="true"]').each(function() {
			var pathFields = $(this).attr("pathFields");
				if (pathFields != null) {
					/*$('#' +messageAndUIBinder.parentContainerID).find('[dataField="true"]').each(function(){*/
					var thisID             = $(this).attr('id');
					var type               = $(this).attr('dataType');
					var tagName            = $(this).attr('tagName');
					var fields             = ($(this).attr('fields') != "") ? $(this).attr('fields').split(','): [];
					var pathFields         = $(this).attr('pathFields').split(',');
					var dateFormatFunction = $(this).attr('dateFormatFunction');
					var fieldMapKey        = $(this).attr('pathFields')+ $(this).attr('tagName')+ $(this).attr('fields');
									
						if (messageAndUIBinder.fieldMap.indexOf(fieldMapKey) > -1) {
							return;
						} else {
							messageAndUIBinder.fieldMap.push(fieldMapKey);
						}

						if (instanceObject && instanceObject.length === 1) {
							return; // only nullFlavor
						}
						
						$.each(fields, function(key, fieldId) {
							var fieldValue = instanceObject[key + 1];

							// Date Formatting
							if (dateFormatFunction && dateFormatFunction !== null && dateFormatFunction !== '' && fieldValue && fieldValue != '') {
								try {
									eval('fieldValue = '+ dateFormatFunction + '(new Date(' + fieldValue + '))');
								} catch (error) {
									// Error happened while calling the formatter function. Revert back the value
									fieldValue = instanceObject[key + 1];
								}
							}

							var fieldObject = $(editorFragment).find('#'+ fieldId);

							if ($(fieldObject).attr("type") == 'text' || $(fieldObject).attr('type') == 'hidden') {
								$(fieldObject).attr("value", fieldValue);
								/*Condition added to to update the value in search box*/
								if($(fieldObject).attr('placeholder')){
									$(fieldObject).attr("placeholder", fieldValue);
								} 
								
								if($(fieldObject).attr('type') == 'hidden' && $(fieldObject).attr('dataType') == 'CVList'){
									$(fieldObject).trigger('change');
								}
							}

							if ($(fieldObject).attr("type") == 'multiple') {
								var comboId = $(fieldObject).attr("id");
								$(editorFragment).find('select#'+ comboId+ ' option[value='+ fieldValue+ ']').attr("selected", "selected");
							}

							if ($(fieldObject).attr("type") == 'file') {
								$(editorFragment).find('#'+ fieldId+ 'Box').attr("src", fieldValue);
							}
														
							if ($(fieldObject).attr("type") == 'label') {
								$(fieldObject).text(fieldValue);
							}

							if ($(fieldObject).attr("type") == 'date') {
								$(fieldObject).attr("value", fieldValue);
							}
							/*dataFormat: [null, key, value, key2, value2,...] */
							if ($(fieldObject).attr("type") == 'checkbox' && type == 'CVList') {
								// pick the key from instanceObject array
								var currentFieldValue = instanceObject[(key+key+1)];
								if (currentFieldValue == $(fieldObject).val().toLowerCase()) {
									$(fieldObject).attr("checked", "checked");
								}
							}
														
							if ($(fieldObject).attr('type') == 'radio') {
                                var group = $(fieldObject).closest('[uiRole="editor"]')[0];
                                
                                $(group).find('[dataField="true"]').each(function() {
                                      if($(this).attr('value') === $.trim(fieldValue)){
                                           $(this).attr('checked',"checked").checkboxradio("refresh");
                                      }
                                 });
                            }
							
							if ($(fieldObject).attr("type") == 'checkbox') {
								$('#' + messageAndUIBinder.parentContainerID).find('[dataField="true"]').each(function() {
									if(fieldValue){
										if (fieldValue.toLowerCase() == $(this).val().toLowerCase()) {
											$(this).attr("checked", "checked");
										}  
									}
								});
								
								
							}

						});

						
						// Check boxes generated dynamically by lookup binding are handled here
						if ($(this).attr('lookupControlType') == 'checkBox') {
							$(this).find('input[type="checkbox"]').each(function() {
								
								var checkItem = $(this);
								$.each(instanceObject, function(key, value) {
									if (value == $(checkItem).val())
										$(checkItem).attr("checked","checked");
								});
							});
						}
					}
		});
	}
	
	/**
	 * Loads the look up values 
	 * @param callbackAfterLookupLoading
	 */
	function bindLookups(callbackAfterLookupLoading) {
		var lookups = [];

		$('#' + messageAndUIBinder.parentContainerID).find('[dataField="true" ]').each(function(key, value) {
			if ($(this).attr("lookupControlType")) {
				lookups.push([ {name : 'conceptClass', value : $(this).attr('conceptClass')}, 
				               {name : 'type', value : $(this).attr("lookupControlType")}, 
				               {name : 'elementId', value : $(this).attr('id')} ]);
			}
		});
		
		messageAndUIBinder.lookupHandler.callbackAfterLookupLoading = callbackAfterLookupLoading;

		/**
		 * call to lookupHandler.js to load the look ups 
		 */
		messageAndUIBinder.lookupHandler.lookUp($('#'+ messageAndUIBinder.parentContainerID), lookups);
	};

	/**
	 * Used to toggle Editor onclick of the display text box,
	 * calls "getEditoValues()" to update the values in the Sub editor to the display textbox.
	 */
	function toggleEditor() {
		var editor        = $(this);
		var dataType      = editor.attr("dataType");
		var editorType    = editor.attr("editorType");
		var editorContent = $(this).closest("[uiRole='editor']");

		if ($(editorContent).find("#SubEditor").css("display") == 'block') {
			$(editorContent).find("#SubEditor").css("display", "none");
		} 
		
		else if ($(editorContent).find("#SubEditor").css("display") == 'none') {
			$('#' + messageAndUIBinder.parentContainerID).find("[uiRole='editor']").each(function(index, value) {
				
				if ($(value).find("[id='SubEditor']").css("display") == "block") {
					var editor = $(value).closest("[isEditor='true']")[0];
					var editorFragment = $(value).closest("[uiRole='editor']")[0];
						
					if (editorFragment) {
							var editorType = $(editor).attr("editorType");
							messageAndUIBinder.getEditoValues(editorFragment, editorType);
						}
				}
		   });

			$('#' + messageAndUIBinder.parentContainerID).find("#SubEditor").css("display", "none");
			$(editorContent).find("#SubEditor").css("display", "block");
		}

		if ($(editorContent).find("#SubEditor").css("display") == 'none') {
			var editor = $(this);
			var editorFragment = $(this).closest("[uiRole='editor']")[0];
			
			if (editorFragment) {
				var editorType = editor.attr("editorType");
				messageAndUIBinder.getEditoValues(editorFragment, editorType);
			}
		}

		else {
			if ($(editorContent).find('#SubEditor input[dataField="true"]')[0]) {
				$(editorContent).find('#SubEditor input[dataField="true"]')[0].focus();
			}
		}
	};

	/**
	 * Used to create a copy of the existing editor for multiple entries  
	 * @param gridEditor : HTML Fragment that holds all the entries 
	 * @param idSuffix : Index of the previous entry  
	 */
	function addGridEditor(gridEditor, idSuffix) {
		var fieldEditor = null;
		fieldEditor     = ($(gridEditor).find("[uiRole='gridContent']"))[0];
		
		
		/*call to the UpdatePathfield.js to get the updated pathField based on the entry */
		//var pathFields  = updatePathfield.getUpdatedPathField(gridEditor);
		
		fieldEditor     = $(fieldEditor).clone();
		var editorType  = $(gridEditor).attr("editorType");
		var id 			= $(gridEditor).attr("id");
		var pathFields	    = $(gridEditor).attr("pathFields");
		var configPathField = $(gridEditor).attr("configPathField");

		/* removing the label for the second editor in the grid*/
		var labels = $(fieldEditor).find('label');
		$((labels)[0]).css('display','none');
		
		$(fieldEditor).find("#addButton").remove();
		$(fieldEditor).find("#removeButton").css("display", "block");
		$(fieldEditor).find("#" + editorType + "EditorLabel").remove();

		idSuffix = parseInt(idSuffix, 10) + 1;
		var lookups = [];

		$.each($(fieldEditor).find('[dataField="true"]'),function(index, value) {
			var content = this;
			if ($(this).attr('type') == 'multiple') {
				$(this).attr("pathFields", pathFields);
				var parentDivs = $(this).closest('div[class="ui-select"]');
				var parent = $(parentDivs)[0];
				$(parent).html("");
				$(parent).removeAttr("class");
				
				var options = $(this).children();
				
				$(options).each(function(key,option){
					$(option).removeAttr('selected');
				});
				
				$(parent).html($(this));
				$(parent).trigger('refresh');
			}
			else if ($(this).attr('data-type') == 'search') {
				var dataType = $(this).attr('dataType');
				var id = $(this).attr('id');
				var tagName = $(this).attr('tagName');
				var fields = $(this).attr('fields');
				var conceptClass = $(this).attr('conceptClass');
				var lookupType = $(this).attr('lookupType');
				var lookupSelectType = $(this).attr('lookupSelectType');
				var lookupControlType = $(this).attr('lookupControlType');
				var parentDivs = $(this).closest('div[id="searchDiv"]');
				var parent = $(parentDivs)[0];
				
				var searchFragment = '<input data-inline="true" value="" id="'+id+'" type="text" data-type="search" dataField="true" placeholder="Search">'
				var ulFragment = ' <ul id="'+id+'List" data-theme="v" data-role="listview" class="ui-search-lookup"></ul>'	
				
				
				$(parent).html("");
				$(parent).append(searchFragment);
				$(parent).append(ulFragment);
				
				$(parent).find("#"+id).attr('dataType', dataType);
				$(parent).find("#"+id).attr('pathFields', pathFields);
				$(parent).find("#"+id).attr('tagName', tagName);
				$(parent).find("#"+id).attr('fields', fields);
				$(parent).find("#"+id).attr('conceptClass', conceptClass);
				$(parent).find("#"+id).attr('lookupType', lookupType);
				$(parent).find("#"+id).attr('lookupSelectType', lookupSelectType);
				$(parent).find("#"+id).attr('lookupControlType', lookupControlType);
				
					
				lookups.push([ {name : 'conceptClass', value : $(parent).find("#"+id).attr('conceptClass')}, 
				               {name : 'type', value : $(parent).find("#"+id).attr("lookupControlType")}, 
				               {name : 'elementId', value : $(parent).find("#"+id).attr('id')} ]);
			
				$(parent).trigger('refresh');
			} 
			else {
				$(this).val("");
				$(this).attr("pathFields", pathFields);
			}
		});

		$.each($(fieldEditor).find('[hastoggle="true"]'),function(index, value) {
			$(this).val("");
			$(this).attr("pathFields", pathFields);
		});


		$(fieldEditor).find("#removeButton").attr("idSuffix", idSuffix);
		$(fieldEditor).find("#addButton").attr("idSuffix",idSuffix);

		$(fieldEditor).attr("idSuffix", idSuffix);
		$(fieldEditor).find('[uiRole="gridContent"]').attr("idSuffix", idSuffix);

		$(fieldEditor).attr("configPathField", configPathField);
		$(fieldEditor).attr("pathFields", pathFields);

		$(fieldEditor).find("#removeButton").click(function() {
			removeRow(gridEditor, idSuffix);
		});

		$(fieldEditor).trigger('refresh');
		$(gridEditor).find("#addButton").attr("idSuffix", idSuffix);

		$(gridEditor).append(fieldEditor);
		$(gridEditor).trigger('create');
		messageAndUIBinder.bindFieldEvents();
		
		messageAndUIBinder.lookupHandler.lookUp($('#' + messageAndUIBinder.parentContainerID), lookups);

	};

	/**
	 * removes the select editor from the Grid in the UI
	 * @param gridEditor : HTML Fragment that contains all the elements in the grid 
	 * @param idSuffix : HTML Fragment id that has to be removed  
	 */
	function removeRow(gridEditor, idSuffix) {
		$(gridEditor).find('[uiRole="gridContent"]').each(function() {
			if ($(this).attr("idSuffix") == idSuffix) {
				$(this).remove();
				
				$(gridEditor).find('[dataField="true"]').trigger("change");
			}
		});

		gridEditor = updatePathfield.setPathField(gridEditor);
	};


	/**
	 * To get the concatenated string of all the values in the Sub editor,
	 * it calls all the get Value methods 
	 * @param fieldInsideTheEditor : HTML fragment which has the display text box and the Sub editor 
	 * @param editorType : type of editor used for display 
	 */
	function getEditoValues(fieldInsideTheEditor, editorType) {
		var editor = $(fieldInsideTheEditor);
		if (editor) {
		} else {
			// alert("No editor found");
			return;
		}

		var methodName = "get" + editorType + "Values";
		
		var content = null;

		/* if(methodName in messageAndUIBinder) */

		try {
			eval("content=messageAndUIBinder." + methodName + "(editor)");
		} catch (error) {
			var msg = "Error: " + error;
			/* if (typeof console != "undefined") {
			      console.log(msg); 
			   } 
			   else {
			     alert(msg); 
			    }
			 */
		}

		var editorTextBox = $(editor).find("[hasToggle='true']")[0];
		if (editorTextBox) {
			// ("EditorTextBox Found: " + editorTextBox);
		} else {
			// alert("No EditorTextBox found");
			return;
		}

		$(editorTextBox).attr("value", content);
	} ;

	/**
	 * creates a msg object with the node to be appended 
	 * @param objectArray : array of elements in the path fields
	 * @param fieldName : Name of the tag 
	 * @param fieldValue : Node to be appended  
	 * @returns returns the msg obj
	 */
	function createMessageObjects(objectArray, fieldName, fieldValue, type) {
		var obj = messageAndUIBinder.messageObject.findObject(messageAndUIBinder.messageTypeID);
		if (!obj || obj.length < 1) {
			obj = messageAndUIBinder.messageObject.createObject(messageAndUIBinder.messageTypeID);
		} else {
			obj = obj[0];
		}

		var subObj = null;

		$.each(objectArray, function(key, value) {
			if (!value || value === null || value == "") {
				return;
			}

			// Create node occurances (if not existing)
			messageAndUIBinder.createNodeAtIndex(objectArray[key], obj);

			subObj = obj.findObject(objectArray[key]);
			if (!subObj || subObj.length < 1) {
				subObj = obj.createObject(objectArray[key]);
				// console.log("Node doesn't exist: " + objectArray[key]);
			} else {
				subObj = subObj[0];
			}
			obj = subObj;
		});
		if (obj != null) {
			if(fieldValue != undefined && typeof(fieldValue) === 'object'/* && AppUtil.isArray(fieldValue) === false*/){
				//obj.setValue(fieldName, fieldValue);
				setSMOValue(obj, fieldName, fieldValue, type, false);
			}
			else {
				obj.clearValue(fieldName);
				for(var i = 0; i < messageAndUIBinder.nodeCollection.length; i++){
					var node = messageAndUIBinder.nodeCollection[i];
					setSMOValue(obj, fieldName, node.node, node.type, true);
				}
				//obj.setValue(fieldName, messageAndUIBinder.nodeCollection);
			}
		}

		//alert("Message xml: \n" + XmlUtil.xmlToString(messageAndUIBinder.messageObject.getXML()));

		return obj;
		
	};
	
	function setSMOValue(smoObject, fieldName, fieldValue, type, isArray){
		var smoValueObject = smoObject.getValue(fieldName);
		if(isArray === true){
			smoValueObject = smoObject.getNewValue(fieldName);
		}else {
			smoValueObject = (AppUtil.isArray(smoValueObject) && smoValueObject.length > 0) 
			? smoValueObject[0]
			: smoObject.getNewValue(fieldName);
		}
		
		var methodName = ('set' + type + 'SMOValue');
		if (methodName in messageAndUIBinder) {
			try {
				eval('node = messageAndUIBinder.' + methodName
						+ '(smoValueObject, fieldValue)');
			} catch (error) {
				alert("Error while calling setXXXSMOValue: " + error);
				return;
			}
		}
	};

	function createNodeAtIndex(nodeNameWithIndex, parentMessageObject) {

		if (!nodeNameWithIndex || nodeNameWithIndex == null || nodeNameWithIndex == '') {
			return;
		}

		var bracketIndex = nodeNameWithIndex.indexOf('[');
		if (bracketIndex < 0) {
			// no index information, just return for normal procedure
			return;
		}

		var nodeName = nodeNameWithIndex.substring(0, bracketIndex);
		var index = nodeNameWithIndex.substring(bracketIndex);
		index = index.substring(1, index.indexOf(']'));
		index = parseInt(index);
		for ( var i = 1; i <= index; i++) {
			var subObj = parentMessageObject.findObject(nodeName + '[' + i+ ']');
			if (!subObj || subObj.length < 1) {
				subObj = parentMessageObject.createObject(nodeName);
			}
		}

	}

	/**
	 * retrieves the node from the message based on the on the pathFields and tagName
	 * @param objectArray :  elements in the pathFields
	 * @param fieldName : tagName of the element to be retrieved
	 * @returns : XML Node
	 */
	function readMessageObjects(objectArray, fieldName) {
		var obj = messageAndUIBinder.messageObject.findObject(messageAndUIBinder.messageTypeID);
		if (!obj || obj.length < 1) {
			return null;
		} else {
			obj = obj[0];
		}

		var subObj = null;

		$.each(objectArray, function(key, value) {
			if (!value || value === null || value == "") {
				return null;
			}
			subObj = obj.findObject(objectArray[key]);
			if (!subObj || subObj.length < 1) {
				return null;
			} else {
				subObj = subObj[0];
			}
			obj = subObj;
		});

		obj = (!obj || obj == null) ? null : obj.getValue(fieldName);

		return obj;
	};
	
	//============= CREATE XML NODE ======================//

	/**
	 * creates XML Node using the values in the "fieldObject"  for dataType: II
	 * @param nodeName : name with which the node is be created
	 * @param fieldObject : Object contains the values to be updated to the xml node
	 * @returns XML Node
	 */
	function getIIXml(nodeName, fieldObject) {
		var nullFlavor = null;
		var root = null;
		var extension = null;
		var assigningAuthorityName = null;

		var xmlNode = XmlUtil.stringToXml('<' + nodeName + '/>').childNodes[0];

		if (fieldObject && fieldObject.length == 4) {
			nullFlavor = fieldObject[3];
			XmlUtil.attr(xmlNode, "nullFlavor", nullFlavor);
			xmlNode.removeAttribute("root");
			xmlNode.removeAttribute("extension");
			xmlNode.removeAttribute("assigningAuthorityName");
		} else {
			root = fieldObject[0];
			extension = fieldObject[1];
			assigningAuthorityName = fieldObject[2];

			xmlNode.removeAttribute("nullFlavor");

			if (root) {
				XmlUtil.attr(xmlNode, "root", root);
			} else {
				xmlNode.removeAttribute("root");
			}
			if (extension) {
				XmlUtil.attr(xmlNode, "extension", extension);
			} else {
				xmlNode.removeAttribute("extension");
			}
			if (assigningAuthorityName) {
				XmlUtil.attr(xmlNode, "assigningAuthorityName",
						assigningAuthorityName);
			} else {
				xmlNode.removeAttribute("assigningAuthorityName");
			}
		}
		return xmlNode;
	};

	/**
	 * creates XML Node using the values in the "fieldObject"  for dataType: TS
	 * @param nodeName : name with which the node is be created
	 * @param fieldObject : Object contains the values to be updated to the xml node
	 * @returns XML Node
	 */
	/*function getTSXml(nodeName, fieldObject) {
		var nullFlavor = null;
		var value = null;

		var xmlNode = XmlUtil.stringToXml('<' + nodeName + '/>').childNodes[0];

		if (fieldObject && fieldObject.length == 2) {
			nullFlavor = fieldObject[1];
			xmlNode.removeAttribute("value");
		} else {
			value = fieldObject[0];
			xmlNode.removeAttribute("nullFlavor");

			if (value) {
				XmlUtil.attr(xmlNode, "value", value);
			}
		}
		return xmlNode;
	}
	;*/
	
	/**
	 * creates XML Node using the values in the "fieldObject"  for dataType: PN
	 * @param nodeName : name with which the node is be created
	 * @param fieldObject : Object contains the values to be updated to the xml node
	 * @returns XML Node
	 */
	function setPNSMOValue(smoValueObject, fieldObject) {
		var nullFlavor = null;
		var prefix = null;
		var family = null;
		var given = null;
		var suffix = null;
		var use = null;

		if (fieldObject && fieldObject.length == 1) {
			nullFlavor = fieldObject[0];
			smoValueObject.setValue("nullFlavor", nullFlavor);
		} else {
			use = fieldObject[0];
			prefix = fieldObject[1];
			family = fieldObject[2];
			given = fieldObject[3];
			suffix = fieldObject[4];

			if (use) {
				smoValueObject.setValue("use", use);
			}
			if (prefix) {
				smoValueObject.setValue("prefix", prefix);
			}
			if (family) {
				smoValueObject.setValue("family", family);
			}
			if (given) {
				smoValueObject.setValue("given", given);
			}
			if (suffix) {
				smoValueObject.setValue("suffix", suffix);
			}
		}

		return smoValueObject;
	};
	function getPNSMOValue(smoValueObject) {
		var fieldObject = [];
		
		var nullFlavor = smoValueObject.getValue("nullFlavor");

		if (nullFlavor && nullFlavor.length == 1) {
			fieldObject.push({nullFlavor: nullFlavor[0]});
		} else {
			fieldObject.push(null);
			
			var use = smoValueObject.getValue("use")[0];
			var prefix = smoValueObject.getValue("prefix")[0];
			var family = smoValueObject.getValue("family")[0];
			var given = smoValueObject.getValue("given")[0];
			var suffix = smoValueObject.getValue("suffix")[0];

			if (use) {
				fieldObject.push(use);
			}
			else {
				fieldObject.push(null);
			}
			if (prefix) {
				fieldObject.push(prefix);
			}
			else {
				fieldObject.push(null);
			}
			if (family) {
				fieldObject.push(family);
			}
			else {
				fieldObject.push(null);
			}
			if (given) {
				fieldObject.push(given);
			}
			else {
				fieldObject.push(null);
			}
			if (suffix) {
				fieldObject.push(suffix);
			}
			else {
				fieldObject.push(null);
			}
		}

		return fieldObject;
	};

	/**
	 * creates XML Node using the values in the "fieldObject"  for dataType: PN
	 * @param nodeName : name with which the node is be created
	 * @param fieldObject : Object contains the values to be updated to the xml node
	 * @returns XML Node
	 */
	function getPNXml(nodeName, fieldObject) {
		var nullFlavor = null;
		var prefix = null;
		var family = null;
		var given = null;
		var suffix = null;
		var use = null;

		var xmlNode = XmlUtil.stringToXml('<' + nodeName + '/>').childNodes[0];

		if (fieldObject && fieldObject.length == 1) {
			nullFlavor = fieldObject[0];
			XmlUtil.attr(xmlNode, "nullFlavor", nullFlavor);
			xmlNode.removeAttribute("use");
			XmlUtil.text(xmlNode, '');
		} else {
			use = fieldObject[0];
			prefix = fieldObject[1];
			family = fieldObject[2];
			given = fieldObject[3];
			suffix = fieldObject[4];

			xmlNode.removeAttribute("nullFlavor");
			if (use) {
				XmlUtil.attr(xmlNode, "use", use);
			}
			if (prefix) {
				var node = XmlUtil.createNewElement(xmlNode, "prefix");
				XmlUtil.text(node, prefix);
				xmlNode.appendChild(node);
			}
			if (family) {
				var node = XmlUtil.createNewElement(xmlNode, "family");
				XmlUtil.text(node, family);
				xmlNode.appendChild(node);
			}
			if (given) {
				var node = XmlUtil.createNewElement(xmlNode, "given");
				XmlUtil.text(node, given);
				xmlNode.appendChild(node);
			}
			if (suffix) {
				var node = XmlUtil.createNewElement(xmlNode, "suffix");
				XmlUtil.text(node, suffix);
				xmlNode.appendChild(node);
			}

		}

		return xmlNode;
	};
	
	/**
	 * creates XML Node using the values in the "fieldObject"  for dataType: ON
	 * @param nodeName : name with which the node is be created
	 * @param fieldObject : Object contains the values to be updated to the xml node
	 * @returns XML Node
	 */
	function getONXml(nodeName, fieldObject) {
		var nullFlavor = null;
		var use = null;
		var prefix = null;

		var xmlNode = XmlUtil.stringToXml('<' + nodeName + '/>').childNodes[0];

		if (fieldObject && fieldObject.length == 1) {
			nullFlavor = fieldObject[0];
			XmlUtil.attr(xmlNode, "nullFlavor", nullFlavor);
			XmlUtil.text(xmlNode, '');
		} else {
			use    = fieldObject[0];
			prefix = fieldObject[1];

			xmlNode.removeAttribute("nullFlavor");
			if (use) {
				XmlUtil.attr(xmlNode, "use", use);
			}
			if (prefix) {
				var node = XmlUtil.createNewElement(xmlNode, "prefix");
				XmlUtil.text(node, prefix);
				xmlNode.appendChild(node);
			}
		}
		return xmlNode;
	};
	
	/**
	 * creates XML Node using the values in the "fieldObject"  for dataType: ST
	 * @param nodeName : name with which the node is be created
	 * @param fieldObject : Object contains the values to be updated to the xml node
	 * @returns XML Node
	 */
	function getSTXml(nodeName, fieldObject){
		var nullFlavor = null;
		var jobTitle   = null;
		
		var xmlNode = XmlUtil.stringToXml('<' + nodeName + '/>').childNodes[0];
		if (fieldObject && fieldObject.length == 2) {
			nullFlavor = fieldObject[0];
			XmlUtil.attr(xmlNode, "nullFlavor", nullFlavor);
			XmlUtil.text(xmlNode, '');
		}else{
			jobTitle = fieldObject[0];
			if (jobTitle) {
				XmlUtil.text(xmlNode, jobTitle);
			}
		}
		return xmlNode;
	};
	
	/**
	 * creates XML Node using the values in the "fieldObject"  for dataType: MO
	 * @param nodeName : name with which the node is be created
	 * @param fieldObject : Object contains the values to be updated to the xml node
	 * @returns XML Node
	 */
	function getMOXml(nodeName, fieldObject) {
		var nullFlavor = null;
		var value = null;
		var xmlNode = XmlUtil.stringToXml('<' + nodeName + '/>').childNodes[0];

		var nullSet = updateNullFlavour(xmlNode, fieldObject);
		if (nullSet === false) {
			if (fieldObject[0] != null) {
				value = fieldObject[0];
			} else {
				value = fieldObject[1];
			}
			xmlNode.removeAttribute("nullFlavor");

			if (value) {
				XmlUtil.attr(xmlNode, "value", value);
			}
		}

		return xmlNode;
	};

	/**
	 * creates XML Node using the values in the "fieldObject"  for dataType: CS
	 * @param nodeName : name with which the node is be created
	 * @param fieldObject : Object contains the values to be updated to the xml node
	 * @returns XML Node
	 */
	function getCSXml(nodeName, fieldObject) {
		var nullFlavor = null;
		var code = null;

		var xmlNode = XmlUtil.stringToXml('<' + nodeName + '/>').childNodes[0];

		if (fieldObject && fieldObject.length == 2) {
			nullFlavor = fieldObject[1];
			XmlUtil.attr(xmlNode, "nullFlavor", nullFlavor);
			xmlNode.removeAttribute("code");
		} else {
			code = fieldObject[0];

			xmlNode.removeAttribute("nullFlavor");

			if (code) {
				XmlUtil.attr(xmlNode, "code", code);
			}
		}
		return xmlNode;
	};

	/**
	 * creates XML Node using the values in the "fieldObject"  for dataType: TEL
	 * @param nodeName : name with which the node is be created
	 * @param fieldObject : Object contains the values to be updated to the xml node
	 * @returns XML Node
	 */
	function getTELXml(nodeName, fieldObject) {
		var nullFlavor = null;
		var use = null;
		var value = null;

		var xmlNode = XmlUtil.stringToXml('<' + nodeName + '/>').childNodes[0];

		if (fieldObject && fieldObject.length == 1) {
			nullFlavor = fieldObject[0];
			XmlUtil.attr(xmlNode, "nullFlavor", nullFlavor);
			xmlNode.removeAttribute("use");
			xmlNode.removeAttribute("value");
		} else {
			use = fieldObject[0];
			value = fieldObject[1];
			xmlNode.removeAttribute("nullFlavor");
			if (use) {
				XmlUtil.attr(xmlNode, "use", use);
			}
			if (value) {
				XmlUtil.attr(xmlNode, "value", value);
			}
		}
		return xmlNode;
	};

	/**
	 * creates XML Node using the values in the "fieldObject"  for dataType: AD
	 * @param nodeName : name with which the node is be created
	 * @param fieldObject : Object contains the values to be updated to the xml node
	 * @returns XML Node
	 */  
	function getADXml(nodeName, fieldObject) {
		var nullFlavor = null;
		var country = null;
		var state = null;
		var city = null;
		var houseNumber = null;
		var streetName = null;
		var postalCode = null;

		var xmlNode = XmlUtil.stringToXml('<' + nodeName + '/>').childNodes[0];

		if (fieldObject && fieldObject.length == 1) {
			nullFlavor = fieldObject[0];
			XmlUtil.attr(xmlNode, "nullFlavor", nullFlavor);
			XmlUtil.text(xmlNode, '');
		} else {
			houseNumber = fieldObject[0];
			streetName = fieldObject[1];
			city = fieldObject[2];
			state = fieldObject[3];
			country = fieldObject[4];
			postalCode = fieldObject[5];
	
			xmlNode.removeAttribute("nullFlavor");

			if (country) {
				var node = XmlUtil.createNewElement(xmlNode, "country");
				XmlUtil.text(node, country);
				xmlNode.appendChild(node);
			}
			if (state) {
				var node = XmlUtil.createNewElement(xmlNode, "state");
				XmlUtil.text(node, state);
				xmlNode.appendChild(node);
			}
			if (city) {
				var node = XmlUtil.createNewElement(xmlNode, "city");
				XmlUtil.text(node, city);
				xmlNode.appendChild(node);
			}
			if (houseNumber) {
				var node = XmlUtil.createNewElement(xmlNode, "houseNumber");
				XmlUtil.text(node, houseNumber);
				xmlNode.appendChild(node);
			}
			if (streetName) {
				var node = XmlUtil.createNewElement(xmlNode, "streetName");
				XmlUtil.text(node, streetName);
				xmlNode.appendChild(node);
			}
			if (postalCode) {
				var node = XmlUtil.createNewElement(xmlNode, "postalCode");
				XmlUtil.text(node, postalCode);
				xmlNode.appendChild(node);
			}

		}
		return xmlNode;
	};

	/**
	 * creates XML Node using the values in the "fieldObject"  for dataType: CE
	 * @param nodeName : name with which the node is be created
	 * @param fieldObject : Object contains the values to be updated to the xml node
	 * @returns XML Node
	 */
	function getCEXml(nodeName, fieldObject) {
		var nullFlavor = null;
		var code = null;
		var displayName = null;

		var xmlNode = XmlUtil.stringToXml('<' + nodeName + '/>').childNodes[0];

		if (fieldObject && fieldObject.length == 1) {
			nullFlavor = fieldObject[2];
			XmlUtil.attr(xmlNode, "nullFlavor", nullFlavor);
			xmlNode.removeAttribute("code");
			xmlNode.removeAttribute("displayName");
		} else {
			code = fieldObject[0];
			displayName = fieldObject[1];

			xmlNode.removeAttribute("nullFlavor");

			if (code) {
				XmlUtil.attr(xmlNode, "code", code);
			}
			if (displayName) {
				XmlUtil.attr(xmlNode, "displayName", displayName);
			}
		}
		return xmlNode;
	};

	/**
	 * creates XML Node using the values in the "fieldObject"  for dataType: CVList
	 * @param nodeName : name with which the node is be created
	 * @param fieldObject : Object contains the values to be updated to the xml node
	 * @returns XML Node
	 */
	function getCVListXml(nodeName, fieldObject) {
		var nullFlavor = null;
		var originalText = null;
		var code = null;
		//var codeSystem = null;
		//var displayName = null;

		var xmlNode = XmlUtil.stringToXml('<' + nodeName + '/>').childNodes[0];

		/*if (fieldObject && fieldObject.length == 1) {	
			nullFlavor = fieldObject[0];
			XmlUtil.attr(xmlNode, "nullFlavor", nullFlavor);
			xmlNode.removeAttribute("code");
		} else {
			for ( var key = 0; key < fieldObject.length;) {
				var itemNode = XmlUtil.createNewElement(xmlNode, "item");
				if (fieldObject[key] && fieldObject[key] !== null) {
					XmlUtil.attr(itemNode, "code", fieldObject[key + 1]);
					var originalTextNode = XmlUtil.createNewElement(itemNode,
							"originalText");
					XmlUtil.text(originalTextNode, fieldObject[key]);
					itemNode.appendChild(originalTextNode);
				}
				xmlNode.appendChild(itemNode);
				key = key + 2;
			}

		}*/
		
		if (fieldObject && fieldObject.length == 3) {
			nullFlavor = fieldObject[1];
			XmlUtil.attr(xmlNode, "nullFlavor", nullFlavor);
			XmlUtil.text(xmlNode, '');
		} else {
			for ( var key = 0; key < fieldObject.length;) {
				var itemNode = XmlUtil.createNewElement(xmlNode, "item");
				if (fieldObject[key] && fieldObject[key] !== null) {
					XmlUtil.attr(itemNode, "code", fieldObject[key + 1]);
					var originalTextNode = XmlUtil.createNewElement(itemNode,
							"originalText");
					XmlUtil.text(originalTextNode, fieldObject[key]);
					itemNode.appendChild(originalTextNode);
				}
				xmlNode.appendChild(itemNode);
				key = key + 2;
			}
		}
		
		
		//alert("XmlUtil " +XmlUtil.xmlToString(xmlNode));
		return xmlNode;
	};

	/**
	 * creates XML Node using the values in the "fieldObject"  for dataType: CV
	 * @param nodeName : name with which the node is be created
	 * @param fieldObject : Object contains the values to be updated to the xml node
	 * @returns XML Node
	 */
	function getCVXml(nodeName, fieldObject) {
		var nullFlavor = null;
		var originalText = null;
		var code = null;
		var codeSystem = null;
		var displayName = null;

		var xmlNode = XmlUtil.stringToXml('<' + nodeName + '/>').childNodes[0];

		if (fieldObject && fieldObject.length == 1) {
			nullFlavor = fieldObject[0];
			XmlUtil.attr(xmlNode, "nullFlavor", nullFlavor);
			xmlNode.removeAttribute("code");
		} else {
			code = fieldObject[0];
			originalText = fieldObject[1];

			if (code) {
				XmlUtil.attr(xmlNode, "code", code);
			}
			if (originalText) {
				var originalTextNode = XmlUtil.createNewElement(xmlNode,
						"originalText");
				XmlUtil.text(originalTextNode, originalText);
				xmlNode.appendChild(originalTextNode);
			}
		}

		return xmlNode;
	};


	/**
	 * retrieves values from an xml node and creates an object with all the values for dataType: CV
	 * @param fieldNode : XML Node from which the values are to be retrived 
	 * @returns : Object containing the values from the node 
	 */
	function getCVObject(fieldNode) {
		var fieldObject = [];

		if (fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "nullFlavor"));
		} else {
			fieldObject.push(null);
		}

		if (XmlUtil.attr(fieldNode, "code")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "code"));
		} else {
			fieldObject.push(null);
		}

		var originalText = XmlUtil.findByName(fieldNode, "originalText", true);

		if (XmlUtil.text(originalText)) {
			fieldObject.push(XmlUtil.text(originalText));
		}

		return fieldObject;
	};

	/**
	 * creates XML Node using the values in the "fieldObject"  for dataType: CEList
	 * @param nodeName : name with which the node is be created
	 * @param fieldObject : Object contains the values to be updated to the xml node
	 * @returns XML Node
	 */
	function getCEListXml(nodeName, fieldObject) {
		var nullFlavor = null;
		var originalText = null;
		var code = null;
		var codeSystem = null;
		var displayName = null;

		var xmlNode = XmlUtil.stringToXml('<' + nodeName + '/>').childNodes[0];

		if (fieldObject && fieldObject.length == 1) {
			nullFlavor = fieldObject[1];
			XmlUtil.attr(xmlNode, "nullFlavor", nullFlavor);
			xmlNode.removeAttribute("code");
		} else {
			for ( var key = 0; key < fieldObject.length;) {
				var itemNode = XmlUtil.createNewElement(xmlNode, "item");
				XmlUtil.attr(itemNode, "code", fieldObject[key + 1]);
				var originalTextNode = XmlUtil.createNewElement(itemNode,
						"originalText");
				XmlUtil.text(originalTextNode, fieldObject[key]);
				itemNode.appendChild(originalTextNode);
				xmlNode.appendChild(itemNode);
				key = key + 2;
			}

		}

		return xmlNode;
	};

	/**
	 * creates XML Node using the values in the "fieldObject"  for dataType: ED
	 * @param nodeName : name with which the node is be created
	 * @param fieldObject : Object contains the values to be updated to the xml node
	 * @returns XML Node
	 */
	function getEDXml(nodeName, fieldObject) {
		var nullFlavor = null;
		var thumbnail = null;

		var xmlNode = XmlUtil.stringToXml('<' + nodeName + '/>').childNodes[0];

		if (fieldObject && fieldObject.length == 2) {
			nullFlavor = fieldObject[1];
			XmlUtil.attr(xmlNode, "nullFlavor", nullFlavor);
			XmlUtil.text(xmlNode, '');
		} else {
			thumbnail = fieldObject[0];
			if (thumbnail) {
				var node = XmlUtil.createNewElement(xmlNode, "thumbnail");
				XmlUtil.text(node, thumbnail);
				xmlNode.appendChild(node);
			}
		}
		//alert(XmlUtil.xmlToString(xmlNode));
		return xmlNode;
	};

	/**
	 * creates XML Node using the values in the "fieldObject"  for dataType: TS
	 * @param nodeName : name with which the node is be created
	 * @param fieldObject : Object contains the values to be updated to the xml node
	 * @returns XML Node
	 */
	function getTSXml(nodeName, fieldObject) {
		var nullFlavor = null;
		var value = null;

		var xmlNode = XmlUtil.stringToXml('<' + nodeName + '/>').childNodes[0];

		if (fieldObject && fieldObject.length == 2) {
			nullFlavor = fieldObject[1];
			XmlUtil.attr(xmlNode, "nullFlavor", nullFlavor);
			xmlNode.removeAttribute("value");
		} else {
			value = fieldObject[0];
			xmlNode.removeAttribute("nullFlavor");

			if (value) {
				XmlUtil.attr(xmlNode, "value", value);
			}
		}
		return xmlNode;
	};

	/**
	 * creates XML Node using the values in the "fieldObject"  for dataType: IVL_TS
	 * @param nodeName : name with which the node is be created
	 * @param fieldObject : Object contains the values to be updated to the xml node
	 * @returns XML Node
	 */
	function getIVL_TSXml(nodeName, fieldObject) {
		var nullFlavor = null;
		var low = null;
		var high = null;

		var xmlNode = XmlUtil.stringToXml('<' + nodeName + '/>').childNodes[0];

		if (fieldObject && fieldObject.length == 1) {
			nullFlavor = fieldObject[0];
			XmlUtil.attr(xmlNode, "nullFlavor", nullFlavor);
			XmlUtil.text(xmlNode, '');
		} else {
			low = fieldObject[0];
			high = fieldObject[1];

			xmlNode.removeAttribute("nullFlavor");

			if (low) {
				var node = XmlUtil.createNewElement(xmlNode, "low");
				XmlUtil.attr(node, "value", low);
				xmlNode.appendChild(node);
			}
			if (high) {
				var node = XmlUtil.createNewElement(xmlNode, "high");
				XmlUtil.attr(node, "value", high);
				xmlNode.appendChild(node);
			}
		}
		return xmlNode;
	};

	/**
	 * creates XML Node using the values in the "fieldObject"  for dataType: PQ
	 * @param nodeName : name with which the node is be created
	 * @param fieldObject : Object contains the values to be updated to the xml node
	 * @returns XML Node
	 */
	function getPQXml(nodeName, fieldObject) {
		var nullFlavor = null;
		var value = null;
		var xmlNode = XmlUtil.stringToXml('<' + nodeName + '/>').childNodes[0];

		var nullSet = updateNullFlavour(xmlNode, fieldObject);
		if (nullSet === false) {
			if (fieldObject[0] != null) {
				value = fieldObject[0];
			} else {
				value = fieldObject[1];
			}
			xmlNode.removeAttribute("nullFlavor");

			if (value) {
				XmlUtil.attr(xmlNode, "value", value);
			}
		}

		return xmlNode;
	}

	function getRTO_PQ_PQXml(nodeName, fieldObject){
		var nullFlavor = null;
		var numerator = null;
		var denominator = null;

		var xmlNode = XmlUtil.stringToXml('<' + nodeName + '/>').childNodes[0];

		if (fieldObject && fieldObject.length == 1) {
			nullFlavor = fieldObject[0];
			XmlUtil.attr(xmlNode, "nullFlavor", nullFlavor);
			xmlNode.removeAttribute("use");
			XmlUtil.text(xmlNode, '');
		} else {
			numerator = fieldObject[0];
			denominator = fieldObject[1];

			xmlNode.removeAttribute("nullFlavor");
			if (numerator) {
				var node = XmlUtil.createNewElement(xmlNode, "numerator");
				XmlUtil.attr(node, "value", numerator);
				xmlNode.appendChild(node);
			}
			if (denominator) {
				var node = XmlUtil.createNewElement(xmlNode, "denominator");
				XmlUtil.attr(node, "value", denominator);
				xmlNode.appendChild(node);
			}
		}

		return xmlNode;
	}
	;
	
	function getRTO_MO_PQXml(nodeName, fieldObject){
		var nullFlavor = null;
		var numerator = null;
		var denominator = null;
		//var use = null;

		var xmlNode = XmlUtil.stringToXml('<' + nodeName + '/>').childNodes[0];

		if (fieldObject && fieldObject.length == 1) {
			nullFlavor = fieldObject[0];
			XmlUtil.attr(xmlNode, "nullFlavor", nullFlavor);
			xmlNode.removeAttribute("use");
			XmlUtil.text(xmlNode, '');
		} else {
			//use = fieldObject[0];
			numerator = fieldObject[0];
			denominator = fieldObject[1];

			xmlNode.removeAttribute("nullFlavor");
			/*if (use) {
				XmlUtil.attr(xmlNode, "use", use);
			}*/
			if (numerator) {
				var node = XmlUtil.createNewElement(xmlNode, "numerator");
				XmlUtil.attr(node, "value", numerator);
				xmlNode.appendChild(node);
			}
			if (denominator) {
				var node = XmlUtil.createNewElement(xmlNode, "denominator");
				XmlUtil.attr(node, "value", denominator);
				xmlNode.appendChild(node);
			}
		}

		return xmlNode;
	}
	;
	
	// --------------------- GET OBJECT METHODS ------------------------------------------//
	
	/**
	 * retrieves values from an xml node and creates an object with all the values for dataType: PQ
	 * @param fieldNode : XML Node from which the values are to be retrived 
	 * @returns : Object containing the values from the node 
	 */
	function getPQObject(fieldNode) { 
		var fieldObject = [];

		if (fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "nullFlavor"));
		} else {
			fieldObject.push(null);
		}

		if (XmlUtil.attr(fieldNode, "value")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "value"));
		}

		return fieldObject;
	}

	/**
	 * retrieves values from an xml node and creates an object with all the values for dataType: II
	 * @param fieldNode : XML Node from which the values are to be retrived 
	 * @returns : Object containing the values from the node 
	 */
	function getIIObject(fieldNode) {
		var fieldObject = [];

		if (fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "nullFlavor"));
		} else {
			fieldObject.push(null);
		}

		if (XmlUtil.attr(fieldNode, "root")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "root"));
		}
		if (XmlUtil.attr(fieldNode, "extension")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "extension"));
		}
		if (XmlUtil.attr(fieldNode, "assigningAuthorityName")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "assigningAuthorityName"));
		}

		return fieldObject;
	};

	/**
	 * retrieves values from an xml node and creates an object with all the values for dataType: PN
	 * @param fieldNode : XML Node from which the values are to be retrived 
	 * @returns : Object containing the values from the node 
	 */
	function getPNObject(fieldNode) {
		/*
		 * var fieldObject = [];
		 * 
		 * if(fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
		 * fieldObject.push(XmlUtil.attr(fieldNode, "nullFlavor")); } else {
		 * fieldObject.push(null); }
		 * 
		 * if(XmlUtil.text(fieldNode)){
		 * fieldObject.push(XmlUtil.text(fieldNode)); }
		 * 
		 * return fieldObject;
		 */
		var fieldObject = [];
		var prefixNode = XmlUtil.findByName(fieldNode, "prefix", true);
		var familyNode = XmlUtil.findByName(fieldNode, "family", true);
		var givenNode = XmlUtil.findByName(fieldNode, "given", true);
		var suffixNode = XmlUtil.findByName(fieldNode, "suffix", true);

		if (fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "nullFlavor"));
		} else {
			fieldObject.push(null);
		}
		if (fieldNode && XmlUtil.attr(fieldNode, "use")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "use"));
		} else {
			fieldObject.push(null);
		}
		if (XmlUtil.text(prefixNode)) {
			fieldObject.push(XmlUtil.text(prefixNode));
		} else {
			fieldObject.push(null);
		}
		if (XmlUtil.text(familyNode)) {
			fieldObject.push(XmlUtil.text(familyNode));
		} else {
			fieldObject.push(null);
		}
		if (XmlUtil.text(givenNode)) {
			fieldObject.push(XmlUtil.text(givenNode));
		} else {
			fieldObject.push(null);
		}
		if (XmlUtil.text(suffixNode)) {
			fieldObject.push(XmlUtil.text(suffixNode));
		} else {
			fieldObject.push(null);
		}
		return fieldObject;

	};
	
	/**
	 * retrieves values from an xml node and creates an object with all the values for dataType: ON
	 * @param fieldNode : XML Node from which the values are to be retrived 
	 * @returns : Object containing the values from the node 
	 */
	function getONObject(fieldNode) {
		/*
		 * var fieldObject = [];
		 * 
		 * if(fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
		 * fieldObject.push(XmlUtil.attr(fieldNode, "nullFlavor")); } else {
		 * fieldObject.push(null); }
		 * 
		 * if(XmlUtil.text(fieldNode)){
		 * fieldObject.push(XmlUtil.text(fieldNode)); }
		 * 
		 * return fieldObject;
		 */
		var fieldObject = [];
		var prefixNode = XmlUtil.findByName(fieldNode, "prefix", true);

		if (fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "nullFlavor"));
		} else {
			fieldObject.push(null);
		}
		if (fieldNode && XmlUtil.attr(fieldNode, "use")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "use"));
		} else {
			fieldObject.push(null);
		}
		if (XmlUtil.text(prefixNode)) {
			fieldObject.push(XmlUtil.text(prefixNode));
		} else {
			fieldObject.push(null);
		}
		return fieldObject;

	};
	
	/**
	 * retrieves values from an xml node and creates an object with all the values for dataType: ST
	 * @param fieldNode : XML Node from which the values are to be retrived 
	 * @returns : Object containing the values from the node 
	 */
	function getSTObject(fieldNode){
		var fieldObject = [];

		if (fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "nullFlavor"));
		} else {
			fieldObject.push(null);
		}
		
		if (XmlUtil.text(fieldNode)) {
			fieldObject.push(XmlUtil.text(fieldNode));
		} else {
			fieldObject.push(null);
		}
		return fieldObject;
	}
	
	/**
	 * retrieves values from an xml node and creates an object with all the values for dataType: MO
	 * @param fieldNode : XML Node from which the values are to be retrived 
	 * @returns : Object containing the values from the node 
	 */
	function getMOObject(fieldNode) { 
		var fieldObject = [];

		if (fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "nullFlavor"));
		} else {
			fieldObject.push(null);
		}

		if (XmlUtil.attr(fieldNode, "value")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "value"));
		}

		return fieldObject;
	};
	

	/**
	 * retrieves values from an xml node and creates an object with all the values for dataType: TS
	 * @param fieldNode : XML Node from which the values are to be retrived 
	 * @returns : Object containing the values from the node 
	 */
	function getTSObject(fieldNode) {
		var fieldObject = [];

		if (fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "nullFlavor"));
		} else {
			fieldObject.push(null);
		}

		if (XmlUtil.attr(fieldNode, "value")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "value"));
		}

		return fieldObject;
	};

	
	/**
	 * retrieves values from an xml node and creates an object with all the values for dataType: CS
	 * @param fieldNode : XML Node from which the values are to be retrived 
	 * @returns : Object containing the values from the node 
	 */
	function getCSObject(fieldNode) {
		var fieldObject = [];

		if (fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "nullFlavor"));
		} else {
			fieldObject.push(null);
		}

		if (XmlUtil.attr(fieldNode, "code")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "code"));
		}

		return fieldObject;
	};


	/**
	 * retrieves values from an xml node and creates an object with all the values for dataType: TEL
	 * @param fieldNode : XML Node from which the values are to be retrived 
	 * @returns : Object containing the values from the node 
	 */
	function getTELObject(fieldNode) {

		var fieldObject = [];

		if (fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "nullFlavor"));
		} else {
			fieldObject.push(null);
		}

		if (XmlUtil.attr(fieldNode, "use")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "use"));

		} else {
			fieldObject.push(null);
		}
		if (XmlUtil.attr(fieldNode, "value")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "value"));
		} else {
			fieldObject.push(null);
		}

		return fieldObject;
	};


	/**
	 * retrieves values from an xml node and creates an object with all the values for dataType: AD
	 * @param fieldNode : XML Node from which the values are to be retrived 
	 * @returns : Object containing the values from the node 
	 */ 
	function getADObject(fieldNode) {
		var fieldObject = [];
		var countryNode = XmlUtil.findByName(fieldNode, "country", true);
		var stateNode = XmlUtil.findByName(fieldNode, "state", true);
		var cityNode = XmlUtil.findByName(fieldNode, "city", true);
		var houseNumberNode = XmlUtil
				.findByName(fieldNode, "houseNumber", true);
		var streetNameNode = XmlUtil.findByName(fieldNode, "streetName", true);
		var postalCodeNode = XmlUtil.findByName(fieldNode, "postalCode", true);

		if (fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "nullFlavor"));
		} else {
			fieldObject.push(null);
		}
		
		if (XmlUtil.text(houseNumberNode)) {
			fieldObject.push(XmlUtil.text(houseNumberNode));
		} else {
			fieldObject.push(null);
		}
		
		if (XmlUtil.text(streetNameNode)) {
			fieldObject.push(XmlUtil.text(streetNameNode));
		} else {
			fieldObject.push(null);
		}
		
		if (XmlUtil.text(cityNode)) {
			fieldObject.push(XmlUtil.text(cityNode));
		} else {
			fieldObject.push(null);
		}
		
		if (XmlUtil.text(stateNode)) {
			fieldObject.push(XmlUtil.text(stateNode));
		} else {
			fieldObject.push(null);
		}

		if (XmlUtil.text(countryNode)) {
			fieldObject.push(XmlUtil.text(countryNode));
		} else {
			fieldObject.push(null);
		}
		
		if (XmlUtil.text(postalCodeNode)) {
			fieldObject.push(XmlUtil.text(postalCodeNode));
		} else {
			fieldObject.push(null);
		}
		return fieldObject;
	};


	/**
	 * retrieves values from an xml node and creates an object with all the values for dataType: CE
	 * @param fieldNode : XML Node from which the values are to be retrived 
	 * @returns : Object containing the values from the node 
	 */
	function getCEObject(fieldNode) {
		var fieldObject = [];

		if (fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "nullFlavor"));
		} else {
			fieldObject.push(null);
		}

		if (XmlUtil.attr(fieldNode, "code")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "code"));
		} else {
			fieldObject.push(null);
		}
		if (XmlUtil.attr(fieldNode, "displayName")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "displayName"));
		} else {
			fieldObject.push(null);
		}

		return fieldObject;
	};

	/**
	 * creates XML Node using the values in the "fieldObject"  for dataType: CD
	 * @param nodeName : name with which the node is be created
	 * @param fieldObject : Object contains the values to be updated to the xml node
	 * @returns XML Node
	 */
	function getCDXml(nodeName, fieldObject) {
		var nullFlavor = null;
		var code = null;
		var displayName = null;

		var xmlNode = XmlUtil.stringToXml('<' + nodeName + '/>').childNodes[0];

		var nullSet = updateNullFlavour(xmlNode, fieldObject);
		if (nullSet === false) {
			displayName = fieldObject[0];
			code = fieldObject[1];

			xmlNode.removeAttribute("nullFlavor");

			if (code) {
				XmlUtil.attr(xmlNode, "code", code);
			}
			if (displayName) {
				XmlUtil.attr(xmlNode, "displayName", displayName);
			}
		}
		return xmlNode;
	};

	 /**
	 * retrieves values from an xml node and creates an object with all the values for dataType: CD
	 * @param fieldNode : XML Node from which the values are to be retrived 
	 * @returns : Object containing the values from the node 
	 */
	function getCDObject(fieldNode) {
		var fieldObject = [];

		if (fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "nullFlavor"));
		} else {
			fieldObject.push(null);
		}

		if (XmlUtil.attr(fieldNode, "code")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "code"));
		}
		if (XmlUtil.attr(fieldNode, "displayName")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "displayName"));
		}

		return fieldObject;
	};
	


	function updateNullFlavour(xmlNode, fieldObject) {
		var nullSet = false;
		if (fieldObject && fieldObject.length == 1 && typeof (fieldObject[0]) == 'object') {
			nullFlavor = fieldObject[0];
			XmlUtil.attr(xmlNode, "nullFlavor", nullFlavor.nullFlavor);

			// Remove all attributes
			while (xmlNode.attributes.length > 1) {
				var attnode = xmlNode.attributes[0];
				if (attnode.nodeName === 'nullFlavor' && xmlNode.attributes.length === 1) {
					break;
				}

				if (attnode.nodeName !== 'nullFlavor')
					xmlNode.removeAttributeNode(attnode);
			}

			// Remove all child nodes
			while (xmlNode.childNodes.length > 0) {
				var child = xmlNode.childNodes[0];
				xmlNode.removeChild(child);
			}

			nullSet = true;
		} else {
			xmlNode.removeAttribute("nullFlavor");
		}

		return nullSet;
	}

	function retrieveNullFlavor(fieldNode) {
		var nullFlavor = null;

		if (fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
			nullFlavor = XmlUtil.attr(fieldNode, "nullFlavor");
		}

		return nullFlavor;
	}

	 /**
	 * retrieves values from an xml node and creates an object with all the values for dataType: ED
	 * @param fieldNode : XML Node from which the values are to be retrived 
	 * @returns : Object containing the values from the node 
	 */
	function getEDObject(fieldNode) {
		var fieldObject = [];

		var nullSet = messageAndUIBinder.retrieveNullFlavor(fieldNode);
		if (nullSet != null) {
			fieldObject.push(nullSet);
			return fieldObject;
		}

		if (fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "nullFlavor"));
		} else {
			fieldObject.push(null);
		}
		var thumbnail = XmlUtil.findByName(fieldNode, "thumbnail", true);

		if (XmlUtil.text(thumbnail)) {
			fieldObject.push(XmlUtil.text(thumbnail));
		}

		return fieldObject;
	};
	
	
	 /**
	 * retrieves values from an xml node and creates an object with all the values for dataType: CVList
	 * @param fieldNode : XML Node from which the values are to be retrived 
	 * @returns : Object containing the values from the node 
	 */
	function getCVListObject(fieldNode) {
		var fieldObject = [];

		if (fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "nullFlavor"));
		} else {
			fieldObject.push(null);
		}
		var itemNode = XmlUtil.findByName(fieldNode, "item", false);

		$.each(itemNode, function(key, value) {
			var originalTextNode = XmlUtil.findByName(value, "originalText",
					true);
			if (XmlUtil.text(originalTextNode)) {
				fieldObject.push(XmlUtil.text(originalTextNode));
			} else {
				fieldObject.push(null);
			}

			if (XmlUtil.attr(value, "code")) {
				fieldObject.push(XmlUtil.attr(value, "code"));
			} else {
				fieldObject.push(null);
			}
		});

		return fieldObject;

	};

	 /**
	 * retrieves values from an xml node and creates an object with all the values for dataType: CEList
	 * @param fieldNode : XML Node from which the values are to be retrived 
	 * @returns : Object containing the values from the node 
	 */
	function getCEListObject(fieldNode) {
		var fieldObject = [];

		if (fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "nullFlavor"));
		} else {
			fieldObject.push(null);
		}

		var itemNode = XmlUtil.findByName(fieldNode, "item", false);

		$.each(itemNode, function(key, value) {
			var originalTextNode = XmlUtil.findByName(value, "originalText",
					true);
			if (XmlUtil.text(originalTextNode)) {
				fieldObject.push(XmlUtil.text(originalTextNode));
			}
			if (XmlUtil.attr(value, "code")) {
				fieldObject.push(XmlUtil.attr(value, "code"));
			}
		});

		return fieldObject;
	};

	 /**
	 * retrieves values from an xml node and creates an object with all the values for dataType: IVL_TS
	 * @param fieldNode : XML Node from which the values are to be retrived 
	 * @returns : Object containing the values from the node 
	 */
	function getIVL_TSObject(fieldNode) {
		var fieldObject = [];
		var lowNode = XmlUtil.findByName(fieldNode, "low", true);
		var highNode = XmlUtil.findByName(fieldNode, "high", true);

		if (fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "nullFlavor"));
		} else {
			fieldObject.push(null);
		}

		if (lowNode) {
			fieldObject.push(XmlUtil.attr(lowNode, "value"));
		} else {
			fieldObject.push(null);
		}
		if (highNode) {
			fieldObject.push(XmlUtil.attr(highNode, "value"));
		} else {
			fieldObject.push(null);
		}

		return fieldObject;
	};

	function getRTO_PQ_PQObject(fieldNode){
		var fieldObject = [];
		var numeratorNode = XmlUtil.findByName(fieldNode, "numerator", true);
		var denominatorNode = XmlUtil.findByName(fieldNode, "denominator", true);

		if (fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "nullFlavor"));
		} else {
			fieldObject.push(null);
		}
		if (fieldNode && XmlUtil.attr(fieldNode, "use")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "use"));
		} else {
			fieldObject.push(null);
		}
		
		if (numeratorNode) {
			fieldObject.push(XmlUtil.attr(numeratorNode, "value"));
		} else {
			fieldObject.push(null);
		}
		
		if (denominatorNode) {
			fieldObject.push(XmlUtil.attr(denominatorNode, "value"));
		}else {
			fieldObject.push(null);
		}
		
		return fieldObject;

	}
	;
	

	function getRTO_MO_PQObject(fieldNode){
		var fieldObject = [];
		var numeratorNode = XmlUtil.findByName(fieldNode, "numerator", true);
		var denominatorNode = XmlUtil.findByName(fieldNode, "denominator", true);

		if (fieldNode && XmlUtil.attr(fieldNode, "nullFlavor")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "nullFlavor"));
		} else {
			fieldObject.push(null);
		}
		if (fieldNode && XmlUtil.attr(fieldNode, "use")) {
			fieldObject.push(XmlUtil.attr(fieldNode, "use"));
		} else {
			fieldObject.push(null);
		}
		
		if (numeratorNode) {
			fieldObject.push(XmlUtil.attr(numeratorNode, "value"));
		} else {
			fieldObject.push(null);
		}
		
		if (denominatorNode) {
			fieldObject.push(XmlUtil.attr(denominatorNode, "value"));
		}else {
			fieldObject.push(null);
		}
		
		return fieldObject;

	}
	;
	
	//==================== UI GENERATION ====================//
	
	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html Fragment, to generate UI for editorType : PN
	 * @param  fieldElement : HTML Fragment to which the editor is appended
	 * @param configParamsObj : Object from the config, which provide addtional info required to load data to editor  
	 */
	function getPNCompleteUI(fieldElement, configParamsObj) {

		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(messageAndUIBinder.editorDOM).find("#PNCompleteEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var fields = "select-nameUse,select-prefix,PNfamily,PNgiven,PNsuffix";

		$(editorFragment).find("#PNCompleteEditorLabel").text(editorLabel);
		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		if (configParamsObj) {
			$.each(configParamsObj, function(key, result) {
				if (result.name == 'prefixConceptClass') {
					$(editorFragment).find("#select-prefix").attr('conceptClass',
							result.value);
				}
				if (result.name == 'prefixLookupType') {
					$(editorFragment).find("#select-prefix").attr('lookupType',
							result.value);
				}
				if (result.name == 'prefixLookupSelectType') {
					$(editorFragment).find("#select-prefix").attr(
							'lookupSelectType', result.value);
				}
				if (result.name == 'prefixLookupControl') {
					$(editorFragment).find("#select-prefix").attr(
							'lookupControlType', result.value);
				}
	
				if (result.name == 'nameUseConceptClass') {
					$(editorFragment).find("#select-nameUse").attr('conceptClass',
							result.value);
				}
				if (result.name == 'nameUseLookupType') {
					$(editorFragment).find("#select-nameUse").attr('lookupType',
							result.value);
				}
				if (result.name == 'nameUseLookupSelectType') {
					$(editorFragment).find("#select-nameUse").attr(
							'lookupSelectType', result.value);
				}
				if (result.name == 'nameUseLookupControl') {
					$(editorFragment).find("#select-nameUse").attr(
							'lookupControlType', result.value);
				}
			});
		}	
		
		$(fieldElement).prepend($(editorFragment));
		// $(fieldElement).removeAttr("isEditor");
		$(fieldElement).trigger("create");

	};
	

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html Fragment, to generate UI for editorType : ON
	 * @param  fieldElement : HTML Fragment to which the editor is appended
	 * @param configParamsObj : Object from the config, which provide addtional info required to load data to editor  
	 */
	function getONUI(fieldElement, configParamsObj) {

		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(messageAndUIBinder.editorDOM).find("#ONEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var fields = "ONuse,ONprefix";

		$(editorFragment).find("#ONEditorLabel").text(editorLabel);
		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});	
		
		if (configParamsObj) {
			$.each(configParamsObj, function(key, result) {	
				if (result.name == 'orgNameTypeConceptClass') {
					$(editorFragment).find("#ONuse").attr('conceptClass',
							result.value);
				}
				if (result.name == 'orgNameTypeLookupType') {
					$(editorFragment).find("#ONuse").attr('lookupType',
							result.value);
				}
				if (result.name == 'orgNameTypeLookupSelectType') {
					$(editorFragment).find("#ONuse").attr(
							'lookupSelectType', result.value);
				}
				if (result.name == 'orgNameTypeLookupControl') {
					$(editorFragment).find("#ONuse").attr(
							'lookupControlType', result.value);
				}
			});
		}
		
		$(fieldElement).prepend($(editorFragment));
		// $(fieldElement).removeAttr("isEditor");
		$(fieldElement).trigger("create");

	};
	

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html Fragment, to generate UI for editorType : ST
	 * @param  fieldElement : HTML Fragment to which the editor is appended
	 * @param configParamsObj : Object from the config, which provide addtional info required to load data to editor  
	 */
	function getSTUI(fieldElement, configParamsObj){
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(messageAndUIBinder.editorDOM).find("#STEditor")
				.clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var fields = "STtext";

		$(editorFragment).find("#STEditorLabel").text(editorLabel);
		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});	
		
		$(fieldElement).prepend($(editorFragment));
		$(fieldElement).trigger("create");
	}
	
	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html Fragment, to generate UI for editorType : EDSpan
	 * @param  fieldElement : HTML Fragment to which the editor is appended
	 * @param configParamsObj : Object from the config, which provide addtional info required to load data to editor  
	 */
	function getEDSpanUI(fieldElement, configParamsObj){
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(messageAndUIBinder.editorDOM).find("#EDSpanEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var tagName = $(fieldElement).attr("tagName");
		var fields = "EDSpan";

		$.each($(editorFragment).find('[dataField="true"]'), function(index, value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});	
		
		$(fieldElement).prepend($(editorFragment));
		$(fieldElement).trigger("create");
	};
	
	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html Fragment, to generate UI for editorType : PQInplace
	 * @param  fieldElement : HTML Fragment to which the editor is appended
	 * @param configParamsObj : Object from the config, which provide addtional info required to load data to editor  
	 */
	function getPQInplaceUI(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(messageAndUIBinder.editorDOM).find("#PQInplaceEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var idSuffix = $(fieldElement).attr("idSuffix");
		idSuffix = (idSuffix) ? idSuffix : "";

		var fields = "PQInplaceDisplayValue" + idSuffix;
		$.each($(editorFragment).find('[dataField="true"]'),function(index, value) {
			$(value).attr("id", $(value).attr("id") + idSuffix);
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
			$(value).attr("labelField",
					$(value).attr("labelField") + idSuffix);
			$(value).attr("idSuffix", idSuffix);

		});
		
		
		if (configParamsObj) {
			$.each(configParamsObj, function(key, result) {
				if (result.name == 'editable') {
					if(result.value == false){
						$(editorFragment).find("#PQInplaceDisplayValue"+idSuffix).attr('readonly',"readonly");	
					}
				}
			});
		}
		
		$(fieldElement).html($(editorFragment));
		//$(fieldElement).removeAttr("isEditor");
		$(fieldElement).trigger("create");
	};
	
	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html Fragment, to generate UI for editorType : MO
	 * @param  fieldElement : HTML Fragment to which the editor is appended
	 * @param configParamsObj : Object from the config, which provide addtional info required to load data to editor  
	 */
	function getMOInplaceUI(fieldElement, configParamsObj) {
		
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(messageAndUIBinder.editorDOM).find("#MOInplaceEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var idSuffix = $(fieldElement).attr("idSuffix");
		idSuffix = (idSuffix) ? idSuffix : "";

		var fields = "MOInplaceDisplayValue" + idSuffix;
		$.each($(editorFragment).find('[dataField="true"]'),function(index, value) {
			$(value).attr("id", $(value).attr("id") + idSuffix);
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
			$(value).attr("labelField",
					$(value).attr("labelField") + idSuffix);
			$(value).attr("idSuffix", idSuffix); 

		});
		
		
		if (configParamsObj) {
			$.each(configParamsObj, function(key, result) {
				if (result.name == 'editable') {
					if(result.value == false){
						$(editorFragment).find("#MOInplaceDisplayValue"+idSuffix).attr('readonly',"readonly");	
					}
				}
			});
		}
		
		$(fieldElement).html($(editorFragment));
		//$(fieldElement).removeAttr("isEditor");
		$(fieldElement).trigger("create");
	};
	
	
	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html Fragment, to generate UI for editorType : CDCheckBox
	 * @param  fieldElement : HTML Fragment to which the editor is appended
	 * @param configParamsObj : Object from the config, which provide addtional info required to load data to editor  
	 */
	function getCDCheckBoxUI(fieldElement, configParamsObj){
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var idSuffix = $(fieldElement).attr("idSuffix");
		var editorFragment = $(messageAndUIBinder.editorDOM).find("#CDCheckBoxEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		
		var field1=  "CDCheckBoxDisplayValue"+idSuffix;
		var field2=  "CDCheckBoxLabel"+idSuffix;
		var fields = field1;
		
		$(editorFragment).find("#CDCheckBoxLabel").text(editorLabel);
		
		$(editorFragment).find("#CDCheckBoxDisplayValue").attr("id",field1);
		$(editorFragment).find("#CDCheckBoxLabel").attr("id",field2);
		
		$.each($(editorFragment).find('[dataField="true"]'), function(index,value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
			$(value).attr("value", editorLabel);
		});

		$(fieldElement).prepend($(editorFragment));
		$(fieldElement).trigger("create");
	};
	

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html Fragment, to generate UI for editorType : PQBoolean
	 * @param  fieldElement : HTML Fragment to which the editor is appended
	 * @param configParamsObj : Object from the config, which provide addtional info required to load data to editor  
	 */
	function getPQBooleanUI(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var name = $(fieldElement).attr("name");
		var editorFragment = $(messageAndUIBinder.editorDOM).find("#PQBooleanEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var idSuffix = $(fieldElement).attr("idSuffix");
		var style = $(fieldElement).attr("style");
		idSuffix = (idSuffix) ? idSuffix : "";
		var field1 = "radioEditor1" + idSuffix;
		var field2 = "radioEditor2" + idSuffix;

		var fields = field1 + "," + field2;
		$.each($(editorFragment).find('[dataField="true"]'),function(index, value) {
			$(value).attr("id", $(value).attr("id") + idSuffix);
			$(value).attr("name", $(value).attr("name") + idSuffix);
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
			$(value).attr("labelField",	$(value).attr("labelField") + idSuffix);
			$(value).attr("idSuffix", idSuffix);
			$(value).attr("style", style);

		});
		$(fieldElement).html($(editorFragment));
		$(fieldElement).trigger("create");
	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html Fragment, to generate UI for editorType : PQInplaceCombo
	 * @param  fieldElement : HTML Fragment to which the editor is appended
	 * @param configParamsObj : Object from the config, which provide addtional info required to load data to editor  
	 */
	function getPQInplaceComboUI(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(messageAndUIBinder.editorDOM).find("#PQInplaceComboEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var idSuffix = $(fieldElement).attr("idSuffix");
		idSuffix = (idSuffix) ? idSuffix : "";

		var conceptClass = null;
		var fields = null;
		if (configParamsObj) {
			$.each(configParamsObj, function(key, result) {
				if (result.name == 'conceptClass') {
					conceptClass = result.value;
					fields = "select-" + conceptClass + idSuffix;
					$(editorFragment).find("#select-choice").attr('conceptClass',result.value);
				}
				if (result.name == 'lookupType') {
					$(editorFragment).find("#select-choice").attr('lookupType',result.value);
				}
				if (result.name == 'lookupSelectType') {
					$(editorFragment).find("#select-choice").attr('lookupSelectType', result.value);
				}
				if (result.name == 'lookupControl') {
					$(editorFragment).find("#select-choice").attr('lookupControlType', result.value);
				}
			});
		}	

		$(editorFragment).find("#select-choice").attr('id',"select-" + conceptClass);

		$.each($(editorFragment).find('[dataField="true"]'),function(index, value) {
			$(value).attr("id", $(value).attr("id") + idSuffix);
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
			$(value).attr("labelField",
					$(value).attr("labelField") + idSuffix);
			$(value).attr("idSuffix", idSuffix);
	
		});

		$(fieldElement).html($(editorFragment));
		//$(fieldElement).removeAttr("isEditor");
		$(fieldElement).trigger("create");
	};
	
	
	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html Fragment, to generate UI for editorType : CDLabel
	 * @param  fieldElement : HTML Fragment to which the editor is appended
	 * @param configParamsObj : Object from the config, which provide addtional info required to load data to editor  
	 */
	function getCDLabelUI(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(messageAndUIBinder.editorDOM).find("#CDLabelEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var idSuffix = $(fieldElement).attr("idSuffix");
		idSuffix = (idSuffix) ? idSuffix : "";

		var field1 = "CDLabelEditorLabel" + idSuffix;
		var field2 = "CDLabelEditorLabelHidden" + idSuffix;

		var fields = field1 + "," + field2;

		$(editorFragment).find("#CDLabelEditorLabel").text(editorLabel);

		$.each($(editorFragment).find('[dataField="true"]'), function(index,value) {
			$(value).attr("id", $(value).attr("id") + idSuffix);
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		$(editorFragment).find("#CDLabelEditorLabel").attr("id","CDLabelEditorLabel" + idSuffix);
		$(fieldElement).html($(editorFragment));
		//$(fieldElement).removeAttr("isEditor");
		$(fieldElement).trigger("create");
	};	

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html Fragment, to generate UI for editorType : II
	 * @param  fieldElement : HTML Fragment to which the editor is appended
	 * @param configParamsObj : Object from the config, which provide addtional info required to load data to editor  
	 */
	function getIIUI(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(messageAndUIBinder.editorDOM).find("#IIEditor")
				.clone();
		
		var idSuffix = $(fieldElement).attr("idSuffix");
		var pathFields = $(fieldElement).attr("pathFields");
		var tagName = $(fieldElement).attr("tagName");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var fields = "IIroot,IIextension,IIassigningAuthorityName";

		$(editorFragment).find("#IIEditorLabel").text(editorLabel);
		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		if (configParamsObj) {
			$.each(configParamsObj, function(key, result) {
				if (result.name == 'textBoxWidth') {
					$(editorFragment).find("#IIDisplayValue").css('width',
							result.value);
				}
				if (result.name == 'buttonWidth') {
					$(editorFragment).find("#button")
							.css('width', result.value);
				}
				if (result.name == 'root.value') {
					$(editorFragment).find("#IIroot")
							.attr('value', result.value);
				}
				if (result.name == 'root.label') {
					$(editorFragment).find("#IIrootLabel")
							.text(result.value);
				}
				if (result.name == 'root.editable') {
					if(result.value == "true")
					{
						$(editorFragment).find("#IIroot")
						.removeAttr('readonly');
					}
					else if("false"){
						$(editorFragment).find("#IIroot")
						.attr('readonly', "readonly");
					}
				}
				if (result.name == 'extension.editable') {
					if(result.value == "true")
					{
						$(editorFragment).find("#IIextension")
						.removeAttr('readonly');
					}
					else if("false"){
						$(editorFragment).find("#IIextension")
						.attr('readonly', "readonly");
					}
				}
				if (result.name == 'extension.label') {
					$(editorFragment).find("#IIextensionLabel")
							.text(result.value);
				}
				if (result.name == 'assigningAuthorityName.value') {
					$(editorFragment).find("#IIassigningAuthorityName")
							.attr("value", result.value);
				}
				if (result.name == 'assigningAuthorityName.label') {
					$(editorFragment).find("#IIassigningAuthorityNameLabel")
							.text(result.value);
				}
				if (result.name == 'root.visible') {
					if(result.value == "true")
					{
						$(editorFragment).find("#IIroot")
						.css('display', "block");
					}
					else if("false"){
						$(editorFragment).find("#IIroot")
						.css('display', "none");
					}
				}
				if (result.name == 'assigningAuthorityName.readOnly') {
					if(result.value == "true")
					{
						$(editorFragment).find("#IIassigningAuthorityName")
						.removeAttr('readonly');
					}
					else if("false"){
						$(editorFragment).find("#IIassigningAuthorityName")
						.attr('readonly', "readonly");
					}
				}
				
			});
		}

		// var htmlFragment = $('<div id="IIFieldEditor"
		// style="display:block">'+ editorFragment.html()+'</div>');

		// $(fieldElement).html($(editorFragment));
		$(editorFragment).attr("idSuffix", idSuffix);
		$(fieldElement).prepend($(editorFragment));

		// $(fieldElement).removeAttr("isEditor");
		$(fieldElement).trigger("create");
	};
	
	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html Fragment, to generate UI for editorType : IIUserName
	 * @param  fieldElement : HTML Fragment to which the editor is appended
	 * @param configParamsObj : Object from the config, which provide addtional info required to load data to editor  
	 */
	function getIIUserNameUI(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(messageAndUIBinder.editorDOM).find("#IIUserNameEditor")
				.clone();

		var pathFields = $(fieldElement).attr("pathFields");
		var tagName = $(fieldElement).attr("tagName");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var fields = "IIUserNameRoot,IIUserNameExtension,IIUserNameAssigningAuthorityName";

		$(editorFragment).find("#IIUserNameEditorLabel").text(editorLabel);
		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		if (configParamsObj) {
			$.each(configParamsObj, function(key, result) {
				if (result.name == 'textBoxWidth') {
					$(editorFragment).find("#IIUserNameDisplayValue").css('width',
							result.value);
				}
				if (result.name == 'buttonWidth') {
					$(editorFragment).find("#button")
							.css('width', result.value);
				}
				if (result.name == 'class') {
					$(editorFragment).find("#IIUserNameExtension")
							.attr('class', result.value);
				}
				if (result.name == 'root.editable') {
					if(result.value == "true")
					{
						$(editorFragment).find("#IIUserNameRoot")
						.removeAttr('readonly');
					}
					else{
						$(editorFragment).find("#IIUserNameRoot")
						.attr('readonly', "readonly");
					}
				}
				if (result.name == 'extension.editable') {
					if(result.value == "true")
					{
						$(editorFragment).find("#IIUserNameExtension")
						.removeAttr('readonly');
					}
					else if("false"){
						$(editorFragment).find("#IIUserNameExtension")
						.attr('readonly', "readonly");
					}
				}
			});
		}

		// var htmlFragment = $('<div id="IIFieldEditor"
		// style="display:block">'+ editorFragment.html()+'</div>');

		// $(fieldElement).html($(editorFragment));
		$(fieldElement).prepend($(editorFragment));

		// $(fieldElement).removeAttr("isEditor");
		$(fieldElement).trigger("create");
	};
	
	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html Fragment, to generate UI for editorType : IIPassword
	 * @param  fieldElement : HTML Fragment to which the editor is appended
	 * @param configParamsObj : Object from the config, which provide addtional info required to load data to editor  
	 */
	function getIIPasswordUI(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(messageAndUIBinder.editorDOM).find("#IIPasswordEditor")
				.clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var tagName = $(fieldElement).attr("tagName");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var fields = "IIPasswordRoot,IIPasswordExtension,IIPasswordAssigningAuthorityName";

		$(editorFragment).find("#IIPasswordEditorLabel").text(editorLabel);
		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		if (configParamsObj) {
			$.each(configParamsObj, function(key, result) {
				if (result.name == 'textBoxWidth') {
					$(editorFragment).find("#IIPasswordDisplayValue").css('width',
							result.value);
				}
				if (result.name == 'buttonWidth') {
					$(editorFragment).find("#button")
							.css('width', result.value);
				}
				if (result.name == 'class') {
					$(editorFragment).find("#IIPasswordExtension")
							.attr('class', result.value);
				}
				if (result.name == 'root.editable') {
					if(result.value == "true")
					{
						$(editorFragment).find("#IIPasswordRoot")
						.removeAttr('readonly');
					}
					else{
						$(editorFragment).find("#IIPasswordRoot")
						.attr('readonly', "readonly");
					}
				}
				if (result.name == 'extension.editable') {
					if(result.value == "true")
					{
						$(editorFragment).find("#IIPasswordExtension")
						.removeAttr('readonly');
					}
					else if("false"){
						$(editorFragment).find("#IIPasswordExtension")
						.attr('readonly', "readonly");
					}
				}
			});
		}

		// var htmlFragment = $('<div id="IIFieldEditor"
		// style="display:block">'+ editorFragment.html()+'</div>');

		// $(fieldElement).html($(editorFragment));
		$(fieldElement).prepend($(editorFragment));

		// $(fieldElement).removeAttr("isEditor");
		$(fieldElement).trigger("create");
	}
	;
	
	function getIIPermissionUI(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(messageAndUIBinder.editorDOM).find(
				"#IIPermissionEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var tagName = $(fieldElement).attr("tagName");
		// var editorLabel = $(fieldElement).attr("editorLabel");
		var fields = "IIPermissionRoot,IIPermissionExtension,IIPermissionAssigningAuthorityName";
		var idSuffix = $(fieldElement).attr("idSuffix");
		// $(editorFragment).find("#IIPermissionRoot").text(editorLabel);
		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			/*$(value).attr("id", $(value).attr("id") + idSuffix);*/
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		if (configParamsObj) {
			$.each(configParamsObj, function(key, result) {
				if (result.name == 'textBoxWidth') {
					$(editorFragment).find("#IIPermissionEditorDisplayValue")
							.css('width', result.value);
				}
				if (result.name == 'buttonWidth') {
					$(editorFragment).find("#button")
							.css('width', result.value);
				}

			});
		}
		$(editorFragment).find("#IIPermissionRoot").attr("for",
				"IIPermissionExtension" + idSuffix);
		// var htmlFragment = $('<div id="IIFieldEditor"
		// style="display:block">'+ editorFragment.html()+'</div>');

		// $(fieldElement).html($(editorFragment));
		$(fieldElement).prepend($(editorFragment));

		// $(fieldElement).removeAttr("isEditor");
		$(fieldElement).trigger("create");

	}
	;

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html Fragment, to generate UI for editorType : CS
	 * @param  fieldElement : HTML Fragment to which the editor is appended
	 * @param configParamsObj : Object from the config, which provide addtional info required to load data to editor  
	 */
	function getCSUI(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(messageAndUIBinder.editorDOM).find("#CSEditor")
				.clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var fields = "CSstatusCode";

		$(editorFragment).find("#CSEditorLabel").text(editorLabel);
		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		if (configParamsObj) {
			$.each(configParamsObj, function(key, result) {
				if (result.name == 'statusConceptClass') {
					$(editorFragment).find("#CSstatusCode").attr('conceptClass',
							result.value);
				}
				if (result.name == 'statusLookupType') {
					$(editorFragment).find("#CSstatusCode").attr('lookupType',
							result.value);
				}
				if (result.name == 'statusLookupSelectType') {
					$(editorFragment).find("#CSstatusCode").attr(
							'lookupSelectType', result.value);
				}
				if (result.name == 'statusLookupControl') {
					$(editorFragment).find("#CSstatusCode").attr(
							'lookupControlType', result.value);
				}
			});
		}	
		
		$(fieldElement).prepend($(editorFragment));
		$(fieldElement).trigger("create");

	};
	
	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html Fragment, to generate UI for editorType : CSInplace
	 * @param  fieldElement : HTML Fragment to which the editor is appended
	 * @param configParamsObj : Object from the config, which provide addtional info required to load data to editor  
	 */
	function getCSInplaceUI(fieldElement, configParamsObj){
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(messageAndUIBinder.editorDOM).find("#CSInplaceEditor")
				.clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var fields = "CSstatusCode";

		$(editorFragment).find("#CSInplaceEditorLabel").text(editorLabel);
		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		if (configParamsObj) {
			$.each(configParamsObj, function(key, result) {
				if (result.name == 'statusConceptClass') {
					$(editorFragment).find("#CSstatusCode").attr('conceptClass',
							result.value);
				}
				if (result.name == 'statusLookupType') {
					$(editorFragment).find("#CSstatusCode").attr('lookupType',
							result.value);
				}
				if (result.name == 'statusLookupSelectType') {
					$(editorFragment).find("#CSstatusCode").attr(
							'lookupSelectType', result.value);
				}
				if (result.name == 'statusLookupControl') {
					$(editorFragment).find("#CSstatusCode").attr(
							'lookupControlType', result.value);
				}
			});
		}	
		
		$(fieldElement).prepend($(editorFragment));
		$(fieldElement).trigger("create");
	}

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html Fragment, to generate UI for editorType : TEL
	 * @param  fieldElement : HTML Fragment to which the editor is appended
	 * @param configParamsObj : Object from the config, which provide addtional info required to load data to editor  
	 */
	function getTELUI(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(messageAndUIBinder.editorDOM).find("#TELEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var tagName = $(fieldElement).attr("tagName");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var fields = "select-telecomUse,TELvalue";

		$(editorFragment).find("#TELEditorLabel").text(editorLabel);
		$.each($(editorFragment).find('[dataField="true"]'), function(index,value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		if (configParamsObj) {
			$.each(configParamsObj, function(key, result) {
				if (result.name == 'telecomUseConceptClass') {
					$(editorFragment).find("#select-telecomUse").attr(
							'conceptClass', result.value);
				}
				if (result.name == 'telecomUseLookupType') {
					$(editorFragment).find("#select-telecomUse").attr('lookupType',
							result.value);
				}
				if (result.name == 'telecomUseLookupSelectType') {
					$(editorFragment).find("#select-telecomUse").attr(
							'lookupSelectType', result.value);
				}
				if (result.name == 'telecomUseLookupControl') {
					$(editorFragment).find("#select-telecomUse").attr(
							'lookupControlType', result.value);
				}
				if (result.name == 'textBoxWidth') {
					$(editorFragment).find("#TELDisplayValue").css('width',
							result.value);
				}
				if (result.name == 'buttonWidth') {
					$(editorFragment).find("#button").css('width', result.value);
				}
	
			});
		}	

		$(fieldElement).prepend($(editorFragment));
		$(fieldElement).trigger("create");
	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html Fragment, to generate UI for editorType : AD
	 * @param  fieldElement : HTML Fragment to which the editor is appended
	 * @param configParamsObj : Object from the config, which provide addtional info required to load data to editor  
	 */
	function getADUI(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(messageAndUIBinder.editorDOM).find("#ADEditor")
				.clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var fields = "ADhouseNumber,ADstreetName,select-city,select-state,select-country,ADpostalCode";

		$(editorFragment).find("#ADEditorLabel").text(editorLabel);
		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		if (configParamsObj) {
			$.each(configParamsObj, function(key, result) {
				if (result.name == 'cityConceptClass') {
					$(editorFragment).find("#select-city").attr('conceptClass',
							result.value);
				}
				if (result.name == 'cityLookupType') {
					$(editorFragment).find("#select-city").attr('lookupType',
							result.value);
				}
				if (result.name == 'cityLookupSelectType') {
					$(editorFragment).find("#select-city").attr('lookupSelectType',
							result.value);
				}
				if (result.name == 'cityLookupControl') {
					$(editorFragment).find("#select-city").attr(
							'lookupControlType', result.value);
				}
	
				if (result.name == 'stateConceptClass') {
					$(editorFragment).find("#select-state").attr('conceptClass',
							result.value);
					$(editorFragment).find("#select-state").attr('request',
							'client');
				}
				if (result.name == 'stateLookupType') {
					$(editorFragment).find("#select-state").attr('lookupType',
							result.value);
				}
				if (result.name == 'stateLookupSelectType') {
					$(editorFragment).find("#select-state").attr(
							'lookupSelectType', result.value);
				}
				if (result.name == 'stateLookupControl') {
					$(editorFragment).find("#select-state").attr(
							'lookupControlType', result.value);
				}
	
				if (result.name == 'countryConceptClass') {
					$(editorFragment).find("#select-country").attr('conceptClass',
							result.value);
					$(editorFragment).find("#select-country").attr('request',
							'client');
				}
				if (result.name == 'countryLookupType') {
					$(editorFragment).find("#select-country").attr('lookupType',
							result.value);
				}
				if (result.name == 'countryLookupSelectType') {
					$(editorFragment).find("#select-country").attr(
							'lookupSelectType', result.value);
				}
				if (result.name == 'countryLookupControl') {
					$(editorFragment).find("#select-country").attr(
							'lookupControlType', result.value);
				}
				if (result.name == 'textBoxWidth') {
					$(editorFragment).find("#ADDisplayValue").css('width',
							result.value);
				}
			});
		}	
		
		$(fieldElement).prepend($(editorFragment));
		$(fieldElement).trigger("create");
	};

	
	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html Fragment, to generate UI for editorType : CE
	 * @param  fieldElement : HTML Fragment to which the editor is appended
	 * @param configParamsObj : Object from the config, which provide addtional info required to load data to editor  
	 */
	function getCEUI(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(messageAndUIBinder.editorDOM).find("#CEEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var conceptClass = null;

		if (configParamsObj) {
			$.each(configParamsObj, function(key, result) {
				if (result.name == 'conceptClass') {
					conceptClass = result.value;
					$(editorFragment).find("#select-choice").attr('conceptClass',
							result.value);
				}
				if (result.name == 'lookupType') {
					$(editorFragment).find("#select-choice").attr('lookupType',
							result.value);
				}
				if (result.name == 'lookupSelectType') {
					$(editorFragment).find("#select-choice").attr(
							'lookupSelectType', result.value);
				}
				if (result.name == 'lookupControl') {
					$(editorFragment).find("#select-choice").attr(
							'lookupControlType', result.value);
				}
				if (result.name == 'width') {
					$(editorFragment).css("width", result.value);
				}
	
			});
		}	
		var fields = 'select-choice' + conceptClass + ',null';

		$(editorFragment).find("#CEEditorLabel").text(editorLabel);
		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		$(editorFragment).find("#select-choice").attr('id',"select-choice" + conceptClass);

		$(fieldElement).prepend($(editorFragment));
		$(fieldElement).trigger("create");
	};
	
	
	
	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html Fragment, to generate UI for editorType : CD
	 * @param  fieldElement : HTML Fragment to which the editor is appended
	 * @param configParamsObj : Object from the config, which provide addtional info required to load data to editor  
	 */
	function getCDUI(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(messageAndUIBinder.editorDOM).find("#CDEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var conceptClass = null;

		if (configParamsObj) {
			$.each(configParamsObj, function(key, result) {
				if (result.name == 'conceptClass') {
					conceptClass = result.value;
					$(editorFragment).find("#select-choice").attr('conceptClass',
							result.value);
				}
				if (result.name == 'lookupType') {
					$(editorFragment).find("#select-choice").attr('lookupType',
							result.value);
				}
				if (result.name == 'lookupSelectType') {
					$(editorFragment).find("#select-choice").attr(
							'lookupSelectType', result.value);
				}
				if (result.name == 'lookupControl') {
					$(editorFragment).find("#select-choice").attr(
							'lookupControlType', result.value);
				}
				if (result.name == 'width') {
					$(editorFragment).css("width", result.value);
				}
	
			});
		}	
		var fields = 'select-choice' + conceptClass + ',null';

		$(editorFragment).find("#CDEditorLabel").text(editorLabel);
		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		$(editorFragment).find("#select-choice").attr('id',"select-choice" + conceptClass);

		$(fieldElement).prepend($(editorFragment));
		$(fieldElement).trigger("create");
	};
	
	

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html Fragment, to generate UI for editorType : CVListThreeTextbox
	 * @param  fieldElement : HTML Fragment to which the editor is appended
	 * @param configParamsObj : Object from the config, which provide addtional info required to load data to editor  
	 */
	function getCVListThreeTextboxUI(fieldElement, configParamsObj) {
		var configPathField = $(fieldElement).attr("configPathField");
		var dataType = $(fieldElement).attr("dataType");
		var editorFragment = $(messageAndUIBinder.editorDOM).find("#CVListThreeTextboxEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var editorType = $(fieldElement).attr("editorType");
		var tagName = $(fieldElement).attr("tagName");
		var fields = "CVListTextboxYear,CVListTextboxYearLabel,CVListTextboxReason,CVListTextboxReasonLabel,CVListTextboxHospital,CVListTextboxHospitalLabel";
		var idSuffix = $(fieldElement).attr("idSuffix");

		$(editorFragment).find("#CVListThreeTextboxEditorLabel").text(editorLabel);

		$.each($(editorFragment).find('[dataField="true"]'), function(index,value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		$.each($(editorFragment).find('[hasToggle="true"]'), function(index,value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
			$(value).attr("editorType", editorType);
		});

		if (configParamsObj) {
			$.each(configParamsObj, function(key, configParam) {
				if (configParam.name == 'column1') {
					$(editorFragment).find("#CVListTextboxYearLabel").text(
							configParam.value);
				}

				if (configParam.name == 'column2') {
					$(editorFragment).find("#CVListTextboxReasonLabel").text(
							configParam.value);
				}

				if (configParam.name == 'column3') {
					$(editorFragment).find("#CVListTextboxHospitalLabel").text(
							configParam.value);
				}
			});
		}

		$(editorFragment).attr("idSuffix", idSuffix);
		$(fieldElement).prepend(editorFragment);
		$(fieldElement).trigger("create");

	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html Fragment, to generate UI for editorType : CVListTwoTextbox
	 * @param  fieldElement : HTML Fragment to which the editor is appended
	 * @param configParamsObj : Object from the config, which provide addtional info required to load data to editor  
	 */
	function getCVListTwoTextboxUI(fieldElement, configParamsObj) {
		var configPathField = $(fieldElement).attr("configPathField");
		var dataType = $(fieldElement).attr("dataType");
		var editorFragment = $(messageAndUIBinder.editorDOM).find("#CVListTwoTextboxEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var editorType = $(fieldElement).attr("editorType");
		var tagName = $(fieldElement).attr("tagName");
		var fields = "CVListTextboxDrug,CVListTextboxDrugLabel,CVListTextboxReaction,CVListTextboxReactionLabel";
		var idSuffix = $(fieldElement).attr("idSuffix");

		$(editorFragment).find("#CVListTwoTextboxEditorLabel").text(editorLabel);

		$.each($(editorFragment).find('[dataField="true"]'), function(index,value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		$.each($(editorFragment).find('[hasToggle="true"]'), function(index,value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
			$(value).attr("editorType", editorType);
		});

		if (configParamsObj) {
			$.each(configParamsObj, function(key, configParam) {
				if (configParam.name == 'column1') {
					$(editorFragment).find("#CVListTextboxDrugLabel").text(
							configParam.value);
				}

				if (configParam.name == 'column2') {
					$(editorFragment).find("#CVListTextboxReactionLabel").text(
							configParam.value);
				}

			});
		}

		$(editorFragment).attr("idSuffix", idSuffix);
		$(fieldElement).prepend(editorFragment);
		$(fieldElement).trigger("create");

	};
	
	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html Fragment, to generate UI for editorType : CVListTextbox
	 * @param  fieldElement : HTML Fragment to which the editor is appended
	 * @param configParamsObj : Object from the config, which provide addtional info required to load data to editor  
	 */
	function getCVListTextboxUI(fieldElement, configParamsObj) {
		var configPathField = $(fieldElement).attr("configPathField");
		var dataType = $(fieldElement).attr("dataType");
		var editorFragment = $(messageAndUIBinder.editorDOM).find("#CVListTextboxEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var editorType = $(fieldElement).attr("editorType");
		var tagName = $(fieldElement).attr("tagName");
		var fields = "CVListTextboxHealth,CVListTextboxHealthLabel"; 
		var idSuffix = $(fieldElement).attr("idSuffix");

		$(editorFragment).find("#CVListTextboxEditorLabel").text(editorLabel);

		$.each($(editorFragment).find('[dataField="true"]'), function(index,value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		$.each($(editorFragment).find('[isEditor="true"]'), function(index,value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
			$(value).attr("editorType", editorType);
		});

		$(editorFragment).attr("idSuffix", idSuffix);
		$(fieldElement).prepend(editorFragment);
		$(fieldElement).trigger("create");

	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html Fragment, to generate UI for editorType : CVListTextarea
	 * @param  fieldElement : HTML Fragment to which the editor is appended
	 * @param configParamsObj : Object from the config, which provide addtional info required to load data to editor  
	 */
	function getCVListTextareaUI(fieldElement, configParamsObj) {
		var configPathField = $(fieldElement).attr("configPathField");
		var dataType = $(fieldElement).attr("dataType");
		var editorFragment = $(messageAndUIBinder.editorDOM).find("#CVListTextareaEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var editorType = $(fieldElement).attr("editorType");
		var tagName = $(fieldElement).attr("tagName");
		var fields = "CVListTextareaList,CVListTextareaEditorLabel"; 
		var idSuffix = $(fieldElement).attr("idSuffix");

		$(editorFragment).find("#CVListTextareaEditorLabel").text(editorLabel);

		$.each($(editorFragment).find('[dataField="true"]'), function(index,value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		$.each($(editorFragment).find('[hasToggle="true"]'), function(index, value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
			$(value).attr("editorType", editorType);
		});
		
		/*var configPathFieldObj = updatePathfield.getPathFieldObject(fieldElement);
		var pathFields = updatePathfield.getPathField(configPathFieldObj);*/
		
		$(editorFragment).attr("idSuffix", idSuffix);
		$(fieldElement).prepend(editorFragment);
		$(fieldElement).trigger("create");

	};


	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html Fragment, to generate UI for editorType : CVListTextarea
	 * @param  fieldElement : HTML Fragment to which the editor is appended
	 * @param configParamsObj : Object from the config, which provide addtional info required to load data to editor  
	 */
	function getGridUI(fieldElement, configParamsObj) {
		var editorType      = $(fieldElement).attr("editorType");
		var editorLabel     = $(fieldElement).attr("editorLabel");
		var configPathField = $(fieldElement).attr("configPathField");
		var dataType		= $(fieldElement).attr("dataType");
		var tagName			= $(fieldElement).attr("tagName");
		var idSuffix 		= $(fieldElement).attr("idSuffix");
		var groupId 		= $(fieldElement).attr("groupId");
		var gridEditorType 	= $(fieldElement).attr("gridEditorType");
		
		var pathFields = $(fieldElement).attr("pathFields");
		
		
		//var configPathFieldObj = updatePathfield.getPathFieldObject(fieldElement);
		//var pathFields = updatePathfield.getPathField(configPathFieldObj);
		
		var gridFragment = $(messageAndUIBinder.editorDOM).find("#"+editorType+"Editor").clone();
		var wrapper = $(gridFragment).find('[uiRole="gridContent"]')[0];
		$(wrapper).attr("configPathField",configPathField);
		$(wrapper).attr("idSuffix",idSuffix);
		
		$(wrapper).attr("isEditor",true);
		$(wrapper).attr("dataType", dataType);
		$(wrapper).attr("tagName",tagName);
		$(wrapper).attr("pathFields",pathFields);
		$(wrapper).attr("editorType",gridEditorType);
		$(wrapper).attr("groupId",groupId);
		
		$(fieldElement).removeAttr('isEditor');
		$(fieldElement).removeAttr('groupId');
	
		//var gridContent  = $(gridFragment).children()[0];
		$(wrapper).find("#gridLabel").text(editorLabel);
		var gridContent  = $(gridFragment).find("#editor");
		
		$(gridFragment).attr("editorType",gridEditorType);
		$(gridContent).attr("pathFields",pathFields);
		$(gridContent).attr("editorLabel"," ");
		$(gridContent).attr("configPathField",configPathField);
		$(gridContent).attr("dataType",dataType);
		$(gridContent).attr("tagName",tagName);
		$(gridContent).attr("idSuffix",idSuffix);
		$(gridContent).attr("editorType",gridEditorType);

		$(gridFragment).find("#addButton").attr("idSuffix",idSuffix);
		$(gridFragment).find("#addButton").attr("configPathField",configPathField);
		$(gridFragment).find("#addButton").css("display","block");
		$(gridFragment).find("#removeButton").css("display","none");
		
		$(fieldElement).html(gridFragment);
		
		$(gridFragment).find("#addButton").click(function(){
			
			var idSuffix = $(this).attr("idSuffix");
			 messageAndUIBinder.addGridEditor(gridFragment,idSuffix);
		});

		var methodName = ('get' + gridEditorType + 'UI');
		
		if(methodName in messageAndUIBinder){
			try{
				eval('messageAndUIBinder.' + methodName + '(gridContent, configParamsObj)');					
			} catch (error){
				  return;
			}
		 }
		
		/* making the display textBox width 100% */
		$(gridFragment).find('[hasToggle="true"]').each(function(key,field){
			$(field).css('width','99%');
		});
		
		$(gridFragment).trigger('create');
	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html Fragment, to generate UI for editorType : EDImage
	 * @param  fieldElement : HTML Fragment to which the editor is appended
	 * @param configParamsObj : Object from the config, which provide addtional info required to load data to editor  
	 */
	function getEDImageUI(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(messageAndUIBinder.editorDOM).find("#EDImageEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var fields = "EDthumbnail";

		$(editorFragment).find("#EDImageEditorLabel").text(editorLabel);
		$.each($(editorFragment).find('[dataField="true"]'), function(index,value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		$(fieldElement).html($(editorFragment));
		// $(fieldElement).removeAttr("isEditor");
		$(fieldElement).trigger("create");
	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html Fragment, to generate UI for editorType : TS
	 * @param  fieldElement : HTML Fragment to which the editor is appended
	 * @param configParamsObj : Object from the config, which provide addtional info required to load data to editor  
	 */
	function getTSUI(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(messageAndUIBinder.editorDOM).find("#TSEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var fields = "TSbirthTime";

		$(editorFragment).find("#TSEditorLabel").text(editorLabel);
		$.each($(editorFragment).find('[dataField="true"]'), function(index,value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});
		
		if(configParamsObj){
			$.each(configParamsObj, function(key, configParam) {
				if (configParam.name == 'width') {
					 $(editorFragment).css("width", configParam.value);
				}
			});
		}	
		
		$(fieldElement).prepend($(editorFragment));
		$(fieldElement).trigger("create");

	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html Fragment, to generate UI for editorType : Calendar
	 * @param  fieldElement : HTML Fragment to which the editor is appended
	 * @param configParamsObj : Object from the config, which provide addtional info required to load data to editor  
	 */
	function getCalendarUI(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(messageAndUIBinder.editorDOM).find("#CalendarEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var page = $(fieldElement).attr("page");
		var calendarPage = "calendarPage";
		var fields = "cFrom,cTo";
		var calendarId = "calendarData";

		$.each($(editorFragment).find('[dataField="true"]'), function(index,value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
			$(value).attr("page", page);
			// $(value).attr("showEditor",calendarPage);
		});
		
		$(fieldElement).html($(editorFragment));
		//$(fieldElement).removeAttr("isEditor");
		$(fieldElement).trigger("create");
		$(fieldElement).find('#' + calendarId).unbind("click",calendarClickHandler);
		$(fieldElement).find('#' + calendarId).bind("click",calendarClickHandler);
		
		var appointmentSchedule = null;
		function calendarClickHandler(event) {
			var object = null;
			if($(fieldElement).find('#' + calendarId).attr("value")){
				object = currentScheduled();					
			}			
			var flag = getPreviousConsultant();
			messageAndUIBinder.makeQueryForLucene();
			//messageAndUIBinder.makeQueryForCassandra();
			var page = $(this).attr("page");
			$('#' + calendarPage).show();
			$("#" + page).hide();
			if (!appointmentSchedule) {
				appointmentSchedule = new HIN.AppointmentSchedule(
						"calendarPage",
						true,
						function(appointmentVO) {
							$(fieldElement).find('#' + calendarId).val(
									appointmentVO.start + " to "
											+ appointmentVO.end);
							$(fieldElement).find('#' + calendarId).trigger(
									'change');
							$(fieldElement).find('#cFrom').val(
									appointmentVO.start);
							$(fieldElement).find('#cFrom').trigger('change');
							$(fieldElement).find('#cTo').val(appointmentVO.end);
							$(fieldElement).find('#cTo').trigger('change');
							$("#" + page).show();
							$('#' + calendarPage).hide();
						});
				appointmentSchedule.backPage = page;
				appointmentSchedule.loadFullCalendar(object);// loadCalendar();
			} else				if(!flag){
				appointmentSchedule.loadFullCalendar();
			}
			function getPreviousConsultant(){
				var context = appController.getComponent("Context");
				if (context){
					var query = context.getCalendarQuery();
					if (query){
						var presentCons = $('#' + messageAndUIBinder.parentContainerID).find('#consultant').attr("value");
						context.setConsultant(presentCons);
						var prevCons = query.getQueryString("PRPA_MT410001HT02");
						//alert(context.getConsultant()+"prevCons:"+prevCons+" \n "+(prevCons==context.getConsultant()));
						if(presentCons==undefined || presentCons=='' || presentCons==null){
							//notificationmsg.success("Please select Physician");
							return false;
						}
						if(prevCons==context.getConsultant()){
							return true;
						}
					}else{
						//notificationmsg.success("Please select Physician");
					}
				}
				return false;
			};
			function currentScheduled(){
				var patient = "";
				var patientId = "";
				var start = $(fieldElement).find('#cFrom').attr("value");
				var end  = $(fieldElement).find('#cTo').attr("value");
				var physicisnId = $('#' + messageAndUIBinder.parentContainerID).find('#consultant').attr("value");
				var physicisnName = $('#' + messageAndUIBinder.parentContainerID).find('#pPhysician').attr("value");
				var patientVO = appController.getComponent("Context").getPatientVO();
				if(patientVO){
					patient = patientVO.name;
					patientId = patientVO.subscriberId;
				}		
				var appointmentVO = new HIN.AppointmentVO();
				appointmentVO.patientId = patientId;
				appointmentVO.start = start;
				appointmentVO.end = end;
				appointmentVO.allDay = false;
				appointmentVO.title = patient;
				appointmentVO.doctorId = physicisnId;
				appointmentVO.doctor = physicisnName;
				appointmentVO.id=1001;
				return appointmentVO;				
			};
		};

	};
	
	/**
	 * Concatenates the values in the subEditor for editorType :Calendar
	 * @param fieldEditor : HTML Fragment that contains the display textBox and the SubEditor
	 * @returns {String} : concatenated String of the values in the subEditor
	 */
	function getCalendarValues(fieldEditor) {
		var cFrom = $(fieldEditor).find("#cFrom").attr("value");

		var cTo = $(fieldEditor).find("#cTo").attr("value");
		var val = '';
		if (cFrom != undefined && cFrom!='' && cTo != undefined && cTo !='') {
		
			val = CommonUtil.dateFormat(parseDate(cFrom, false) + "","fullDateTime") + " to " + CommonUtil.dateFormat(parseDate(cTo, false) + "","fullDateTime");
		}
		return val;
	};
	function getPhysicianLookupValues(fieldEditor) {
		var consultant = $(fieldEditor).find("#consultant").attr("value");
		var pPhysician = $(fieldEditor).find("#pPhysician").attr("value");
		return pPhysician;
	};
	
	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html Fragment, to generate UI for editorType : CDInplace
	 * @param  fieldElement : HTML Fragment to which the editor is appended
	 * @param configParamsObj : Object from the config, which provide addtional info required to load data to editor  
	 */
	function getCDInplaceUI(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(messageAndUIBinder.editorDOM).find("#CDInplaceEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var fields = "commentsValue";
		$.each($(editorFragment).find('[dataField="true"]'), function(index,value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
			$(value).removeAttr("isEditor");
		});
		
		$(fieldElement).prepend($(editorFragment));
		//$(fieldElement).removeAttr("isEditor");
		$(fieldElement).trigger("create");
		// $("#comments").val(appointmentVO.start);
	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html Fragment, to generate UI for editorType : CEInplace
	 * @param  fieldElement : HTML Fragment to which the editor is appended
	 * @param configParamsObj : Object from the config, which provide addtional info required to load data to editor  
	 */
	function getCEInplaceUI(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(messageAndUIBinder.editorDOM).find("#CEInplaceEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var fields = "reasonValue,null";
		$.each($(editorFragment).find('[dataField="true"]'), function(index,value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		$(fieldElement).prepend($(editorFragment));
		$(fieldElement).trigger("create");
		
		// $(fieldElement).removeAttr("isEditor");
		//$(fieldElement).trigger("change");
		// $("#comments").val(appointmentVO.start);
	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html Fragment,
	 *  to generate UI also loads the look up values for  for "physician" editorType : PhysicianLookup
	 * @param  fieldElement : HTML Fragment to which the editor is appended
	 * @param configParamsObj : Object from the config, which provide addtional info required to load data to editor  
	 */
	function getPhysicianLookupUI(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(messageAndUIBinder.editorDOM).find("#PhysicianLookupEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var fields = "pPhysician";
		var fieldsId = "consultant";
		var suggestionId = "pPhysicianSuggestions";
		
		$.each($(editorFragment).find('[dataField="true"]'), function(index, value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", "consultant,null,null,pPhysician,null");
		});
/*
		var searchVO = new HIN.SearchVO();
		searchVO.type=AppConstants.SearchType.PHYSICIAN_PROFILE_SEARCH;
		searchVO.serverURI = "/hin-web/rest/search/entitySearch";
		searchVO.role = "doctor";
		var searchValue = "R";
		searchVO.value = searchValue.replace(/^\s+|\s+$/g, "");
*/
		
		$(fieldElement).html($(editorFragment));
		
		$(fieldElement).trigger("create");
/*	
 		appController.getComponent("DataLayer").search(searchVO,null,
				fillAutoComplete);
				*/
		$(editorFragment).find('[data-role="listview"]').attr("id", suggestionId);

		$(editorFragment).find('#' + fields).unbind("click",
				physicianLookupClickHandler);
		$(editorFragment).find('#' + fields).bind("click",
				physicianLookupClickHandler);
		
		var searchVO = new HIN.SearchVO();
		searchVO.type=AppConstants.SearchType.PHYSICIAN_PROFILE_SEARCH;;
		searchVO.serverURI = "/hin-web/rest/search/entitySearchWithCondtion";
		searchVO.role = "doctor";
		searchVO.messageType = "PRPA_MT201000HT03";
		
		function physicianLookupClickHandler(data) {
			new HIN.AutoCompleteSearch().search(
					$(editorFragment).find("#"+fields),
					$(editorFragment).find("#" + suggestionId),
					searchVO,
					showSelectedValue
			);
		};
		function showSelectedValue(data){
			$(fieldElement).find("#" + fields).val(data.label);
			$(fieldElement).find("#" + fieldsId).val(data.value);
			$(fieldElement).find("#" + fields).trigger("create");
			$(fieldElement).find("#" + fields).trigger("change");
			appController.getComponent("Context").setConsultant(data.value);
			appController.getComponent("Context").setConsultantName(data.label);
		};
		
/*
		function physicianLookupClickHandler(data) {
			//alert("Form Parent: " + bindPhysicianLookups);
			$(editorFragment).find("#"+fields).autocomplete({
				target : $(editorFragment).find("#" + suggestionId),
				source : bindPhysicianLookups,
				callback : function(e) {
					var $a = $(e.currentTarget); // access the selected item
					var value = physicianLookupMap.get($a.text()).value;
					$(fieldElement).find("#" + fields).val($a.text());
					$(fieldElement).find("#" + fieldsId).val(value);
					$(fieldElement).find("#" + fields).trigger("create");
					$(fieldElement).find("#" + fields).trigger("change");
					$(fieldElement).find("#" + fields).autocomplete('clear');
					appController.getComponent("Context").setConsultant(value);
					appController.getComponent("Context").setConsultantName($a.text());
					//alert("value: " + value + ", $a.text(): " + $a.text());
				},
				minLength : 1
			});
		}
		;*/
	}
	;
	
	/*Entity loopup for dataType: PN */
	function getEntityLookupUI(fieldElement, configParamsObj){
		var dataType = $(fieldElement).attr("dataType");
		var idSuffix = $(fieldElement).attr("idSuffix");
		var editorFragment = $(messageAndUIBinder.editorDOM).find("#EntityLookupEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var displayValueId ="EntityDisplayValue"+idSuffix;
		var listId = "entityList"+idSuffix;
		var fields = "null,null,null,"+displayValueId+",null";
		var serverURI = null;
		var role = null;
		
		$(editorFragment).find("#EntityDisplayValue").attr('id',displayValueId);
		$(editorFragment).find("#entityList").attr('id',listId);

		$.each($(editorFragment).find('[dataField="true"]'), function(index, value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});
		
		
		if (configParamsObj) {
			$.each(configParamsObj, function(key, entityInfo) {
				if (entityInfo.name == 'serverURI') {
					serverURI = entityInfo.value;
				}
				if (entityInfo.name == 'role') {
					role = entityInfo.value;
				}
			});
		}	
		
       $(fieldElement).html($(editorFragment));
       $(fieldElement).trigger("create");
      
		$(editorFragment).find('#' + displayValueId).unbind("keyup", physicianLookupClickHandler);
		$(editorFragment).find('#' + displayValueId).bind("keyup", physicianLookupClickHandler);
		
		function physicianLookupClickHandler() {
			var searchValue = $("#"+displayValueId).val();
			if(searchValue.length >= 2){
				var lookupArray = new Array();
				var conditionMap = new HIN.HashMap();
				var searchVO = new HIN.SearchVO();
				searchVO.serverURI = serverURI;
				searchVO.role = role;
				searchVO.value = searchValue.replace(/^\s+|\s+$/g, "");
			
				conditionMap.put("firstName", searchVO.value + "*");
				conditionMap.put("givenName", searchVO.value + "*");
				conditionMap.put("familyName", searchVO.value + "*");
				conditionMap.put("Role", searchVO.role);
					
				appController.getComponent("DataLayer").search(searchVO,conditionMap,function(data){
					loadAuto(data);
					});
			}		
		};
		
		function loadAuto(lookupArray){
			$(editorFragment).find("#" + listId).html(" ");
			$.each(lookupArray,function(index,value){
				var html = "<li  class='ui-lookup-li' id='entity"+index+"'>"+value.name+"</li>";
				$(editorFragment).find("#" + listId).append(html);
		
				$("#entity"+index).click(function(){
					//alert("subscriberId" + value.subscriberId);
					$(editorFragment).find('#' + displayValueId).attr("value", $(this).text());
					$(editorFragment).find("#" + listId).html("");
					$(editorFragment).find('#' + displayValueId).trigger('change');
					
					appController.getComponent("DataLayer").getMessageInternal(value.subscriberId, getMessage, false);
				});
			})
		};
		
		function getMessage(messageId, msg){
			//alert(msg.getXML());
		};

	};
	

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html Fragment, 
	 * to generate UI also loads service auto complete, for editorType : ServiceLookup
	 * @param  fieldElement : HTML Fragment to which the editor is appended
	 * @param configParamsObj : Object from the config, which provide addtional info required to load data to editor  
	 */
	function getServiceLookupUI(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(messageAndUIBinder.editorDOM).find("#ServiceLookupEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var fields = "sService";
		var suggestionId = "sServiceSuggestions";
		$.each($(editorFragment).find('[dataField="true"]'), function(index,value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		/*
		 * var searchVO = new HIN.SearchVO(); searchVO.serverURI =
		 * "/hin-web/rest/lookUp/static"; /*searchVO.role = "doctor"; var
		 * searchValue = "R"; searchVO.value = searchValue.replace(/^\s+|\s+$/g,
		 * "");
		 */

		//var htmlFragment = $('<div id="ServiceLookupFieldEditor" style="display:block">'+ $(editorFragment) + '</div>');
		$(fieldElement).append(editorFragment);
		$(fieldElement).trigger("create");
		appController.getComponent("DataLayer").searchServices("Service",
				serviceLookupClickHandler);
		$(editorFragment).find('[data-role="listview"]').attr("id", suggestionId);
		// $(editorFragment).find('[editorType="PhysicianLookup"]').attr("id","pPhysician");

		$(editorFragment).find('#' + fields).unbind("click",
				serviceLookupClickHandler);
		$(editorFragment).find('#' + fields).bind("click",
				serviceLookupClickHandler);

		// $('#pPhysician').unbind("click",physicianLookupClickHandler);
		// $('#pPhysician').bind("click",physicianLookupClickHandler);

		function serviceLookupClickHandler(data) {
			var allServices = data.getAllServices();
			//alert("autocomp.......... " + allServices);
			$('#' + messageAndUIBinder.parentContainerID).find("#sService").autocomplete({
				target : $(editorFragment).find("#" + suggestionId),
				source : allServices,
				callback : function(e) {
					var $a = $(e.currentTarget); // access the selected item
					var value = serviceLookupMap.get($a.text());
					$(editorFragment).find("#" + fields).val($a.text()); // place
					// the value of the selection into the search box
					$(editorFragment).find("#" + fields).trigger("create");
					$(editorFragment).find("#" + fields).trigger('change');
					$(editorFragment).find("#" + fields).autocomplete('clear'); // clear
					// the listview
					appController.getComponent("Context").setConsultant(value);
					// getAppointments(value);
					// messageAndUIBinder.makeQueryForLucene(value);
					// code to get amount value
					appController.getComponent("DataLayer").
					fetchConcept($a.text(), 'Service', lookupHandler, $(editorFragment).find("#" + fields).parents("fieldset").parent()); 
				},
				minLength : 1
			});
		}
		;
	}
	;

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html Fragment, to generate UI for editorType : CVListCalender
	 * @param  fieldElement : HTML Fragment to which the editor is appended
	 * @param configParamsObj : Object from the config, which provide addtional info required to load data to editor  
	 */
	function getCVListCalenderUI(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(messageAndUIBinder.editorDOM).find(
				"#CVListCalenderEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var fields = "CVListCalenderbirthTime,CVListCalenderLabel";

		$(editorFragment).find("#CVListCalenderLabel").text(editorLabel);
		$.each($(editorFragment).find('[dataField="true"]'), function(index,value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		
		if(configParamsObj){
			$.each(configParamsObj, function(key, configParam) {
				if (configParam.name == 'width') {
					 $(editorFragment).css("width", configParam.value);
				}
			});
		}
		
		$(fieldElement).prepend($(editorFragment));
		//$(fieldElement).removeAttr("isEditor");
		$(fieldElement).trigger("create");

	}
	;
	
	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html Fragment, to generate UI for editorType : CVListSlider
	 * @param  fieldElement : HTML Fragment to which the editor is appended
	 * @param configParamsObj : Object from the config, which provide addtional info required to load data to editor  
	 */
	function getCVListSliderUI(fieldElement, configParamsObj){
	/*	$(fieldElement).find("#slider").change(function(){*/
			var dataType = $(fieldElement).attr("dataType");
			var id = $(fieldElement).attr("id");
			var editorFragment = $(messageAndUIBinder.editorDOM).find("#CVListSliderEditor").clone();
			var pathFields = $(fieldElement).attr("pathFields");
			var editorLabel = $(fieldElement).attr("editorLabel");
			var tagName = $(fieldElement).attr("tagName");
			var fields = "numericHealthHidden,CVListSliderLabel";
			
			$(editorFragment).find("#CVListSliderLabel").text(editorLabel);
			$.each($(editorFragment).find('[dataField="true"]'), function(index,value) {
				$(value).attr("dataType", dataType);
				$(value).attr("pathFields", pathFields);
				$(value).attr("tagName", tagName);
				$(value).attr("fields", fields);
			});
			
			$(editorFragment).find('#decrementHealth').click(function(){
				var value = $("#numericHealth").html();
				if(parseInt(value) > 0){
					value=parseInt(value)-1;
					$(editorFragment).find("#numericHealth").html(value);
					$(editorFragment).find("#numericHealthHidden").attr("value", value);
					$(editorFragment).find("#numericHealthHidden").trigger('change');
				}
			});
			
			
			$(editorFragment).find('#incrementHealth').click(function(){
				var value = $("#numericHealth").html();
				if(parseInt(value) < 10){
					value=parseInt(value)+1;
					$(editorFragment).find("#numericHealth").html(value);
					$(editorFragment).find("#numericHealthHidden").attr("value", value);
					$(editorFragment).find("#numericHealthHidden").trigger('change');
				}
				
			});
			
			$(editorFragment).find("#numericHealthHidden").change(function(){
				var hiddenValue = $(this).attr('value');
				if(hiddenValue){
				$(editorFragment).find("#numericHealth").html(hiddenValue);
				}
			});
			
			$(fieldElement).prepend($(editorFragment));
			//$(fieldElement).removeAttr("isEditor");
			$(fieldElement).trigger("create");

		
	}

	
	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html Fragment, to generate UI for editorType : IVL_TS
	 * @param  fieldElement : HTML Fragment to which the editor is appended
	 * @param configParamsObj : Object from the config, which provide addtional info required to load data to editor  
	 */
	function getIVL_TSUI(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(messageAndUIBinder.editorDOM).find(
				"#IVL_TSEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var fields = "IVL_TSlow,IVL_TShigh";

		$(editorFragment).find("#IVL_TSEditorLabel").text(editorLabel);
		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});
		
		$(fieldElement).prepend($(editorFragment));
		// $(fieldElement).removeAttr("isEditor");
		$(fieldElement).trigger("create");
	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html Fragment, to generate UI for editorType : CVList
	 * @param  fieldElement : HTML Fragment to which the editor is appended
	 * @param configParamsObj : Object from the config, which provide addtional info required to load data to editor  
	 */
	function getCVListUI(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(messageAndUIBinder.editorDOM).find(
				"#CVListEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var width = null;

		if(configParamsObj){
			$.each(configParamsObj, function(key, result) {
				if (result.name == 'conceptClass') {
					conceptClass = result.value;
					$(editorFragment).find("#select-choice").attr('conceptClass',
							result.value);
				}
				if (result.name == 'lookupType') {
					$(editorFragment).find("#select-choice").attr('lookupType',
							result.value);
				}
				if (result.name == 'lookupSelectType') {
					$(editorFragment).find("#select-choice").attr(
							'lookupSelectType', result.value);
				}
				if (result.name == 'lookupControl') {
					$(editorFragment).find("#select-choice").attr(
							'lookupControlType', result.value);
				}
				if (result.name == 'width') {
					$(editorFragment).css("width", result.value);
				}
			});
		}

		var fields = "select-choice" + conceptClass + ",CVListDisplayValue";
		$(editorFragment).find("#select-choice").attr('id', "select-choice" + conceptClass);

		$(editorFragment).find("#CVListEditorLabel").text(editorLabel);
		$.each($(editorFragment).find('[dataField="true"]'), function(index, value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		// var htmlFragment = $('<div id="CVListFieldEditor"
		// style="display:block;width:'+width+'">'+
		// editorFragment.html()+'</div>');

		// $(fieldElement).html($(editorFragment));
		$(fieldElement).prepend($(editorFragment));

		// $(fieldElement).removeAttr("isEditor");
		$(fieldElement).trigger("create");
	};

	
	/**
	 * Concatenates the values in the subEditor for editorType : PNComplete
	 * @param fieldEditor : HTML Fragment that contains the display textBox and the SubEditor
	 * @returns {String} : concatenated String of the values in the subEditor
	 */
	function getPNCompleteValues(fieldEditor) {
		var prefixValue = $(fieldEditor).find("#select-prefix").val();
		var prefix = $(fieldEditor).find("#select-prefix").find('[value="' + prefixValue + '"]').text();
		var family = $(fieldEditor).find("#PNfamily").attr("value");
		var given = $(fieldEditor).find("#PNgiven").attr("value");
		var suffix = $(fieldEditor).find("#PNsuffix").attr("value");
		var value = "";

		if(prefix != "Select"){
			value = prefix;
		}
		if(given){
			if(value){
				value += " " + given;
			}else{
				value = given;
			}
		}
		if(family){
			if(value){
				value += " " + family;
			}else{
				value = family;
			}
		}
		if(suffix){
			if(value){
				value += " " + suffix;
			}else{
				value = suffix;
			}
		}
		return value;
	};
	
	/**
	 * Concatenates the values in the subEditor for editorType : ON
	 * @param fieldEditor : HTML Fragment that contains the display textBox and the SubEditor
	 * @returns {String} : concatenated String of the values in the subEditor
	 */
	function getONValues(fieldEditor) {
		var prefix = $(fieldEditor).find("#ONprefix").attr("value");
		var value  = "";
		
		if (prefix) {
			value = prefix;
		}
			
		return value;
	};

	/**
	 * Concatenates the values in the subEditor for editorType : II
	 * @param fieldEditor : HTML Fragment that contains the display textBox and the SubEditor
	 * @returns {String} : concatenated String of the values in the subEditor
	 */
	function getIIValues(fieldEditor) {
		var root = $(fieldEditor).find("#IIroot").attr("value");
		var extension = $(fieldEditor).find("#IIextension").attr("value");
		var assigningAuthorityName = $(fieldEditor).find(
				"#IIassigningAuthorityName").attr("value");

		var value = extension;
		return value;
	};

	/**
	 * Concatenates the values in the subEditor for editorType : CVList
	 * @param fieldEditor : HTML Fragment that contains the display textBox and the SubEditor
	 * @returns {String} : concatenated String of the values in the subEditor
	 */
	function getCVListValues(fieldEditor) {
		var root = $(fieldEditor).find("#IIroot").attr("value");
		var extension = $(fieldEditor).find("#IIextension").attr("value");
		var assigningAuthorityName = $(fieldEditor).find("#IIassigningAuthorityName").attr("value");
		var value = "";

		if(assigningAuthorityName){
			value = assigningAuthorityName;
		}
		if(extension){
			if(value){
				value += " " + extension;
			}else{
				value = extension;
			}
		}
		return value;
	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html Fragment, to generate UI for editorType : CVCheckBoxList
	 * @param  fieldElement : HTML Fragment to which the editor is appended
	 * @param configParamsObj : Object from the config, which provide addtional info required to load data to editor  
	 */
	function getCVListCheckBoxUI(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var idSuffix = $(fieldElement).attr("idSuffix");
		var editorFragment = $(messageAndUIBinder.editorDOM).find("#CVListCheckBoxEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		
		var field1=  "CVListCheckBox"+idSuffix;
		var field2=  "CVListCheckBoxLabel"+idSuffix;
		var fields = field1;
		
		$(editorFragment).find("#CVListCheckBoxLabel").text(editorLabel);
		
		$(editorFragment).find("#CVListCheckBox").attr("id",field1);
		$(editorFragment).find("#CVListCheckBoxLabel").attr("id",field2);
		
		$.each($(editorFragment).find('[dataField="true"]'), function(index,value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
			$(value).attr("value", editorLabel);
		});
		
		$(editorFragment).find("#CVListCheckBoxLabel"+idSuffix).click(function(){
			if($(editorFragment).find("#CVListCheckBox"+idSuffix).attr("checked") == 'checked'){
				$(editorFragment).find("#CVListCheckBox"+idSuffix).removeAttr("checked");
			}
			else{
				$(editorFragment).find("#CVListCheckBox"+idSuffix).attr("checked", "checked");
				$(editorFragment).find("#CVListCheckBox"+idSuffix).trigger("change");
			}
		});
		
		$(fieldElement).prepend($(editorFragment));
		$(fieldElement).trigger("create");
	
	};
	
	function getCESearchUI(fieldElement, configParamsObj){
		//alert("in ce search");
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(messageAndUIBinder.editorDOM).find("#CESearchEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var idSuffix = $(fieldElement).attr("idSuffix");
		var fields = "select-dose"+idSuffix+",null";

		$(editorFragment).find("#CESearchLabel").text(editorLabel);
		$.each($(editorFragment).find('[dataField="true"]'), function(index,value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		if (configParamsObj) {
			$.each(configParamsObj, function(key, result) {
				if (result.name == 'conceptClass') {
					$(editorFragment).find("#select-dose").attr('conceptClass',result.value);
				}
				if (result.name == 'lookupType') {
					$(editorFragment).find("#select-dose").attr('lookupType',result.value);
				}
				if (result.name == 'lookupSelectType') {
					$(editorFragment).find("#select-dose").attr('lookupSelectType',result.value);
				}
				if (result.name == 'lookupControl') {
					$(editorFragment).find("#select-dose").attr('lookupControlType', result.value);
				}
			});
		}	
		$(editorFragment).find("#select-dose").attr('id',"select-dose"+idSuffix);
		$(editorFragment).find("#select-doseList").attr('id',"select-dose"+idSuffix+"List");
		$(fieldElement).prepend($(editorFragment));
		$(fieldElement).trigger("create");
	};


	 /**
	 * Concatenates the values in the subEditor for editorType : CS
	 * @param fieldEditor : HTML Fragment that contains the display textBox and the SubEditor
	 * @returns {String} : concatenated String of the values in the subEditor
	 */
	function getCSValues(fieldEditor) {
		var status = $(fieldEditor).find("#CSstatusCode").attr("value");

		var value = status;
		return value;
	};
	
	
	 /**
	 * Concatenates the values in the subEditor for editorType : CSInplace
	 * @param fieldEditor : HTML Fragment that contains the display textBox and the SubEditor
	 * @returns {String} : concatenated String of the values in the subEditor
	 */
	function getCSInplaceValues(fieldEditor) {
		var status = $(fieldEditor).find("#CSstatusCode").attr("value");

		var value = status;
		return value;
	}; 
	
	 /**
	 * Concatenates the values in the subEditor for editorType : TS
	 * @param fieldEditor : HTML Fragment that contains the display textBox and the SubEditor
	 * @returns {String} : concatenated String of the values in the subEditor
	 */
	function getSTValues(fieldEditor) {
		var text = $(fieldEditor).find("#STtext").attr("value");

		var value = text;
		return value;
	}; 

	 /**
	 * Concatenates the values in the subEditor for editorType : TEL
	 * @param fieldEditor : HTML Fragment that contains the display textBox and the SubEditor
	 * @returns {String} : concatenated String of the values in the subEditor
	 */
	function getTELValues(fieldEditor) {
		var telecomeType = $(fieldEditor).find("#select-telecomUse option:selected").text();
		var TELval = $(fieldEditor).find("#TELvalue").attr("value");
		var value = "";
		if (telecomeType != "Select" && telecomeType && TELval) {
			value = telecomeType + ": " + TELval;
		} else {
			value = TELval;
		}
		return value;
	};

	 /**
	 * Concatenates the values in the subEditor for editorType : PQ
	 * @param fieldEditor : HTML Fragment that contains the display textBox and the SubEditor
	 * @returns {String} : concatenated String of the values in the subEditor
	 */
	function getPQInplaceValues(fieldEditor) {
		var value = $(fieldEditor).find("#PQInplaceComboDisplayValue").attr("value");
		return value;
	};

	
	 /**
	 * Concatenates the values in the subEditor for editorType : PQBoolean
	 * @param fieldEditor : HTML Fragment that contains the display textBox and the SubEditor
	 * @returns {String} : concatenated String of the values in the subEditor
	 */
	function getPQBooleanValues(fieldEditor) {
		var value = $(fieldEditor).find("#PQBooleanDisplayValue").attr("value");
		return value;
	};

	/**
	 * Concatenates the values in the subEditor for editorType : AD
	 * @param fieldEditor : HTML Fragment that contains the display textBox and the SubEditor
	 * @returns {String} : concatenated String of the values in the subEditor
	 */
	function getADValues(fieldEditor) {
		var houseNumber = $(fieldEditor).find("#ADhouseNumber").attr("value");
		var streetName = $(fieldEditor).find("#ADstreetName").attr("value");
		var city = $(fieldEditor).find("#select-city").attr("value");
		var state = $(fieldEditor).find("#select-state").attr("value");
		var country = $(fieldEditor).find("#select-country").attr("value");
		var postalCode = $(fieldEditor).find("#ADpostalCode").attr("value");
		var value = "";

		if (houseNumber) {
			value += "#" + houseNumber;
		}
		if (streetName) {
			if (value) {
				value += ", " + streetName;
			} else {
				value = streetName;
			}
		}
		if (city) {
			if (value) {
				value += ", " + city;
			} else {
				value = city;
			}
		}
		if (state) {
			if (value) {
				value += ", " + state;
			} else {
				value = state;
			}
		}
		if (country) {
			if (value) {
				value += ", " + country;
			} else {
				value = country;
			}
		}
		if (postalCode) {
			if (value) {
				value += "-" + postalCode;
			} else {
				value = postalCode;
			}
		}
		return value;
	};

	/**
	 * Concatenates the values in the subEditor for editorType : CE
	 * @param fieldEditor : HTML Fragment that contains the display textBox and the SubEditor
	 * @returns {String} : concatenated String of the values in the subEditor
	 */
	function getCEValues(fieldEditor) {
		var statusValue = $(fieldEditor).find('[dataField="true"]').val();
		var status = $(fieldEditor).find('[dataField="true"]').find('[value="' + statusValue + '"]').text();
		var value = "";
		if (status == "Select") {
			return value;
		} else {
			value = status;
		}
		return value;
	};

	/**
	 * Concatenates the values in the subEditor for editorType : CVListThreeTextbox
	 * @param fieldEditor : HTML Fragment that contains the display textBox and the SubEditor
	 * @returns {String} : concatenated String of the values in the subEditor
	 */
	function getCVListThreeTextboxValues(fieldEditor) {
		var year = $(fieldEditor).find("#CVListTextboxYear").attr("value");
		var reason = $(fieldEditor).find("#CVListTextboxReason").attr("value");
		var hospital = $(fieldEditor).find("#CVListTextboxHospital").attr("value");
		var value = '';// year +" "+ reason +" "+ hospital;
		if (year) {
			value += year + " ";
		}
		if (reason) {
			value += reason + " ";
		}
		if (hospital) {
			value += hospital + " ";
		}
		return value;
	};


	/**
	 * Concatenates the values in the subEditor for editorType : CVListTwoTextbox
	 * @param fieldEditor : HTML Fragment that contains the display textBox and the SubEditor
	 * @returns {String} : concatenated String of the values in the subEditor
	 */
	function getCVListTwoTextboxValues(fieldEditor) {
		var drug = $(fieldEditor).find("#CVListTextboxDrug").attr("value");
		var reaction = $(fieldEditor).find("#CVListTextboxReaction").attr("value");

		var value = '';
		if (drug) {
			value += drug + " ";
		}
		if (reaction) {
			value += reaction + " ";
		}
		return value;
	}
	;

	/**
	 * Concatenates the values in the subEditor for editorType : CVListTextbox
	 * @param fieldEditor : HTML Fragment that contains the display textBox and the SubEditor
	 * @returns {String} : concatenated String of the values in the subEditor
	 */
	function getCVListTextboxValues(fieldEditor) {
		var health = $(fieldEditor).find("#CVListTextboxHealth").attr("value");

		var value = '';
		if (health) {
			value += health + " ";
		}
		return value;
	};

	/**
	 * Concatenates the values in the subEditor for editorType : CVListTextarea
	 * @param fieldEditor : HTML Fragment that contains the display textBox and the SubEditor
	 * @returns {String} : concatenated String of the values in the subEditor
	 */
	function getCVListTextareaValues(fieldEditor) {
		var list = $(fieldEditor).find("#CVListTextareaList").attr("value");

		var value = '';
		if (list) {
			value += list + " ";
		}
		return value;
	};

	/**
	 * Concatenates the values in the subEditor for editorType : TS
	 * @param fieldEditor : HTML Fragment that contains the display textBox and the SubEditor
	 * @returns {String} : concatenated String of the values in the subEditor
	 */
	function getTSValues(fieldEditor) {
		var value = $(fieldEditor).find("#TSbirthTime").attr("value");
		return value;
	};
	
	
	/**
	 * Concatenates the values in the subEditor for editorType : IVL_TS
	 * @param fieldEditor : HTML Fragment that contains the display textBox and the SubEditor
	 * @returns {String} : concatenated String of the values in the subEditor
	 */
	function getIVL_TSValues(fieldEditor) {
		var low = $(fieldEditor).find("#IVL_TSlow").attr("value");
		var high = $(fieldEditor).find("#IVL_TShigh").attr("value");
		var value = "";

		if (low && high) {
			if (Date.parse(low) <= Date.parse(high)) {
				value = low + " to " + high;
			} else {
				alert("End Date should be greater than Start Date");
			}
		}
		return value;

	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html Fragment, to generate UI for editorType : EDBoolean
	 * @param  fieldElement : HTML Fragment to which the editor is appended
	 * @param configParamsObj : Object from the config, which provide addtional info required to load data to editor  
	 */
	function getEDBooleanUI(fieldElement, configParamsObj) {// for Boolean
		// Editor generation
		var dataType = $(fieldElement).attr("dataType");
		var editorFragment = $(this.editorDOM).find("#EDBooleanEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var idSuffix = $(fieldElement).attr("idSuffix");
		var style = $(fieldElement).attr("style");
		idSuffix = (idSuffix) ? idSuffix : "";
		var field1 = "radioEditor1" + idSuffix;
		var field2 = "radioEditor2" + idSuffix;

		var fields = field1 + "," + field2;
		$.each($(editorFragment).find('[dataField="true"]'),function(index, value) {
			$(value).attr("id", $(value).attr("id") + idSuffix);
			$(value).attr("name", $(value).attr("name") + idSuffix);
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
			$(value).attr("labelField",
					$(value).attr("labelField") + idSuffix);
			$(value).attr("idSuffix", idSuffix);
			$(value).attr("style", style);

		});
		$(editorFragment).find("#label1").attr("for", "radioEditor1" + idSuffix);
		$(editorFragment).find("#label2").attr("for", "radioEditor2" + idSuffix);
		$(fieldElement).prepend($(editorFragment));
		$(fieldElement).trigger("create");
	};

	
	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html Fragment, to generate UI for editorType : EDTextBox
	 * @param  fieldElement : HTML Fragment to which the editor is appended
	 * @param configParamsObj : Object from the config, which provide addtional info required to load data to editor  
	 */
	function getEDTextBoxUI(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var idSuffix = $(fieldElement).attr("idSuffix");
		var editorFragment = $(messageAndUIBinder.editorDOM).find("#EDTextBoxEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		
		var field1=  "EDDisplayValue"+idSuffix;
		var fields = field1;
		
		$(editorFragment).find("#EDDisplayValue").attr("id",field1);
		
		$.each($(editorFragment).find('[dataField="true"]'), function(index,value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		$(fieldElement).prepend($(editorFragment));
		$(fieldElement).trigger("create");

	};
	
	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html Fragment, to generate UI for editorType : CVListBoolean
	 * @param  fieldElement : HTML Fragment to which the editor is appended
	 * @param configParamsObj : Object from the config, which provide addtional info required to load data to editor  
	 */
	function getCVListBooleanUI(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var editorFragment = $(this.editorDOM).find("#CVListBooleanEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var idSuffix = $(fieldElement).attr("idSuffix");
		var style = $(fieldElement).attr("style");
		idSuffix = (idSuffix) ? idSuffix : "";
		var field1 = "radioEditor1" + idSuffix;
		var field2 = "radioEditor2" + idSuffix; 

		var fields = field1+","+ field2;
		$.each($(editorFragment).find('[dataField="true"]'),function(index, value) {
			$(value).attr("id", $(value).attr("id") + idSuffix);
			$(value).attr("name", $(value).attr("name") + idSuffix);
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
			$(value).attr("labelField",
					$(value).attr("labelField") + idSuffix);
			$(value).attr("idSuffix", idSuffix);
			$(value).attr("style", style);
		
		});
		
		$(editorFragment).find("#CVListBooleanLabel").html(editorLabel);
		$(fieldElement).prepend($(editorFragment));
		$(fieldElement).trigger("create");
	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html Fragment, to generate UI for editorType : EDCheckBox
	 * @param  fieldElement : HTML Fragment to which the editor is appended
	 * @param configParamsObj : Object from the config, which provide addtional info required to load data to editor  
	 */
	function getEDCheckBoxUI(fieldElement, configParamsObj){
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var idSuffix = $(fieldElement).attr("idSuffix");
		var editorFragment = $(messageAndUIBinder.editorDOM).find("#EDCheckBoxEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		
		var field1=  "EDCheckBoxDisplayValue"+idSuffix;
		var fields = field1;
		
		$(editorFragment).find("#EDCheckBoxDisplayValue").attr("id",field1);
		
		$.each($(editorFragment).find('[dataField="true"]'), function(index,value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
			$(value).attr("value", editorLabel);
		});

		$(fieldElement).prepend($(editorFragment));
		$(fieldElement).trigger("create");
	};

	
	function fillAutoComplete(data) {
		for ( var index = 0, i = 0; index < data.length; index++) {
			var value = data[index].subscriberId;
			var label = data[index].name;
			if (value != null && value.length > 0) {
				physicianLookupMap.put(label, value);
				bindPhysicianLookups[i++] = label;
			}
		}
		// alert(page+" lookup :"+bindPhysicianLookups.length);


	};

	function fillServiceAutoComplete(data) {
		for ( var index = 0, i = 0; index < data.length; index++) {
			var value = data[index].subscriberId;
			var label = data[index].name;
			if (value != null && value.length > 0) {
				serviceLookupMap.put(label, value);
				bindServiceLookups[i++] = label;
			}
		}
		// alert(page+" lookup :"+bindServiceLookups.length);

	};

	function makeQueryForCassandra() {
		var context = appController.getComponent("Context");
		var queryString = "";
		if (context) {
			var consultantId = context.getConsultant();
			// alert("consultantId : "+consultantId);
			var subscriberId = context.getUserVo().subscriberId;
			if (consultantId)
				queryString = consultantId;
			var query = new HIN.Query();
			query.id = subscriberId;
			query.messageRequired = true;
			// alert("queryString:"+queryString);
			query.addCondition("PRPA_MT410001HT02", queryString);
			appController.getComponent("Context").setCalendarQuery(query);
			// alert("query : "+query);
		}
	};
	function makeQueryForLucene() {
		var context = appController.getComponent("Context");
		var queryString = "";
		if (context) {
			var consultantId = context.getConsultant();
			// alert("consultantId : "+consultantId);
			var subscriberId = context.getUserVo().subscriberId;
			if (consultantId)
				queryString =  consultantId;
			var query = new HIN.Query();
			query.id = subscriberId;
			query.messageRequired = true;
			// alert("queryString:"+queryString);
			query.addCondition("PRPA_MT410001HT02", queryString);
			appController.getComponent("Context").setCalendarQuery(query);
			// alert("query : "+query);
		}
	};
}