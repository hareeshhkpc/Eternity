<#assign activePage = page.url.templateArgs.pageid?lower_case!"">
<div id="${args.htmlid}-body" class="toolbar userprofile" >
   <div class="link"><a href="profile" style="color:#6b1e64" <#if activePage=="profile">class="activePage theme-color-4"</#if>>${msg("link.info")}</a></div>
   <!--<div class="separator">&nbsp;</div>-->
   <!--<div class="link"><a href="user-sites" style="color:#6b1e64" <#if activePage=="user-sites">class="activePage theme-color-4"</#if>>${msg("link.sites")}</a></div>
   <div class="separator">&nbsp;</div>-->
  <!-- <div class="link"><a href="user-content" style="color:#6b1e64" <#if activePage=="user-content">class="activePage theme-color-4"</#if>>${msg("link.content")}</a></div>-->
 <!--  <#if activeUserProfile>
      <#if following &gt; -1>
   <div class="separator">&nbsp;</div>-->
  <!-- <div class="link"><a href="following" style="color:#6b1e64" <#if activePage=="following">class="activePage theme-color-4"</#if>>${msg("link.following")} (${following})</a></div>
      </#if>
      <#if followers &gt; -1>
   <div class="separator">&nbsp;</div>
   <div class="link"><a href="followers" style="color:#6b1e64"<#if activePage=="followers">class="activePage theme-color-4"</#if>>${msg("link.followers")} (${followers})</a></div>
      </#if>
      <#if user.capabilities.isMutable>
   <div class="separator">&nbsp;</div>-->
   <!--<div class="link"><a href="change-password" style="color:#6b1e64" <#if activePage=="change-password">class="activePage theme-color-4"</#if>>${msg("link.changepassword")}</a></div>
      </#if>
   <div class="separator">&nbsp;</div>-->
   <!--<div class="link"><a href="user-notifications" style="color:#6b1e64" <#if activePage=="user-notifications">class="activePage theme-color-4"</#if>>${msg("link.notifications")}</a></div>
   <#else>-->
      <!--<#if following &gt; -1>
   <div class="separator">&nbsp;</div>-->
   <!--<div class="link"><a href="following" style="color:#6b1e64" <#if activePage=="following">class="activePage theme-color-4"</#if>>${msg("link.otherfollowing")} (${following})</a></div>
      </#if>
   </#if>
</div>-->
<!--<#assign activePage = page.url.templateArgs.pageid?lower_case!"">
<div id="${args.htmlid}-body" class="toolbar userprofile" >
   <div class="newlink"><a href="profile"  <#if activePage=="profile">class="activePage theme-color-4"</#if>>${msg("link.info")}</a></div>
   <div class="separator">&nbsp;</div>
   <div class="newlink"><a href="user-sites"  <#if activePage=="user-sites">class="activePage theme-color-4"</#if>>${msg("link.sites")}</a></div>
   <div class="separator">&nbsp;</div>
   <div class="newlink"><a href="user-content" <#if activePage=="user-content">class="activePage theme-color-4"</#if>>${msg("link.content")}</a></div>
   <#if activeUserProfile>
      <#if following &gt; -1>
   <div class="separator">&nbsp;</div>
   <div class="newlink"><a href="following" <#if activePage=="following">class="activePage theme-color-4"</#if>>${msg("link.following")} (${following})</a></div>
      </#if>
      <#if followers &gt; -1>
   <div class="separator">&nbsp;</div>
   <div class="newlink"><a href="followers" <#if activePage=="followers">class="activePage theme-color-4"</#if>>${msg("link.followers")} (${followers})</a></div>
      </#if>
      <#if user.capabilities.isMutable>
   <div class="separator">&nbsp;</div>
   <div class="newlink"><a href="change-password"  <#if activePage=="change-password">class="activePage theme-color-4"</#if>>${msg("link.changepassword")}</a></div>
      </#if>
   <div class="separator">&nbsp;</div>
   <div class="newlink"><a href="user-notifications"  <#if activePage=="user-notifications">class="activePage theme-color-4"</#if>>${msg("link.notifications")}</a></div>
   <#else>
      <#if following &gt; -1>
   <div class="separator">&nbsp;</div>
   <div class="newlink"><a href="following" <#if activePage=="following">class="activePage theme-color-4"</#if>>${msg("link.otherfollowing")} (${following})</a></div>
      </#if>
   </#if>
</div>-->