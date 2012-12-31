<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns="http://www.w3.org/TR/REC-html40">

<xsl:output method="xml" indent="yes"/>
<xsl:param name="xpath" select="//anonymTypes/complex/type[@name='AnonymComplex_1']" />

	<xsl:template match="/">
		<xsl:apply-templates select="$xpath" mode="message-type-definitions" />
	</xsl:template>
	
	<xsl:template match="anonymTypes/complex/type | message-element-type-definitions/message-element" mode="message-type-definitions">
		<xsl:for-each select="current()//element">
				 
				 <xsl:if test="@category = 'hl7' ">
						<xsl:element name="{@name}">
							<xsl:attribute name="_i"><xsl:value-of select="@e_id "/> </xsl:attribute>
							<xsl:attribute name="_u"><xsl:value-of select="@use"/></xsl:attribute>
							<xsl:attribute name="_mn"><xsl:value-of select="@minOccurs "/></xsl:attribute>
							<xsl:attribute name="_mx"><xsl:value-of select="@maxOccurs "/></xsl:attribute>
							
						</xsl:element> 
				</xsl:if>
				
				<!-- <xsl:if test="@category = 'rim' and [@use='required'] ">
					<xsl:element name="{@name}">
						<xsl:attribute name="_i"><xsl:value-of select="@e_id "/> </xsl:attribute>
						<xsl:attribute name="_u"><xsl:value-of select="@use"/></xsl:attribute>
						<xsl:attribute name="_mn"><xsl:value-of select="@minOccurs "/></xsl:attribute>
						<xsl:attribute name="_mx"><xsl:value-of select="@maxOccurs "/></xsl:attribute>
					</xsl:element>			
				</xsl:if>   -->
  		</xsl:for-each>
  		
 	</xsl:template>
	
</xsl:stylesheet>