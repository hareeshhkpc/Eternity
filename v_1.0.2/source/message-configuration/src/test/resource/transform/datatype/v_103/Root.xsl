<?xml version="1.0"?>
<xsl:stylesheet 
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
	exclude-result-prefixes="xsi xsl xalan"
	xmlns:xalan="http://xml.apache.org/xslt" 
	version="1.0">
	
	<xsl:import href="EN.xsl"/>
	<xsl:import href="IVL_TS.xsl"/>
	<xsl:import href="PQ.xsl"/>
	
	<xsl:strip-space elements="*"/>
	<xsl:output method="html" omit-xml-declaration="no" indent="no" />
	
	<xsl:param name="typeDelim">"!##$!"</xsl:param>
	
	<xsl:variable name="spacer"><xsl:text> </xsl:text></xsl:variable>	
	<xsl:variable name="dquote">"</xsl:variable>	

	<xsl:template match="/">
		<xsl:variable name="EN">
        	<xsl:apply-templates select="/config/hl7-type-definition/hl7[@name='EN']" mode="type-definitions-content" />
        </xsl:variable>
        <xsl:variable name="IVL_TS">
        	<xsl:apply-templates select="/config/hl7-type-definition/hl7[@name='IVL_TS']" mode="type-definitions-content" />
        </xsl:variable>
        <xsl:variable name="PQ">
        	<xsl:apply-templates select="/config/hl7-type-definition/hl7[@name='PQ']" mode="type-definitions-content" />
        </xsl:variable>{
	"HL7DOM": {
		"PQ": {
			"UI": <xsl:value-of select="$typeDelim" /><xsl:copy-of select="$PQ"/><xsl:value-of select="$typeDelim" />
		},		
		"IVL_TS": {
			"UI": <xsl:value-of select="$typeDelim" /><xsl:copy-of select="$IVL_TS"/><xsl:value-of select="$typeDelim" />
		},
		"EN": {
			"UI": <xsl:value-of select="$typeDelim" /><xsl:copy-of select="$EN"/><xsl:value-of select="$typeDelim" />
		}
	}
}</xsl:template>
	
</xsl:stylesheet>