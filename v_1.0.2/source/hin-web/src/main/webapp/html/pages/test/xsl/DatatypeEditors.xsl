<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="html" indent="no"/>

	<!-- template to used to call all the data type templates to create the editors -->
	<xsl:template mode="find-type" match="*">
		<div>	
			<xsl:apply-templates mode="CE" select="."/>
			<xsl:apply-templates mode="TEL" select="."/>
			<xsl:apply-templates mode="II" select="."/>
			<xsl:apply-templates mode="PN" select="."/>
			<xsl:apply-templates mode="ED" select="."/>
			
			<xsl:apply-templates mode="CS" select="."/>
			<xsl:apply-templates mode="TS" select="."/>
			<xsl:apply-templates mode="INT" select="."/>
			<xsl:apply-templates mode="CD" select="."/>
			<xsl:apply-templates mode="AD" select="."/>
		</div>
	</xsl:template>
	
		<!-- template used to create a combo box for Null Flavor -->
	<xsl:template mode="create-nullFlavor" match="*">
		<label for="nullFlavor" style="color: #FFFFFF; font-weight: bold; text-shadow: none;"> <font size="2">Empty Value : </font></label> 
			<select id="nullFlavor">
			   <option value="Select">Select</option>
			   <option value="NA">Not Applicable</option>
			   <option value="NI">No Information</option>
			</select>		
	</xsl:template>
	
		<xsl:template mode="CE"  match="*">
			<xsl:message>in CE</xsl:message>
			<div data-role="content" id="editorCE">
				<label for="code"  style=" font-weight: bold; text-shadow: none; font-size:13;">Code</label> 
				<input class="searchCE ui-input-text ui-body-c" placeholder="Search Code..." data-type="search" type="text" id="code" value="" dataSource="" data-inline="true"/>
				<ul data-role="listview" data-theme="b" id="codeList" style="margin-top: 0px;margin-left:10px; width: 95.5%; font-size:13;"></ul>  <br/>
				
				<label for="codeSystemName"  style=" font-weight: bold; text-shadow: none; font-size:13;">Code System Name</label>
				<input value="" id="codeSystemName"  type="text" class="CEtext edit-text" style="font-size:13;"/>
				
				<label for="originalText"  style=" font-weight: bold; text-shadow: none; font-size:13;">Original Text</label>
				<input value="" id="originalText"  type="text" class="CEtext edit-text" style="font-size:13;"/>

				<!-- <a data-inline="true" data-role="button" href="#" data-theme="c" class="ui-btn ui-btn-inline ui-btn-corner-all ui-shadow ui-btn-up-c" id="editorCEOk">
					<span class="ui-btn-inner ui-btn-corner-all">
						<span class="ui-btn-text">OK</span>
					</span>
				</a> 	
				
				<a data-inline="true" data-role="button" href="#" data-theme="c" class="ui-btn ui-btn-inline ui-btn-corner-all ui-shadow ui-btn-up-c" id="editorCECancel">
					<span class="ui-btn-inner ui-btn-corner-all">
						<span class="ui-btn-text">CANCEL</span>
					</span>
				</a> -->			
			</div>	
		</xsl:template>
		
		<xsl:template mode="TEL" match="*">
			<xsl:message>in  TEL</xsl:message>
			<div data-role="content" id="editorTEL">
				
				<label for="use"  style=" font-weight: bold; text-shadow: none; font-size:13;">Use</label>
				<input value="" id="use" type="text" class="TELtext edit-text" style="font-size:13;"/>
				
				<label for="useablePeriod"  style=" font-weight: bold; text-shadow: none; font-size:13;">Useable Period</label>
				<input value="" id="useablePeriod" type="text" class="TELtext edit-text" style="font-size:13;"/>
				
				<xsl:apply-templates mode="create-nullFlavor" select="."/>
				
				<!-- <a data-inline="true" data-role="button" href="#" data-theme="c" class="ui-btn ui-btn-inline ui-btn-corner-all ui-shadow ui-btn-up-c" id="editorTELOk">
					<span class="ui-btn-inner ui-btn-corner-all">
						<span class="ui-btn-text">OK</span>
					</span>
				</a>	
				
				<a data-inline="true" data-role="button" href="#" data-theme="c" class="ui-btn ui-btn-inline ui-btn-corner-all ui-shadow ui-btn-up-c" id="editorTELCancel">
					<span class="ui-btn-inner ui-btn-corner-all">
						<span class="ui-btn-text">CANCEL</span>
					</span>
				</a> -->				
			</div>
		</xsl:template>
		
		<xsl:template mode="II" match="*">
		<xsl:message>in  II</xsl:message>
		<div data-role="content" id="editorII">
			
			<label for="root"  style=" font-weight: bold; text-shadow: none; font-size:13;">Profile Id</label>
			<input value="" id="root" type="text" class="IItext edit-text" style="font-size:13;"/>
			
			<label for="assigningAuthorityName"  style=" font-weight: bold; text-shadow: none; font-size:13;">Assigning Authority Name</label>
			<input value="" id="assigningAuthorityName" type="text" class="IItext edit-text" style="font-size:13;"/>
			
			<label for="extension"  style=" font-weight: bold; text-shadow: none; font-size:13;">Extension</label>
			<input value="" id="extension" type="text" class="IItext edit-text" style="font-size:13;"/>

			<xsl:apply-templates mode="create-nullFlavor" select="."/>
			
			<!-- <a data-inline="true" data-role="button" href="#" data-theme="c" class="ui-btn ui-btn-inline ui-btn-corner-all ui-shadow ui-btn-up-c" id="editorIIOk">
				<span class="ui-btn-inner ui-btn-corner-all">
					<span class="ui-btn-text">OK</span>
				</span>
			</a>	
			
			<a data-inline="true" data-role="button" href="#" data-theme="c" class="ui-btn ui-btn-inline ui-btn-corner-all ui-shadow ui-btn-up-c" id="editorIICancel">
				<span class="ui-btn-inner ui-btn-corner-all">
					<span class="ui-btn-text">CANCEL</span>
				</span>
			</a>	 -->		
		</div>
	</xsl:template>
	
	<xsl:template mode="PN" match="*">
		<xsl:message>in  PN</xsl:message>
		<div data-role="content" id="editorPN" data-theme="a">
			
			<label for="prefix"  style=" font-weight: bold; text-shadow: none; font-size:13;">Prefix</label>
			<!-- <input class="ui-input-text ui-body-c" placeholder="Prefix..." data-type="search" type="text" id="prefix" value="" data-inline="true"/> -->
			<input class="searchPN" placeholder="Search prefix..." data-type="search" id="prefix" value="" dataSource="" />	
			<ul data-role="listview" data-theme="b" data-filter="false" id="prefixList" style="margin-top: 0px;margin-left:10px; width: 95.5%; font-size:13;"></ul>	<br/>

			<label for="delimiter"  style=" font-weight: bold; text-shadow: none; font-size:13;">Delimiter</label>
			<input value="" id="delimiter" type="text" class="PNtext edit-text" style="font-size:13;"/>
			
			<label for="family"  style=" font-weight: bold; text-shadow: none; font-size:13;">Family Name</label>
			<input value="" id="family" type="text" class="PNtext edit-text" style="font-size:13;"/>
			
			<label for="given"  style=" font-weight: bold; text-shadow: none; font-size:13;">Given</label>
			<input value="" id="given" type="text" class="PNtext edit-text" style="font-size:13;"/>
			
			<label for="suffix"  style=" font-weight: bold; text-shadow: none; font-size:13;">Suffix</label>
			<input value="" id="suffix" type="text" class="PNtext edit-text" style="font-size:13;"/>
			
			<!-- label for="validFrom"  style=" font-weight: bold; text-shadow: none; font-size:13;">Valid From</label>
			<input value="" id="low" type="text" class="PNtext edit-text" style="font-size:13;"/>
			
			<label for="validTo"  style=" font-weight: bold; text-shadow: none; font-size:13;">valid To</label>
			<input value="" id="high" type="text" class="PNtext edit-text" style="font-size:13;"/> -->
			
			<xsl:apply-templates mode="create-nullFlavor" select="."/>
			
			<!-- <a data-inline="true" data-role="button" href="#" data-theme="c" class="ui-btn ui-btn-inline ui-btn-corner-all ui-shadow ui-btn-up-c" id="editorPNOk">
				<span class="ui-btn-inner ui-btn-corner-all">
					<span class="ui-btn-text">OK</span>
				</span>
			</a>	
			
			<a data-inline="true" data-role="button" href="#" data-theme="c" class="ui-btn ui-btn-inline ui-btn-corner-all ui-shadow ui-btn-up-c" id="editorPNCancel">
				<span class="ui-btn-inner ui-btn-corner-all">
					<span class="ui-btn-text">CANCEL</span>
				</span>
			</a>	 -->		
		</div>
	</xsl:template>	
	
	<xsl:template mode="ED" match="*">
		<xsl:message>in  ED</xsl:message>
		<div data-role="content"  id="editorED">
			 <a data-inline="true" data-role="button" id="choose" href="#">CHOOSE IMAGE</a> <br/>
			<!-- <a href="#"  id="editorEDimageOk" data-role="button" data-inline="true" onclick="window.JSInterface.sampleImage();">OK</a>
			<a href="#"  id="editorEDimageCancel" data-role="button" data-inline="true">CANCEL</a> -->
			
			<!-- <a data-inline="true" data-role="button" href="#" data-theme="c" class="ui-btn ui-btn-inline ui-btn-corner-all ui-shadow ui-btn-up-c" id="editorEDOk">
				<span class="ui-btn-inner ui-btn-corner-all">
					<span class="ui-btn-text">OK</span>
				</span>
			</a>	
			
			<a data-inline="true" data-role="button" href="#" data-theme="c" class="ui-btn ui-btn-inline ui-btn-corner-all ui-shadow ui-btn-up-c" id="editorEDCancel">
				<span class="ui-btn-inner ui-btn-corner-all">
					<span class="ui-btn-text">CANCEL</span>
				</span>
			</a> -->
			
		</div>
	</xsl:template>
	
	<xsl:template mode="CS" match="*">
		<div data-role="content"  id="editorCS"> 

			<label for="code" style=" font-weight: bold; text-shadow: none; font-size:13;">Code</label>
			<!-- <input value="" id="code" type="text" class="ui-input-text ui-body-d ui-corner-all ui-shadow-inset" style="font-size:13;"/> -->
			<input class="searchCS ui-input-text ui-body-c" placeholder="Search code ..." data-type="search" type="text" id="code" value="" dataSource="" data-inline="true"/>
			<ul data-role="listview" data-theme="b" id="codeList" style="margin-top: 0px;margin-left:10px; width: 95.5%; font-size:13;"></ul>	<br/>

			<!-- <a data-inline="true" data-role="button" href="#" data-theme="c" class="ui-btn ui-btn-inline ui-btn-corner-all ui-shadow ui-btn-up-c" id="editorCSOk">
				<span class="ui-btn-inner ui-btn-corner-all">
					<span class="ui-btn-text">OK</span>
				</span>
			</a>	
			
			<a data-inline="true" data-role="button" href="#" data-theme="c" class="ui-btn ui-btn-inline ui-btn-corner-all ui-shadow ui-btn-up-c" id="editorCSCancel">
				<span class="ui-btn-inner ui-btn-corner-all">
					<span class="ui-btn-text">CANCEL</span>
				</span>
			</a> -->			
		</div>
	</xsl:template>
	
	<xsl:template mode="TS" match="*">
		<div data-role="content"  id="editorTS">
			<label for="value" style=" font-weight: bold; text-shadow: none; font-size:13;">Value</label>
			<input value="" id="value" type="text" class="TStext edit-text" style="font-size:13;"/>

			<!-- <a data-inline="true" data-role="button" href="#" data-theme="c" class="ui-btn ui-btn-inline ui-btn-corner-all ui-shadow ui-btn-up-c" id="editorTSOk">
				<span class="ui-btn-inner ui-btn-corner-all">
					<span class="ui-btn-text">OK</span>
				</span>
			</a>	
			
			<a data-inline="true" data-role="button" href="#" data-theme="c" class="ui-btn ui-btn-inline ui-btn-corner-all ui-shadow ui-btn-up-c" id="editorTSCancel">
				<span class="ui-btn-inner ui-btn-corner-all">
					<span class="ui-btn-text">CANCEL</span>
				</span>
			</a> -->				
		
		</div>	
	</xsl:template>
	
	<xsl:template mode="INT" match="*">
	
		<div data-role="content"  id="editorINT">
			<label for="value" style=" font-weight: bold; text-shadow: none; font-size:13;">Value</label>
			<input value="" id="value" type="text" class="INTtext edit-text" style="font-size:13;"/>	
			
			<!-- <a data-inline="true" data-role="button" href="#" data-theme="c" class="ui-btn ui-btn-inline ui-btn-corner-all ui-shadow ui-btn-up-c" id="editorINTOk">
				<span class="ui-btn-inner ui-btn-corner-all">
					<span class="ui-btn-text">OK</span>
				</span>
			</a>	
			
			<a data-inline="true" data-role="button" href="#" data-theme="c" class="ui-btn ui-btn-inline ui-btn-corner-all ui-shadow ui-btn-up-c" id="editorINTCancel">
				<span class="ui-btn-inner ui-btn-corner-all">
					<span class="ui-btn-text">CANCEL</span>
				</span>
			</a> -->			
		</div>	
	</xsl:template>

	<xsl:template mode="CD" match="*">
		<div data-role="content"  id="editorCD">
			<label for="code" style=" font-weight: bold; text-shadow: none; font-size:13;">Code</label>
			<!-- <input value="" id="code" type="text" class="ui-input-text ui-body-d ui-corner-all ui-shadow-inset" style="font-size:13;"/> -->
			<input placeholder="Search codes ..." data-type="search" type="text" id="code" value="" dataSource="" data-inline="true"/>
			<ul data-role="listview" data-theme="b" id="codeList" style="margin-top: 0px;margin-left:10px; width: 95.5%; font-size:13;"></ul>	<br/>
			
			<label for="codeSystemName" style=" font-weight: bold; text-shadow: none; font-size:13;">Code System Name</label>
			<input value="" id="codeSystemName" type="text" class="CDtext edit-text" style="font-size:13;"/>
			
			<label for="originalText" style=" font-weight: bold; text-shadow: none; font-size:13;">Original Text</label>
			<input value="" id="originalText" type="text" class="CDtext edit-text" style="font-size:13;"/>
			
			<!-- <a data-inline="true" data-role="button" href="#" data-theme="c" class="ui-btn ui-btn-inline ui-btn-corner-all ui-shadow ui-btn-up-c" id="editorCDOk">
				<span class="ui-btn-inner ui-btn-corner-all">
					<span class="ui-btn-text">OK</span>
				</span>
			</a>	
			
			<a data-inline="true" data-role="button" href="#" data-theme="c" class="ui-btn ui-btn-inline ui-btn-corner-all ui-shadow ui-btn-up-c" id="editorCDCancel">
				<span class="ui-btn-inner ui-btn-corner-all">
					<span class="ui-btn-text">CANCEL</span>
				</span>
			</a> -->			
		</div>	
	</xsl:template>
	
	<xsl:template mode="AD" match="*">
		<div data-role="content"  id="editorAD">
			<label for="delimiter" style=" font-weight: bold; text-shadow: none; font-size:13;">Delimiter</label>
			<input value="" id="delimiter" type="text" class="ADtext edit-text" style="font-size:13;"/>
			
			<label for="country" style=" font-weight: bold; text-shadow: none; font-size:13;">Country</label>
			<!-- <input value="" id="country" type="text" class="ui-input-text ui-body-d ui-corner-all ui-shadow-inset" style="font-size:13;"/> -->
			<input class="searchAD ui-input-text ui-body-c" placeholder="Search country..." data-type="search" type="text" id="country" value="" dataSource="" data-inline="true"/>
			<ul data-role="listview" data-theme="b" id="countryList" style="margin-top: 0px;margin-left:10px; width: 95.5%; font-size:13;"></ul>	<br/>	
			
			<label for="state" style=" font-weight: bold; text-shadow: none; font-size:13;">State</label>
			<!-- <input value="" id="state" type="text" class="ui-input-text ui-body-d ui-corner-all ui-shadow-inset" style="font-size:13;"/> -->
			<input class="searchAD ui-input-text ui-body-c" placeholder="Search state ..." data-type="search" type="text" id="state" value="" dataSource="" data-inline="true"/>
			<ul data-role="listview" data-theme="b" id="stateList" style="margin-top: 0px;margin-left:10px; width: 95.5%; font-size:13;"></ul>	<br/>	
			
			<label for="county" style=" font-weight: bold; text-shadow: none; font-size:13;">County</label>
			<input value="" id="county" type="text" class="ADtext edit-text" style="font-size:13;"/>
			
			<label for="city" style=" font-weight: bold; text-shadow: none; font-size:13;">City</label>
			<!-- <input value="" id="city" type="text" class="ui-input-text ui-body-d ui-corner-all ui-shadow-inset" style="font-size:13;"/> -->
			<input class="searchAD ui-input-text ui-body-c" placeholder="Search city ..." data-type="search" type="text" id="city" value="" dataSource="" data-inline="true"/>
			<ul data-role="listview" data-theme="b" id="cityList" style="margin-top: 0px;margin-left:10px; width: 95.5%; font-size:13;"></ul>	<br/>
			
			<label for="postalCode" style=" font-weight: bold; text-shadow: none; font-size:13;">Postal Code</label>
			<!-- <input value="" id="postalCode" type="text" class="ui-input-text ui-body-d ui-corner-all ui-shadow-inset" style="font-size:13;"/> -->
			<input value="" id="postalCode" type="text" class="ADtext edit-text" style="font-size:13;"/>		
			
			<label for="streetAddressLine" style=" font-weight: bold; text-shadow: none; font-size:13;">Street Address Line</label>
			<!-- <input value="" id="streetAddressLine" type="text" class="ui-input-text ui-body-d ui-corner-all ui-shadow-inset" style="font-size:13;"/> -->
			<input value="" id="streetAddressLine" type="text" class="ADtext edit-text" style="font-size:13;"/>
			
			<label for="houseNumber" style=" font-weight: bold; text-shadow: none; font-size:13;">House Number</label>
			<!-- <input value="" id="houseNumber" type="text" class="ui-input-text ui-body-d ui-corner-all ui-shadow-inset" style="font-size:13;"/> -->
			<input value="" id="houseNumber" type="text" class="ADtext edit-text" style="font-size:13;"/>
			
			<label for="houseNumberNumeric" style=" font-weight: bold; text-shadow: none; font-size:13;">House Number Numeric</label>
			<!-- <input value="" id="houseNumberNumeric" type="text" class="ui-input-text ui-body-d ui-corner-all ui-shadow-inset" style="font-size:13;"/> -->
			<input value="" id="houseNumberNumeric" type="text" class="ADtext edit-text" style="font-size:13;"/>
			
			<label for="direction" style=" font-weight: bold; text-shadow: none; font-size:13;">Direction</label>
			<!-- <input value="" id="direction" type="text" class="ui-input-text ui-body-d ui-corner-all ui-shadow-inset" style="font-size:13;"/> -->
			<input value="" id="direction" type="text" class="ADtext edit-text" style="font-size:13;"/>
			
			<label for="streetName" style=" font-weight: bold; text-shadow: none; font-size:13;">Street Name</label>
			<!-- <input value="" id="streetName" type="text" class="ui-input-text ui-body-d ui-corner-all ui-shadow-inset" style="font-size:13;"/> -->
			<input value="" id="streetName" type="text" class="ADtext edit-text" style="font-size:13;"/>
			
			<label for="streetNameBase" style=" font-weight: bold; text-shadow: none; font-size:13;">Street Name Base</label>
			<!-- <input value="" id="streetNameBase" type="text" class="ui-input-text ui-body-d ui-corner-all ui-shadow-inset" style="font-size:13;"/> -->
			<input value="" id="streetNameBase" type="text" class="ADtext edit-text" style="font-size:13;"/>
			
			<label for="streetNameType" style=" font-weight: bold; text-shadow: none; font-size:13;">Street Name Type</label>
			<!-- <input value="" id="streetNameType" type="text" class="ui-input-text ui-body-d ui-corner-all ui-shadow-inset" style="font-size:13;"/> -->
			<input value="" id="streetNameType" type="text" class="ADtext edit-text" style="font-size:13;"/>
			
			<label for="additionalLocator" style=" font-weight: bold; text-shadow: none; font-size:13;">Additional Locator</label>
			<!-- <input value="" id="additionalLocator" type="text" class="ui-input-text ui-body-d ui-corner-all ui-shadow-inset" style="font-size:13;"/> -->
			<input value="" id="additionalLocator" type="text" class="ADtext edit-text" style="font-size:13;"/>
			
			<label for="unitID" style=" font-weight: bold; text-shadow: none; font-size:13;">Unit ID</label>
			<!-- <input value="" id="unitID" type="text" class="ui-input-text ui-body-d ui-corner-all ui-shadow-inset" style="font-size:13;"/> -->
			<input value="" id="unitID" type="text" class="ADtext edit-text" style="font-size:13;"/>
			
			<label for="unitType" style=" font-weight: bold; text-shadow: none; font-size:13;">Unit Type</label>
			<!-- <input value="" id="unitType" type="text" class="ui-input-text ui-body-d ui-corner-all ui-shadow-inset" style="font-size:13;"/> -->
			<input value="" id="unitType" type="text" class="ADtext edit-text" style="font-size:13;"/>
			
			<label for="careOf" style=" font-weight: bold; text-shadow: none; font-size:13;">Care Of</label>
			<!-- <input value="" id="careOf" type="text" class="ui-input-text ui-body-d ui-corner-all ui-shadow-inset" style="font-size:13;"/> -->
			<input value="" id="careOf" type="text" class="ADtext edit-text" style="font-size:13;"/>
			
			<label for="censusTract" style=" font-weight: bold; text-shadow: none; font-size:13;">Census Tract</label>
			<!-- <input value="" id="censusTract" type="text" class="ui-input-text ui-body-d ui-corner-all ui-shadow-inset" style="font-size:13;"/> -->
			<input value="" id="censusTract" type="text" class="ADtext edit-text" style="font-size:13;"/>
			
			<label for="deliveryAddressLine" style=" font-weight: bold; text-shadow: none; font-size:13;">Delivery Address Line</label>
			<!-- <input value="" id="deliveryAddressLine" type="text" class="ui-input-text ui-body-d ui-corner-all ui-shadow-inset" style="font-size:13;"/> -->
			<input value="" id="deliveryAddressLine" type="text" class="ADtext edit-text" style="font-size:13;"/>
			
			<label for="deliveryInstallationType" style=" font-weight: bold; text-shadow: none; font-size:13;">Delivery Installation Type</label>
			<!-- <input value="" id="deliveryInstallationType" type="text" class="ui-input-text ui-body-d ui-corner-all ui-shadow-inset" style="font-size:13;"/> -->	
			<input value="" id="deliveryInstallationType" type="text" class="ADtext edit-text" style="font-size:13;"/>

			<label for="deliveryInstallationArea" style=" font-weight: bold; text-shadow: none; font-size:13;">Delivery Installation Area</label>
			<!-- <input value="" id="deliveryInstallationArea" type="text" class="ui-input-text ui-body-d ui-corner-all ui-shadow-inset" style="font-size:13;"/> -->
			<input value="" id="deliveryInstallationArea" type="text" class="ADtext edit-text" style="font-size:13;"/>
			
			<label for="deliveryInstallationQualifier" style=" font-weight: bold; text-shadow: none; font-size:13;">Delivery Installation Qualifier</label>
			<!-- <input value="" id="deliveryInstallationQualifier" type="text" class="ui-input-text ui-body-d ui-corner-all ui-shadow-inset" style="font-size:13;"/> -->
			<input value="" id="deliveryInstallationQualifier" type="text" class="ADtext edit-text" style="font-size:13;"/>
			
			<label for="deliveryMode" style=" font-weight: bold; text-shadow: none; font-size:13;">Delivery Mode</label>
			<!-- <input value="" id="deliveryMode" type="text" class="ui-input-text ui-body-d ui-corner-all ui-shadow-inset" style="font-size:13;"/> -->
			<input value="" id="deliveryMode" type="text" class="ADtext edit-text" style="font-size:13;"/>
			
			<label for="deliveryModeIdentifier" style=" font-weight: bold; text-shadow: none; font-size:13;">Delivery Mode Identifier</label>
			<!-- <input value="" id="deliveryModeIdentifier" type="text" class="ui-input-text ui-body-d ui-corner-all ui-shadow-inset" style="font-size:13;"/> -->
			<input value="" id="deliveryModeIdentifier" type="text" class="ADtext edit-text" style="font-size:13;"/>
			
			<label for="buildingNumberSuffix" style=" font-weight: bold; text-shadow: none; font-size:13;">Building Number Suffix</label>
			<!-- <input value="" id="buildingNumberSuffix" type="text" class="ui-input-text ui-body-d ui-corner-all ui-shadow-inset" style="font-size:13;"/> -->
			<input value="" id="buildingNumberSuffix" type="text" class="ADtext edit-text" style="font-size:13;"/>
			
			<label for="postBox" style=" font-weight: bold; text-shadow: none; font-size:13;">Post Box</label>
			<!-- <input value="" id="postBox" type="text" class="ui-input-text ui-body-d ui-corner-all ui-shadow-inset" style="font-size:13;"/> -->
			<input value="" id="postBox" type="text" class="ADtext edit-text" style="font-size:13;"/>
			
			<label for="precinct" style=" font-weight: bold; text-shadow: none; font-size:13;">Precinct</label>
			<!-- <input value="" id="precinct" type="text" class="ui-input-text ui-body-d ui-corner-all ui-shadow-inset" style="font-size:13;"/> -->	
			<input value="" id="precinct" type="text" class="ADtext edit-text" style="font-size:13;"/>
			
			
			<!-- <a data-inline="true" data-role="button" href="#" data-theme="c" class="ui-btn ui-btn-inline ui-btn-corner-all ui-shadow ui-btn-up-c" id="editorADOk">
				<span class="ui-btn-inner ui-btn-corner-all">
					<span class="ui-btn-text">OK</span>
				</span>
			</a>	
			
			<a data-inline="true" data-role="button" href="#" data-theme="c" class="ui-btn ui-btn-inline ui-btn-corner-all ui-shadow ui-btn-up-c" id="editorADCancel">
				<span class="ui-btn-inner ui-btn-corner-all">
					<span class="ui-btn-text">CANCEL</span>
				</span>
			</a> -->																																																																												
		
		</div>	
	</xsl:template>

</xsl:stylesheet>