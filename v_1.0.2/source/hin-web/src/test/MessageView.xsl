<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
xmlns="http://www.w3.org/TR/REC-html40">
	<xsl:output method="xml" indent="yes" />
	
	<xsl:param name=""></xsl:param>
	
	<xsl:template match="/">
		<xsl:apply-templates select="/config/root-elements" />
	</xsl:template>
	
	<xsl:template match="root-elements">
		<xsl:element name="{current()/element/@name}">			
			<xsl:apply-templates select="//type[@name=current()/element/@type]" />
			<xsl:element name="simpleText">Hello World</xsl:element>
		</xsl:element>	
	</xsl:template>
	
	<xsl:template match="message-element | type">
		<xsl:param name="count">1</xsl:param>
		
		<xsl:message><xsl:value-of select="$count"/></xsl:message>
		
		<xsl:for-each select="current()//attribute">
			<xsl:attribute name="{@name}"></xsl:attribute>
		</xsl:for-each>
		<xsl:for-each select="current()//element">
			<xsl:variable name="countPlusPosition" select="$count + position()"/>
			<xsl:element name="{@name}">
				<xsl:choose>
					<xsl:when test="@category='hl7'">
						<xsl:message>Type: <xsl:value-of select="@type"/></xsl:message>
						<xsl:variable name="typeName" select="@type" />
						<xsl:apply-templates select="//hl7[@name=$typeName]" />
					</xsl:when>
					<xsl:when test="@category='rim' and @use != 'optional'">
						<xsl:message>RIM Type: <xsl:value-of select="@type"/></xsl:message>
						<xsl:variable name="typeName" select="@type" />
						<xsl:apply-templates select="//message-element[@name=$typeName]">
							<xsl:with-param name="count" select="$countPlusPosition + 1" />
						</xsl:apply-templates>
					</xsl:when>
				</xsl:choose>
			</xsl:element>
		</xsl:for-each>
	
		
	</xsl:template>
	
	<xsl:template match="hl7">
		<xsl:message>Current HL7 Type: <xsl:value-of select="@name"/></xsl:message>
		<xsl:for-each select="current()//attribute">
			<xsl:attribute name="{@name}"></xsl:attribute>
		</xsl:for-each>
		<xsl:for-each select="current()//element">
			<xsl:element name="{@name}">
				<xsl:apply-templates select="//hl7[@name=@type]" />
			</xsl:element>
		</xsl:for-each>		
	</xsl:template>
	
</xsl:stylesheet>