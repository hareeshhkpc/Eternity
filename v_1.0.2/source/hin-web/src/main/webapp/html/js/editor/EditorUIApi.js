/**
 * Class EditorUIApi - Used to load editor UI and get display values from them
 * back to the message
 * 
 * @returns EditorUIApi
 * @author Administrator
 */
function EditorUIApi(messageAndUIBinder) {

	var editorUIApi = this;
	this.messageAndUIBinder = messageAndUIBinder;

	EditorUIApi.editorDOM = "<html><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=ISO-8859-1\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><link rel=\"stylesheet\" href=\"../html/js/jquery.mobile-1.0.1.min.css\" /><!-- <link rel=\"stylesheet\" href=\"../html/css/hin.css\" /> --><link rel=\"stylesheet\" href=\"../html/css/violet.css\" /><link rel=\"stylesheet\" href=\"../html/css/mobile.css\" /><script src=\"../html/js/jquery-1.6.4.min.js\"></script><script src=\"../html/js/jquery.json-2.3.js\"></script><script src=\"../html/js/jquery.mobile-1.0.1.min.js\"></script><script src=\"../html/js/jqm.autoComplete-1.4.js\"></script></head><body> <div data-role=\"page\" class=\"ui-align-text\">  <div class=\"ui-form-fields\">   <div style=\"float: left;\" id=\"EDImageEditor\" uiRole=\"editor\">    <img id=\"EDthumbnailBox\" alt=\"Patient Image\" src=\"images/user.png\"     width=\"100px\" onclick=\"$('#EDthumbnail').trigger('click')\"> <input     type=\"file\" id=\"EDthumbnail\" dataType=\"ED\" editorType=\"EDImage\"     dataField=\"true\" style=\"display: none\" />   </div>   <div style=\"float:left;width: 97%\" id=\"EDFileAttachmentEditor\"     uiRole=\"editor\">     <div class=\"FileAttachment-editor-border\" style=\"margin-bottom:10px;\">    <fieldset>     <div style=\"float: left; width: 10%\">      <form action=\"/hin-web/rest/FileUploadController\" method=\"post\"       id=\"docAttachmentForm\" enctype=\"multipart/form-data\">       <div style=\"float: left\">        <img id=\"EDthumbnailBox\" alt=\"File Image\" width=\"64px\" style=\"padding-top:5px;\"         src=\"images/pdf.png\"         onclick=\"$('#EDFileAttachmentThumbnail').trigger('click');\">       </div>       <input type=\"file\" name=\"fileUpload\"        id=\"EDFileAttachmentThumbnail\" style=\"display: none\" /> <input        type=\"text\" id=\"patientId\" name=\"patient\" value=\"\"        style=\"display: none\" />        <input        type=\"text\" id=\"formName\" name=\"formName\" value=\"\"        style=\"display: none\" />        <input        type=\"text\" id=\"documentType\" name=\"documentType\" value=\"\"        style=\"display: none\" />      </form>     </div>       <input type=\"hidden\" id=\"EDReference\" dataField=\"true\" />       <input type=\"hidden\" id=\"EDMediaType\" dataField=\"true\" />       <input type=\"hidden\" id=\"EDMediaTypeType\"/>     <fieldset style=\"float: left; width: 90%\">      <div id=\"loadingFile\"       style=\"float: left; display: none\">       <img src=\"images/loading.gif\">       <div>Loading...</div>      </div>      <div id=\"displayError\">      </div>      <div style=\"float: left;display: none\"       id=\"EDfileAttach\">       <fieldset style=\"margin-top: 5px;\">        <label style=\"float: left; font-size:15px; width: 80px; font-weight:normal;\">Name:</label>        <label style=\"float: left; font-size:15px; font-weight:normal;\" id=\"EDLanguage\" dataField=\"true\" type=\"label\" editorType=\"EDFileAttachment\"></label>       </fieldset>       <fieldset style=\"margin-top: 10px;\">        <label style=\"float: left; font-size:15px;font-weight:normal; width: 80px;\">Size:</label>        <label style=\"float: left; font-weight:normal;; font-size:15px;\" id=\"EDMediaTypeSize\"\"></label>       </fieldset>      </div>      <div style=\"float: right;\">       <input type=\"button\" value=\"Open\" id=\"openButton\"        disabled=\"disabled\" /> <input id=\"downloadButton\"        disabled=\"disabled\" type=\"button\" value=\"Download\" />       <form action=\"/hin-web/rest/downloadFileAttachment\" method=\"post\"        id=\"docDownloadForm\" enctype=\"multipart/form-data\" style=\"display: none\">        <input type=\"text\" id=\"messageId\" name=\"message\" value=\"\"/>       </form>      </div>     </fieldset>    </fieldset>    </div>    <div id=\"displayFile\" displayId=\"\" style=\"width: 100%; display: none\">&nbsp;</div>   </div>   <div id=\"PNCompleteEditor\" uiRole=\"editor\">    <!-- <div id=\"PNCompleteEditor\" uiRole=\"editor\" style=\"width:70%;float:left;\"> -->    <label id=\"PNCompleteEditorLabel\">Name:</label> <input     readonly=\"readonly\" id=\"PNDisplayValue\" type=\"text\" dataType=\"PN\"     editorType=\"PNComplete\" hasToggle=\"true\" />    <div data-role=\"none\"     class=\"ui-align-text ui-form-border ui-subEditor\" id=\"SubEditor\">     <label id=\"PNCompleteNameTypeLabel\">Name Type:</label>     <div id=\"comboDiv\">      <select type=\"multiple\" id=\"PNCompleteNameTypeCombo\"       name=\"select-choice-1\" dataField=\"true\" data-native-menu=\"false\"></select>     </div>     <label id=\"PNCompletePrefixLabel\">Title:</label>     <div id=\"comboDiv\">      <select type=\"multiple\" id=\"PNCompletePrefixCombo\"       name=\"select-choice-1\" dataField=\"true\" data-native-menu=\"false\"></select>     </div>     <label id=\"PNCompleteGivenLabel\">Given Name:</label> <input      type=\"text\" id=\"PNgiven\" value=\"\" dataField=\"true\" /> <label      id=\"PNCompleteFamilyLabel\">Family Name:</label> <input type=\"text\"      id=\"PNfamily\" value=\"\" dataField=\"true\" /> <label      id=\"PNCompleteSuffixLabel\">Suffix:</label> <input type=\"text\"      id=\"PNsuffix\" value=\"\" dataField=\"true\" />    </div>   </div>   <div id=\"PNCompleteName\" uiRole=\"editor\">    <!-- <label id=\"PNCompleteEditorLabel\">Name:</label> -->    <input readonly=\"readonly\" id=\"PNDisplayValue\" type=\"text\"     dataType=\"PN\" editorType=\"PNCompleteNameDisplay\" hasToggle=\"false\" />    <div data-role=\"none\"     class=\"ui-align-text ui-form-border ui-subEditor\" id=\"SubEditor\"     style=\"display: none\">     <label>Name Type:</label>     <div id=\"comboDiv\">      <select type=\"multiple\" id=\"select-nameUse\" name=\"select-choice-1\"       dataField=\"true\" data-native-menu=\"false\"></select>     </div>     <label>Title:</label>     <div id=\"comboDiv\">      <select type=\"multiple\" id=\"select-prefix\" name=\"select-choice-1\"       dataField=\"true\" data-native-menu=\"false\"></select>     </div>     <label>Given Name:</label> <input type=\"text\" id=\"PNgiven\" value=\"\"      dataField=\"true\" /> <label>Family Name:</label> <input      type=\"text\" id=\"PNfamily\" value=\"\" dataField=\"true\" /> <label>Suffix:</label>     <input type=\"text\" id=\"PNsuffix\" value=\"\" dataField=\"true\" />    </div>   </div>   <!-- <div id=\"IIEditor\" uiRole=\"editor\" style=\"width:70%;float:left;\"> -->   <div id=\"IIEditor\" uiRole=\"editor\">    <label id=\"IIEditorLabel\">ID:</label> <input id=\"IIDisplayValue\"     type=\"text\" dataType=\"II\" editorType=\"II\" hasToggle=\"true\" />    <div data-role=\"none\"     class=\"ui-align-text ui-form-border ui-subEditor\" id=\"SubEditor\">     <label id=\"IIrootLabel\">Root:</label> <input readonly=\"readonly\"      type=\"text\" id=\"IIroot\" value=\"\" dataField=\"true\" /> <label      id=\"IIextensionLabel\">Extension:</label> <input type=\"text\"      id=\"IIextension\" value=\"\" dataField=\"true\" /> <label      id=\"IIassigningAuthorityNameLabel\">Assigning Authority      Name:</label> <input type=\"text\" id=\"IIassigningAuthorityName\" value=\"\"      dataField=\"true\" />    </div>   </div>   <div id=\"IIComboEditor\" uiRole=\"editor\">    <label id=\"IIComboEditorLabel\">ID:</label> <input     readonly=\"readonly\" id=\"IIComboDisplayValue\" type=\"text\"     dataType=\"II\" editorType=\"IICombo\" hasToggle=\"true\" />    <div data-role=\"none\"     class=\"ui-align-text ui-form-border ui-subEditor\" id=\"SubEditor\">     <label id=\"IIComboRootLabel\">Identification Type:</label> <select      type=\"multiple\" id=\"IIComboRoot\" dataField=\"true\"      name=\"select-choice-1\" data-native-menu=\"false\"></select> <label      id=\"IIComboExtensionLabel\">Identification Number:</label> <input      type=\"text\" id=\"IIComboExtension\" value=\"\" dataField=\"true\" /> <input      type=\"hidden\" id=\"IIComboAssigningAuthorityName\" value=\"\"      dataField=\"true\" />    </div>   </div>   <div id=\"IIUserNameEditor\" uiRole=\"editor\">    <label id=\"IIUserNameEditorLabel\">ID:</label> <input     id=\"IIUserNameDisplayValue\" type=\"hidden\" dataType=\"II\"     editorType=\"IIUserName\" hasToggle=\"true\" />    <div data-role=\"none\" class=\"ui-align-text\">     <input type=\"hidden\" id=\"IIUserNameRoot\" value=\"\" dataField=\"true\" />     <input type=\"text\" id=\"IIUserNameExtension\" value=\"\"      dataField=\"true\" data-prompt-position=\"topRight\" /> <input      type=\"hidden\" id=\"IIUserNameAssigningAuthorityName\" value=\"\"      dataField=\"true\" />    </div>   </div>   <div id=\"IIPasswordEditor\" uiRole=\"editor\">    <label id=\"IIPasswordEditorLabel\">ID:</label> <input     id=\"IIPasswordDisplayValue\" type=\"hidden\" dataType=\"II\"     editorType=\"IIPassword\" hasToggle=\"true\" />    <div data-role=\"none\" class=\"ui-align-text\">     <input type=\"hidden\" id=\"IIPasswordRoot\" value=\"\" dataField=\"true\" />     <input type=\"password\" id=\"IIPasswordExtension\" value=\"\"      dataField=\"true\" data-prompt-position=\"topRight\" /> <input      type=\"hidden\" id=\"IIPasswordAssigningAuthorityName\" value=\"\"      dataField=\"true\" />    </div>   </div>   <div id=\"CSEditor\" uiRole=\"editor\">    <label id=\"CSEditorLabel\">Status:</label> <input id=\"CSDisplayValue\"     type=\"text\" dataType=\"CS\" editorType=\"CS\" hasToggle=\"true\" />    <div data-role=\"none\"     class=\"ui-align-text ui-form-border ui-subEditor\" id=\"SubEditor\">     <label>Status:</label> <input type=\"text\" id=\"CSstatusCode\"      value=\"\" dataField=\"true\" />    </div>   </div>   <div id=\"TSEditor\" uiRole=\"editor\">    <label id=\"TSEditorLabel\">Birth Time:</label> <input     id=\"TSDisplayValue\" type=\"hidden\" dataType=\"TS\" editorType=\"TS\"     hasToggle=\"true\" />    <div data-role=\"none\" class=\"ui-align-text\">     <!-- <label>Birth Time:</label> -->     <!-- <input type=\"text\" readonly=\"readonly\" id=\"TSbirthTime\" value=\"\" dataField=\"true\" date=\"true\" data-role=\"datebox\" data-options='{\"mode\": \"flipbox\"}'/> -->     <input type=\"text\"      data-options='{\"mode\":\"calbox\", \"calUsePickers\": true, \"calNoHeader\": true, \"dateFormat\": \"YYYY-MM-DD\"}'      data-role=\"datebox\" id=\"TSbirthTime\" value=\"\" dataField=\"true\"      class=\"ui-input-text ui-body-d ui-shadow-inset ui-corner-all ui-icon-datebox\"      readonly=\"readonly\">    </div>   </div>   <div id=\"TELEditor\" uiRole=\"editor\">    <label id=\"TELEditorLabel\">Telecoms:</label> <input     readonly=\"readonly\" id=\"TELDisplayValue\" type=\"text\" dataType=\"TEL\"     editorType=\"TEL\" hasToggle=\"true\" />    <div data-role=\"none\"     class=\"ui-align-text ui-form-border ui-subEditor\" id=\"SubEditor\">     <label>Contact Type:</label> <select type=\"multiple\"      id=\"select-telecomUse\" dataField=\"true\" name=\"select-choice-1\"      data-native-menu=\"false\"></select> <label>Contact:</label> <input      type=\"text\" id=\"TELvalue\" value=\"\" dataField=\"true\" />    </div>   </div>   <div id=\"TELInplaceEditor\" uiRole=\"editor\">    <label id=\"TELInplaceEditorLabel\">Telecoms:</label> <input     type=\"text\" id=\"TELInplaceValue\" value=\"\" dataField=\"true\" /> <input     type=\"hidden\" id=\"TELInplaceUse\" value=\"\" dataField=\"true\" />   </div>   <div id=\"ADEditor\" uiRole=\"editor\">    <label id=\"ADEditorLabel\">Address:</label> <input     readonly=\"readonly\" id=\"ADDisplayValue\" type=\"text\" dataType=\"AD\"     editorType=\"AD\" hasToggle=\"true\" />    <div data-role=\"none\"     class=\"ui-align-text ui-form-border ui-subEditor\" id=\"SubEditor\">     <label id=\"ADhouseNumberLabel\">House Number:</label> <input type=\"text\" id=\"ADhouseNumber\"      value=\"\" dataField=\"true\" /> <label id=\"ADstreetNameLabel\">Street Name:</label> <input      type=\"text\" id=\"ADstreetName\" value=\"\" dataField=\"true\" /> <label >City      :</label>     <div id=\"searchDiv\" style=\"width: 97%;\">      <!-- <input type=\"text\" id=\"select-city\" value=\"\" dataField=\"true\" /> -->      <input data-inline=\"true\" value=\"\" id=\"select-city\" type=\"text\"       data-type=\"search\" dataField=\"true\" placeholder=\"Search city...\">      <ul id=\"select-cityList\" data-theme=\"v\" data-role=\"listview\"       class=\"ui-search-lookup\"></ul>     </div>     <label>State:</label>     <div id=\"searchDiv\" style=\"width: 97%;\">      <!-- <input type=\"text\" id=\"select-state\" value=\"\" dataField=\"true\" />  -->      <input data-inline=\"true\" value=\"\" id=\"select-state\" type=\"text\"       data-type=\"search\" dataField=\"true\" placeholder=\"Search state...\">      <ul id=\"select-stateList\" data-theme=\"b\" data-role=\"listview\"       class=\"ui-search-lookup\"></ul>     </div>     <label>Country:</label>     <div id=\"searchDiv\" style=\"width: 97%;\">      <!-- <input type=\"text\" id=\"select-country\" value=\"\" dataField=\"true\" />  -->      <input data-inline=\"true\" value=\"\" id=\"select-country\" type=\"text\"       data-type=\"search\" dataField=\"true\"       placeholder=\"Search country...\">      <ul id=\"select-countryList\" data-theme=\"b\" data-role=\"listview\"       class=\"ui-search-lookup\"></ul>     </div>     <label>Postal Code:</label> <input type=\"text\" id=\"ADpostalCode\"      value=\"\" dataField=\"true\" />    </div>   </div>  <div id=\"CEEditor\" style=\"width: 50%\" uiRole=\"editor\">    <label id=\"CELabel\">Gender:</label>     <input type=\"hidden\" id=\"CEOriginalText\" dataField=\"true\" value=\"\">    <input type=\"hidden\" id=\"CEDisplayName\" dataField=\"true\" value=\"\">    <div id=\"comboDiv\" hasToggle=\"true\">     <select id=\"select-choice\" name=\"select-choice-1\" dataField=\"true\"      data-native-menu=\"false\" type=\"multiple\">     </select>    </div>   </div>      <div id=\"CERegionEditor\" uiRole=\"editor\">    <label id=\"CERegionEditorLabel\">Country:</label>    <input type=\"hidden\" id=\"CERegionCode\" dataField=\"true\" value=\"\">    <input type=\"hidden\" id=\"CERegionDisplayName\" dataField=\"true\" value=\"\">    <div id=\"searchDiv\" style=\"width: 97%;\">      <input data-inline=\"true\" value=\"\" id=\"select-country\" type=\"text\"       data-type=\"search\" dataField=\"true\"       placeholder=\"Search country...\">      <ul id=\"select-countryList\" data-theme=\"b\" data-role=\"listview\"       class=\"ui-search-lookup\"></ul>    </div>   </div>  </div>  <hr />  <div id=\"CVListCheckBoxEditor\" uiRole=\"editor\">   <div id=\"comboDiv\" data-role=\"fieldcontain\">    <label for=\"CVListCheckBox\"></label> <select id=\"CVListCheckBox\"     name=\"CVListCheckBox\" dataField=\"true\" data-native-menu=\"false\"     multiple=\"multiple\" type=\"multiple\">    </select>   </div>  </div>  <hr />  <hr />  <!----Do not add uiRole=\"editor\"---->  <div id=\"GridEditor\">   <div id=\"editorWrapper\" uiRole=\"gridContent\"    style=\"padding-bottom: 5px\">    <label id=\"gridLabel\"> </label>    <fieldset class=\"ui-grid-b\">     <div class=\"ui-block-a\" id=\"editor\" style=\"width: 96%;\">      <!--  <input readonly=\"readonly\" style=\"width: 100%\" id=\"IVL_TSDisplayValue\" type=\"text\" dataType=\"IVL_TS\" editorType=\"IVL_TS\"  hasToggle=\"true\"/> -->     </div>     <div class=\"ui-block-b\" id=\"button\"      style=\"width: 2%; vertical-align: top;\">      <div id=\"addButton\" style=\"display: block;\">       <img src=\"images/add.png\" />      </div>      <div id=\"removeButton\" style=\"display: block;\">       <img src=\"images/delete.png\" />      </div>     </div>    </fieldset>   </div>  </div>  <hr />  <div id=\"IVL_TSEditor\" uiRole=\"editor\">   <label id=\"IVL_TSEditorLabel\">Effective Time:</label> <input    readonly=\"readonly\" id=\"IVL_TSDisplayValue\" type=\"text\"    dataType=\"IVL_TS\" editorType=\"IVL_TS\" hasToggle=\"true\" />   <div data-role=\"none\"    class=\"ui-align-text ui-form-border ui-subEditor\" id=\"SubEditor\">    <label>Start Date:</label> <input type=\"text\"     data-options='{\"mode\":\"calbox\", \"calUsePickers\": true, \"calNoHeader\": true, \"dateFormat\": \"YYYY-MM-DD\"}'     data-role=\"datebox\" id=\"IVL_TSlow\" value=\"\" dataField=\"true\"     class=\"ui-input-text ui-body-d ui-shadow-inset ui-corner-all ui-icon-datebox\"     readonly=\"readonly\"> <br> <br> <label>End     Date:</label> <input type=\"text\"     data-options='{\"mode\":\"calbox\", \"calUsePickers\": true, \"calNoHeader\": true, \"dateFormat\": \"YYYY-MM-DD\"}'     data-role=\"datebox\" id=\"IVL_TShigh\" value=\"\" dataField=\"true\"     class=\"ui-input-text ui-body-d ui-shadow-inset ui-corner-all ui-icon-datebox\"     readonly=\"readonly\">   </div>  </div>  <div id=\"CVListEditor\" uiRole=\"editor\">   <label id=\"CVListEditorLabel\">Race Code:</label> <input    id=\"CVListDisplayValue\" type=\"hidden\" dataField=\"true\" />   <!-- <select type=\"multiple\" id=\"select-choice\" name=\"select-choice-1\"  dataField=\"true\"  data-native-menu=\"false\" >     </select>  -->   <div id=\"comboDiv\">    <select id=\"select-choice\" name=\"select-choice-1\" dataField=\"true\"     data-native-menu=\"false\" type=\"multiple\">    </select>   </div>  </div>  <div id=\"CDLabelEditor\" uiRole=\"editor\">   <label id=\"CDLabelEditorLabel\" type=\"label\">Just a label</label> <input    id=\"CDLabelEditorLabelHidden\" type=\"hidden\" dataField=\"true\"    dataType=\"CD\" editorType=\"CDLabel\" />  </div>  <div id=\"PQInplaceEditor\" uiRole=\"editor\">   <input id=\"PQInplaceDisplayValue\" type=\"text\"    labelField=\"CDLabelEditorLabelHidden\" dataField=\"true\" dataType=\"PQ\"    hasToggle=\"true\" editorType=\"PQInplace\" />  </div>  <div id=\"MOInplaceEditor\" uiRole=\"editor\">   <input id=\"MOInplaceDisplayValue\" type=\"text\"    labelField=\"CDLabelEditorLabelHidden\" dataField=\"true\" dataType=\"MO\"    editorType=\"MOInplace\" />  </div>  <div id=\"PQInplaceComboEditor\" uiRole=\"editor\">   <input id=\"PQInplaceComboDisplayValue\" type=\"hidden\" />   <div id=\"comboDiv\">    <select type=\"multiple\" id=\"select-choice\" name=\"select-choice-1\"     dataField=\"true\" data-native-menu=\"false\"     labelField=\"CDLabelEditorLabelHidden\">    </select>   </div>  </div>  <div id=\"CalendarEditor\" uiRole=\"editor\">   <input id=\"calendarData\" type=\"text\" dataType=\"IVL_TS\"    editorType=\"Calendar\" hasToggle=\"true\" /> <input id=\"cFrom\"    type=\"hidden\" dataField=\"true\" /> <input id=\"cTo\" type=\"hidden\"    dataField=\"true\" />  </div>  <div id=\"CDInplaceEditor\" uiRole=\"editor\">  <label id=\"CDInplaceEditorLabel\"></label>   <input id=\"commentsValue\" type=\"text\" dataField=\"true\" dataType=\"CD\"    editorType=\"CDInplace\" />  </div>  <div id=\"CEInplaceEditor\" uiRole=\"editor\">   <input id=\"reasonValue\" type=\"text\" dataField=\"true\" dataType=\"CE\"    editorType=\"CEInplace\" />  </div>  <!-- <div id=\"PQBooleanEditor\" uiRole=\"editor\">   <div class=\"ui-grid-a\" data-role=\"controlgroup\"    style=\"margin-bottom: 25px;\" hasToggle=\"true\">    <div class=\"ui-block-a\">     <div style=\"float: left\">      <label>Yes</label>     </div>     <div style=\"float: left; margin-top: 4px; margin-left: -15px\">      <input type=\"radio\" name=\"radioEditor\" id=\"radioEditor1\" value=\"1\"       dataField=\"true\" labelField=\"CDLabelEditorLabelHidden\" />     </div>    </div>    <div class=\"ui-block-b\">     <div style=\"float: left\">      <label>No</label>     </div>     <div style=\"float: left; margin-top: 4px; margin-left: -15px\">      <input type=\"radio\" name=\"radioEditor\" id=\"radioEditor2\" value=\"0\"       dataField=\"true\" labelField=\"CDLabelEditorLabelHidden\" />     </div>    </div>   </div>  </div> -->  <div id=\"PQBooleanEditor\" uiRole=\"editor\">   <div class=\"ui-grid-a\" data-role=\"none\" style=\"margin-bottom: 25px;\">    <div class=\"ui-block-a\" data-role=\"none\">     <div style=\"float: left\">      <label id=\"label1\" for=\"radioEditor1\">Yes</label>     </div>     <div style=\"float: left; margin-top: 4px; margin-left: -15px\">      <input type=\"radio\" name=\"radioEditor1\" id=\"radioEditor1\" value=\"1\"       dataField=\"true\" labelField=\"CDLabelEditorLabelHidden\" />     </div>    </div>    <div class=\"ui-block-b\" data-role=\"none\">     <div style=\"float: left\">      <label id=\"label2\" for=\"radioEditor2\">No</label>     </div>     <div style=\"float: left; margin-top: 4px; margin-left: -15px\">      <input type=\"radio\" name=\"radioEditor1\" id=\"radioEditor2\" value=\"0\"       dataField=\"true\" labelField=\"CDLabelEditorLabelHidden\" />     </div>    </div>   </div>  </div>  <div id=\"PhysicianLookupEditor\" uiRole=\"editor\">   <div id=\"searchDiv\">    <input type=\"text\" id=\"pPhysician\" placeholder=\"Click/Double Click\" hasToggle='true'     editorType=\"PhysicianLookup\"  readonly=\"true\" />    <ul data-role=\"listview\" data-inset=\"true\"     style=\"width: 30%; position: absolute; z-index: 1000;\"></ul>   </div>      <div id=\"SubEditor\"  style=\"display:none\">     <div id=\"comboDiv\"  style=\"display:none\">      <select type=\"multiple\" id=\"PNCompleteNameTypeCombo\"       name=\"select-choice-1\" dataField=\"true\"></select>     </div>     <div id=\"comboDiv\"  style=\"display:none\">      <select type=\"multiple\" id=\"PNCompletePrefixCombo\"       name=\"select-choice-1\" dataField=\"true\"></select>     </div>      <input type=\"text\" id=\"PNgiven\" value=\"\" dataField=\"true\"  style=\"display:none\" />       <input type=\"text\" id=\"PNfamily\" value=\"\" dataField=\"true\"   style=\"display:none\"/>       <input type=\"text\" id=\"PNsuffix\" value=\"\" dataField=\"true\"  style=\"display:none\"/>    </div>  </div>  <div id=\"ServiceLookupEditor\" uiRole=\"editor\">   <div id=\"searchDiv\">    <input type=\"text\" id=\"sService\" placeholder=\"Search\" dataType=\"CD\"     hasToggle=\"true\" editorType=\"ServiceLookup\" dataField=\"true\" />    <ul data-role=\"listview\" data-inset=\"true\"     style=\"width: 30%; position: absolute; z-index: 1000;\"     dataField=\"true\"></ul>   </div>  </div>  <!-- Three Textbox editor  -->  <div id=\"CVListThreeTextboxEditor\" uiRole=\"editor\">   <div>    <label id=\"CVListThreeTextboxEditorLabel\">Surgery:</label>   </div>   <input id=\"CVListThreeTextboxDisplayValue\" type=\"text\"    dataType=\"CVList\" hasToggle=\"true\"  readonly=\"readonly\"/>   <div data-role=\"none\"    class=\"ui-align-text ui-form-border ui-subEditor\" id=\"SubEditor\">    <label id=\"CVListTextboxYearLabel\">Year </label> <input type=\"text\"     id=\"CVListTextboxYear\" value=\"\" dataField=\"true\" /> <label     id=\"CVListTextboxReasonLabel\">Reason</label> <input type=\"text\"     id=\"CVListTextboxReason\" value=\"\" dataField=\"true\" /> <label     id=\"CVListTextboxHospitalLabel\">Hospital</label> <input type=\"text\"     id=\"CVListTextboxHospital\" value=\"\" dataField=\"true\" />   </div>  </div>  <!-- Two Textbox editor  -->  <div id=\"CVListTwoTextboxEditor\" uiRole=\"editor\">   <div>    <label id=\"CVListTwoTextboxEditorLabel\">Allergies:</label>   </div>   <input id=\"CVListTwoTextboxDisplayValue\" type=\"text\" readonly=\"readonly\"    dataType=\"CVList\" hasToggle=\"true\" />   <div data-role=\"none\"    class=\"ui-align-text ui-form-border ui-subEditor\" id=\"SubEditor\">    <label id=\"CVListTextboxDrugLabel\">Name the Drug </label> <input     type=\"text\" id=\"CVListTextboxDrug\" value=\"\" dataField=\"true\" /> <label     id=\"CVListTextboxReactionLabel\">Reaction You Had</label> <input     type=\"text\" id=\"CVListTextboxReaction\" value=\"\" dataField=\"true\" />   </div>  </div>  <!-- Single Textbox editor  -->  <div id=\"CVListTextboxEditor\" uiRole=\"editor\">   <label id=\"CVListTextboxEditorLabel\">Health</label> <input    type=\"text\" id=\"CVListTextboxHealth\" value=\"\" dataField=\"true\" />  </div>  <!--TextArea editor  -->  <div id=\"CVListTextareaEditor\" uiRole=\"editor\">   <label id=\"CVListTextareaEditorLabel\">List</label>   <textarea type=\"text\" name=\"textarea\" id=\"CVListTextareaList\"    value=\"\" dataField=\"true\" rows=\"20\"> </textarea>  </div>  <div id=\"EDTextareaEditor\" uiRole=\"editor\">   <label id=\"EDTextareaLabel\"></label>   <div id=\"EDTextareaText\" dataField=\"true\">   <textarea type=\"text\" name=\"textarea\"  value=\"\"    dataType=\"ED\" editorType=\"EDTextarea\"  rows=\"2\"    cols=\"20\"> </textarea>    </div>  </div>  <!-- Boolean editor  -->  <div id=\"CVListBooleanEditor\" uiRole=\"editor\">   <label class=\"ui-health-habit\" id=\"CVListBooleanLabel\"></label>   <div class=\"ui-grid-a\" data-role=\"none\" style=\"float:left;width:87%;\">    <div class=\"ui-block-a\" data-role=\"none\" style=\"width:11%;\">     <div style=\"float: left\">      <label id=\"label1\" for=\"radioEditor1\">Yes</label>     </div>     <div style=\"float: left; margin-top: 4px; margin-left: -15px\">      <input type=\"radio\" name=\"radioEditor\" id=\"radioEditor1\" value=\"1\"       dataField=\"true\" labelField=\"CDLabelEditorLabelHidden\" />     </div>    </div>    <div class=\"ui-block-b\" data-role=\"none\">     <div style=\"float: left\">      <label id=\"label2\" for=\"radioEditor2\">No</label>     </div>     <div style=\"float: left; margin-top: 4px; margin-left: -15px\">      <input type=\"radio\" name=\"radioEditor\" id=\"radioEditor2\" value=\"0\"       dataField=\"true\" labelField=\"CDLabelEditorLabelHidden\" />     </div>    </div>   </div><br /><br />  </div>  <!-- CVList Calender -->  <div id=\"CVListCalenderEditor\" uiRole=\"editor\">   <label id=\"CVListCalenderLabel\">Birth Time:</label> <input    id=\"CVListCalenderDisplayValue\" type=\"hidden\" />   <div data-role=\"none\" class=\"ui-align-text\">    <input type=\"text\" readonly=\"readonly\" id=\"CVListCalenderbirthTime\"     value=\"\" dataField=\"true\" date=\"true\" data-role=\"datebox\"     data-options='{\"mode\": \"flipbox\",\"noButtonFocusMode\":true}' />   </div>  </div>  <!-- CVList Slider -->  <div id=\"CVListSliderEditor\" uiRole=\"editor\">   <div style=\"padding-bottom: 9px;\">    <label id=\"CVListSliderLabel\"></label>   </div>   <div>    <div class=\"increment\">Very unhealthy</div>    <div class=\"increment\">     <a href=\"#\" data-role=\"button\" data-icon=\"arrow-l\"      data-iconpos=\"notext\" data-theme=\"v\" data-inline=\"true\"      id=\"decrementHealth\"></a> <input type=\"hidden\"      id=\"numericHealthHidden\" value=\"\" dataField=\"true\" /> <span      id=\"numericHealth\" type=\"text\">0</span> <a href=\"#\"      data-role=\"button\" data-icon=\"arrow-r\" data-iconpos=\"notext\"      data-theme=\"v\" data-inline=\"true\" id=\"incrementHealth\"></a>    </div>    <div class=\"decrement\">Very healthy</div>   </div>   <br /> <br /> <br />  </div>  <div id=\"EDBooleanEditor\" uiRole=\"editor\">   <div class=\"ui-grid-a\" data-role=\"none\" style=\"padding-left:3px;\">    <div class=\"ui-block-a\" data-role=\"none\">     <div>       <label id=\"label1\" for=\"radioEditor1\">Yes</label>     </div>     <div style=\"float: left;\">      <input type=\"radio\" name=\"radioEditor\" id=\"radioEditor1\" value=\"1\"       dataField=\"true\" labelField=\"CDLabelEditorLabelHidden\" />     </div>    </div>    <div class=\"ui-block-b\" data-role=\"none\">     <div>      <label id=\"label2\" for=\"radioEditor2\">No</label>     </div>     <div style=\"float: left;\">      <input type=\"radio\" name=\"radioEditor\" id=\"radioEditor2\" value=\"0\"       dataField=\"true\" labelField=\"CDLabelEditorLabelHidden\" />     </div>    </div>   </div>  </div>    <!-- <div id=\"EDBooleanEditor\" uiRole=\"editor\">   <div class=\"ui-grid-a\" data-role=\"none\" style=\"padding-left:3px;margin-bottom: 25px;\">    <div class=\"ui-block-a\" data-role=\"none\">     <div style=\"float: left\">      <label id=\"label1\" for=\"radioEditor1\">Yes</label>     </div>     <div style=\"float: left; margin-top: 4px; margin-left: -15px\">      <input type=\"radio\" name=\"radioEditor\" id=\"radioEditor1\" value=\"1\"       dataField=\"true\" labelField=\"CDLabelEditorLabelHidden\" />     </div>    </div>    <div class=\"ui-block-b\" data-role=\"none\">     <div style=\"float: left\">      <label id=\"label2\" for=\"radioEditor2\">No</label>     </div>     <div style=\"float: left; margin-top: 4px; margin-left: -15px\">      <input type=\"radio\" name=\"radioEditor\" id=\"radioEditor2\" value=\"0\"       dataField=\"true\" labelField=\"CDLabelEditorLabelHidden\" />     </div>    </div>   </div>  </div> -->  <div id=\"EDTextBoxEditor\" uiRole=\"editor\">   <label id=\"EDTextBoxEditorLabel\"></label> <input id=\"EDDisplayValue\"    type=\"text\" dataField=\"true\" dataType=\"ED\" editorType=\"EDTextBox\" />  </div>  <div id=\"ONEditor\" uiRole=\"editor\">   <label id=\"ONEditorLabel\">Name:</label> <input readonly=\"readonly\"    id=\"ONDisplayValue\" type=\"text\" dataType=\"ON\" editorType=\"ON\"    hasToggle=\"true\" />   <div data-role=\"none\"    class=\"ui-align-text ui-form-border ui-subEditor\" id=\"SubEditor\">    <label>Name Type:</label>    <div id=\"comboDiv\">     <select type=\"multiple\" id=\"ONuse\" name=\"select-choice-1\"      dataField=\"true\" data-native-menu=\"false\"></select>    </div>    <label>Name:</label> <input type=\"text\" id=\"ONprefix\" value=\"\"     dataField=\"true\" />   </div>  </div>  <div id=\"ONInplaceEditor\" uiRole=\"editor\">   <label id=\"ONInplaceEditorLabel\">Oraganization:</label> <input    readonly=\"readonly\" id=\"ONInplaceDisplayValue\" type=\"hidden\"    dataType=\"ON\" editorType=\"ON\" hasToggle=\"true\" /> <input    type=\"text\" id=\"ONInplacePrefix\" value=\"\" dataField=\"true\" />  </div>  <div id=\"EntityLookupEditor\" uiRole=\"editor\">   <input id=\"consultant\" type=\"hidden\" />   <div id=\"searchDiv\">    <input type=\"text\" id=\"EntityDisplayValue\" placeholder=\"Search\"     dataField=\"true\" />    <ul id=\"entityList\" data-role=\"listview\" data-inset=\"true\"     style=\"width: 30%; position: absolute; z-index: 1000;\"></ul>   </div>  </div>  <div id=\"STEditor\" uiRole=\"editor\">   <label id=\"STEditorLabel\">Job Title.:</label> <input    id=\"STDisplayValue\" type=\"hidden\" dataType=\"ST\" editorType=\"ST\"    hasToggle=\"true\" /> <input type=\"text\" id=\"STtext\" value=\"\"    dataField=\"true\" />  </div>  <div id=\"STLabelEditor\" uiRole=\"editor\">   <label id=\"STLabelEditorLabel\" type=\"label\" dataField=\"true\"    dataType=\"ST\" editorType=\"STLabel\">Just a label</label>  </div>  <div id=\"EDLabelEditor\" uiRole=\"editor\">   <label id=\"EDLabelEditorLabel\" type=\"label\" dataField=\"true\"    dataType=\"ED\" editorType=\"EDLabel\">Just a label</label>  </div>  <div id=\"EDCheckBoxEditor\" uiRole=\"editor\">   <input id=\"EDCheckBoxDisplayValue\" type=\"checkbox\" dataField=\"true\"    labelField=\"CDLabelEditorLabelHidden\" style=\"margin:-4px 0 0;\" /> <label    id=\"EDCheckBoxLabel\" type=\"label\" dataField=\"true\" for=\"EDCheckBoxDisplayValue\"></label>  </div>  <div id=\"EDSpanEditor\" uiRole=\"editor\">   <span id=\"EDSpan\" dataField=\"true\"></span>  </div>  <div id=\"CDCheckBoxEditor\" uiRole=\"editor\"   style=\"width: 70%; float: left;\">   <div style=\"width: 7%; float: left; margin-top: 5px;\">    <input id=\"CDCheckBoxDisplayValue\" type=\"checkbox\" dataField=\"true\" />   </div>   <div style=\"width: 70%; float: left\">    <label id=\"CDCheckBoxLabel\" type=\"label\"></label>   </div>  </div>  <div id=\"CDEditor\" style=\"width: 50%\" uiRole=\"editor\">   <label id=\"CDEditorLabel\">:</label> <input id=\"CDDisplayValue\"    type=\"hidden\" dataType=\"CD\" editorType=\"CD\" hasToggle=\"true\" />   <div id=\"comboDiv\" hasToggle=\"true\">    <select id=\"select-choice\" name=\"select-choice-1\" dataField=\"true\"     data-native-menu=\"false\" type=\"multiple\">    </select>   </div>  </div>  <div id=\"CDProgramsEditor\" uiRole=\"editor\">   <label id=\"CDProgramsEditorLabel\">:</label> <input    id=\"CDDisplayValue\" type=\"hidden\" dataType=\"CD\"    editorType=\"CDPrograms\" hasToggle=\"true\" /> <input type=\"hidden\"    id=\"CDProgramsCode\" value=\"\" dataField=\"true\" /> <input    type=\"hidden\" id=\"CDProgramsDisplayName\" value=\"\" dataField=\"true\" />   <fieldset class=\"ui-grid-b\" id=\"programs\">    <div nameType=\"shortName\" class=\"demo-programs ui-block-a\" program=\"\">     <div class=\"program\">      <img image=\"smallIcon\" src=\"\" />     </div>     <div nameType=\"name\" class=\"ui-program-position ui-cursor-point\"></div>    </div>    <div nameType=\"shortName\" class=\"demo-programs ui-block-b\" program=\"\">     <div class=\"program\">      <img image=\"smallIcon\" src=\"\" />     </div>     <div nameType=\"name\" class=\"ui-program-position ui-cursor-point\"></div>    </div>    <div nameType=\"shortName\" class=\"demo-programs ui-block-a\" program=\"\">     <div class=\"program\">      <img image=\"smallIcon\" src=\"\" />     </div>     <div nameType=\"name\" class=\"ui-program-position ui-cursor-point\"></div>    </div>    <div nameType=\"shortName\" class=\"demo-programs ui-block-b\" program=\"\">     <div class=\"program\">      <img image=\"smallIcon\" src=\"\" />     </div>     <div nameType=\"name\" class=\"ui-program-position ui-cursor-point\"></div>    </div>    <div nameType=\"shortName\" class=\"demo-programs ui-block-a\" program=\"\">     <div class=\"program\">      <img image=\"smallIcon\" src=\"\" />     </div>     <div nameType=\"name\" class=\"ui-program-position ui-cursor-point\"></div>    </div>    <div nameType=\"shortName\" class=\"demo-programs ui-block-b\" program=\"\">     <div class=\"program\">      <img image=\"smallIcon\" src=\"\" />     </div>     <div nameType=\"name\" class=\"ui-program-position ui-cursor-point\"></div>    </div>    <div nameType=\"shortName\" class=\"demo-programs ui-block-a\" program=\"\">     <div class=\"program\">      <img image=\"smallIcon\" src=\"\" />     </div>     <div nameType=\"name\" class=\"ui-program-position ui-cursor-point\"></div>    </div>    <div nameType=\"shortName\" class=\"demo-programs ui-block-b\" program=\"\">     <div class=\"program\">      <img image=\"smallIcon\" src=\"\" />     </div>     <div nameType=\"name\" class=\"ui-program-position ui-cursor-point\"></div>    </div>    <div nameType=\"shortName\" class=\"demo-programs ui-block-a\" program=\"\">     <div class=\"program\">      <img image=\"smallIcon\" src=\"\" />     </div>     <div nameType=\"name\" class=\"ui-program-position ui-cursor-point\"></div>    </div>    <div nameType=\"shortName\" class=\"demo-programs ui-block-b\" program=\"\">     <div class=\"program\">      <img image=\"smallIcon\" src=\"\" />     </div>     <div nameType=\"name\" class=\"ui-program-position ui-cursor-point\"></div>    </div>   </fieldset>  </div>  <div id=\"CESearchEditor\" uiRole=\"editor\">   <label id=\"CESearchLabel\"></label>   <div id=\"searchDiv\" style=\"width: 100%;\">    <input data-inline=\"true\" value=\"\" id=\"select-dose\" type=\"text\" hasToggle=\"true\"     data-type=\"search\" placeholder=\"Search\"  dataField=\"true\" hasToggle='true'>    <ul id=\"select-doseList\" data-theme=\"v\" data-role=\"listview\"     class=\"ui-search-lookup\"></ul>    <div  id=\"SubEditor\" style=\"display:none\">     <input  value=\"\" id=\"select-doseHidden\" type=\"text\" dataField=\"true\" style=\"display:none\"/>     </div>   </div>     </div>  <div id=\"IIPermissionEditor\" uiRole=\"editor\">   <input id=\"IIPermissionEditorDisplayValue\" type=\"hidden\"    dataType=\"II\" editorType=\"IIPermission\" hasToggle=\"true\" /> <label    type=\"label\" for=\"permissionlabel\" id=\"IIPermissionRoot\"></label> <input    type=\"checkbox\" id=\"IIPermissionExtension\" value=\"\" dataField=\"true\" />   <input type=\"hidden\" id=\"IIPermissionAssigningAuthorityName\" value=\"\"    dataField=\"true\" />  </div>  <div id=\"RTO_PQ_PQInplaceEditor\" uiRole=\"editor\">   <label id=\"RTO_PQ_PQProductLabel\"></label> <input type=\"text\"    id=\"RTO_PQ_PQProduct\" value=\"\" dataField=\"true\" />  </div>  <div id=\"RTO_MO_PQInplaceEditor\" uiRole=\"editor\">   <label id=\"RTO_MO_PQProductLabel\"></label> <input type=\"text\"    id=\"RTO_MO_PQProduct\" value=\"\" dataField=\"true\" />  </div>  <div id=\"CELabelEditor\" uiRole=\"editor\">   <label id=\"CELabel\" type=\"label\">Range:</label> <input    id=\"CELabelHidden\" type=\"hidden\" dataField=\"true\" />  </div>  <div id=\"EDCalenderEditor\" uiRole=\"editor\">   <label id=\"EDCalenderLabel\">Birth Time:</label> <input    id=\"EDCalenderDisplayValue\" type=\"hidden\" />   <div data-role=\"none\" class=\"ui-align-text\">    <input type=\"text\" readonly=\"readonly\" id=\"EDCalenderbirthTime\"     value=\"\" dataField=\"true\" date=\"true\" data-role=\"datebox\"     data-options='{\"mode\": \"calbox\",\"calUsePickers\": true, \"calNoHeader\": true, \"dateFormat\": \"%B-%d-%Y, %k:%M:%S\"}' />    <!--   <input type=\"text\"  id=\"EDCalenderbirthTime\" value=\"\" dataField=\"true\"/> -->   </div>  </div>  <div id=\"EDComboBoxEditor\" uiRole=\"editor\" style=\"width: 50%\">   <label id=\"EDCombolabel\"></label>   <div id=\"comboDiv\">    <select type=\"multiple\" id=\"EDComboBox\" name=\"select-choice-1\"     dataField=\"true\" data-native-menu=\"false\"></select>   </div>  </div>  <div id=\"PQInplaceBooleanEditor\" uiRole=\"editor\">   <label id=\"PQInplaceBooleanLabel\"></label>   <div class=\"ui-grid-a\" data-role=\"none\" style=\"margin-bottom: 25px;\">    <div data-role=\"none\">     <div style=\"float: left\">      <label id=\"label1\" for=\"radioEditor1\">Yes</label>     </div>     <div style=\"float: left; margin-top: 4px; margin-left: -15px\">      <input type=\"radio\" name=\"radioEditor\" id=\"radioEditor1\" value=\"1\"       dataField=\"true\" labelField=\"CDLabelEditorLabelHidden\" />     </div>    </div>    <div class=\"ui-block-b\" data-role=\"none\" style=\"margin-left: 25px\">     <div style=\"float: left\">      <label id=\"label2\" for=\"radioEditor2\">No</label>     </div>     <div style=\"float: left; margin-top: 4px; margin-left: -15px\">      <input type=\"radio\" name=\"radioEditor\" id=\"radioEditor2\" value=\"0\"       dataField=\"true\" labelField=\"CDLabelEditorLabelHidden\" />     </div>    </div>   </div>  </div>  <div id=\"EDSingleBooleanEditor\" uiRole=\"editor\">    <fieldset class=\"ui-grid-d\">     <div class=\"ui-block-a\">     <div style=\"width:80%;position:relative;left:15px;\">      <label id=\"label1\" for=\"radioEditor1\">yes</label>     <input type=\"radio\" name=\"radio-mini\" id=\"radioEditor1\" value=\"1\" dataField=\"true\" labelField=\"CDLabelEditorLabelHidden\"/>     </div>     <div style=\"height:20px;text-align:center;position:relative;bottom:5px;\">     <p id=\"p1\">Normal1</p>      </div>     </div>     <div class=\"ui-block-b\">     <div style=\"width:80%;position:relative;left:15px\">     <label id=\"label2\" for=\"radioEditor2\">yes</label>     <input type=\"radio\" name=\"radio-mini\" id=\"radioEditor2\" value=\"1\" dataField=\"true\" labelField=\"CDLabelEditorLabelHidden\"/>     </div>     <div style=\"height:20px;text-align:center;position:relative;bottom:5px\">     <p id=\"p2\">Normal2</p>      </div>     </div>     <div class=\"ui-block-c\">     <div style=\"width:80%;position:relative;left:15px;\">     <label id=\"label3\" for=\"radioEditor3\">yes</label>     <input type=\"radio\" name=\"radio-mini\" id=\"radioEditor3\" value=\"1\" dataField=\"true\" labelField=\"CDLabelEditorLabelHidden\"/>     </div>     <div style=\"height:20px;text-align:center;position:relative;bottom:5px\">     <p id=\"p3\">Normal3</p>      </div>     </div>     <div class=\"ui-block-d\">     <div style=\"width:80%;position:relative;left:15px\">     <label id=\"label4\" for=\"radioEditor4\">yes</label>     <input type=\"radio\" name=\"radio-mini\" id=\"radioEditor4\" value=\"1\" dataField=\"true\" labelField=\"CDLabelEditorLabelHidden\"/>     </div>     <div style=\"height:20px;text-align:center;position:relative;bottom:5px\">     <p id=\"p4\">Normal4</p>      </div>     </div>     <div class=\"ui-block-e\">     <div style=\"width:80%;position:relative;left:15px\">     <label id=\"label5\" for=\"radioEditor5\">yes</label>     <input type=\"radio\" name=\"radio-mini\" id=\"radioEditor5\" value=\"1\" dataField=\"true\" labelField=\"CDLabelEditorLabelHidden\"/>     </div>     <div style=\"height:20px;text-align:center;position:relative;bottom:5px\">     <p id=\"p5\">Normal5</p>      </div>     </div>    </fieldset>  </div>  <div id=\"ColorPickerEditor\" uiRole=\"editor\">   <input id=\"colorValue\" type=\"text\" dataField=\"true\" dataType=\"CD\" editorType=\"ColorPicker\" placeholder=\"Click\" name=\"color1\" readonly=\"readonly\"/>  </div>    <div id=\"IIinplaceComboEditor\" style=\"width: 100%\" uiRole=\"editor\">   <label id=\"IIcomboLabel\"></label>    <input id=\"IIHidden\" dataField=\"true\" type=\"hidden\" />   <div id=\"comboDiv\">    <select id=\"select-choice\" name=\"select-choice-1\" dataField=\"true\"     data-native-menu=\"false\" type=\"multiple\">    </select>   </div>  </div>    <div id=\"IISingleCheckBoxEditor\" uiRole=\"editor\">   <input type=\"hidden\" id=\"IIRoot\" value=\"\" dataField=\"true\" />   <input type=\"checkbox\" id=\"IIExtension\" value=\"\" dataField=\"true\" />  </div> </div></body></html>";

	var bindPhysicianLookups = new Array();
	var bindServiceLookups = new Array();
	var physicianLookupMap = new HIN.HashMap();
	var serviceLookupMap = new HIN.HashMap();

	/**
	 * Used to toggle Editor onclick of the display text box, calls
	 * "getEditoValues()" to update the values in the Sub editor to the display
	 * textbox.
	 */
	this.toggleEditor = function() {
		var editor = $(this);
		var dataType = editor.attr("dataType");
		var editorType = editor.attr("editorType");
		var editorContent = $(this).closest("[uiRole='editor']");

		if ($(editorContent).find("#SubEditor").css("display") == 'block') {
			$(editorContent).find("#SubEditor").css("display", "none");
		} else if ($(editorContent).find("#SubEditor").css("display") == 'none' || $(editorContent).find("#SubEditor").html() == null) {
			$('#' + editorUIApi.messageAndUIBinder.parentContainerID).find(
					"[uiRole='editor']")
					.each(
							function(index, value) {

								if ($(value).find("[id='SubEditor']").css(
										"display") == "block") {
									var editor = $(value).closest(
											"[isEditor='true']")[0];
									var editorFragment = $(value).closest(
											"[uiRole='editor']")[0];

									if (editorFragment) {
										var editorType = $(editor).attr(
												"editorType");
										editorUIApi.getEditoValues(editorFragment, editorType);
									}
								}
							});

			$('#' + editorUIApi.messageAndUIBinder.parentContainerID).find(
					"#SubEditor").css("display", "none");
			$(editorContent).find("#SubEditor").css("display", "block");
		}

		if ($(editorContent).find("#SubEditor").css("display") == 'none') {
			var editor = $(this);
			var editorFragment = $(this).closest("[uiRole='editor']")[0];

			if (editorFragment) {
				var editorType = editor.attr("editorType");
				editorUIApi.getEditoValues(editorFragment, editorType);
			}
		}

		else {
			if ($(editorContent).find('#SubEditor input[dataField="true"]')[0]) {
				$(editorContent).find('#SubEditor input[dataField="true"]')[0]
						.focus();
			}
		}
	};

	/**
	 * Used to create a copy of the existing editor for multiple entries
	 * 
	 * @param gridEditor :
	 *            HTML Fragment that holds all the entries
	 * @param idSuffix :
	 *            Index of the previous entry
	 */
	this.addGridEditor = function(gridEditor, idSuffix) {
		var fieldEditor = null;
		var events = [];
		// var formElementId = new Array();
		// var gridContentId = "";
		fieldEditor = ($(gridEditor).find("[uiRole='gridContent']"))[0];

		/*
		 * call to the UpdatePathfield.js to get the updated pathField based on
		 * the entry
		 */
		// var pathFields = updatePathfield.getUpdatedPathField(gridEditor);
		fieldEditor = $(fieldEditor).clone();
		var editorType = $(gridEditor).attr("editorType");
		var id = $(gridEditor).attr("id");
		var pathFields = $(gridEditor).attr("pathFields");
		var configPathField = $(gridEditor).attr("configPathField");

		/* removing the label for the second editor in the grid */
		var labels = $(fieldEditor).find('label');
		$((labels)[0]).css('display', 'none');

		$(fieldEditor).find("#addButton").remove();
		$(fieldEditor).find("#removeButton").css("display", "block");
		$(fieldEditor).find("#" + editorType + "EditorLabel").remove();

		idSuffix = parseInt(idSuffix, 10) + 1;
		var lookups = [];

		$
				.each(
						$(fieldEditor).find('[dataField="true"]'),
						function(index, value) {
							var content = this;
							if ($(this).attr('type') == 'multiple') {
								$(this).attr("pathFields", pathFields);
								var parentDivs = $(this).closest(
										'div[class="ui-select"]');
								var parent = $(parentDivs)[0];
								$(parent).html("");
								$(parent).removeAttr("class");

								var options = $(this).children();

								$(options).each(function(key, option) {
									$(option).removeAttr('selected');
								});

								$(parent).html($(this));
								$(parent).trigger('refresh');
							} else if ($(this).attr('data-type') == 'search') {
								var dataType = $(this).attr('dataType');
								var id = $(this).attr('id');
								var tagName = $(this).attr('tagName');
								var fields = $(this).attr('fields');
								var conceptClass = $(this).attr('conceptClass');
								var lookupType = $(this).attr('lookupType');
								var lookupSelectType = $(this).attr(
										'lookupSelectType');
								var lookupControlType = $(this).attr(
										'lookupControlType');
								var parentDivs = $(this).closest(
										'div[id="searchDiv"]');
								var parent = $(parentDivs)[0];

								var searchFragment = '<input data-inline="true" value="" id="'
										+ id
										+ '" type="text" data-type="search" dataField="true" placeholder="Search">'
								var ulFragment = ' <ul id="'
										+ id
										+ 'List" data-theme="v" data-role="listview" class="ui-search-lookup"></ul>'

								$(parent).html("");
								$(parent).append(searchFragment);
								$(parent).append(ulFragment);

								$(parent).find("#" + id).attr('dataType',
										dataType);
								$(parent).find("#" + id).attr('pathFields',
										pathFields);
								$(parent).find("#" + id).attr('tagName',
										tagName);
								$(parent).find("#" + id).attr('fields', fields);
								$(parent).find("#" + id).attr('conceptClass',
										conceptClass);
								$(parent).find("#" + id).attr('lookupType',
										lookupType);
								$(parent).find("#" + id).attr(
										'lookupSelectType', lookupSelectType);
								$(parent).find("#" + id).attr(
										'lookupControlType', lookupControlType);

								lookups.push([
										{
											name : 'conceptClass',
											value : $(parent).find("#" + id)
													.attr('conceptClass')
										},
										{
											name : 'type',
											value : $(parent).find("#" + id)
													.attr("lookupControlType")
										},
										{
											name : 'elementId',
											value : $(parent).find("#" + id)
													.attr('id')
										} ]);

								$(parent).trigger('refresh');
							} else {
								$(this).val("");
								$(this).attr("pathFields", pathFields);
							}
						});

		$.each($(fieldEditor).find('[hastoggle="true"]'),
				function(index, value) {
					$(this).val("");
					$(this).attr("pathFields", pathFields);
				});

		$(fieldEditor).find("#removeButton").attr("idSuffix", idSuffix);
		$(fieldEditor).find("#addButton").attr("idSuffix", idSuffix);

		/* event handler */
		var formDiv = $(gridEditor).find("#addButton").closest(
				"[editortype='Grid']")[0];
		var instanceId = $(formDiv).attr("instanceId");
		var configParams = $(formDiv).attr('configParams');
		try {
			eval('var configParamsObj=' + configParams);
		} catch (error) {
			alert("Invalid JSON config params from the form: " + configParams);
			return;
		}

		if (configParamsObj) {
			$.each(configParamsObj, function(key, result) {
				if (result.name == 'eventData') {
					events.push(result.value);
				}
			});
		}
		if (events) {
			var changeFieldId = $(fieldEditor).find('[eventuse="eventChange"]')
					.attr('id');
			var updateFieldId = $(fieldEditor).find('[eventuse="eventUpdate"]')
					.attr('id');
			editorUIApi.eventHandler(events, changeFieldId, updateFieldId,
					fieldEditor, instanceId, configParamsObj);
		}

		$(fieldEditor).attr("idSuffix", idSuffix);
		/*
		 * gridContentId = $(fieldEditor).attr("id"); if(gridContentId){
		 * formElementId = gridContentId.split('Content'); }
		 * if(formElementId[0]){ $(fieldEditor).attr("id",
		 * formElementId[0]+"Content"+idSuffix); }
		 */

		$(fieldEditor).attr("configPathField", configPathField);
		$(fieldEditor).attr("pathFields", pathFields);

		$(fieldEditor).find("#removeButton").click(function() {
			editorUIApi.removeRow(gridEditor, idSuffix);
		});

		$(fieldEditor).trigger('refresh');
		$(gridEditor).find("#addButton").attr("idSuffix", idSuffix);

		$(gridEditor).append(fieldEditor);
		$(gridEditor).trigger('create');
		editorUIApi.messageAndUIBinder.bindFieldEvents();

		editorUIApi.messageAndUIBinder.lookupHandler.lookUp($('#'
				+ editorUIApi.messageAndUIBinder.parentContainerID), lookups);

	};

	/**
	 * removes the select editor from the Grid in the UI
	 * 
	 * @param gridEditor :
	 *            HTML Fragment that contains all the elements in the grid
	 * @param idSuffix :
	 *            HTML Fragment id that has to be removed
	 */
	this.removeRow = function(gridEditor, idSuffix) {
		$(gridEditor).find('[uiRole="gridContent"]').each(function() {
			if ($(this).attr("idSuffix") == idSuffix) {
				$(this).remove();

				$(gridEditor).find('[dataField="true"]').trigger("change");
			}
		});

		// gridEditor = updatePathfield.setPathField(gridEditor);
	};

	/**
	 * To get the concatenated string of all the values in the Sub editor, it
	 * calls all the get Value methods
	 * 
	 * @param fieldInsideTheEditor :
	 *            HTML fragment which has the display text box and the Sub
	 *            editor
	 * @param editorType :
	 *            type of editor used for display
	 */
	this.getEditoValues = function(fieldInsideTheEditor, editorType) {
		var editor = $(fieldInsideTheEditor);
		if (editor) {
		} else {
			// alert("No editor found");
			return;
		}

		var methodName = "get" + editorType + "Values";

		var content = null;

		/* if(methodName in editorUIApi.messageAndUIBinder) */

		try {
			eval("content=editorUIApi." + methodName + "(editor)");
		} catch (error) {
			var msg = "Error: " + error;
			/*
			 * if (typeof console != "undefined") { console.log(msg); } else {
			 * alert(msg); }
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
	};

	// ==================== UI GENERATION ====================//

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : PN
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getPNCompleteUI = function(fieldElement, configParamsObj) {

		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(EditorUIApi.editorDOM).find("#PNCompleteEditor")
				.clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var fields = "PNCompleteNameTypeCombo,PNCompletePrefixCombo,PNgiven,PNfamily,PNsuffix";

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
					$(editorFragment).find("#PNCompletePrefixCombo").attr(
							'conceptClass', result.value);
				}
				if (result.name == 'prefixLookupType') {
					$(editorFragment).find("#PNCompletePrefixCombo").attr(
							'lookupType', result.value);
				}
				if (result.name == 'prefixLookupSelectType') {
					$(editorFragment).find("#PNCompletePrefixCombo").attr(
							'lookupSelectType', result.value);
				}
				if (result.name == 'prefixLookupControl') {
					$(editorFragment).find("#PNCompletePrefixCombo").attr(
							'lookupControlType', result.value);
				}

				if (result.name == 'nameUseConceptClass') {
					$(editorFragment).find("#PNCompleteNameTypeCombo").attr(
							'conceptClass', result.value);
				}
				if (result.name == 'nameUseLookupType') {
					$(editorFragment).find("#PNCompleteNameTypeCombo").attr(
							'lookupType', result.value);
				}
				if (result.name == 'nameUseLookupSelectType') {
					$(editorFragment).find("#PNCompleteNameTypeCombo").attr(
							'lookupSelectType', result.value);
				}
				if (result.name == 'nameUseLookupControl') {
					$(editorFragment).find("#PNCompleteNameTypeCombo").attr(
							'lookupControlType', result.value);
				}
				if (result.name == 'nameTypeRequired') {
					if (result.value == 'no') {
						$(editorFragment).find("#PNCompleteNameTypeLabel").css(
								"display", "none");
						$(editorFragment).find("#PNCompleteNameTypeCombo")
								.closest('[id="comboDiv"]').css("display",
										"none");
					}
				}
				if (result.name == 'validate') {
					$(editorFragment).find("#PNDisplayValue").attr("class",
							result.value);
				}
			});
		}

		this.getField = function(fieldId, rowIndex) {
			var field = $(editorFragment).find("#" + fieldId);
			return $(field);
		}

		$(fieldElement).prepend($(editorFragment));
		// $(fieldElement).removeAttr("isEditor");
		$(fieldElement).trigger("create");

	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : ON
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getONUI = function(fieldElement, configParamsObj) {

		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(EditorUIApi.editorDOM).find("#ONEditor").clone();
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
					$(editorFragment).find("#ONuse").attr('lookupSelectType',
							result.value);
				}
				if (result.name == 'orgNameTypeLookupControl') {
					$(editorFragment).find("#ONuse").attr('lookupControlType',
							result.value);
				}
				if (result.name == 'validate') {
					$(editorFragment).find("#ONDisplayValue").attr('class',
							result.value);
				}
			});
		}

		$(fieldElement).prepend($(editorFragment));
		// $(fieldElement).removeAttr("isEditor");
		$(fieldElement).trigger("create");

	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : ON
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getONInplaceUI = function(fieldElement, configParamsObj) {

		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(EditorUIApi.editorDOM).find("#ONInplaceEditor")
				.clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var fields = "null,ONInplacePrefix";

		$(editorFragment).find("#ONInplaceEditorLabel").text(editorLabel);
		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		if (configParamsObj) {
			$.each(configParamsObj, function(key, result) {

			});
		}

		$(fieldElement).prepend($(editorFragment));
		// $(fieldElement).removeAttr("isEditor");
		$(fieldElement).trigger("create");

	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : ST
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getSTUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(EditorUIApi.editorDOM).find("#STEditor").clone();
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
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : CDLabel
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getSTLabelUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(EditorUIApi.editorDOM).find("#STLabelEditor")
				.clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var idSuffix = $(fieldElement).attr("idSuffix");
		idSuffix = (idSuffix) ? idSuffix : "";

		var field1 = "STLabelEditorLabel" + idSuffix;

		var fields = field1;

		$(editorFragment).find("#STLabelEditorLabel").text(editorLabel);

		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("id", $(value).attr("id") + idSuffix);
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		$(editorFragment).find("#STLabelEditorLabel").attr("id",
				"STLabelEditorLabel" + idSuffix);
		$(fieldElement).html($(editorFragment));
		// $(fieldElement).removeAttr("isEditor");
		$(fieldElement).trigger("create");
	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : EDSpan
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getEDSpanUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(EditorUIApi.editorDOM).find("#EDSpanEditor")
				.clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var tagName = $(fieldElement).attr("tagName");
		var fields = "EDSpan";

		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		$(fieldElement).prepend($(editorFragment));
		$(fieldElement).trigger("create");
	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : CDLabel
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getEDLabelUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(EditorUIApi.editorDOM).find("#EDLabelEditor")
				.clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var idSuffix = $(fieldElement).attr("idSuffix");
		idSuffix = (idSuffix) ? idSuffix : "";

		var field1 = "EDLabelEditorLabel" + idSuffix;

		var fields = field1;

		$(editorFragment).find("#EDLabelEditorLabel").text(editorLabel);

		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("id", $(value).attr("id") + idSuffix);
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		$(editorFragment).find("#EDLabelEditorLabel").attr("id",
				"EDLabelEditorLabel" + idSuffix);
		$(fieldElement).html($(editorFragment));
		// $(fieldElement).removeAttr("isEditor");
		$(fieldElement).trigger("create");
	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : PQInplace
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getPQInplaceUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(EditorUIApi.editorDOM).find("#PQInplaceEditor")
				.clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var idSuffix = $(fieldElement).attr("idSuffix");
		idSuffix = (idSuffix) ? idSuffix : "";

		var fields = "PQInplaceDisplayValue" + idSuffix;
		$.each($(editorFragment).find('[dataField="true"]'),
				function(index, value) {
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
					if (result.value == false) {
						$(editorFragment).find(
								"#PQInplaceDisplayValue" + idSuffix).attr(
								'readonly', "readonly");
					}
				}
				if (result.name == 'concept') {
					$(editorFragment).find("#PQInplaceDisplayValue" + idSuffix)
							.attr('concept', result.value);
				}
				if (result.name == 'textAlignCeter') {
					if (result.value == true) {
						$(editorFragment).find(
								"#PQInplaceDisplayValue" + idSuffix).css(
								'text-align', 'center');
					}
				}

			});
		}

		if (editorLabel) {
			$(editorFragment).find("#PQInplaceDisplayValue" + idSuffix).attr(
					'value', editorLabel);
		}

		this.getField = function(fieldId, rowIndex) {
			var field = $(editorFragment).find("#" + fieldId);
			return $(field);
		}

		$(fieldElement).html($(editorFragment));
		// $(fieldElement).removeAttr("isEditor");
		$(fieldElement).trigger("create");
	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : MO
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getMOInplaceUI = function(fieldElement, configParamsObj) {

		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(EditorUIApi.editorDOM).find("#MOInplaceEditor")
				.clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var idSuffix = $(fieldElement).attr("idSuffix");
		idSuffix = (idSuffix) ? idSuffix : "";

		var fields = "MOInplaceDisplayValue" + idSuffix;
		$.each($(editorFragment).find('[dataField="true"]'),
				function(index, value) {
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
					if (result.value == false) {
						$(editorFragment).find(
								"#MOInplaceDisplayValue" + idSuffix).attr(
								'readonly', "readonly");
					}
				}
			});
		}

		$(editorFragment).find("#MOInplaceDisplayValue" + idSuffix).change(
				function() {
					var discountAmountListener = editorUIApi.messageAndUIBinder
							.getEditorListener("discount",
									"discountAmountListener");
					if (discountAmountListener) {
						discountAmountListener();
					}
				});

		$(fieldElement).html($(editorFragment));
		// $(fieldElement).removeAttr("isEditor");
		$(fieldElement).trigger("create");
	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : CDCheckBox
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getCDCheckBoxUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var idSuffix = $(fieldElement).attr("idSuffix");
		var editorFragment = $(EditorUIApi.editorDOM).find("#CDCheckBoxEditor")
				.clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");

		var field1 = "CDCheckBoxDisplayValue" + idSuffix;
		var field2 = "CDCheckBoxLabel" + idSuffix;
		var fields = field1;

		$(editorFragment).find("#CDCheckBoxLabel").text(editorLabel);

		$(editorFragment).find("#CDCheckBoxDisplayValue").attr("id", field1);
		$(editorFragment).find("#CDCheckBoxLabel").attr("id", field2);

		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
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
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : PQBoolean
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getPQBooleanUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var name = $(fieldElement).attr("name");
		var editorFragment = $(EditorUIApi.editorDOM).find("#PQBooleanEditor")
				.clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var idSuffix = $(fieldElement).attr("idSuffix");
		var style = $(fieldElement).attr("style");
		idSuffix = (idSuffix) ? idSuffix : "";
		var field1 = "radioEditor1" + idSuffix;
		var field2 = "radioEditor2" + idSuffix;

		var fields = field1 + "," + field2;
		$.each($(editorFragment).find('[dataField="true"]'),
				function(index, value) {
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

		$(editorFragment).find("#label1")
				.attr("for", "radioEditor1" + idSuffix);
		$(editorFragment).find("#label2")
				.attr("for", "radioEditor2" + idSuffix);

		$(fieldElement).html($(editorFragment));
		$(fieldElement).trigger("create");
	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : PQInplaceCombo
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getPQInplaceComboUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(EditorUIApi.editorDOM).find(
				"#PQInplaceComboEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var idSuffix = $(fieldElement).attr("idSuffix");
		idSuffix = (idSuffix) ? idSuffix : "";

		var conceptClass = null;
		var fields = null;
		var options = "<option value=''>Select</option>";
		if (configParamsObj) {
			$.each(configParamsObj, function(key, result) {
				/*
				 * if (result.name == 'conceptClass') { conceptClass =
				 * result.value; fields = "select-" + conceptClass + idSuffix;
				 * $(editorFragment).find("#select-choice").attr('conceptClass',result.value); }
				 * if (result.name == 'lookupType') {
				 * $(editorFragment).find("#select-choice").attr('lookupType',result.value); }
				 * if (result.name == 'lookupSelectType') {
				 * $(editorFragment).find("#select-choice").attr('lookupSelectType',
				 * result.value); } if (result.name == 'lookupControl') {
				 * $(editorFragment).find("#select-choice").attr('lookupControlType',
				 * result.value); }
				 */

				options += "<option value=" + result.name + ">" + result.value
						+ "</option>"

			});
		}
		fields = "select-choice" + idSuffix;
		$(editorFragment).find("#select-choice").html(options);
		// $(editorFragment).find("#select-choice").attr('id',"select-" +
		// conceptClass);

		$.each($(editorFragment).find('[dataField="true"]'),
				function(index, value) {
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
		// $(fieldElement).removeAttr("isEditor");
		$(fieldElement).trigger("create");
	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : CDLabel
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getCDLabelUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(EditorUIApi.editorDOM).find("#CDLabelEditor")
				.clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var idSuffix = $(fieldElement).attr("idSuffix");
		idSuffix = (idSuffix) ? idSuffix : "";

		var field1 = "CDLabelEditorLabel" + idSuffix;
		var field2 = "CDLabelEditorLabelHidden" + idSuffix;

		var fields = field1 + "," + field2;

		$(editorFragment).find("#CDLabelEditorLabel").text(editorLabel);

		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("id", $(value).attr("id") + idSuffix);
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		$(editorFragment).find("#CDLabelEditorLabel").attr("id",
				"CDLabelEditorLabel" + idSuffix);
		$(fieldElement).html($(editorFragment));
		// $(fieldElement).removeAttr("isEditor");
		$(fieldElement).trigger("create");
	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : II
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getIIUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(EditorUIApi.editorDOM).find("#IIEditor").clone();

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
					$(editorFragment).find("#IIroot").attr('value',
							result.value);
				}
				if (result.name == 'root.label') {
					$(editorFragment).find("#IIrootLabel").text(result.value);
				}
				if (result.name == 'root.editable') {
					if (result.value == "true") {
						$(editorFragment).find("#IIroot")
								.removeAttr('readonly');
					} else if ("false") {
						$(editorFragment).find("#IIroot").attr('readonly',
								"readonly");
					}
				}
				if (result.name == 'extension.editable') {
					if (result.value == "true") {
						$(editorFragment).find("#IIextension").removeAttr(
								'readonly');
					} else if ("false") {
						$(editorFragment).find("#IIextension").attr('readonly',
								"readonly");
					}
				}
				if (result.name == 'extension.label') {
					$(editorFragment).find("#IIextensionLabel").text(
							result.value);
				}
				if (result.name == 'assigningAuthorityName.value') {
					$(editorFragment).find("#IIassigningAuthorityName").attr(
							"value", result.value);
				}
				if (result.name == 'assigningAuthorityName.label') {
					$(editorFragment).find("#IIassigningAuthorityNameLabel")
							.text(result.value);
				}
				if (result.name == 'root.visible') {
					if (result.value == "true") {
						$(editorFragment).find("#IIroot").css('display',
								"block");
					} else if ("false") {
						$(editorFragment).find("#IIroot")
								.css('display', "none");
					}
				}
				if (result.name == 'assigningAuthorityName.readOnly') {
					if (result.value == "true") {
						$(editorFragment).find("#IIassigningAuthorityName")
								.removeAttr('readonly');
					} else if ("false") {
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
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : IIUserName
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getIIUserNameUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(EditorUIApi.editorDOM).find("#IIUserNameEditor")
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
					$(editorFragment).find("#IIUserNameExtension").css('width',
							result.value);
				}
				if (result.name == 'buttonWidth') {
					$(editorFragment).find("#button")
							.css('width', result.value);
				}
				if (result.name == 'validate') {
					$(editorFragment).find("#IIUserNameExtension").attr(
							'class', result.value);
				}
				if (result.name == 'root.editable') {
					if (result.value == "true") {
						$(editorFragment).find("#IIUserNameRoot").removeAttr(
								'readonly');
					} else {
						$(editorFragment).find("#IIUserNameRoot").attr(
								'readonly', "readonly");
					}
				}
				if (result.name == 'extension.editable') {
					if (result.value == "true") {
						$(editorFragment).find("#IIUserNameExtension")
								.removeAttr('readonly');
					} else if ("false") {
						$(editorFragment).find("#IIUserNameExtension").attr(
								'readonly', "readonly");
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
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : IIPassword
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getIIPasswordUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(EditorUIApi.editorDOM).find("#IIPasswordEditor")
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
					$(editorFragment).find("#IIPasswordExtension").css('width',
							result.value);
				}
				if (result.name == 'buttonWidth') {
					$(editorFragment).find("#button")
							.css('width', result.value);
				}
				if (result.name == 'validate') {
					$(editorFragment).find("#IIPasswordExtension").attr(
							'class', result.value);
				}
				if (result.name == 'root.editable') {
					if (result.value == "true") {
						$(editorFragment).find("#IIPasswordRoot").removeAttr(
								'readonly');
					} else {
						$(editorFragment).find("#IIPasswordRoot").attr(
								'readonly', "readonly");
					}
				}
				if (result.name == 'extension.editable') {
					if (result.value == "true") {
						$(editorFragment).find("#IIPasswordExtension")
								.removeAttr('readonly');
					} else if ("false") {
						$(editorFragment).find("#IIPasswordExtension").attr(
								'readonly', "readonly");
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
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : IIPassword
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getIIComboUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(EditorUIApi.editorDOM).find("#IIComboEditor")
				.clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var tagName = $(fieldElement).attr("tagName");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var fields = "IIComboRoot,IIComboExtension,IIComboAssigningAuthorityName";
		var instanceId = $(fieldElement).attr("instanceId");
		var events = [];

		$(editorFragment).find("#IIComboEditorLabel").text(editorLabel);
		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		if (configParamsObj) {
			$.each(configParamsObj, function(key, result) {
				if (result.name == 'conceptClass') {
					conceptClass = result.value;
					$(editorFragment).find("#IIComboRoot").attr('conceptClass',
							result.value);
				}
				if (result.name == 'lookupType') {
					$(editorFragment).find("#IIComboRoot").attr('lookupType',
							result.value);
				}
				if (result.name == 'lookupSelectType') {
					$(editorFragment).find("#IIComboRoot").attr(
							'lookupSelectType', result.value);
				}
				if (result.name == 'lookupControl') {
					$(editorFragment).find("#IIComboRoot").attr(
							'lookupControlType', result.value);
				}
				if (result.name == 'textBoxWidth') {
					$(editorFragment).find("#IIComboDisplayValue").css('width',
							result.value);
				}
				if (result.name == 'buttonWidth') {
					$(editorFragment).find("#button")
							.css('width', result.value);
				}
				if (result.name == 'class') {
					$(editorFragment).find("#IIComboExtension").attr('class',
							result.value);
				}
				if (result.name == 'root.editable') {
					if (result.value == "true") {
						$(editorFragment).find("#IIComboRoot").removeAttr(
								'readonly');
					} else {
						$(editorFragment).find("#IIComboRoot").attr('readonly',
								"readonly");
					}
				}
				if (result.name == 'extension.editable') {
					if (result.value == "true") {
						$(editorFragment).find("#IIComboExtension").removeAttr(
								'readonly');
					} else if ("false") {
						$(editorFragment).find("#IIComboExtension").attr(
								'readonly', "readonly");
					}
				}
				if (result.name == 'eventData') {
					events.push(result.value);
				}

			});
		}
		/*
		 * $(events).each(function(index, event){
		 * $(editorFragment).find('#'+event.fieldId).change(function() {
		 * if($(editorFragment).find('#'+event.fieldId+'
		 * option:selected').text() == event.comboText){
		 * fireEditorEvent(instanceId, event.eventName); } }); });
		 * 
		 * function fireEditorEvent(instanceId, eventName){ var serviceListener =
		 * editorUIApi.messageAndUIBinder.getEditorListener(instanceId,
		 * eventName); if(serviceListener){ var eventApi = (function(){
		 * this.editorFragment = $(editorFragment); this.configParamsObj =
		 * configParamsObj; this.instanceId = instanceId; var api = this;
		 * 
		 * this.getField = function(fieldName){ return
		 * api.editorFragment.find("#" + fieldName); };
		 * 
		 * this.getInstanceId = function(){ return api.instanceId; } });
		 * serviceListener(new eventApi); } }
		 */

		if (events && events.length !== 0) {
			var changeFieldId = "";
			var updateFieldId = "IIComboExtension";

			$.each(events, function(key, event) {
				changeFieldId = event.fieldId;
			});
			$(editorFragment).find("#" + changeFieldId).attr('eventUse',
					'eventChange');
			$(editorFragment).find("#" + updateFieldId).attr('eventUse',
					'eventUpdate');
			editorUIApi.eventHandler(events, changeFieldId, updateFieldId,
					editorFragment, instanceId, configParamsObj);
		}

		$(fieldElement).prepend($(editorFragment));

		$(fieldElement).trigger("create");
	};

	this.getIIPermissionUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(EditorUIApi.editorDOM).find(
				"#IIPermissionEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var tagName = $(fieldElement).attr("tagName");
		// var editorLabel = $(fieldElement).attr("editorLabel");
		var fields = "IIPermissionRoot,IIPermissionExtension,IIPermissionAssigningAuthorityName";
		var idSuffix = $(fieldElement).attr("idSuffix");
		// $(editorFragment).find("#IIPermissionRoot").text(editorLabel);
		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			/* $(value).attr("id", $(value).attr("id") + idSuffix); */
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

	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : CS
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getCSUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(EditorUIApi.editorDOM).find("#CSEditor").clone();
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
					$(editorFragment).find("#CSstatusCode").attr(
							'conceptClass', result.value);
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
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : CSInplace
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getCSInplaceUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(EditorUIApi.editorDOM).find("#CSInplaceEditor")
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
					$(editorFragment).find("#CSstatusCode").attr(
							'conceptClass', result.value);
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
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : TEL
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getTELUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(EditorUIApi.editorDOM).find("#TELEditor")
				.clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var tagName = $(fieldElement).attr("tagName");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var fields = "select-telecomUse,TELvalue";

		$(editorFragment).find("#TELEditorLabel").text(editorLabel);
		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
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
					$(editorFragment).find("#select-telecomUse").attr(
							'lookupType', result.value);
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
					$(editorFragment).find("#button")
							.css('width', result.value);
				}
				if (result.name == 'validate') {
					$(editorFragment).find("#TELDisplayValue").attr('class',
							result.value);
				}

			});
		}

		$(fieldElement).prepend($(editorFragment));
		$(fieldElement).trigger("create");
	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : TEL
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getTELInplaceUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(EditorUIApi.editorDOM).find("#TELInplaceEditor")
				.clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var tagName = $(fieldElement).attr("tagName");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var fields = "TELInplaceUse,TELInplaceValue";

		$(editorFragment).find("#TELInplaceEditorLabel").text(editorLabel);
		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		if (configParamsObj) {
			$.each(configParamsObj, function(key, result) {
				if (result.name == 'use') {
					$(editorFragment).find("#TELInplaceUse").attr('value',
							result.value);
				}
				if (result.name == 'textBoxWidth') {
					$(editorFragment).find("#TELInplaceValue").css('width',
							result.value);
				}
				if (result.name == 'validate') {
					$(editorFragment).find("#TELInplaceValue").attr('class',
							result.value);
				}
			});
		}

		$(fieldElement).prepend($(editorFragment));
		$(fieldElement).trigger("create");
	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : AD
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getADUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(EditorUIApi.editorDOM).find("#ADEditor").clone();
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
					$(editorFragment).find("#select-city").attr(
							'lookupSelectType', result.value);
				}
				if (result.name == 'cityLookupControl') {
					$(editorFragment).find("#select-city").attr(
							'lookupControlType', result.value);
				}

				if (result.name == 'stateConceptClass') {
					$(editorFragment).find("#select-state").attr(
							'conceptClass', result.value);
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
					$(editorFragment).find("#select-country").attr(
							'conceptClass', result.value);
					$(editorFragment).find("#select-country").attr('request',
							'client');
				}
				if (result.name == 'countryLookupType') {
					$(editorFragment).find("#select-country").attr(
							'lookupType', result.value);
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
				if (result.name == 'houseNumberLabel') {
					$(editorFragment).find("#ADhouseNumberLabel").text(
							result.value);
				}
				if (result.name == 'ADstreetName') {
					if (result.value == 'hide') {
						$(editorFragment).find("#ADstreetName").css('display',
								"none");
						$(editorFragment).find("#ADstreetNameLabel").css(
								'display', "none");
					}
				}
			});
		}

		$(fieldElement).prepend($(editorFragment));
		$(fieldElement).trigger("create");
	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : CE
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getCEUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(EditorUIApi.editorDOM).find("#CEEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var idSuffix = $(fieldElement).attr("idSuffix");
		var field1 = "select-choice" + idSuffix;
		var field2 = "CEDisplayName" + idSuffix;
		var field3 = "CEOriginalText" + idSuffix;
		var fields = field1 + "," + field2 + "," + field3;

		if (configParamsObj) {
			$.each(configParamsObj, function(key, result) {
				if (result.name == 'conceptClass') {
					conceptClass = result.value;
					$(editorFragment).find("#select-choice").attr(
							'conceptClass', result.value);
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
				if (result.name == 'validate') {
					$(editorFragment).find("#select-choice").attr('class',
							result.value);
				}
			});
		}
		$(editorFragment).find("#CELabel").text(editorLabel);
		if (!(editorLabel.indexOf(':') == -1)) {
			editorLabel = editorLabel.split(':')[0];
		}
		$(editorFragment).find("#CEDisplayName").attr('value', editorLabel);
		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		$(editorFragment).attr("idSuffix", idSuffix);
		$(editorFragment).find("#select-choice").attr("id", field1);
		$(editorFragment).find("#CEDisplayName").attr("id", field2);
		$(editorFragment).find("#CEOriginalText").attr("id", field3);

		$(editorFragment).find("#select-choice" + idSuffix).unbind('change',
				bindChangeEvent);
		$(editorFragment).find("#select-choice" + idSuffix).bind('change',
				bindChangeEvent);

		function bindChangeEvent() {
			var editorFragment = $(this).closest('[uiRole="editor"]')[0];
			var idSuffix = $(editorFragment).attr("idSuffix");
			$(editorFragment).find("#CEOriginalText" + idSuffix).attr("value",
					$(this).find('option:selected').text());
			$(editorFragment).find("#CEOriginalText" + idSuffix).trigger(
					'change');
		}

		$(fieldElement).prepend($(editorFragment));
		$(fieldElement).trigger("create");
	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : CE
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getCERegionUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(EditorUIApi.editorDOM).find("#CERegionEditor")
				.clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var idSuffix = $(fieldElement).attr("idSuffix");
		// var fields = "CERegionCode,CERegionDisplayName,select-country";
		var field1 = "CERegionCode" + idSuffix;
		var field2 = "CERegionDisplayName" + idSuffix;
		var field3 = "select-country" + idSuffix;
		var fields = field1 + "," + field2 + "," + field3;

		if (configParamsObj) {
			$.each(configParamsObj, function(key, result) {
				if (result.name == 'conceptClass') {
					conceptClass = result.value;
					$(editorFragment).find("#select-country").attr(
							'conceptClass', result.value);
					$(editorFragment).find("#select-country").attr('request',
							'client');
				}
				if (result.name == 'lookupType') {
					$(editorFragment).find("#select-country").attr(
							'lookupType', result.value);
				}
				if (result.name == 'lookupSelectType') {
					$(editorFragment).find("#select-country").attr(
							'lookupSelectType', result.value);
				}
				if (result.name == 'lookupControl') {
					$(editorFragment).find("#select-country").attr(
							'lookupControlType', result.value);
				}
				if (result.name == 'searchDivWidth') {
					$(editorFragment).find("#searchDiv").css('width',
							result.value);
				}
				if (result.name == 'validate') {
					$(editorFragment).find("#select-country").attr('class',
							result.value);
				}
			});
		}
		$(editorFragment).find("#CERegionEditorLabel").text(editorLabel);
		if (!(editorLabel.indexOf(':') == -1)) {
			editorLabel = editorLabel.split(':')[0];
		}
		$(editorFragment).find("#CERegionDisplayName").attr('value',
				editorLabel);

		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		$(editorFragment).attr("idSuffix", idSuffix);
		$(editorFragment).find("#CERegionCode").attr("id", field1);
		$(editorFragment).find("#CERegionDisplayName").attr("id", field2);
		$(editorFragment).find("#select-country").attr("id", field3);
		$(editorFragment).find("#select-countryList").attr("id",
				"select-country" + idSuffix + "List");

		$(editorFragment).find("#select-country" + idSuffix).unbind('change',
				bindChangeEvent);
		$(editorFragment).find("#select-country" + idSuffix).bind('change',
				bindChangeEvent);

		function bindChangeEvent() {
			var editorFragment = $(this).closest('[uiRole="editor"]')[0];
			var idSuffix = $(editorFragment).attr("idSuffix");
			$(editorFragment).find("#CERegionCode" + idSuffix).attr(
					"value",
					$(editorFragment).find("#select-country" + idSuffix).attr(
							"code"));
		}

		$(fieldElement).prepend($(editorFragment));
		$(fieldElement).trigger("create");
	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : CD
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getCDUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(EditorUIApi.editorDOM).find("#CDEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var conceptClass = null;

		if (configParamsObj) {
			$.each(configParamsObj, function(key, result) {
				if (result.name == 'conceptClass') {
					conceptClass = result.value;
					$(editorFragment).find("#select-choice").attr(
							'conceptClass', result.value);
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
				if (result.name == 'validate') {
					$(editorFragment).find("#select-choice").attr('class',
							result.value);
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

		$(editorFragment).find("#select-choice").attr('id',
				"select-choice" + conceptClass);

		$(fieldElement).prepend($(editorFragment));
		$(fieldElement).trigger("create");
	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : CD
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getCDProgramsUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(EditorUIApi.editorDOM).find("#CDProgramsEditor")
				.clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var conceptClass = null;

		if (configParamsObj) {
			$.each(configParamsObj, function(key, result) {
				if (result.name == 'conceptClass') {
					conceptClass = result.value;
					$(editorFragment).find("#CDProgramsCode").attr(
							'conceptClass', result.value);
				}
				if (result.name == 'lookupType') {
					$(editorFragment).find("#CDProgramsCode").attr(
							'lookupType', result.value);
				}
				if (result.name == 'lookupSelectType') {
					$(editorFragment).find("#CDProgramsCode").attr(
							'lookupSelectType', result.value);
				}
				if (result.name == 'lookupControl') {
					$(editorFragment).find("#CDProgramsCode").attr(
							'lookupControlType', result.value);
				}
			});
		}
		var fields = 'CDProgramsCode,CDProgramsDisplayName';

		$(editorFragment).find("#CDProgramsEditorLabel").text(editorLabel);
		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		$(editorFragment).find('[nameType="shortName"]').each(
				function(index, program) {
					$(program).unbind('click', bindProgramSelection);
					$(program).bind('click', bindProgramSelection);
				});

		function bindProgramSelection() {
			var editorFragment = $(this).closest('[uiRole="editor"]')[0];
			$(editorFragment).find("#CDProgramsCode").attr("value", "");
			$(editorFragment).find("#CDProgramsDisplayName").attr("value", "");
			if ($(this).find(".ui-cursor-point").hasClass('program-highlight')) {
				$(this).find(".ui-cursor-point").removeClass(
						"program-highlight");
			} else {
				$(editorFragment).find(".ui-cursor-point").removeClass(
						"program-highlight");
				$(this).find(".ui-cursor-point").addClass("program-highlight");

				var processName = $(this).attr("program");
				var shortName = $(this).find('[nameType="name"]').html();
				$(editorFragment).find("#CDProgramsCode").attr("value",
						processName);
				$(editorFragment).find("#CDProgramsDisplayName").attr("value",
						shortName);

				$(editorFragment).find("#CDProgramsDisplayName").trigger(
						"change");
				$(editorFragment).find("#CDProgramsCode").trigger("change");
			}
		}
		$(fieldElement).prepend($(editorFragment));
		$(fieldElement).trigger("create");
	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : CVListThreeTextbox
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getCVListThreeTextboxUI = function(fieldElement, configParamsObj) {
		var configPathField = $(fieldElement).attr("configPathField");
		var dataType = $(fieldElement).attr("dataType");
		var editorFragment = $(EditorUIApi.editorDOM).find(
				"#CVListThreeTextboxEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var editorType = $(fieldElement).attr("editorType");
		var tagName = $(fieldElement).attr("tagName");
		var fields = "CVListTextboxYear,CVListTextboxYearLabel,CVListTextboxReason,CVListTextboxReasonLabel,CVListTextboxHospital,CVListTextboxHospitalLabel";
		var idSuffix = $(fieldElement).attr("idSuffix");

		$(editorFragment).find("#CVListThreeTextboxEditorLabel").text(
				editorLabel);

		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		$.each($(editorFragment).find('[hasToggle="true"]'), function(index,
				value) {
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
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : CVListTwoTextbox
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getCVListTwoTextboxUI = function(fieldElement, configParamsObj) {
		var configPathField = $(fieldElement).attr("configPathField");
		var dataType = $(fieldElement).attr("dataType");
		var editorFragment = $(EditorUIApi.editorDOM).find(
				"#CVListTwoTextboxEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var editorType = $(fieldElement).attr("editorType");
		var tagName = $(fieldElement).attr("tagName");
		var fields = "CVListTextboxDrug,CVListTextboxDrugLabel,CVListTextboxReaction,CVListTextboxReactionLabel";
		var idSuffix = $(fieldElement).attr("idSuffix");

		$(editorFragment).find("#CVListTwoTextboxEditorLabel")
				.text(editorLabel);

		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		$.each($(editorFragment).find('[hasToggle="true"]'), function(index,
				value) {
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
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : CVListTextbox
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getCVListTextboxUI = function(fieldElement, configParamsObj) {
		var configPathField = $(fieldElement).attr("configPathField");
		var dataType = $(fieldElement).attr("dataType");
		var editorFragment = $(EditorUIApi.editorDOM).find(
				"#CVListTextboxEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var editorType = $(fieldElement).attr("editorType");
		var tagName = $(fieldElement).attr("tagName");
		var fields = "CVListTextboxHealth,CVListTextboxHealthLabel";
		var idSuffix = $(fieldElement).attr("idSuffix");

		$(editorFragment).find("#CVListTextboxEditorLabel").text(editorLabel);

		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		$.each($(editorFragment).find('[isEditor="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
			$(value).attr("editorType", editorType);
		});
		if (configParamsObj) {
			$.each(configParamsObj, function(key, configParam) {
				if (configParam.name == 'width') {
					$(editorFragment).css("width", configParam.value);
				}
			});
		}

		$(editorFragment).attr("idSuffix", idSuffix);
		$(fieldElement).prepend(editorFragment);
		$(fieldElement).trigger("create");

	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : CVListTextarea
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getCVListTextareaUI = function(fieldElement, configParamsObj) {
		var configPathField = $(fieldElement).attr("configPathField");
		var dataType = $(fieldElement).attr("dataType");
		var editorFragment = $(EditorUIApi.editorDOM).find(
				"#CVListTextareaEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var editorType = $(fieldElement).attr("editorType");
		var tagName = $(fieldElement).attr("tagName");
		var fields = "CVListTextareaList,CVListTextareaEditorLabel";
		var idSuffix = $(fieldElement).attr("idSuffix");

		$(editorFragment).find("#CVListTextareaEditorLabel").text(editorLabel);

		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		$.each($(editorFragment).find('[hasToggle="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
			$(value).attr("editorType", editorType);
		});

		/*
		 * var configPathFieldObj =
		 * updatePathfield.getPathFieldObject(fieldElement); var pathFields =
		 * updatePathfield.getPathField(configPathFieldObj);
		 */

		$(editorFragment).attr("idSuffix", idSuffix);
		$(fieldElement).prepend(editorFragment);
		$(fieldElement).trigger("create");

	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : CVListTextarea
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getGridUI = function(fieldElement, configParamsObj) {
		var editorType = $(fieldElement).attr("editorType");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var configPathField = $(fieldElement).attr("configPathField");
		var dataType = $(fieldElement).attr("dataType");
		var tagName = $(fieldElement).attr("tagName");
		var idSuffix = $(fieldElement).attr("idSuffix");
		var groupId = $(fieldElement).attr("groupId");
		var gridEditorType = $(fieldElement).attr("gridEditorType");
		var instanceId = $(fieldElement).attr("instanceId");
		var pathFields = $(fieldElement).attr("pathFields");
		var gridId = $(fieldElement).attr("id");

		// var configPathFieldObj =
		// updatePathfield.getPathFieldObject(fieldElement);
		// var pathFields = updatePathfield.getPathField(configPathFieldObj);

		var gridFragment = $(EditorUIApi.editorDOM).find(
				"#" + editorType + "Editor").clone();
		var wrapper = $(gridFragment).find('[uiRole="gridContent"]')[0];
		$(wrapper).attr("configPathField", configPathField);
		$(wrapper).attr("idSuffix", idSuffix);

		$(wrapper).attr("isEditor", true);
		$(wrapper).attr("dataType", dataType);
		$(wrapper).attr("tagName", tagName);
		$(wrapper).attr("pathFields", pathFields);
		$(wrapper).attr("editorType", gridEditorType);
		$(wrapper).attr("groupId", groupId);
		// $(wrapper).attr("id", gridId+"Content"+idSuffix);

		$(fieldElement).removeAttr('isEditor');
		$(fieldElement).removeAttr('groupId');

		// var gridContent = $(gridFragment).children()[0];
		$(wrapper).find("#gridLabel").text(editorLabel);
		var gridContent = $(gridFragment).find("#editor");

		$(gridFragment).attr("editorType", gridEditorType);
		$(gridContent).attr("pathFields", pathFields);
		$(gridContent).attr("editorLabel", " ");
		$(gridContent).attr("configPathField", configPathField);
		$(gridContent).attr("dataType", dataType);
		$(gridContent).attr("tagName", tagName);
		$(gridContent).attr("idSuffix", idSuffix);
		$(gridContent).attr("editorType", gridEditorType);
		$(gridContent).attr("instanceId", instanceId);

		$(gridFragment).find("#addButton").attr("idSuffix", idSuffix);
		$(gridFragment).find("#addButton").attr("configPathField",
				configPathField);
		$(gridFragment).find("#addButton").css("display", "block");
		$(gridFragment).find("#removeButton").css("display", "none");

		$(fieldElement).html(gridFragment);

		$(gridFragment).find("#addButton").click(function() {

			var idSuffix = $(this).attr("idSuffix");
			editorUIApi.addGridEditor(gridFragment, idSuffix);
		});

		var methodName = ('get' + gridEditorType + 'UI');

		if (methodName in editorUIApi) {
			try {
				eval('editorUIApi.' + methodName
						+ '(gridContent, configParamsObj)');
			} catch (error) {
				return;
			}
		}

		/* making the display textBox width 100% */
		$(gridFragment).find('[hasToggle="true"]').each(function(key, field) {
			$(field).css('width', '99%');
		});

		/* giving 100% width to the subEditor */
		var subEditor = $(gridFragment).find('[id="SubEditor"]')[0];
		if (subEditor) {
			$(subEditor).css("width", "100%");
		}

		this.getField = function(fieldId, rowIndex) {
			var gridContentArray = new Array();
			gridContentArray = $(gridFragment).find('[uiRole="gridContent"]');
			var editor = gridContentArray[(rowIndex - 1)];
			var field = $(editor).find('#' + fieldId);
			return $(field);
		}

		$(gridFragment).trigger('create');
	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : EDImage
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getEDImageUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(EditorUIApi.editorDOM).find("#EDImageEditor")
				.clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var fields = "EDthumbnail";

		$(editorFragment).find("#EDImageEditorLabel").text(editorLabel);
		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		if (configParamsObj) {
			$.each(configParamsObj, function(key, configParam) {
				if (configParam.name == 'image') {
					$(editorFragment).find("#EDthumbnailBox").attr("src",
							configParam.value);
				}
			});
		}

		$(fieldElement).html($(editorFragment));
		// $(fieldElement).removeAttr("isEditor");
		$(fieldElement).trigger("create");
	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : EDImage
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getEDFileAttachmentUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(EditorUIApi.editorDOM).find(
				"#EDFileAttachmentEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var fields = "EDthumbnail,EDMediaType,EDReference,EDLanguage";
		var idSuffix = $(fieldElement).attr("idSuffix");

		$(editorFragment).find("#EDFileAttachmentEditorLabel")
				.text(editorLabel);
		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		if (configParamsObj) {
			$.each(configParamsObj, function(key, configParam) {
				if (configParam.name == 'displayId') {
					$(editorFragment).find("#displayFile").attr("displayId",
							configParam.value);
				}
				if (configParam.name == 'fileImage') {
					$(editorFragment).find("#EDthumbnailBox").attr("src",
							configParam.value);
				}
				if (configParam.name == 'formName') {
					$(editorFragment).find("#formName").attr("value",
							configParam.value);
				}
				if (configParam.name == 'documentType') {
					$(editorFragment).find("#documentType").attr("value",
							configParam.value);
				}
			});
		}

		/*
		 * if(idSuffix){
		 * $(editorFragment).find("#EDthumbnailBox").attr("onclick",
		 * "$('#EDFileAttachmentThumbnail"+idSuffix+"').trigger('click')");
		 * 
		 * $(editorFragment).find("#EDFileAttachmentThumbnail").attr("id","EDFileAttachmentThumbnail"+idSuffix);
		 * }else{ }
		 */

		$(editorFragment).find("#EDthumbnailBox").attr("onclick", "");

		$(editorFragment).find("#EDthumbnailBox")
				.click(
						function() {
							var editorFragment1 = $(this).closest(
									'[uiRole="editor"]')[0];
							$(editorFragment1).find(
									"#EDFileAttachmentThumbnail").trigger(
									"click");

							$(editorFragment1).find(
									"#EDFileAttachmentThumbnail").unbind(
									'change');
							$(editorFragment1).find(
									"#EDFileAttachmentThumbnail").bind(
									'change', bindChangeEventtListener);
						});

		function bindChangeEventtListener() {
			var editorFragment = $(this).closest('[uiRole="editor"]')[0];
			bindChangeEvent(editorFragment);
		}
		;

		function bindChangeEvent(editorFragment) {
			var iframe = $('<iframe name="postiframe" id="postiframe" style="display: none" />');
			$(editorFragment).append(iframe);
			var form = $(editorFragment).find('#docAttachmentForm');
			form.attr("method", "post");
			form.attr("enctype", "multipart/form-data");
			form.attr("encoding", "multipart/form-data");
			form.attr("target", "postiframe");
			form.attr("file", $('#fileId').val());
			$(editorFragment).find("#docAttachmentForm").attr("action",
					"/hin-web/rest/FileUploadController");
			$(editorFragment).find('#loadingFile').show();
			$(editorFragment).find('#EDfileAttach').hide();
			form.submit();

			function loadEventListener() {
				bindLoadEvent(editorFragment)
			}
			;

			$(editorFragment).find("#postiframe").unbind('load',
					loadEventListener);
			$(editorFragment).find("#postiframe").bind('load',
					loadEventListener);
			return false;
		}

		function bindLoadEvent(editorFragment) {
			var response = $(editorFragment).find("#postiframe").contents()
					.find("body").text();
			var data = null;

			try {
				data = JSON.parse(response);
				console.log("Parsed extracted values");
			} catch (jsonError) {
				console
						.log("Error while parsing JSON of extracted values from the server: "
								+ jsonError);
				data = {};
			}

			$(editorFragment).find("#postiframe").remove();
			if (data && !(data.errorMessage)) {
				$(editorFragment).find('#EDfileAttach').show();
				$(editorFragment).find("#displayError").hide();
				$(editorFragment).find('#loadingFile').hide();
				$(editorFragment).find("#EDfileAttach").css("display", "block");
				$(editorFragment).find("#EDMediaTypeSize").text(data.fileSize);
				$(editorFragment).find("#EDMediaTypeType").attr("value",
						data.fileType);
				$(editorFragment).find("#EDLanguage").text(data.fileName);

				var mediaTypeValue = data.fileType + "," + data.fileSize;
				$(editorFragment).find("#EDMediaType").attr("value",
						mediaTypeValue);
				$(editorFragment).find("#EDReference").attr("value",
						data.messageId);

				$(editorFragment).find("#EDMediaType").trigger("change");
				$(editorFragment).find("#EDLanguage").trigger("change");
				$(editorFragment).find("#EDReference").trigger("change");

				if ($(editorFragment).find('#openButton').attr('disabled') == "disabled") {
					$(editorFragment).find('#openButton').button('enable');
				}
				if ($(editorFragment).find('#downloadButton').attr('disabled') == "disabled") {
					$(editorFragment).find('#downloadButton').button('enable');
				}

				$(editorFragment).find("#openButton").unbind('click');
				$(editorFragment).find("#openButton").bind('click', function() {
					openAttachedFile(data.messageId, editorFragment)
				});
				$(editorFragment).find("#downloadButton").unbind('click');
				$(editorFragment).find("#downloadButton")
						.bind(
								'click',
								function() {
									downloadAttachedFile(data.messageId,
											editorFragment)
								});
			} else {
				$(editorFragment).find("#displayError").show();
				$(editorFragment).find("#displayError").html(data.errorMessage);
			}

			// alert("data: "+data.extractedValues);
			var uploadListener = editorUIApi.messageAndUIBinder
					.getEditorListener("upload", "uploadListener");
			if (uploadListener) {
				uploadListener(data.extractedValues);
			}

		}
		$(editorFragment).find("#openButton").unbind('click');
		$(editorFragment).find("#openButton").bind('click',
				openAttachedFileEventListener);

		$(editorFragment).find("#downloadButton").unbind('click');
		$(editorFragment).find("#downloadButton").bind('click',
				downloadAttachedFileEventListener);

		function openAttachedFileEventListener() {
			var editorFragment = $(this).closest('[uiRole="editor"]')[0];
			openAttachedFile($(editorFragment).find("#EDReference").attr(
					"value"), editorFragment);
		}
		;

		function downloadAttachedFileEventListener() {
			var editorFragment = $(this).closest('[uiRole="editor"]')[0];
			downloadAttachedFile($(editorFragment).find("#EDReference").attr(
					"value"), editorFragment);
		}
		;

		function openAttachedFile(messageId, editorFragment) {
			$(editorFragment).find("#openButton").prev('span').find(
					'span.ui-btn-text').text("Close")
			var displayId = "displayFile";
			if ($(editorFragment).find("#displayFile").attr("displayId")) {
				var id = $(editorFragment).find("#displayFile").attr(
						"displayId");
				$('#' + id).html("");
			}
			var contentType = $(editorFragment).find("#EDMediaTypeType").attr(
					"value");

			$(editorFragment).find('#' + displayId).css('display', 'block');
			var fileUrl = AppConstants.URL.GetFileAttachment + '?messageId='
					+ messageId;
			$(editorFragment).find('#' + displayId).html(
					'<object width="100%" height="500px" type="' + contentType
							+ '"' + ' data="' + fileUrl + '" id="pdf_content">'
							+ '<p>Could not get the File.</p></object>');
			$(editorFragment).find('#' + displayId).css("height", "auto");

			$(editorFragment).find("#openButton").unbind('click');
			$(editorFragment).find("#openButton").bind('click',
					toggleFileDisplay);
			function toggleFileDisplay() {
				$(editorFragment).find('#' + displayId).toggle();
				if ($(editorFragment).find('#' + displayId).css("display") == "none") {
					$(editorFragment).find("#openButton").prev('span').find(
							'span.ui-btn-text').text("Open")
				}
				if ($(editorFragment).find('#' + displayId).css("display") == "block") {
					$(editorFragment).find("#openButton").prev('span').find(
							'span.ui-btn-text').text("Close")
				}
			}
		}
		;

		function downloadAttachedFile(messageId, editorFragment) {
			$(editorFragment).find("#postDownloadIframe").remove();
			$(editorFragment).find('#messageId').attr("value", messageId);
			var iframe = $('<iframe name="postDownloadIframe" id="postDownloadIframe" style="display: none" />');
			$(editorFragment).append(iframe);

			var form = $(editorFragment).find('#docDownloadForm');
			form.attr("method", "post");
			form.attr("enctype", "multipart/form-data");
			form.attr("encoding", "multipart/form-data");
			form.attr("target", "postDownloadIframe");
			form.attr("file", $('#fileId').val());
			$(editorFragment).find("#docDownloadForm").attr("action",
					"/hin-web/rest/downloadFileAttachment");
			form.submit();
		}
		;

		$(fieldElement).html($(editorFragment));
		$(fieldElement).trigger("create");
	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : TS
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getTSUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(EditorUIApi.editorDOM).find("#TSEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var fields = "TSbirthTime";

		$(editorFragment).find("#TSEditorLabel").text(editorLabel);
		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		if (configParamsObj) {
			$
					.each(
							configParamsObj,
							function(key, configParam) {
								if (configParam.name == 'width') {
									$(editorFragment).css("width",
											configParam.value);
								}
								if (configParam.name == 'validate') {
									$(editorFragment).find("#TSbirthTime")
											.attr("class", configParam.value);
								}
								if (configParam.name == 'data-options') {
									if (configParam.value == 'flipbox') {
										$(editorFragment)
												.find("#TSbirthTime")
												.attr(
														"data-options",
														"{\"mode\":\"flipbox\",\"noButtonFocusMode\":true,\"dateFormat\": \"YYYY-MM-DD\"}");
									} else if (configParam.value == 'timeflipbox') {
										$(editorFragment)
												.find("#TSbirthTime")
												.attr(
														"data-options",
														"{\"mode\":\"timeflipbox\",\"noButtonFocusMode\":true,\"dateFormat\": \"YYYY-MM-DD\"}");
									} else if (configParam.value == 'slidebox') {
										$(editorFragment)
												.find("#TSbirthTime")
												.attr(
														"data-options",
														"{\"mode\":\"slidebox\",\"noButtonFocusMode\":true,\"overrideDateFormat\":\"%Y-%m-%dT%I:%M%p\", \"overrideTimeFormat\":12, \"overrideSlideFieldOrder\":[\"y\",\"m\",\"d\",\"h\",\"i\"]}");
									} else if (configParam.value == 'timeslidebox') {
										$(editorFragment)
												.find("#TSbirthTime")
												.attr(
														"data-options",
														"{\"mode\":\"timeslidebox\",\"noButtonFocusMode\":true,\"overrideDateFormat\":\"%Y-%m-%dT%I:%M%p\", \"overrideTimeFormat\":12, \"overrideSlideFieldOrder\":[\"y\",\"m\",\"d\",\"h\",\"i\"]}");
									}
								}
								if (configParam.name == 'beforeToday') {
									$(editorFragment)
											.find("#TSbirthTime")
											.attr(
													"data-options",
													'{"mode":"calbox", "calUsePickers": true, "calNoHeader": true, "dateFormat": "YYYY-MM-DD", "beforeToday": '
															+ configParam.value
															+ '}');
								}
								if (configParam.name == 'afterToday') {
									$(editorFragment)
											.find("#TSbirthTime")
											.attr(
													"data-options",
													'{"mode":"calbox", "calUsePickers": true, "calNoHeader": true, "dateFormat": "YYYY-MM-DD", "afterToday": '
															+ configParam.value
															+ '}');
								}
							});
		}

		$(fieldElement).prepend($(editorFragment));
		$(fieldElement).trigger("create");

	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : Calendar
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getCalendarUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(EditorUIApi.editorDOM).find("#CalendarEditor")
				.clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var page = $(fieldElement).attr("page");
		var calendarPage = "calendarPage";
		var fields = "cFrom,cTo";
		var calendarId = "calendarData";

		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
			$(value).attr("page", page);
			// $(value).attr("showEditor",calendarPage);
		});

		$(fieldElement).html($(editorFragment));
		// $(fieldElement).removeAttr("isEditor");
		$(fieldElement).trigger("create");
		$(fieldElement).find('#' + calendarId).unbind("click",
				calendarClickHandler);
		$(fieldElement).find('#' + calendarId).bind("click",
				calendarClickHandler);

		var appointmentSchedule = null;
		function calendarClickHandler(event) {
			var object = null;
			var flag = true;
			if ($(fieldElement).find('#' + calendarId).attr("value")) {
				object = currentScheduled();
			}
			editorUIApi.messageAndUIBinder.makeQueryForLucene();
			flag = getPreviousConsultant();
			if (!flag) {
				return;
			}
			// editorUIApi.messageAndUIBinder.makeQueryForCassandra();
			// alert("Html :"+$(fieldElement).attr("page"));
			var page = $(fieldElement).attr("page")
			$('#' + calendarPage).show();
			$("#" + page).hide();
			if (!appointmentSchedule) {
				appointmentSchedule = new HIN.AppointmentSchedule(
						"calendarPage",
						true,
						function(appointmentVO) {
							$(fieldElement)
									.find('#' + calendarId)
									.val(
											CommonUtil
													.dateFormat(
															parseDate(appointmentVO.start),
															"fullDateMinute")
													+ " to "
													+ CommonUtil
															.dateFormat(
																	parseDate(appointmentVO.end),
																	"fullDateMinute"));
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
			} else {
				appointmentSchedule.loadFullCalendar(object);
			}
			function getPreviousConsultant() {
				var context = appController.getComponent("Context");
				if (context) {
					var presentCons = $(
							'#'
									+ editorUIApi.messageAndUIBinder.parentContainerID)
							.find('[id="IIextension"]').attr("value");

					var consultant = context.getConsultant();
					if (presentCons == undefined || presentCons == ''
							|| presentCons == null) {
						notificationmsg.success("Please select Physician");
						return false;
					}
				}
				return true;
			}
			;
			function currentScheduled() {
				var patient = "";
				var patientId, physicisnName = "";
				var start = $(fieldElement).find('#cFrom').attr("value");
				var end = $(fieldElement).find('#cTo').attr("value");
				var color = $(
						'#' + editorUIApi.messageAndUIBinder.parentContainerID)
						.find('#colorValue').attr("value");
				var comment = $(
						'#' + editorUIApi.messageAndUIBinder.parentContainerID)
						.find('#commentsValue').attr("value");
				var physicisnId = $(
						'#' + editorUIApi.messageAndUIBinder.parentContainerID)
						.find('[id="IIextension"]').attr("value");
				physicisnName = $(
						'#' + editorUIApi.messageAndUIBinder.parentContainerID)
						.find('[id="pPhysician"]').attr("value");

				var patientVO = appController.getComponent("Context")
						.getPatientVO();
				if (patientVO) {
					patient = patientVO.name;
					patientId = patientVO.subscriberId;
				}
				var appointmentVO = new HIN.AppointmentVO();
				appointmentVO.patientId = patientId;
				appointmentVO.start = start;
				appointmentVO.end = end;
				appointmentVO.allDay = false;
				appointmentVO.reason = color;
				appointmentVO.backgroundColor = color;
				appointmentVO.comment = comment;
				appointmentVO.title = patient;
				appointmentVO.doctorId = physicisnId;
				appointmentVO.doctor = physicisnName;
				appointmentVO.isCurrent = true;
				return appointmentVO;
			}
			;
		}
		;

	};

	/**
	 * Concatenates the values in the subEditor for editorType :Calendar
	 * 
	 * @param fieldEditor :
	 *            HTML Fragment that contains the display textBox and the
	 *            SubEditor
	 * @returns {String} : concatenated String of the values in the subEditor
	 */
	this.getCalendarValues = function(fieldEditor) {
		var cFrom = $(fieldEditor).find("#cFrom").attr("value");

		var cTo = $(fieldEditor).find("#cTo").attr("value");
		var val = '';
		if (cFrom != undefined && cFrom != '' && cTo != undefined && cTo != '') {
			val = CommonUtil
					.dateFormat(parseDate(cFrom) + "", "fullDateMinute")
					+ " to "
					+ CommonUtil.dateFormat(parseDate(cTo) + "",
							"fullDateMinute");
		}
		return val;
	};
	this.getPhysicianLookupValues = function(fieldEditor) {
		// var consultant = $(fieldEditor).find("#consultant").attr("value");
		// var pPhysician = $(fieldEditor).find("#pPhysician").attr("value");
		var prefix = $(fieldEditor).find("#PNCompletePrefixCombo").find(
				'[value="' + prefixValue + '"]').text();
		var family = $(fieldEditor).find("#PNfamily").attr("value");
		var given = $(fieldEditor).find("#PNgiven").attr("value");
		var suffix = $(fieldEditor).find("#PNsuffix").attr("value");
		var value = "";
		if (prefix) {
			value = prefix;
		}
		if (given) {
			value += " " + given;
		}
		if (family) {
			value += " " + family;
		}
		if (suffix) {
			value += " " + suffix;
		}

		return pPhysician;
	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : CDInplace
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getCDInplaceUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(EditorUIApi.editorDOM).find("#CDInplaceEditor")
				.clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var idSuffix = $(fieldElement).attr("idSuffix");
		idSuffix = (idSuffix) ? idSuffix : "";
		var field1 = "commentsValue" + idSuffix;
		var field2 = "null";
		var fields = field1 + "," + field2;

		if (editorLabel) {
			$(editorFragment).find("#CDInplaceEditorLabel").text(editorLabel);
		}
		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
			$(value).removeAttr("isEditor");
			var id = $(value).attr("id");
			$(value).attr("id", id + idSuffix);
		});

		$(fieldElement).prepend($(editorFragment));
		// $(fieldElement).removeAttr("isEditor");
		$(fieldElement).trigger("create");
		// $("#comments").val(appointmentVO.start);
	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : CEInplace
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getCEInplaceUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(EditorUIApi.editorDOM).find("#CEInplaceEditor")
				.clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var fields = "reasonValue,null";
		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		if (configParamsObj) {
			$.each(configParamsObj, function(key, result) {
				if (result.name == 'textBoxBackground') {
					$(editorFragment).find("#reasonValue").css('background',
							result.value);
				}
			});
		}

		this.getField = function(fieldId, rowIndex) {
			var field = $(editorFragment).find("#" + fieldId);
			return $(field);
		}

		if (editorLabel) {
			$(editorFragment).find("#reasonValue").attr('value', editorLabel);
		}

		$(fieldElement).prepend($(editorFragment));
		$(fieldElement).trigger("create");

		// $(fieldElement).removeAttr("isEditor");
		// $(fieldElement).trigger("change");
		// $("#comments").val(appointmentVO.start);
	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI also loads the look up values for for
	 * "physician" editorType : PhysicianLookup
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getPhysicianLookupUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(EditorUIApi.editorDOM).find(
				"#PhysicianLookupEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var fields = "pPhysician";
		var fieldsId = "consultant";
		var suggestionId = "pPhysicianSuggestions";

		$
				.each(
						$(editorFragment).find('[dataField="true"]'),
						function(index, value) {
							$(value).attr("dataType", dataType);
							$(value).attr("pathFields", pathFields);
							$(value).attr("tagName", tagName);
							$(value)
									.attr("fields",
											"PNCompleteNameTypeCombo,PNCompletePrefixCombo,PNgiven,PNfamily,PNsuffix");
						});

		if (configParamsObj) {
			$.each(configParamsObj, function(key, result) {
				if (result.name == 'prefixConceptClass') {
					$(editorFragment).find("#PNCompletePrefixCombo").attr(
							'conceptClass', result.value);
				}
				if (result.name == 'prefixLookupType') {
					$(editorFragment).find("#PNCompletePrefixCombo").attr(
							'lookupType', result.value);
				}
				if (result.name == 'prefixLookupSelectType') {
					$(editorFragment).find("#PNCompletePrefixCombo").attr(
							'lookupSelectType', result.value);
				}
				if (result.name == 'prefixLookupControl') {
					$(editorFragment).find("#PNCompletePrefixCombo").attr(
							'lookupControlType', result.value);
				}

				if (result.name == 'nameUseConceptClass') {
					$(editorFragment).find("#PNCompleteNameTypeCombo").attr(
							'conceptClass', result.value);
				}
				if (result.name == 'nameUseLookupType') {
					$(editorFragment).find("#PNCompleteNameTypeCombo").attr(
							'lookupType', result.value);
				}
				if (result.name == 'nameUseLookupSelectType') {
					$(editorFragment).find("#PNCompleteNameTypeCombo").attr(
							'lookupSelectType', result.value);
				}
				if (result.name == 'nameUseLookupControl') {
					$(editorFragment).find("#PNCompleteNameTypeCombo").attr(
							'lookupControlType', result.value);
				}

			});
		}

		/*
		 * var searchVO = new HIN.SearchVO();
		 * searchVO.type=AppConstants.SearchType.PHYSICIAN_PROFILE_SEARCH;
		 * searchVO.serverURI = "/hin-web/rest/search/entitySearch";
		 * searchVO.role = "doctor"; var searchValue = "R"; searchVO.value =
		 * searchValue.replace(/^\s+|\s+$/g, "");
		 */

		$(fieldElement).html($(editorFragment));

		$(fieldElement).trigger("create");
		/*
		 * appController.getComponent("DataLayer").search(searchVO,null,
		 * fillAutoComplete);
		 */
		$(editorFragment).find('[data-role="listview"]').attr("id",
				suggestionId);

		$(editorFragment).find('#' + fields).unbind("click",
				physicianLookupClickHandler);
		$(editorFragment).find('#' + fields).bind("click",
				physicianLookupClickHandler);

		var searchVO = new HIN.SearchVO();
		searchVO.type = AppConstants.SearchType.PHYSICIAN_PROFILE_SEARCH;
		searchVO.serverURI = "/hin-web/rest/search/entitySearchWithCondtion";
		searchVO.role = "doctor";
		searchVO.messageType = AppConstants.XPaths.Registrtion.MESSAGE_TYPE;// "PRPA_MT201000HT03";

		function physicianLookupClickHandler(data) {

			if ($(editorFragment).find("#" + suggestionId).html()) {
				$(editorFragment).find("#" + suggestionId).html('');
			} else {
				new HIN.AutoCompleteSearch().search($(editorFragment).find(
						"#" + fields), $(editorFragment).find(
						"#" + suggestionId), searchVO, showSelectedValue);
			}
		}
		;
		function showSelectedValue(data) {
			var physicianVO = data;
			$(fieldElement).find("#" + fields).val(physicianVO.name);
			$(fieldElement).find("#" + fields).trigger("change");
			$('#' + editorUIApi.messageAndUIBinder.parentContainerID).find(
					'[id="IIroot"]').attr("value", "SUBSCRIBER_ID").trigger(
					"change");
			$('#' + editorUIApi.messageAndUIBinder.parentContainerID).find(
					'[id="IIextension"]')
					.attr("value", physicianVO.physicianId).trigger("change");

			$(fieldElement).find('#PNCompletePrefixCombo').find('option').each(
					function(key, option) {
						if ($(option).attr('value') == physicianVO.prefixName) {
							$(option).attr("selected", "selected");
						}
					});
			$(fieldElement).find("#select-prefix").trigger("change");

			// $(fieldElement).find('[id="select-prefix"]').attr("value",physicianVO.prefixName).trigger("change");
			$(fieldElement).find('[id="PNgiven"]').attr("value",
					physicianVO.givenName).trigger("change");
			$(fieldElement).find('[id="PNfamily"]').attr("value",
					physicianVO.familyName).trigger("change");
			$(fieldElement).find('[id="PNsuffix"]').attr("value",
					physicianVO.suffixName).trigger("change");
			// $('#' +
			// editorUIApi.messageAndUIBinder.parentContainerID).find('[id="PNDisplayValue"]').attr("value",physicianVO.name);

			$('#' + editorUIApi.messageAndUIBinder.parentContainerID).find(
					'[id="IIextension"]').trigger("change");
			// $('#' +
			// editorUIApi.messageAndUIBinder.parentContainerID).find('[id="PNgiven"]').trigger("change");

			var physicianListener = editorUIApi.messageAndUIBinder
					.getEditorListener("physicianChange", "physicianListener");
			if (physicianListener)
				physicianListener(physicianVO);

			// appController.getComponent("Context").setConsultant(physicianVO.physicianId);
			// appController.getComponent("Context").setConsultantName(physicianVO.name);
			// appController.getComponent("Context").setPhysicianVO(physicianVO);
		}
		;

		/*
		 * function physicianLookupClickHandler(data) { //alert("Form Parent: " +
		 * bindPhysicianLookups);
		 * $(editorFragment).find("#"+fields).autocomplete({ target :
		 * $(editorFragment).find("#" + suggestionId), source :
		 * bindPhysicianLookups, callback : function(e) { var $a =
		 * $(e.currentTarget); // access the selected item var value =
		 * physicianLookupMap.get($a.text()).value; $(fieldElement).find("#" +
		 * fields).val($a.text()); $(fieldElement).find("#" +
		 * fieldsId).val(value); $(fieldElement).find("#" +
		 * fields).trigger("create"); $(fieldElement).find("#" +
		 * fields).trigger("change"); $(fieldElement).find("#" +
		 * fields).autocomplete('clear');
		 * appController.getComponent("Context").setConsultant(value);
		 * appController.getComponent("Context").setConsultantName($a.text());
		 * //alert("value: " + value + ", $a.text(): " + $a.text()); },
		 * minLength : 1 }); } ;
		 */
	};

	this.getColorPickerUI = function(fieldElement, configParamsObj) {
		// alert("getColorPickerUI");
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(EditorUIApi.editorDOM)
				.find("#ColorPickerEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var idSuffix = $(fieldElement).attr("idSuffix");
		idSuffix = (idSuffix) ? idSuffix : "";
		var field1 = "colorValue" + idSuffix;
		var field2 = "null";
		var fields = field1 + "," + field2;
		$.each($(editorFragment).find('[dataField="true"]'),
				function(index, value) {
					$(value).attr("dataType", dataType);
					$(value).attr("pathFields", pathFields);
					$(value).attr("tagName", tagName);
					$(value).attr("fields", fields);
					$(value).attr("style",
							"background-color:" + $(value).attr("value"));
					$(value).removeAttr("isEditor");
					var id = $(value).attr("id");
					$(value).attr("id", id + idSuffix);
				});
		$(fieldElement).prepend($(editorFragment));
		$(fieldElement).trigger("create");

		$(editorFragment).find('#' + field1).unbind("click", colorPickHandlor);
		$(editorFragment).find('#' + field1).bind("click", colorPickHandlor);
		function colorPickHandlor() {
			var selectedText = $(
					"#" + editorUIApi.messageAndUIBinder.parentContainerID)
					.find('#ColorPickerEditor');
			new HIN.ColorPicker(selectedText).pickColor(function(data) {
				$(selectedText).find('#' + field1).attr("value", data);
				$(selectedText).find('#' + field1).trigger("change");
				var colorPickerListener = editorUIApi.messageAndUIBinder
						.getEditorListener("colorPickerChange",
								"colorPickerListener");
				if (colorPickerListener)
					colorPickerListener(data);
			});
		}
		;
	};

	this.getColorPickerValue = function(fieldEditor) {
		var colorValue = $(fieldEditor).find("#colorValue").attr("value");
		return colorValue;
	};

	/* Entity loopup for dataType: PN */
	this.getEntityLookupUI = function(fieldElement, configParamsObj) {
		/*
		 * var dataType = $(fieldElement).attr("dataType"); var idSuffix =
		 * $(fieldElement).attr("idSuffix"); var editorFragment =
		 * $(EditorUIApi.editorDOM).find("#EntityLookupEditor").clone(); var
		 * pathFields = $(fieldElement).attr("pathFields"); var editorLabel =
		 * $(fieldElement).attr("editorLabel"); var tagName =
		 * $(fieldElement).attr("tagName"); var displayValueId
		 * ="EntityDisplayValue"+idSuffix; var listId = "entityList"+idSuffix;
		 * var fields = "null,null,null,"+displayValueId+",null"; var serverURI =
		 * null; var role = null;
		 * 
		 * $(editorFragment).find("#EntityDisplayValue").attr('id',displayValueId);
		 * $(editorFragment).find("#entityList").attr('id',listId);
		 * 
		 * $.each($(editorFragment).find('[dataField="true"]'), function(index,
		 * value) { $(value).attr("dataType", dataType);
		 * $(value).attr("pathFields", pathFields); $(value).attr("tagName",
		 * tagName); $(value).attr("fields", fields); });
		 * 
		 * 
		 * if (configParamsObj) { $.each(configParamsObj, function(key,
		 * entityInfo) { if (entityInfo.name == 'serverURI') { serverURI =
		 * entityInfo.value; } if (entityInfo.name == 'role') { role =
		 * entityInfo.value; } }); }
		 * 
		 * $(fieldElement).html($(editorFragment));
		 * $(fieldElement).trigger("create");
		 * 
		 * $(editorFragment).find('#' + displayValueId).unbind("keyup",
		 * physicianLookupClickHandler); $(editorFragment).find('#' +
		 * displayValueId).bind("keyup", physicianLookupClickHandler);
		 * 
		 * function physicianLookupClickHandler() { var searchValue =
		 * $("#"+displayValueId).val(); if(searchValue.length >= 2){ var
		 * lookupArray = new Array(); var conditionMap = new HIN.HashMap(); var
		 * searchVO = new HIN.SearchVO(); searchVO.serverURI = serverURI;
		 * searchVO.role = role; searchVO.value =
		 * searchValue.replace(/^\s+|\s+$/g, "");
		 * 
		 * conditionMap.put("firstName", searchVO.value + "*");
		 * conditionMap.put("givenName", searchVO.value + "*");
		 * conditionMap.put("familyName", searchVO.value + "*");
		 * conditionMap.put("Role", searchVO.role);
		 * 
		 * appController.getComponent("DataLayer").search(searchVO,conditionMap,function(data){
		 * loadAuto(data); }); } };
		 * 
		 * function loadAuto(lookupArray){ $(editorFragment).find("#" +
		 * listId).html(" "); $.each(lookupArray,function(index,value){ var html = "<li  class='ui-lookup-li' id='entity"+index+"'>"+value.name+"</li>";
		 * $(editorFragment).find("#" + listId).append(html);
		 * 
		 * $("#entity"+index).click(function(){ //alert("subscriberId" +
		 * value.subscriberId); $(editorFragment).find('#' +
		 * displayValueId).attr("value", $(this).text());
		 * $(editorFragment).find("#" + listId).html("");
		 * $(editorFragment).find('#' + displayValueId).trigger('change');
		 * 
		 * //appController.getComponent("DataLayer").getMessageInternal(value.subscriberId,
		 * getMessage, false); }); }) };
		 * 
		 * function getMessage(messageId, msg){ //alert(msg.getXML()); };
		 * 
		 */};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI also loads service auto complete, for editorType :
	 * ServiceLookup
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getServiceLookupUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(EditorUIApi.editorDOM).find(
				"#ServiceLookupEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var queryType = $(fieldElement).attr("queryType");
		var fields = "sService";
		var suggestionId = "sServiceSuggestions";
		var allServices = null;
		var instanceId = $(fieldElement).attr("instanceId");

		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		$(fieldElement).append(editorFragment);
		$(fieldElement).trigger("create");
		appController.getComponent("DataLayer").searchServices(queryType,
				serviceLookupHandler);

		$(editorFragment).find('[data-role="listview"]').attr("id",
				suggestionId);

		$(editorFragment).find('#' + fields).unbind("click",
				serviceLookupClickHandler);
		$(editorFragment).find('#' + fields).bind("click",
				serviceLookupClickHandler);

		$(editorFragment).find('#' + fields).trigger('click');

		function serviceLookupHandler(data) {
			allServices = data.getAllServices();
		}
		function serviceLookupClickHandler() {
			$('#' + editorUIApi.messageAndUIBinder.parentContainerID)
					.find("#sService")
					.autocomplete(
							{
								target : $(editorFragment).find(
										"#" + suggestionId),
								source : allServices,
								callback : function(e) {
									var $a = $(e.currentTarget); // access
									// the
									// selected
									// item
									var value = $a.attr('data-value');
									$(editorFragment).find("#" + fields).val(
											$a.text()); // place
									// the value of the selection into the
									// search box
									$(editorFragment).find("#" + fields)
											.trigger("create");
									$(editorFragment).find("#" + fields)
											.trigger('change');
									$(editorFragment).find("#" + fields)
											.autocomplete('clear'); // clear

									var serviceListener = editorUIApi.messageAndUIBinder
											.getEditorListener(instanceId,
													"serviceListener");
									if (serviceListener)
										serviceListener(value);

								},
								minLength : 1
							});
		}
		;
	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : CVListCalender
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getCVListCalenderUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(EditorUIApi.editorDOM).find(
				"#CVListCalenderEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var fields = "CVListCalenderbirthTime,CVListCalenderLabel";

		$(editorFragment).find("#CVListCalenderLabel").text(editorLabel);
		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		if (configParamsObj) {
			$.each(configParamsObj, function(key, configParam) {
				if (configParam.name == 'width') {
					$(editorFragment).css("width", configParam.value);
				}
			});
		}

		$(fieldElement).prepend($(editorFragment));
		// $(fieldElement).removeAttr("isEditor");
		$(fieldElement).trigger("create");

	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : CVListSlider
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getCVListSliderUI = function(fieldElement, configParamsObj) {
		/* $(fieldElement).find("#slider").change(function(){ */
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(EditorUIApi.editorDOM).find(
				"#CVListSliderEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var fields = "numericHealthHidden,CVListSliderLabel";

		$(editorFragment).find("#CVListSliderLabel").text(editorLabel);
		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		$(editorFragment).find('#decrementHealth').click(
				function() {
					var value = $("#numericHealth").html();
					if (parseInt(value) > 0) {
						value = parseInt(value) - 1;
						$(editorFragment).find("#numericHealth").html(value);
						$(editorFragment).find("#numericHealthHidden").attr(
								"value", value);
						$(editorFragment).find("#numericHealthHidden").trigger(
								'change');
					}
				});

		$(editorFragment).find('#incrementHealth').click(
				function() {
					var value = $("#numericHealth").html();
					if (parseInt(value) < 10) {
						value = parseInt(value) + 1;
						$(editorFragment).find("#numericHealth").html(value);
						$(editorFragment).find("#numericHealthHidden").attr(
								"value", value);
						$(editorFragment).find("#numericHealthHidden").trigger(
								'change');
					}

				});

		$(editorFragment).find("#numericHealthHidden").change(function() {
			var hiddenValue = $(this).attr('value');
			if (hiddenValue) {
				$(editorFragment).find("#numericHealth").html(hiddenValue);
			}
		});

		$(fieldElement).prepend($(editorFragment));
		// $(fieldElement).removeAttr("isEditor");
		$(fieldElement).trigger("create");

	}

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : IVL_TS
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getIVL_TSUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(EditorUIApi.editorDOM).find("#IVL_TSEditor")
				.clone();
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
		if (configParamsObj) {
			$
					.each(
							configParamsObj,
							function(key, result) {
								if (result.name == 'data-options') {
									if (result.value == "slidebox") {
										$(editorFragment)
												.find("#IVL_TSlow")
												.attr(
														'data-options',
														'{"mode": "slidebox", "overrideDateFormat":"%Y-%m-%d %H:%M:%S", "overrideTimeFormat":24, "overrideSlideFieldOrder":["y","m","d","h","i"]}');
										$(editorFragment)
												.find("#IVL_TShigh")
												.attr(
														'data-options',
														'{"mode": "slidebox", "overrideDateFormat":"%Y-%m-%d %H:%M:%S", "overrideTimeFormat":24, "overrideSlideFieldOrder":["y","m","d","h","i"]}');
									}
								}
							});
		}
		$(fieldElement).prepend($(editorFragment));
		// $(fieldElement).removeAttr("isEditor");
		$(fieldElement).trigger("create");
	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : CVList
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getCVListUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(EditorUIApi.editorDOM).find("#CVListEditor")
				.clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var width = null;

		if (configParamsObj) {
			$.each(configParamsObj, function(key, result) {
				if (result.name == 'conceptClass') {
					conceptClass = result.value;
					$(editorFragment).find("#select-choice").attr(
							'conceptClass', result.value);
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
		$(editorFragment).find("#select-choice").attr('id',
				"select-choice" + conceptClass);

		$(editorFragment).find("#CVListEditorLabel").text(editorLabel);
		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
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

	this.getRTO_PQ_PQInplaceUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var editorFragment = $(EditorUIApi.editorDOM).find(
				"#RTO_PQ_PQInplaceEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var width = null;
		var fields = "RTO_PQ_PQProduct";

		$(editorFragment).find("#RTO_PQ_PQProductLabel").text(editorLabel);
		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		$(fieldElement).prepend($(editorFragment));
		$(fieldElement).trigger("create");
	};

	this.getRTO_MO_PQInplaceUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var editorFragment = $(EditorUIApi.editorDOM).find(
				"#RTO_MO_PQInplaceEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var width = null;
		var fields = "RTO_MO_PQProduct";

		$(editorFragment).find("#RTO_PQ_PQProductLabel").text(editorLabel);
		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		if (configParamsObj) {
			$.each(configParamsObj, function(key, result) {
				if (result.name == 'editable') {
					if (result.value == false) {
						$(editorFragment).find("#RTO_MO_PQProduct").attr(
								'readonly', "readonly");
					}
				}
			});
		}

		$(fieldElement).prepend($(editorFragment));
		$(fieldElement).trigger("create");
	};

	this.getEDCalenderUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(EditorUIApi.editorDOM).find("#EDCalenderEditor")
				.clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var fields = "EDCalenderbirthTime,EDCalenderLabel";

		$(editorFragment).find("#EDCalenderLabel").text(editorLabel);
		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		if (configParamsObj) {
			$.each(configParamsObj, function(key, configParam) {
				if (configParam.name == 'width') {
					$(editorFragment).css("width", configParam.value);
				}
			});
		}

		$(fieldElement).prepend($(editorFragment));
		// $(fieldElement).removeAttr("isEditor");
		$(fieldElement).trigger("create");

	};

	this.getEDComboBoxUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var idSuffix = $(fieldElement).attr("idSuffix");
		var editorFragment = $(EditorUIApi.editorDOM).find("#EDComboBoxEditor")
				.clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");

		var field1 = "EDComboBox" + idSuffix;
		// var field2= "CVListCheckBoxLabel"+idSuffix;
		var fields = field1;

		$(editorFragment).find("#EDCombolabel").text(editorLabel);

		// $(editorFragment).find("#CVListCheckBox").attr("id",field1);
		// $(editorFragment).find("#CVListCheckBoxLabel").attr("id",field2);

		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
			$(value).attr("value", editorLabel);
		});

		if (configParamsObj) {
			$.each(configParamsObj, function(key, result) {
				if (result.name == 'conceptClass') {
					$(editorFragment).find("#EDComboBox").attr('conceptClass',
							result.value);
				}
				if (result.name == 'lookupType') {
					$(editorFragment).find("#EDComboBox").attr('lookupType',
							result.value);
				}
				if (result.name == 'lookupSelectType') {
					$(editorFragment).find("#EDComboBox").attr(
							'lookupSelectType', result.value);
				}
				if (result.name == 'lookupControl') {
					$(editorFragment).find("#EDComboBox").attr(
							'lookupControlType', result.value);
				}
			});
			/*
			 * $.each(configParamsObj, function(key, configParam) { if
			 * (configParam.name == 'column') {
			 * $(editorFragment).find("#EDCombolabel").text( configParam.value); }
			 * });
			 */
		}
		;

		this.getField = function(fieldId, rowIndex) {
			var field = $(editorFragment).find("#" + fieldId);
			return $(field);
		}

		$(editorFragment).find("#EDComboBox").attr("id", field1);

		$(fieldElement).prepend($(editorFragment));
		$(fieldElement).trigger("create");

	};
	/**
	 * Concatenates the values in the subEditor for editorType : PNComplete
	 * 
	 * @param fieldEditor :
	 *            HTML Fragment that contains the display textBox and the
	 *            SubEditor
	 * @returns {String} : concatenated String of the values in the subEditor
	 */
	this.getPNCompleteValues = function(fieldEditor) {
		var prefixValue = $(fieldEditor).find("#PNCompletePrefixCombo").val();
		var prefix = $(fieldEditor).find("#PNCompletePrefixCombo").find(
				'[value="' + prefixValue + '"]').text();
		var family = $(fieldEditor).find("#PNfamily").attr("value");
		var given = $(fieldEditor).find("#PNgiven").attr("value");
		var suffix = $(fieldEditor).find("#PNsuffix").attr("value");
		var value = "";

		if (given) {
			if (value) {
				value += " " + given;
			} else {
				value = given;
			}
		}
		if (family) {
			if (value) {
				value += " " + family;
			} else {
				value = family;
			}
		}
		if (suffix) {
			if (value) {
				value += " " + suffix;
			} else {
				value = suffix;
			}
		}
		if (prefix != "Select") {
			if (value) {
				value = prefix + " " + value;
			}
		}
		return value;
	};

	/**
	 * Concatenates the values in the subEditor for editorType : ON
	 * 
	 * @param fieldEditor :
	 *            HTML Fragment that contains the display textBox and the
	 *            SubEditor
	 * @returns {String} : concatenated String of the values in the subEditor
	 */
	this.getONValues = function(fieldEditor) {
		var prefix = $(fieldEditor).find("#ONprefix").attr("value");
		var value = "";

		if (prefix) {
			value = prefix;
		}

		return value;
	};

	/**
	 * Concatenates the values in the subEditor for editorType : II
	 * 
	 * @param fieldEditor :
	 *            HTML Fragment that contains the display textBox and the
	 *            SubEditor
	 * @returns {String} : concatenated String of the values in the subEditor
	 */
	this.getIIComboValues = function(fieldEditor) {

		var rootValue = $(fieldEditor).find("#IIComboRoot").val();
		var root = $(fieldEditor).find("#IIComboRoot").find(
				'[value="' + rootValue + '"]').text();
		var extension = $(fieldEditor).find("#IIComboExtension").attr("value");

		var value = "";

		if (root != "Select" && root && extension) {
			value = root + ": " + extension;
		}
		return value;
	};

	/**
	 * Concatenates the values in the subEditor for editorType : II
	 * 
	 * @param fieldEditor :
	 *            HTML Fragment that contains the display textBox and the
	 *            SubEditor
	 * @returns {String} : concatenated String of the values in the subEditor
	 */
	this.getIIValues = function(fieldEditor) {
		var root = $(fieldEditor).find("#IIroot").attr("value");
		var extension = $(fieldEditor).find("#IIextension").attr("value");
		var assigningAuthorityName = $(fieldEditor).find(
				"#IIassigningAuthorityName").attr("value");

		var value = extension;
		return value;
	};

	/**
	 * Concatenates the values in the subEditor for editorType : CVList
	 * 
	 * @param fieldEditor :
	 *            HTML Fragment that contains the display textBox and the
	 *            SubEditor
	 * @returns {String} : concatenated String of the values in the subEditor
	 */
	this.getCVListValues = function(fieldEditor) {
		var root = $(fieldEditor).find("#IIroot").attr("value");
		var extension = $(fieldEditor).find("#IIextension").attr("value");
		var assigningAuthorityName = $(fieldEditor).find(
				"#IIassigningAuthorityName").attr("value");
		var value = "";

		if (assigningAuthorityName) {
			value = assigningAuthorityName;
		}
		if (extension) {
			if (value) {
				value += " " + extension;
			} else {
				value = extension;
			}
		}
		return value;
	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : CVCheckBoxList
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getCVListCheckBoxUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var idSuffix = $(fieldElement).attr("idSuffix");
		var editorFragment = $(EditorUIApi.editorDOM).find(
				"#CVListCheckBoxEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");

		var field1 = "CVListCheckBox" + idSuffix;
		// var field2= "CVListCheckBoxLabel"+idSuffix;
		var fields = field1;

		// $(editorFragment).find("#CVListCheckBoxLabel").text(editorLabel);

		// $(editorFragment).find("#CVListCheckBox").attr("id",field1);
		// $(editorFragment).find("#CVListCheckBoxLabel").attr("id",field2);

		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
			$(value).attr("value", editorLabel);
		});

		if (configParamsObj) {
			$.each(configParamsObj, function(key, result) {
				if (result.name == 'conceptClass') {
					$(editorFragment).find("#CVListCheckBox").attr(
							'conceptClass', result.value);
				}
				if (result.name == 'lookupType') {
					$(editorFragment).find("#CVListCheckBox").attr(
							'lookupType', result.value);
				}
				if (result.name == 'lookupSelectType') {
					$(editorFragment).find("#CVListCheckBox").attr(
							'lookupSelectType', result.value);
				}
				if (result.name == 'lookupControl') {
					$(editorFragment).find("#CVListCheckBox").attr(
							'lookupControlType', result.value);
				}
			});
		}

		$(editorFragment).find("#CVListCheckBox").attr("id", field1);

		$(fieldElement).prepend($(editorFragment));
		$(fieldElement).trigger("create");

	};

	this.getCESearchUI = function(fieldElement, configParamsObj) {
		// alert("in ce search");
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(EditorUIApi.editorDOM).find("#CESearchEditor")
				.clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var idSuffix = $(fieldElement).attr("idSuffix");
		var dynamicConceptClass = $(fieldElement).attr("dynamicConceptClass");
		var fields = "select-dose" + idSuffix + "Hidden,null";

		$(editorFragment).find("#CESearchLabel").text(editorLabel);
		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		if (configParamsObj) {
			$.each(configParamsObj, function(key, result) {
				if (result.name == 'conceptClass') {
					$(editorFragment).find("#select-dose").attr('conceptClass',
							result.value);
				}
				if (result.name == 'lookupType') {
					$(editorFragment).find("#select-dose").attr('lookupType',
							result.value);
				}
				if (result.name == 'lookupSelectType') {
					$(editorFragment).find("#select-dose").attr(
							'lookupSelectType', result.value);
				}
				if (result.name == 'lookupControl') {
					$(editorFragment).find("#select-dose").attr(
							'lookupControlType', result.value);
				}
			});
		}

		// alert("dynamicConceptClass: "+dynamicConceptClass);
		if (dynamicConceptClass) {
			$(editorFragment).find("#select-dose").attr('conceptClass',
					dynamicConceptClass);
		}

		$(editorFragment).find("#select-dose").attr('id',
				"select-dose" + idSuffix);
		$(editorFragment).find("#select-doseHidden").attr('id',
				"select-dose" + idSuffix + "Hidden");
		$(editorFragment).find("#select-doseList").attr('id',
				"select-dose" + idSuffix + "List");
		$(fieldElement).prepend($(editorFragment));
		$(fieldElement).trigger("create");
	};

	/**
	 * Concatenates the values in the subEditor for editorType : CS
	 * 
	 * @param fieldEditor :
	 *            HTML Fragment that contains the display textBox and the
	 *            SubEditor
	 * @returns {String} : concatenated String of the values in the subEditor
	 */
	this.getCSValues = function(fieldEditor) {
		var status = $(fieldEditor).find("#CSstatusCode").attr("value");

		var value = status;
		return value;
	};

	/**
	 * Concatenates the values in the subEditor for editorType : CSInplace
	 * 
	 * @param fieldEditor :
	 *            HTML Fragment that contains the display textBox and the
	 *            SubEditor
	 * @returns {String} : concatenated String of the values in the subEditor
	 */
	this.getCSInplaceValues = function(fieldEditor) {
		var status = $(fieldEditor).find("#CSstatusCode").attr("value");

		var value = status;
		return value;
	};

	/**
	 * Concatenates the values in the subEditor for editorType : TS
	 * 
	 * @param fieldEditor :
	 *            HTML Fragment that contains the display textBox and the
	 *            SubEditor
	 * @returns {String} : concatenated String of the values in the subEditor
	 */
	this.getSTValues = function(fieldEditor) {
		var text = $(fieldEditor).find("#STtext").attr("value");

		var value = text;
		return value;
	};

	/**
	 * Concatenates the values in the subEditor for editorType : TEL
	 * 
	 * @param fieldEditor :
	 *            HTML Fragment that contains the display textBox and the
	 *            SubEditor
	 * @returns {String} : concatenated String of the values in the subEditor
	 */
	this.getTELValues = function(fieldEditor) {
		var telecomeType = $(fieldEditor).find(
				"#select-telecomUse option:selected").text();
		var TELval = $(fieldEditor).find("#TELvalue").attr("value");
		var value = "";
		/*
		 * if (telecomeType != "Select" && telecomeType && TELval) { value =
		 * telecomeType + ": " + TELval; } else { value = TELval; }
		 */

		if (telecomeType != "Select") {
			value = telecomeType + ": ";
		}
		if (TELval) {
			value += TELval;
		}
		return value;

	};

	/**
	 * Concatenates the values in the subEditor for editorType : PQ
	 * 
	 * @param fieldEditor :
	 *            HTML Fragment that contains the display textBox and the
	 *            SubEditor
	 * @returns {String} : concatenated String of the values in the subEditor
	 */
	this.getPQInplaceValues = function(fieldEditor) {
		var value = $(fieldEditor).find("#PQInplaceComboDisplayValue").attr(
				"value");
		return value;
	};

	/**
	 * Concatenates the values in the subEditor for editorType : PQBoolean
	 * 
	 * @param fieldEditor :
	 *            HTML Fragment that contains the display textBox and the
	 *            SubEditor
	 * @returns {String} : concatenated String of the values in the subEditor
	 */
	this.getPQBooleanValues = function(fieldEditor) {
		var value = $(fieldEditor).find("#PQBooleanDisplayValue").attr("value");
		return value;
	};

	/**
	 * Concatenates the values in the subEditor for editorType : AD
	 * 
	 * @param fieldEditor :
	 *            HTML Fragment that contains the display textBox and the
	 *            SubEditor
	 * @returns {String} : concatenated String of the values in the subEditor
	 */
	this.getADValues = function(fieldEditor) {
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
	 * 
	 * @param fieldEditor :
	 *            HTML Fragment that contains the display textBox and the
	 *            SubEditor
	 * @returns {String} : concatenated String of the values in the subEditor
	 */
	this.getCEValues = function(fieldEditor) {
		var statusValue = $(fieldEditor).find('[dataField="true"]').val();
		var status = $(fieldEditor).find('[dataField="true"]').find(
				'[value="' + statusValue + '"]').text();
		var value = "";
		if (status == "Select") {
			return value;
		} else {
			value = status;
		}
		return value;
	};

	/**
	 * Concatenates the values in the subEditor for editorType :
	 * CVListThreeTextbox
	 * 
	 * @param fieldEditor :
	 *            HTML Fragment that contains the display textBox and the
	 *            SubEditor
	 * @returns {String} : concatenated String of the values in the subEditor
	 */
	this.getCVListThreeTextboxValues = function(fieldEditor) {
		var yearLabel = $(fieldEditor).find("#CVListTextboxYearLabel").html();
		var reasonLabel = $(fieldEditor).find("#CVListTextboxReasonLabel")
				.html();
		var hospitalLabel = $(fieldEditor).find("#CVListTextboxHospitalLabel")
				.html();

		var year = $(fieldEditor).find("#CVListTextboxYear").attr("value");
		var reason = $(fieldEditor).find("#CVListTextboxReason").attr("value");
		var hospital = $(fieldEditor).find("#CVListTextboxHospital").attr(
				"value");
		var value = '';// year +" "+ reason +" "+ hospital;
		if (year) {
			if (yearLabel) {
				value += yearLabel + ": " + year + " ";
			} else {
				value += year + " ";
			}
		}
		if (reason) {
			if (reasonLabel) {
				value += reasonLabel + ": " + reason + " ";
			} else {
				value += reason + " ";
			}
		}
		if (hospital) {
			if (hospitalLabel) {
				value += hospitalLabel + ": " + hospital + " ";
			} else {
				value += hospital + " ";
			}
		}
		return value;
	};

	/**
	 * Concatenates the values in the subEditor for editorType :
	 * CVListTwoTextbox
	 * 
	 * @param fieldEditor :
	 *            HTML Fragment that contains the display textBox and the
	 *            SubEditor
	 * @returns {String} : concatenated String of the values in the subEditor
	 */
	this.getCVListTwoTextboxValues = function(fieldEditor) {
		var drugLabel = $(fieldEditor).find("#CVListTextboxDrugLabel").html();
		var reactionLabel = $(fieldEditor).find("#CVListTextboxReactionLabel")
				.html();

		var drug = $(fieldEditor).find("#CVListTextboxDrug").attr("value");
		var reaction = $(fieldEditor).find("#CVListTextboxReaction").attr(
				"value");

		var value = '';
		if (drug) {
			if (drugLabel) {
				value += drugLabel + ": " + drug + " ";
			} else {
				value += drug + " ";
			}
		}
		if (reaction) {
			if (reactionLabel) {
				value += reactionLabel + ": " + reaction + " ";
			} else {
				value += reaction + " ";
			}
		}
		return value;
	};

	/**
	 * Concatenates the values in the subEditor for editorType : CVListTextbox
	 * 
	 * @param fieldEditor :
	 *            HTML Fragment that contains the display textBox and the
	 *            SubEditor
	 * @returns {String} : concatenated String of the values in the subEditor
	 */
	this.getCVListTextboxValues = function(fieldEditor) {
		var health = $(fieldEditor).find("#CVListTextboxHealth").attr("value");

		var value = '';
		if (health) {
			value += health + " ";
		}
		return value;
	};

	/**
	 * Concatenates the values in the subEditor for editorType : CVListTextarea
	 * 
	 * @param fieldEditor :
	 *            HTML Fragment that contains the display textBox and the
	 *            SubEditor
	 * @returns {String} : concatenated String of the values in the subEditor
	 */
	this.getCVListTextareaValues = function(fieldEditor) {
		var list = $(fieldEditor).find("#CVListTextareaList").attr("value");

		var value = '';
		if (list) {
			value += list + " ";
		}
		return value;
	};

	/**
	 * Concatenates the values in the subEditor for editorType : TS
	 * 
	 * @param fieldEditor :
	 *            HTML Fragment that contains the display textBox and the
	 *            SubEditor
	 * @returns {String} : concatenated String of the values in the subEditor
	 */
	this.getTSValues = function(fieldEditor) {
		var value = $(fieldEditor).find("#TSbirthTime").attr("value");
		return value;
	};

	/**
	 * Concatenates the values in the subEditor for editorType : IVL_TS
	 * 
	 * @param fieldEditor :
	 *            HTML Fragment that contains the display textBox and the
	 *            SubEditor
	 * @returns {String} : concatenated String of the values in the subEditor
	 */
	this.getIVL_TSValues = function(fieldEditor) {
		var low = $(fieldEditor).find("#IVL_TSlow").attr("value");
		var high = $(fieldEditor).find("#IVL_TShigh").attr("value");
		var value = "";

		if (low && high) {
			if (parseDate(low) < new Date()) {
				$(fieldEditor).find("#IVL_TSlow").attr("value", '')
				$(fieldEditor).find("#IVL_TShigh").attr("value", '');
				alert("Should be greater than Current Date");
				return;
			}
			if (parseDate(low) <= parseDate(high)) {
				value = CommonUtil.dateFormat(parseDate(low), "fullDateMinute")
						+ " to "
						+ CommonUtil.dateFormat(parseDate(high),
								"fullDateMinute");
			} else {
				alert("End Date should be greater than Start Date");
			}
		}
		return value;

	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : EDBoolean
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getEDBooleanUI = function(fieldElement, configParamsObj) {// for
		// Boolean
		// Editor generation
		var dataType = $(fieldElement).attr("dataType");
		var editorFragment = $(EditorUIApi.editorDOM).find("#EDBooleanEditor")
				.clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var idSuffix = $(fieldElement).attr("idSuffix");
		var style = $(fieldElement).attr("style");
		idSuffix = (idSuffix) ? idSuffix : "";
		var field1 = "radioEditor1" + idSuffix;
		var field2 = "radioEditor2" + idSuffix;

		var fields = field1 + "," + field2;

		if (configParamsObj) {
			$.each(configParamsObj, function(key, result) {
				if (result.name == 'radio1Name') {
					$(editorFragment).find("#label1").html(result.value);
				}
				if (result.name == 'radio2Name') {
					$(editorFragment).find("#label2").html(result.value);
				}
			});
		}

		$.each($(editorFragment).find('[dataField="true"]'),
				function(index, value) {
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
		$(editorFragment).find("#label1")
				.attr("for", "radioEditor1" + idSuffix);
		$(editorFragment).find("#label2")
				.attr("for", "radioEditor2" + idSuffix);
		$(fieldElement).prepend($(editorFragment));
		$(fieldElement).trigger("create");
	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : EDTextBox
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getEDTextBoxUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var idSuffix = $(fieldElement).attr("idSuffix");
		var editorFragment = $(EditorUIApi.editorDOM).find("#EDTextBoxEditor")
				.clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");

		var field1 = "EDDisplayValue" + idSuffix;
		var fields = field1;

		$(editorFragment).find("#EDDisplayValue").attr("id", field1);
		$(editorFragment).find("#EDTextBoxEditorLabel").html(editorLabel);

		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		if (configParamsObj) {
			$.each(configParamsObj, function(key, configParam) {
				if (configParam.name == 'width') {
					$(editorFragment).css("width", configParam.value);
				}
			});
		}

		this.getField = function(fieldId, rowIndex) {
			var field = $(editorFragment).find("#" + fieldId);
			return $(field);
		}

		$(fieldElement).prepend($(editorFragment));
		$(fieldElement).trigger("create");

	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : EDTextBox
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getEDTextareaUI = function(fieldElement, configParamsObj) {
		this.tinyMCEObj = null;
		var thisObject = this;
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var idSuffix = $(fieldElement).attr("idSuffix");
		var editorFragment = $(EditorUIApi.editorDOM).find("#EDTextareaEditor")
				.clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");

		var containerType = $(fieldElement).attr("containerType");
		var field1 = "EDTextareaText" + idSuffix;
		var fields = field1;
		$(editorFragment).find("#EDTextareaText").attr("id", field1);
		$(editorFragment).find("#EDTextareaLabel").html(editorLabel);

		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		if (configParamsObj) {
			$.each(configParamsObj, function(key, configParam) {
				if (configParam.name == 'width') {
					$(editorFragment).find("#" + field1).css("width",
							configParam.value);
				}
				if (configParam.name == 'height') {
					$(editorFragment).find("#" + field1).css("height",
							configParam.value);
				}
			});
		}

		$(fieldElement).prepend($(editorFragment));
		$(fieldElement).trigger("create");

		if (containerType) {
			/*editorUIApi.insertRichTextEditor();*/

		}

		this.getField = function(fieldId, rowIndex) {
			if (containerType) {
				thisObject.tinyMCEObj = tinyMCE.get(fieldId);

				/*
				 * var ed = thisObject.tinyMCEObj.get(fieldId);
				 * 
				 * 
				 * ed.setProgressState(1); // Show progress
				 * window.setTimeout(function() { ed.setProgressState(0); //
				 * Hide progress ed.setContent('<p>Dear<br><br>Eternity
				 * Medicine Institute would like to remind you of your upcoming
				 * appointment:<br><br><br>We look forward to seeing you
				 * soon, for your convenience please find attached our location
				 * map.<br><br>If this is your first appointment with
				 * Eternity Medicine Institute, please come to the appointment
				 * 12 hours fasting; only drinking water. Refreshments will be
				 * provided upon completion of your blood draw.<br><br>Also,
				 * Eternity Medicine Institute is a program based medical center
				 * and does not accept insurance. If you would like to claim
				 * your doctor consultation or blood tests, we kindly ask that
				 * you bring your claim form with you to your appointment. Our
				 * doctors will be happy to fill the medical visit information
				 * for you.<br><br>For additional information or if you have
				 * any questions please dont hesitate to contact us:<br><br><br><br>Yours
				 * in Health,<br><br>Eternity Medicine Institute, Dubai</p>'); },
				 * 3000);
				 */

				return thisObject.tinyMCEObj;
			} else {
				var field = $(editorFragment).find("#" + fieldId);
				return $(field);
			}
		}

	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : CVListBoolean
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getCVListBooleanUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var editorFragment = $(EditorUIApi.editorDOM).find(
				"#CVListBooleanEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var idSuffix = $(fieldElement).attr("idSuffix");
		var style = $(fieldElement).attr("style");
		idSuffix = (idSuffix) ? idSuffix : "";
		var field1 = "radioEditor1" + idSuffix;
		var field2 = "radioEditor2" + idSuffix;

		var fields = field1 + "," + field2;
		$.each($(editorFragment).find('[dataField="true"]'),
				function(index, value) {
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
		$(editorFragment).find("#label1")
				.attr("for", "radioEditor1" + idSuffix);
		$(editorFragment).find("#label2")
				.attr("for", "radioEditor2" + idSuffix);
		$(fieldElement).prepend($(editorFragment));
		$(fieldElement).trigger("create");
	};

	/**
	 * fetches the editor from the "editorDOM" and appends it to the Html
	 * Fragment, to generate UI for editorType : EDCheckBox
	 * 
	 * @param fieldElement :
	 *            HTML Fragment to which the editor is appended
	 * @param configParamsObj :
	 *            Object from the config, which provide addtional info required
	 *            to load data to editor
	 */
	this.getEDCheckBoxUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var idSuffix = $(fieldElement).attr("idSuffix");
		var editorFragment = $(EditorUIApi.editorDOM).find("#EDCheckBoxEditor")
				.clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");

		var field1 = "EDCheckBoxDisplayValue" + idSuffix;
		var fields = field1;

		var labelField = $(editorFragment).find("#EDCheckBoxDisplayValue")
				.attr("labelField");
		if (labelField) {
			$(editorFragment).find("#EDCheckBoxDisplayValue").attr(
					"labelField", labelField + idSuffix);
		}

		$(editorFragment).find("#EDCheckBoxDisplayValue").attr("id", field1);

		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
			$(value).attr("value", editorLabel);
		});

		if (configParamsObj) {
			$.each(configParamsObj, function(key, configParam) {
				if (configParam.name == 'width') {
					$(editorFragment).find("#" + field1).css("width",
							configParam.value);
				}
				if (configParam.name == 'height') {
					$(editorFragment).find("#" + field1).css("margin-bottom",
							configParam.value);
				}
			});
		}

		$(fieldElement).prepend($(editorFragment));
		$(fieldElement).trigger("create");
	};

	this.getCELabelUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(EditorUIApi.editorDOM).find("#CELabelEditor")
				.clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var idSuffix = $(fieldElement).attr("idSuffix");
		idSuffix = (idSuffix) ? idSuffix : "";

		var field1 = "CELabel" + idSuffix;
		var field2 = "CELabelHidden" + idSuffix;

		var fields = field1 + "," + field2;

		$(editorFragment).find("#CELabel").text(editorLabel);
		$(editorFragment).find("#CELabelHidden").attr('value', editorLabel);

		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("id", $(value).attr("id") + idSuffix);
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		$(editorFragment).find("#CELabel").attr("id", "CELabel" + idSuffix);
		$(editorFragment).find("#CELabelHidden").attr("id",
				"CELabelHidden" + idSuffix);
		// $(editorFragment).find("CELabelHidden" + idSuffix).trigger("change");

		$(fieldElement).html($(editorFragment));
		// $(fieldElement).removeAttr("isEditor");
		$(fieldElement).trigger("create");
	};
	this.getPQInplaceBooleanUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var name = $(fieldElement).attr("name");
		var editorFragment = $(EditorUIApi.editorDOM).find(
				"#PQInplaceBooleanEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var idSuffix = $(fieldElement).attr("idSuffix");
		var style = $(fieldElement).attr("style");
		idSuffix = (idSuffix) ? idSuffix : "";
		var field1 = "radioEditor1" + idSuffix;
		var field2 = "radioEditor2" + idSuffix;

		var fields = field1 + "," + field2;
		$.each($(editorFragment).find('[dataField="true"]'),
				function(index, value) {
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
		$(editorFragment).find("#label1")
				.attr("for", "radioEditor1" + idSuffix);
		$(editorFragment).find("#label2")
				.attr("for", "radioEditor2" + idSuffix);
		$(fieldElement).html($(editorFragment));
		$(fieldElement).trigger("create");
	};
	this.getEDSingleBooleanUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var name = $(fieldElement).attr("name");
		var editorFragment = $(EditorUIApi.editorDOM).find(
				"#EDSingleBooleanEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var idSuffix = $(fieldElement).attr("idSuffix");
		var style = $(fieldElement).attr("style");
		idSuffix = (idSuffix) ? idSuffix : "";
		var field1 = "radioEditor1" + idSuffix;
		var field2 = "radioEditor2" + idSuffix;
		var field3 = "radioEditor3" + idSuffix;
		var field4 = "radioEditor4" + idSuffix;
		var field5 = "radioEditor5" + idSuffix;

		if (configParamsObj) {
			$.each(configParamsObj, function(key, result) {
				if (result.name == 'param1') {
					$(editorFragment).find("#radioEditor1").attr('value',
							result.value);
					$(editorFragment).find("#p1").html(result.value);
				}
				if (result.name == 'param2') {
					$(editorFragment).find("#radioEditor2").attr('value',
							result.value);
					$(editorFragment).find("#p2").html(result.value);
				}
				if (result.name == 'param3') {
					$(editorFragment).find("#radioEditor3").attr('value',
							result.value);
					$(editorFragment).find("#p3").html(result.value);
				}
				if (result.name == 'param4') {
					$(editorFragment).find("#radioEditor4").attr('value',
							result.value);
					$(editorFragment).find("#p4").html(result.value);
				}
				if (result.name == 'param5') {
					$(editorFragment).find("#radioEditor5").attr('value',
							result.value);
					$(editorFragment).find("#p5").html(result.value);
				}
			});
		}

		var fields = field1 + "," + field2 + "," + field3 + "," + field4 + ","
				+ field5;
		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("id", $(value).attr("id") + idSuffix);
			$(value).attr("name", $(value).attr("name") + idSuffix);
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
			// $(value).attr("labelField", $(value).attr("labelField") +
			// idSuffix);
			$(value).attr("idSuffix", idSuffix);
			// $(value).attr("style", style);
			// $(value).attr("value", editorLabel+(index+1));

		});

		for (i = 1; i <= 5; i++) {
			$(editorFragment).find("#label" + i).text("x");
			$(editorFragment).find("#label" + i).attr("for",
					"radioEditor" + i + idSuffix);
			// $(editorFragment).find("#label"+i).find(".ui-btn-text").css('color','#61145A');
		}

		$(fieldElement).html($(editorFragment));
		$(fieldElement).trigger("create");

		for (i = 1; i <= 5; i++) {
			$(fieldElement).find("#label" + i).find(".ui-btn-text").css(
					'color', '#61145A');
		}

	};

	this.getIIinplaceComboUI = function(fieldElement, configParamsObj) {
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var editorFragment = $(EditorUIApi.editorDOM).find(
				"#IIinplaceComboEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var idSuffix = $(fieldElement).attr("idSuffix");
		idSuffix = (idSuffix) ? idSuffix : "";
		var field1 = "select-choice" + idSuffix;
		var field2 = "IIHidden" + idSuffix;
		var fields = field2 + "," + field1;

		if (configParamsObj) {
			$.each(configParamsObj, function(key, result) {
				if (result.name == 'conceptClass') {
					conceptClass = result.value;
					$(editorFragment).find("#select-choice").attr(
							'conceptClass', result.value);
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
			});
		}

		$(editorFragment).find("#IIcomboLabel").text(editorLabel);
		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
		});

		$(editorFragment).find("#" + field1).change(
				function() {
					var chargeListener = editorUIApi.messageAndUIBinder
							.getEditorListener("charge", "chargeListener");
					if (chargeListener) {
						chargeListener();
					}
				});

		$(editorFragment).find("#select-choice").attr("id", field1);
		$(editorFragment).find("#IIHidden").attr("id", field2);

		$(fieldElement).prepend($(editorFragment));
		$(fieldElement).trigger("create");
	};

	this.eventHandler = function(events, changeFieldId, updateFieldId,
			editorFragment, instanceId, configParamsObj) {
		var type = $(editorFragment).find("#" + changeFieldId).attr('type');
		$(events).each(
				function(index, event) {
					if (type == 'multiple') {
						$(editorFragment).find('#' + changeFieldId).change(
								function() {
									var editorFragment = $(this).closest(
											'[uiRole="editor"]')[0];
									if ($(editorFragment).find(
											'#' + changeFieldId
													+ ' option:selected')
											.text() == event.comboText) {
										fireEditorEvent(instanceId,
												event.eventName, updateFieldId,
												editorFragment, true);
									} else {
										fireEditorEvent(instanceId,
												event.eventName, updateFieldId,
												editorFragment, false);
									}
								});
					}
				});

		function fireEditorEvent(instanceId, eventName, updateFieldId,
				editorFragment, isSelected) {
			var eventListener = editorUIApi.messageAndUIBinder
					.getEditorListener(instanceId, eventName);
			if (eventListener) {
				var eventApi = (function() {
					this.editorFragment = $(editorFragment);
					this.configParamsObj = configParamsObj;
					this.instanceId = instanceId;
					this.fieldName = updateFieldId;
					this.isSelected = isSelected;
					var api = this;

					this.getField = function(fieldName) {
						return api.editorFragment.find("#" + fieldName);
					};

					this.getInstanceId = function() {
						return api.instanceId;
					}
				});
				eventListener(new eventApi);
			}
		}

	};

	this.getPhysicianLookupValues = function(fieldEditor) {
		var prefixValue = $(fieldEditor).find("#PNCompletePrefixCombo").val();
		var prefix = $(fieldEditor).find("#PNCompletePrefixCombo").find(
				'[value="' + prefixValue + '"]').text();
		var family = $(fieldEditor).find("#PNfamily").attr("value");
		var given = $(fieldEditor).find("#PNgiven").attr("value");
		var suffix = $(fieldEditor).find("#PNsuffix").attr("value");
		var value = "";

		if (given) {
			if (value) {
				value += " " + given;
			} else {
				value = given;
			}
		}
		if (family) {
			if (value) {
				value += " " + family;
			} else {
				value = family;
			}
		}
		if (suffix) {
			if (value) {
				value += " " + suffix;
			} else {
				value = suffix;
			}
		}
		if (prefix != "Select") {
			if (value) {
				value = prefix + " " + value;
			}
		}
		return value;
	};

	this.insertRichTextEditor = function(onInitTinyMCE, fieldId) {
		// var tinyMCE = tinyMCE.init({
		tinyMCE
				.init({
					// General options
					mode : "exact",
					elements : fieldId, 
					theme : "advanced",
					plugins : "autolink,lists,spellchecker,pagebreak,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,inlinepopups,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras,template",

					// Theme options
					theme_advanced_buttons1 : "newdocument,|,bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,formatselect,fontselect,fontsizeselect,|,nonbreaking,blockquote,pagebreak,|",
					theme_advanced_buttons2 : "pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
					theme_advanced_buttons3 : "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|,fullscreen",
					theme_advanced_toolbar_location : "top",
					theme_advanced_toolbar_align : "left",
					theme_advanced_statusbar_location : "bottom",
					theme_advanced_resizing : true,

					// Skin options
					skin : "o2k7",
					skin_variant : "silver",
					oninit : onInitTinyMCE
				});

	};
	
	this.getCESearchValues = function(fieldEditor) {
		var value = $(fieldEditor).find('#SubEditor').find('[dataField="true"]').val();
		return value;
	};	
	
	this.getIISingleCheckBoxUI = function(fieldElement, configParamsObj) {
		//alert("in meth");
		var dataType = $(fieldElement).attr("dataType");
		var id = $(fieldElement).attr("id");
		var idSuffix = $(fieldElement).attr("idSuffix");
		var editorFragment = $(EditorUIApi.editorDOM).find("#IISingleCheckBoxEditor").clone();
		var pathFields = $(fieldElement).attr("pathFields");
		var editorLabel = $(fieldElement).attr("editorLabel");
		var tagName = $(fieldElement).attr("tagName");
		var fields = "IIRoot,IIExtension";
		var idSuffix = $(fieldElement).attr("idSuffix");

		$.each($(editorFragment).find('[dataField="true"]'), function(index,
				value) {
			$(value).attr("dataType", dataType);
			$(value).attr("pathFields", pathFields);
			$(value).attr("tagName", tagName);
			$(value).attr("fields", fields);
			$(value).attr("value", editorLabel);
		});

		if(editorLabel){
			$(editorFragment).find("#IIRoot").attr("value",editorLabel);
		}	
		
		$(fieldElement).prepend($(editorFragment));
		$(fieldElement).trigger("create");
	}

}