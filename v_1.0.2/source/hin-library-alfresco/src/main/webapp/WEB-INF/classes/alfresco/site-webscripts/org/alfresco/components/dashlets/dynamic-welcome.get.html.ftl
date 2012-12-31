<#if showDashlet>
   <#assign el=args.htmlid?html>
   <div class="dashlet dynamic-welcome" >
     <!-- <a href="#" class="welcome-close-button" id="page_x002e_full-width-dashlet_x002e_user_x007e_admin_x007e_dashboard_x0023_default-close-button">
         <img src="/share/res/components/images/delete-16.png">
         <span>Remove</span>
      </a>-->
      <div class="welcome-body">
         <div class="welcome-info">
            <h1>Welcome to your dashboard</h1>
           <p class="welcome-info-text"></p>
            <!--<h2>Let's get you started...</h2>-->
         </div>
         <div>
            <div class="welcome-left-container">
               <div class="welcome-middle-container">
                  <div class="welcome-right-container">
                     <div class="welcome-details-column welcome-details-column-0">
                        <div class="welcome-details-column-image">
                           <img src="/hin-library-alfresco-1.0-SNAPSHOT/res/components/images/help-tutorial-bw-64.png">
                         </div>
                         <div class="welcome-details-column-info">
                           <h3>Learning</h3>
                           <p class="welcome-details-column-info-text"></p>
                        </div>
                        <div style="height:0;" class="welcome-height-adjuster">&nbsp;</div>
                     </div>
                     <div class="welcome-details-column welcome-details-column-1">
                        <div class="welcome-details-column-image">
                           <img src="/hin-library-alfresco-1.0-SNAPSHOT/res/components/images/Research.png">
                         </div>
                         <div class="welcome-details-column-info">
                           <h3>Research</h3>
                           <!--<p class="welcome-details-column-info-text">Create a site to share content with other site members.</p>-->
                        </div>
                        <div style="height:0;" class="welcome-height-adjuster">&nbsp;</div>
                     </div>
                     <div class="welcome-details-column welcome-details-column-2">
                       <!-- <div class="welcome-details-column-image">
                           <img src="/share/res/components/images/help-avatar-bw-64.png">
                         </div>
                         <div class="welcome-details-column-info">
                           <h3>Personalizing</h3>
                           <p class="welcome-details-column-info-text">Update your personal and business information so others can get to know you.</p>
                        </div>-->
                        <div style="height:0;" class="welcome-height-adjuster">&nbsp;</div>
                     </div>
                  </div>
               </div>
            </div>
            <div style="height:0;" class="welcome-height-adjuster">&nbsp;</div>
         </div>

         <div class="welcome-details">
            <div class="welcome-left-container">
               <div class="welcome-middle-container">
                  <div class="welcome-right-container">
                     <div class="welcome-details-column welcome-details-column-0">
                        <div class="welcome-details-column-info">
                           <div class="welcome-details-column-info-vertical-spacer"></div>
                           <a href="${page.url.context}/page/repository">
                              <span>View the Documents</span>
                           </a>
                        </div>
                     </div>
                     <div class="welcome-details-column welcome-details-column-1">
                        <div class="welcome-details-column-info">
                           <div class="welcome-details-column-info-vertical-spacer"></div>
                           <a href="#" id="page_x002e_full-width-dashlet_x002e_user_x007e_admin_x007e_dashboard_x0023_default-createSite-button">
                              <span>Research</span>
                           </a>
                        </div>
                     </div>
                     <!--<div class="welcome-details-column welcome-details-column-2">
                        <div class="welcome-details-column-info">
                           <div class="welcome-details-column-info-vertical-spacer"></div>
                           <a href="/share/page/user/profile#edit">
                              <span>Edit your profile</span>
                           </a>
                        </div>
                     </div>-->
                  </div>
               </div>
            </div>
            <div class="welcome-height-adjuster">&nbsp;</div>
         </div>
      </div>
    </div>
</#if>