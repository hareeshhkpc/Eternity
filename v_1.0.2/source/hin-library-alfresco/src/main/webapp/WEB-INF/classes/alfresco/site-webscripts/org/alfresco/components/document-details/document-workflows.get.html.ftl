<#if workflows??>
   <#include "../../include/alfresco-macros.lib.ftl" />
   <#assign el=args.htmlid?js_string>
   <script type="text/javascript">//<![CDATA[
   new Alfresco.DocumentWorkflows("${el}").setOptions(
   {
      nodeRef: "${nodeRef?js_string}",
      siteId: <#if site??>"${site?js_string}"<#else>null</#if>,
      destination: "${destination}"
   }).setMessages(
      ${messages}
   );
   //]]></script>

</#if>