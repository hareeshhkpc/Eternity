<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xalan="http://xml.apache.org/xslt"
	xmlns:helper="com.hin.hl7messaging.configuration.XSLHelper"
	exclude-result-prefixes="xsi xsl xalan helper" version="1.0">

<xsl:param name="helper" />
<xsl:output method="html" indent="yes" />
	
	<xsl:template match="/">
			<html>
		 		<head>
		 			<link rel="stylesheet" type="text/css" href="MessageView.css" />
		 		</head>
		 		<body>
			 		<xsl:variable name="rootElement" select="name(/*)"/>
					<xsl:message><xsl:value-of select="$rootElement"/></xsl:message><br/>
						<xsl:choose>
							<xsl:when test="$rootElement = 'POLB_IN224200'">
								<div class="InboxView1">
									<table cellpadding="5">
										<tr>
											<td rowspan="6">
												<img src="../out/image/Services.png" height="100" width="100%"/> 
											</td>
										</tr>
										<tr>
											<td style="font-weight: bold">Profile ID</td>
											<td> <xsl:value-of select="/POLB_IN224200/id/@root"/></td>
										</tr>
										<tr>
											<td style="font-weight: bold">Creation Time</td>
											<td><xsl:value-of select="/POLB_IN224200/creationTime/@value"/></td>
										</tr>
										<tr>
											<td style="font-weight: bold">Patient Name</td>
											<td><xsl:value-of select="/POLB_IN224200/controlActProcess/subject/observationBattery/recordTarget/patientClinical/patientPerson/name"/></td>
										</tr>
										<tr>
											<td style="font-weight: bold">Address</td>
											<td><xsl:value-of select="/POLB_IN224200/controlActProcess/subject/observationBattery/recordTarget/patientClinical/addr"/></td>
										</tr>
										<tr>
											<td style="font-weight: bold">Organisation</td>
											<td><xsl:value-of select="/POLB_IN224200/controlActProcess/subject/observationBattery/subject/specimen/productOf/process/performer/assignedEntity/assignedOrganization/name"/></td>
										</tr>
									</table>
								</div>
							</xsl:when>
							
							<xsl:when test="$rootElement= 'POLB_IN555'">
								<div class="InboxView2">
									<table cellpadding="5">
										<tr>
											<td rowspan="6">
												<img src="../out/image/lab.png"  height="100" width="95%"/>
											</td>
										</tr>
										<tr>
											<td style="font-weight: bold">Profile ID</td> 
											<td><xsl:value-of select="/POLB_IN555/id/@root"/></td> </tr>
										<tr>
											<td style="font-weight: bold">Patient Name</td>
											<td><xsl:value-of select="/POLB_IN555/controlActProcess/subject/observationBattery/recordTarget/patientClinical/patientPerson/name"/></td>
										</tr>
										<tr>
											<td style="font-weight: bold">Gender</td>
											<td><xsl:value-of select="/POLB_IN555/controlActProcess/subject/observationBattery/recordTarget/patientClinical/patientPerson/profile/gender"/></td>
										</tr>
										<tr>
											<td style="font-weight: bold">DOB</td>
											<td><xsl:value-of select="/POLB_IN555/controlActProcess/subject/observationBattery/recordTarget/patientClinical/patientPerson/profile/dob"/></td>
										</tr>
										<tr>
											<td style="font-weight: bold">Address</td>
											<td><xsl:value-of select="/POLB_IN555/controlActProcess/subject/observationBattery/recordTarget/patientClinical/addr"/></td>
										</tr>
									</table>
								</div> 
							</xsl:when>	
							
							<xsl:when test="$rootElement = 'POLB_IN790'">
								<div class="InboxView1">
									<table cellpadding="5">
										<tr>
											<td rowspan="6">
												<img src="../out/image/Appointment.png"  height="100" width="105%"/>
											</td>
										</tr>
										<tr>
											<td style="font-weight: bold">Profile ID</td> 
											<td><xsl:value-of select="POLB_IN790/id/@root"/></td>
										</tr>
										<tr>
											<td style="font-weight: bold">Patient Name</td>
											<td><xsl:value-of select="POLB_IN790/controlActProcess/subject/observationBattery/recordTarget/patientClinical/patientPerson/name"/></td>
										</tr>
										<tr>
											<td style="font-weight: bold">Gender</td>
											<td><xsl:value-of select="POLB_IN790/controlActProcess/subject/observationBattery/recordTarget/patientClinical/patientPerson/profile/gender"/></td>
										</tr>
										<tr>
											<td style="font-weight: bold">DOB</td>
											<td><xsl:value-of select="POLB_IN790/controlActProcess/subject/observationBattery/recordTarget/patientClinical/patientPerson/profile/dob"/></td>
										</tr>
										<tr>
											<td style="font-weight: bold">Address</td>
											<td><xsl:value-of select="POLB_IN790/controlActProcess/subject/observationBattery/recordTarget/patientClinical/addr"/></td>
										</tr>
									</table>
								</div>
							</xsl:when>
							
							<xsl:when test="$rootElement = 'POLB_IN156'">
								<div class="InboxView2">
									<table cellpadding="5">
										<tr>
											<td rowspan="5">
												<img src="../out/image/notification.jpg"  height="90" width="95%"/>
											</td>
										</tr>
										<tr>
											<td style="font-weight: bold">Prifile ID</td>
											<td><xsl:value-of select="POLB_IN156/id/@root"/></td>
										</tr>	
										<tr>
											<td style="font-weight: bold">Patient Name</td>
											<td><xsl:value-of select="POLB_IN156/controlActProcess/subject/observationBattery/recordTarget/patientClinical/patientPerson/name"/></td>
										</tr>	
										<tr>
											<td style="font-weight: bold">Gender</td>
											<td><xsl:value-of select="POLB_IN156/controlActProcess/subject/observationBattery/recordTarget/patientClinical/patientPerson/profile/gender"/></td>
										</tr>
										<tr>
											<td style="font-weight: bold">Address</td>
											<td><xsl:value-of select="POLB_IN156/controlActProcess/subject/observationBattery/recordTarget/patientClinical/addr"/></td>
										</tr>
									</table>
								</div>
							</xsl:when>
							<xsl:when test="$rootElement = 'PRPA_IN101001UV01'">
							<div class="messages">
								<span
									style="padding:10px; margin-top:10px;font-family:Calibri; font-size:18px; font-weight:bold; color:#00923f;">Appointment</span>
			
								<div class="close"></div>
								<div class="inner_photo">
									<img src="../out/image/Services.png" height="100" width="100%" />
								</div>
								<div class="message_list">
									<ul id="listing">
										<li>
											<xsl:value-of
												select="PRPA_IN101001UV01/controlActProcess/subject/registrationEvent/subject1/identifiedPerson/identifiedPerson/name/given" />
										</li>
										<li><xsl:value-of select="PRPA_IN101001UV01/id/@root" /> </li>
										<li>36 years old </li>
										<li>
											<xsl:value-of select="PRPA_IN101001UV01/creationTime/@value" />
										</li>
										<li>First Visit</li>
									</ul>
								</div>
			
								<div class="app_buttons">
									<span class="button">
										<button type="submit" tabindex="12" id="btnAccount" name="btnAccount">Respond</button>
									</span>
								</div>
							</div>
						</xsl:when>
													
							<xsl:otherwise>
								<div>
									<h3>Unknown message</h3>
								</div>
							</xsl:otherwise>	
						</xsl:choose>
					</body>
				</html>
	</xsl:template>
</xsl:stylesheet>




















					