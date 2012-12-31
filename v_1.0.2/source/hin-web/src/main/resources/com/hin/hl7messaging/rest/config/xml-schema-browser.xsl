<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE stylesheet [
<!ENTITY nbsp  "&#160;" >
]>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xalan="http://xml.apache.org/xslt"
	xmlns:xs="http://www.w3.org/2001/XMLSchema"
	exclude-result-prefixes="xsl xalan">

	<xsl:strip-space elements="*" />
	
	<xsl:output method="text" indent="no" xalan:indent-amount="4"
		omit-xml-declaration="yes" />

	<xsl:param name="action" select="'list-roots'" /> <!-- list-roots/expand-type -->
	<xsl:param name="typeToExpand" />
	
	<xsl:param name="baseDir" />
	<xsl:param name="schemas" />
	<xsl:param name="messageType" />
	<xsl:param name="entryPoint" />
	<xsl:param name="configClassType" />

	<xsl:template match="/">
		<xsl:text>{</xsl:text>
		<xsl:if test="$messageType != ''">
			<xsl:text>"messageType":"</xsl:text><xsl:value-of select="$messageType"/><xsl:text>",</xsl:text>
		</xsl:if>
		<xsl:if test="$entryPoint != ''">
			<xsl:text>"entryPoint":"</xsl:text><xsl:value-of select="$entryPoint"/><xsl:text>",</xsl:text>
		</xsl:if>
		<xsl:text>"items":</xsl:text>
		<xsl:choose>
			<xsl:when test="$action = 'LIST_MESSAGE_TYPES'">
				<xsl:call-template name="list-message-types"/>
			</xsl:when>
			<xsl:when test="$action = 'LIST_ENTRY_POINTS'">
				<!-- <xsl:message>Message Type: <xsl:value-of select="$messageType"/></xsl:message> -->
				<xsl:call-template name="list-entry-points"/>
			</xsl:when>
			<xsl:when test="$action = 'SHOW_CLASS_VIEW'">
				<xsl:call-template name="load-class-view"/>
			</xsl:when>
		</xsl:choose>
		<xsl:text>}</xsl:text>
	</xsl:template>
	
	<xsl:template name="expand-entry-point">	
		<xsl:variable name="docPath" select="concat($baseDir,'/schemas/',$messageType)"/>
		<!-- <xsl:message>Document Path: <xsl:value-of select="$docPath"/></xsl:message> -->
		<xsl:variable name="entryType" select="document($docPath)//xs:complexType[@name = $entryPoint]"/>	
		<xsl:text>[{},</xsl:text>
			<xsl:for-each select="$entryType//xs:element">
				<xsl:text>,{</xsl:text>
					<xsl:variable name="min">
						<xsl:choose>
							<xsl:when test="count(@minOccurs) > 0">
								<xsl:choose>
									<xsl:when test="@minOccurs = 'unbounded'">-1</xsl:when>
									<xsl:otherwise><xsl:value-of select="@minOccurs"/></xsl:otherwise>
								</xsl:choose>
							</xsl:when>
							<xsl:otherwise>1</xsl:otherwise>
						</xsl:choose>
					</xsl:variable>
					<xsl:variable name="max">
						<xsl:choose>
							<xsl:when test="count(@maxOccurs) > 0">
								<xsl:choose>
									<xsl:when test="@maxOccurs = 'unbounded'">-1</xsl:when>
									<xsl:otherwise><xsl:value-of select="@maxOccurs"/></xsl:otherwise>
								</xsl:choose>
							</xsl:when>
							<xsl:otherwise>1</xsl:otherwise>
						</xsl:choose>
					</xsl:variable>
					<xsl:variable name="isHL7Type">
						<xsl:call-template name="check-if-coreschema-type">
							<xsl:with-param name="typeName" select="@type"/>
						</xsl:call-template>
					</xsl:variable>
					<xsl:text>"name":"</xsl:text><xsl:value-of select="@name"/><xsl:text>",</xsl:text>
					<xsl:text>"type":"</xsl:text><xsl:value-of select="@type"/><xsl:text>",</xsl:text>
					<xsl:text>"isHL7Type":"</xsl:text><xsl:value-of select="$isHL7Type"/><xsl:text>",</xsl:text>
					<xsl:text>"min":"</xsl:text><xsl:value-of select="$min"/><xsl:text>",</xsl:text>
					<xsl:text>"max":"</xsl:text><xsl:value-of select="$max"/><xsl:text>"</xsl:text>
				<xsl:text>}</xsl:text>	
			</xsl:for-each>
			<xsl:for-each select="$entryType//xs:group">
				<xsl:text>,{</xsl:text>
					<xsl:variable name="min">
						<xsl:choose>
							<xsl:when test="count(@minOccurs) > 0">
								<xsl:choose>
									<xsl:when test="@minOccurs = 'unbounded'">-1</xsl:when>
									<xsl:otherwise><xsl:value-of select="@minOccurs"/></xsl:otherwise>
								</xsl:choose>
							</xsl:when>
							<xsl:otherwise>1</xsl:otherwise>
						</xsl:choose>
					</xsl:variable>
					<xsl:variable name="max">
						<xsl:choose>
							<xsl:when test="count(@maxOccurs) > 0">
								<xsl:choose>
									<xsl:when test="@maxOccurs = 'unbounded'">-1</xsl:when>
									<xsl:otherwise><xsl:value-of select="@maxOccurs"/></xsl:otherwise>
								</xsl:choose>
							</xsl:when>
							<xsl:otherwise>1</xsl:otherwise>
						</xsl:choose>
					</xsl:variable>
					<xsl:text>"name":"</xsl:text><xsl:value-of select="@name"/><xsl:text>",</xsl:text>
					<xsl:text>"type":"</xsl:text><xsl:value-of select="@type"/><xsl:text>",</xsl:text>
					<xsl:text>"min":"</xsl:text><xsl:value-of select="$min"/><xsl:text>",</xsl:text>
					<xsl:text>"max":"</xsl:text><xsl:value-of select="$max"/><xsl:text>"</xsl:text>
				<xsl:text>}</xsl:text>	
			</xsl:for-each>
		<xsl:text>]</xsl:text>
	</xsl:template>
	
	<xsl:template name="list-message-types">		
		<xsl:text>[{},</xsl:text>
			<xsl:message>Total Schemas: <xsl:value-of select="count($schemas//schema)"></xsl:value-of> </xsl:message>
			<xsl:for-each select="$schemas//schema[@type != 'coreschemas']">
				<xsl:text>,{</xsl:text>
					<xsl:text>"name":"</xsl:text><xsl:value-of select="@name"/><xsl:text>",</xsl:text>
					<xsl:text>"type":"</xsl:text><xsl:value-of select="@name"/><xsl:text>",</xsl:text>
					<xsl:text>"min":"</xsl:text><xsl:value-of select="'1'"/><xsl:text>",</xsl:text>
					<xsl:text>"max":"</xsl:text><xsl:value-of select="'1'"/><xsl:text>"</xsl:text>
				<xsl:text>}</xsl:text>	
			</xsl:for-each>
		<xsl:text>]</xsl:text>
	</xsl:template>
	
	<xsl:template name="list-entry-points">		
		<xsl:text>[{},</xsl:text>
			<xsl:for-each select="/xs:schema/xs:complexType">
				<xsl:text>,{</xsl:text>
					<xsl:text>"name":"</xsl:text><xsl:value-of select="@name"/><xsl:text>",</xsl:text>
					<xsl:text>"type":"</xsl:text><xsl:value-of select="@name"/><xsl:text>",</xsl:text>
					<xsl:text>"min":"</xsl:text><xsl:value-of select="'1'"/><xsl:text>",</xsl:text>
					<xsl:text>"max":"</xsl:text><xsl:value-of select="'1'"/><xsl:text>"</xsl:text>
				<xsl:text>}</xsl:text>	
			</xsl:for-each>
		<xsl:text>]</xsl:text>
	</xsl:template>
	
	<xsl:template name="load-class-view">
		<xsl:for-each select="$schemas//schema[@type = 'schemas']">
			<xsl:variable name="docPath" select="concat($baseDir,'/schemas/',@name)"/>
			<!-- <xsl:message>Loading XSD from: <xsl:value-of select="$docPath"/> for searching type: <xsl:value-of select="$configClassType"/></xsl:message> -->
			<xsl:variable name="doc" select="document($docPath)"/>
			<!-- <xsl:message>XSD: <xsl:value-of select="@name"/>, Types: <xsl:value-of select="count($doc//xs:complexType[@name = $configClassType])"/>, configClassType: <xsl:value-of select="$configClassType"/></xsl:message> -->
			<!-- <xsl:message>Loaded XSD: <xsl:value-of select="$doc"/></xsl:message> -->
			<xsl:if test="count($doc//xs:complexType[@name = $configClassType]) > 0">
				<xsl:call-template name="class-view">
					<xsl:with-param name="classTypeName" select="$configClassType"></xsl:with-param>
					<xsl:with-param name="schemaName" select="@name"/>
				</xsl:call-template>
			</xsl:if>
		</xsl:for-each>
	</xsl:template>
	
	<xsl:template name="class-view">	
		<xsl:param name="classTypeName"/>
		<xsl:param name="schemaName"/>
		
		<xsl:variable name="docPath" select="concat($baseDir,'/schemas/',$schemaName)"/>
		<!-- <xsl:message>Document Path: <xsl:value-of select="$docPath"/></xsl:message> -->
		<xsl:variable name="classType" select="document($docPath)//xs:complexType[@name = $classTypeName]"/>	
		<xsl:text>[{},</xsl:text>
			<xsl:for-each select="$classType//xs:element">
				<xsl:text>,{</xsl:text>
					<xsl:variable name="min">
						<xsl:choose>
							<xsl:when test="count(@minOccurs) > 0">
								<xsl:choose>
									<xsl:when test="@minOccurs = 'unbounded'">-1</xsl:when>
									<xsl:otherwise><xsl:value-of select="@minOccurs"/></xsl:otherwise>
								</xsl:choose>
							</xsl:when>
							<xsl:otherwise>1</xsl:otherwise>
						</xsl:choose>
					</xsl:variable>
					<xsl:variable name="max">
						<xsl:choose>
							<xsl:when test="count(@maxOccurs) > 0">
								<xsl:choose>
									<xsl:when test="@maxOccurs = 'unbounded'">-1</xsl:when>
									<xsl:otherwise><xsl:value-of select="@maxOccurs"/></xsl:otherwise>
								</xsl:choose>
							</xsl:when>
							<xsl:otherwise>1</xsl:otherwise>
						</xsl:choose>
					</xsl:variable>
					<xsl:variable name="isHL7Type">
						<xsl:call-template name="check-if-coreschema-type">
							<xsl:with-param name="typeName" select="@type"/>
						</xsl:call-template>
					</xsl:variable>
					<xsl:text>"name":"</xsl:text><xsl:value-of select="@name"/><xsl:text>",</xsl:text>
					<xsl:text>"type":"</xsl:text><xsl:value-of select="@type"/><xsl:text>",</xsl:text>
					<xsl:text>"isHL7Type":"</xsl:text><xsl:value-of select="$isHL7Type"/><xsl:text>",</xsl:text>
					<xsl:text>"min":"</xsl:text><xsl:value-of select="$min"/><xsl:text>",</xsl:text>
					<xsl:text>"max":"</xsl:text><xsl:value-of select="$max"/><xsl:text>"</xsl:text>
				<xsl:text>}</xsl:text>	
			</xsl:for-each>
			<xsl:for-each select="$classType//xs:group">
				<xsl:text>,{</xsl:text>
					<xsl:variable name="min">
						<xsl:choose>
							<xsl:when test="count(@minOccurs) > 0">
								<xsl:choose>
									<xsl:when test="@minOccurs = 'unbounded'">-1</xsl:when>
									<xsl:otherwise><xsl:value-of select="@minOccurs"/></xsl:otherwise>
								</xsl:choose>
							</xsl:when>
							<xsl:otherwise>1</xsl:otherwise>
						</xsl:choose>
					</xsl:variable>
					<xsl:variable name="max">
						<xsl:choose>
							<xsl:when test="count(@maxOccurs) > 0">
								<xsl:choose>
									<xsl:when test="@maxOccurs = 'unbounded'">-1</xsl:when>
									<xsl:otherwise><xsl:value-of select="@maxOccurs"/></xsl:otherwise>
								</xsl:choose>
							</xsl:when>
							<xsl:otherwise>1</xsl:otherwise>
						</xsl:choose>
					</xsl:variable>
					<xsl:text>"name":"</xsl:text><xsl:value-of select="@name"/><xsl:text>",</xsl:text>
					<xsl:text>"type":"</xsl:text><xsl:value-of select="@type"/><xsl:text>",</xsl:text>
					<xsl:text>"min":"</xsl:text><xsl:value-of select="$min"/><xsl:text>",</xsl:text>
					<xsl:text>"max":"</xsl:text><xsl:value-of select="$max"/><xsl:text>"</xsl:text>
				<xsl:text>}</xsl:text>	
			</xsl:for-each>
		<xsl:text>]</xsl:text>
	</xsl:template>
	
	<xsl:template name="check-if-coreschema-type">		
		<xsl:param name="typeName"/>
		<xsl:variable name="typeIsHL7">
			<xsl:for-each select="$schemas//schema[@type = 'coreschemas']">
				<xsl:if test="document(concat($baseDir,'/coreschemas/',@name))//xs:schema/xs:complexType[@name = $typeName]">
					<xsl:value-of select="'true'"/>
				</xsl:if>
			</xsl:for-each>
		</xsl:variable>
		<xsl:choose>
			<xsl:when test="$typeIsHL7 = ''"><xsl:value-of select="'false'"/></xsl:when>
			<xsl:otherwise><xsl:value-of select="'true'"/></xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
</xsl:stylesheet>