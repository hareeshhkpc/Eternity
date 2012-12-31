<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:include href="DatatypeEditors.xsl" />
	<xsl:output indent="yes" method="html" />

	<xsl:variable name="config"
		select="document('../xml/personRegConfig.xml')" />
	<xsl:template match="/">
		<xsl:apply-templates />

		<!-- div created to hold the editors and find type is called to include 
			all the data type editors -->
		<div id="editorDom" style="display:none;">
			<xsl:apply-templates mode="find-type" select="." />
		</div>
	</xsl:template>

	<xsl:template match="table">
		<table
			style="border-collapsed:collapsed;border:0px solid #cccccc;width:100%">
			<xsl:apply-templates />
		</table>
	</xsl:template>

	<xsl:template match="row">
		<tr>
			<xsl:apply-templates />
		</tr>
	</xsl:template>

	<xsl:template match="column">
		<td colspan="{@colspan}" rowspan="{@rowspan}">
			<xsl:apply-templates />
		</td>
	</xsl:template>

	<xsl:template match="element">
		<xsl:variable name="id" select="@id" />
		<xsl:variable name="idValue">
			<xsl:value-of select="concat('h',$id)" />
		</xsl:variable>
		<xsl:variable name="field" select="$config//Field[@id=$id]"></xsl:variable>

		<!-- div id="wrapper{$idValue}">

			<fieldset class="ui-grid-a">
				<div class="ui-block-a">
					<label>
						<xsl:value-of select="$field/@label" />
						<xsl:if test="count(@align) = 0">
							:
						</xsl:if>
					</label>
				</div>

				<xsl:if test="@align = 'vertical'">
					<br />
				</xsl:if>

				<div class="ui-block-b">
					<span class="subField{$idValue}" id="subField{$idValue}">
						<div
							class="normal ui-input-text ui-body-c ui-corner-all ui-shadow-inset"
							style="width:100%;height:30px" datatype="{@type}" elementType="Fields"
							id="{$idValue}" label="{@label}">
						</div>
					</span>
				</div>
			</fieldset>
		</div-->


		<!--div id="wrapper{$idValue}">
			<div class="subField{$idValue}" id="subField{$idValue}">
				<label for="{$idValue}" id="label{$idValue}">
					<font size="2">
						<xsl:value-of select="$field/@label" />
					</font>
				</label>
				<div class="ui-body  ui-grid-b ui-body-c ui-corner-all ui-shadow-inset "
					style="width: 80%;  height:20px;background-color:#CCCCCC;margin-top:4px;">

					<fieldset class="ui-grid-c"
						style="margin-top:-12px;margin-right:-10px;">

						<div class="Fields ui-body ui-block-a"
							style="width: 96%;font-size:13; float: left;margin-top:14px;"
							datatype="{$field/@type}" elementType="Fields" id="{$idValue}" label="{@label}">
						</div>
						<div class="ui-block-b">
						<a href="#" data-role="button" id="plus{$idValue}" data-theme="a" data-icon="plus" data-iconpos="notext" class="addField ui-btn-up-a ui-btn-icon-notext plusIcon" title="">
							<span class="ui-btn-inner">
								<span class="ui-btn-text"></span>
								<span class="ui-icon ui-icon-plus ui-icon-shadow"></span>
							</span>
						</a>
						</div>

					</fieldset>
					
				</div>
			</div>
		</div-->
		
		<div id="wrapper{$idValue}">
		<div class="subField{$idValue} ui-grid-c" id="subField{$idValue}">
				<div class="ui-block-a">
				<label id="label{$idValue}" for="{$idValue}">
					<xsl:value-of select="$field/@label"/>
				</label>
				</div>
				
				<xsl:if test="@align = 'vertical'">
					<br />
				</xsl:if>
				<!--fieldset class="view-fieldset"-->
						<div class="Fields  ui-block-b  ui-input-text ui-body-c ui-corner-all ui-shadow-inset" style="height:20px;background-color:#CCCCCC;padding:10px;" datatype="{$field/@type}" elementtype="Fields" id="{$idValue}"  label="{$field/@label}"></div>
						<!-- <div class="view-block-b"></div> -->
						<xsl:if test="$field/@maxOccurs > 1"> 							
						<div class="ui-block-c">
							<a href="#" data-role="button" id="plus{$idValue}" data-theme="a" data-icon="plus" data-iconpos="notext" class="addField ui-btn-up-a ui-btn-icon-notext plusIcon" title="">
								<span class="ui-btn-inner">
									<span class="ui-btn-text"></span>
									<span class="ui-icon ui-icon-plus ui-icon-shadow"></span>
								</span>
							</a>
					  </div>
					  </xsl:if>
				<!--  /fieldset>-->
		</div>
		</div>
	</xsl:template>



	<xsl:template mode="id-generation" match="Field">
		<xsl:variable name="elementId" select="@id" />
		<xsl:value-of select="concat('h',$elementId)" />
	</xsl:template>

</xsl:stylesheet>