<#macro filterTemplate>
<#assign filterIds = "">
<#nested>
<script type="text/javascript">//<![CDATA[
   new Alfresco.component.BaseFilter("Alfresco.DocListFilter", "${args.htmlid}").setFilterIds([${filterIds}]);
//]]></script>
</#macro>