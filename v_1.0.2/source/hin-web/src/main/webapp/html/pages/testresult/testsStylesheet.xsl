<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"
                xmlns="http://www.w3.org/1999/xhtml">
  <xsl:template match="card">
    <html>
      <head>
        <title><xsl:value-of select="name/text()"/></title>
      </head>
      <body bgcolor="#ffffff">
        <table border="3">
          <tr>
            <td>
            <xsl:for-each select="eternitytest">
              <xsl:apply-templates select="testname"/><br/></xsl:for-each>
            </td>
          </tr>
        </table>
      </body>
    </html>
  </xsl:template> 

  <xsl:template match="testname">
    <xsl:value-of select="text()"/>
  </xsl:template>
</xsl:stylesheet>