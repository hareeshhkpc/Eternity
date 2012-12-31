<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xalan="http://xml.apache.org/xslt"
	xmlns:dyn="http://exslt.org/dynamic" extension-element-prefixes="dyn"
	xmlns:helper="com.hin.hl7messaging.configuration.XSLHelper"
	exclude-result-prefixes="xsi xsl xalan" version="1.0">

	<xsl:output method="xml" indent="yes" />
	<xsl:param name="helper" />

	<xsl:param name="xpath"
		select="/config/anonymTypes/complex/type[@name='AnonymComplex_1']" />
	<xsl:variable name="var1"></xsl:variable>

	<xsl:template match="/">
		<xsl:apply-templates select="$xpath" mode="message-defn">
		</xsl:apply-templates>

</xsl:template>

<xsl:template
		match="anonymTypes/complex/type | message-element-type-definitions/message-element"
		mode="message-defn">
		<xsl:param name="XpathFragment">
			$message/POLB_IN224200
		</xsl:param>

		<xsl:message>
			<xsl:value-of select="$XpathFragment" />
		</xsl:message>


		<xsl:for-each select="current()//element">			
				<xsl:if test="@category = 'hl7'">
						<xsl:variable name="attr">
							@*
						</xsl:variable>
						<xsl:variable name="hl7ElementXpath"
							select="concat($XpathFragment,'/',@label ,'/',$attr)" />
						
						<xsl:variable name="message" select="document('PRPA_EX001001.xml')" />
						<xsl:variable name="attrValue" select="dyn:evaluate($hl7ElementXpath)" />
						<xsl:if test="$attrValue != ''">
							<div>
							<xsl:value-of select="@label" /> : <xsl:value-of select="$attrValue" />
							</div>							
						</xsl:if>
						
					</xsl:if>
					
				<xsl:if test="@category = 'rim'">
					
						<xsl:if test="helper:hasVisited($helper,@type) = false">
							<xsl:variable name="MessageEleType"
								select="helper:keepVisited($helper,@type)" />
							<xsl:variable name="TempXpath"
								select="concat($XpathFragment, '/' , @label)" />
							<xsl:apply-templates
								select="/config/message-element-type-definitions/message-element[@name=$MessageEleType]"
								mode="message-defn">
								<xsl:with-param name="XpathFragment" select="$TempXpath" />
							</xsl:apply-templates>
						</xsl:if>

				</xsl:if>
		</xsl:for-each>
	</xsl:template>



</xsl:stylesheet>


