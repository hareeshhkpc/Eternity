<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="xml"/>
	
<!-- <xsl:include href="datatypeXmlStructure.xsl"/> -->
	
	<xsl:template match="/">
	
		<!-- <xsl:apply-templates mode="root-element" select="HL7MessageConfiguration/MetaInfo"/> -->
		<xsl:element name="message">
			<xsl:attribute name="config"><xsl:value-of select="//HL7MessageConfiguration/MetaInfo/@artifactID"/></xsl:attribute>
		    <xsl:apply-templates mode="class-content" select="HL7MessageConfiguration/Class"/> 
		</xsl:element>
	</xsl:template>
	
	<xsl:template mode="root-element" match="MetaInfo">
		<xsl:element name="{@artifactID}">
			<!-- <xsl:attribute name="id"><xsl:value-of select="concat('x',@id)"/></xsl:attribute> -->
			
			<xsl:apply-templates mode="class-content" select="//HL7MessageConfiguration/Class"/>
		</xsl:element>
	</xsl:template>
	
	<xsl:template  mode="class-content" match="Class">
		<xsl:element name="{@tagName}">
			<xsl:for-each select="Attribute">
				<xsl:variable name="attrName" select="@tagName"/>
				<xsl:attribute name="{$attrName}"><xsl:value-of select="@fixedValue"/></xsl:attribute>
			</xsl:for-each>
			
			
		 	 <xsl:for-each select="Field">
		 	 
		 	 <xsl:element name="{@tagName}"/>
		 	 	 
		 	 		<!-- calling a template in the datatypeXmlStructure.xsl which calls a template which has the data type structure for each data type -->
		 	 	<!--  <xsl:apply-templates mode="datatype-indentifier" select=".">
		 	 	 	<xsl:with-param name="type" select="@type"></xsl:with-param>
		 	 	 </xsl:apply-templates> -->
		 	 	 
		 	 </xsl:for-each>
	 	 
	 	 	<xsl:for-each select="Class">
				<xsl:apply-templates mode="class-content" select="."/>				
			</xsl:for-each>	
		</xsl:element>	
	</xsl:template>
	
	
	
	
	
	
	
	
	
	<!-- <xsl:template mode="create-table" match="row">
	
		<xsl:for-each select="column">
			<xsl:variable name="id" select="@id"/>
			<xsl:variable name="field" select="$config//Field[@id=$id]"></xsl:variable>
			
			<xsl:apply-templates mode="create-column" select=".">
				<xsl:with-param name="field" select="$field"/>
			</xsl:apply-templates>
		</xsl:for-each>	
	</xsl:template>
	
	
	<xsl:template mode="create-column" match="column">
	<xsl:param name="field"/>
	
	<xsl:variable name="elementId" select="$field/@id"/>
	
		

	<xsl:variable name="idValue"> <xsl:value-of select="concat('h',$elementId)"/> </xsl:variable>
	
	<xsl:element name="{$field/@tagName}">
		<xsl:attribute name="id"> <xsl:value-of select="$idValue"/>  </xsl:attribute>
	</xsl:element>
 	
	</xsl:template> -->

	
	
</xsl:stylesheet>