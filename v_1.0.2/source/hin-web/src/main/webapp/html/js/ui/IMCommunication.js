function IMCommunication(renderingEngine)
{
	var renderingEngine    = renderingEngine;
	this.eventHandler = eventHandler;	
	this.className = "IMCommunication";
	/*
	 * CHATBOX_TYPE = 1 : Chat box will show you as pop-up box.
	 * CHATBOX_TYPE = 2 : Chat box will show you as Drag-down box in the contact list itself.
	 * CHATBOX_TYPE = 3 : Show you the three tab 1-Online,2-Off line and 3-Online Chat.
	 */
	var CHATBOX_TYPE = 3;
	
	var groupCharId = {};
	var userMap = {};	
	var userIdMap = {};	
	var serverLoggedUser = "";
	this.serverLoggedUser = new Array();
	this.messageList = new Array();
	var groupArray = new Array();
	var groupMap = {};
	var mySourceId = 0;
	var eUsername = "";
	var profileUserName = "";
	var accesUserId = 0;
	var myProfileId = 0;
	var eStatus=null;
	var loggedUsers= new Array();
	this.oldMessage = null;
	
	this.getOldMessage = getOldMessage;
	this.setOldMessage = setOldMessage;
	
	this.restructureChatBoxes = restructureChatBoxes;
	this.chatWith = chatWith;
	this.createChatBox = createChatBox;
	//this.chatHeartbeat = chatHeartbeat;
	this.closeChatBox = closeChatBox;
	this.toggleChatBoxGrowth = toggleChatBoxGrowth;
	this.activeChatBox = activeChatBox;
	this.checkChatBoxInputKey = checkChatBoxInputKey;
	this.chatFromSession = chatFromSession;
	//this.startChatSession = startChatSession;
	
	this.log = log;
	this.doFocus = doFocus;
	this.clearLog = clearLog;
	this.doOpen = doOpen;
	this.loadUserForChart = loadUserForChart;
	this.loadUserForChartRoom = loadUserForChartRoom;
	this.loadGroupChartRoom = loadGroupChartRoom;
	this.createLogedServerUser = createLogedServerUser;
	this.getClients = getClients;
	this.doClose = doClose;
	this.broadcastMsg  = broadcastMsg;
	this.broadcast = broadcast;
	this.checkKeepAlive = checkKeepAlive;
	this.usrKeyDnLsnr = usrKeyDnLsnr;
	this.msgKeyDnLsnr = msgKeyDnLsnr;
	this.elemFocusLsnr = elemFocusLsnr;
	this.exitPage = exitPage
	this.initPage = initPage;
	var imcommunicate = this;
	
	function eventHandler(event)
	{
		if(event.type == AppConstants.Event.MESSAGES_OPEN_CONTACT_EVENTS){
			//alert(""+event.data.profileId);
			try{		
				var profileVO  = renderingEngine.getComponent("Context").getProfileVO();
				if(CHATBOX_TYPE==1){					
					chatWith(userProfileID);
					chatFromSession(userProfileID,"","");
				}else if(CHATBOX_TYPE==2){
					createChatBox2(userProfileID,"client");
				}else if(CHATBOX_TYPE==3){
					userProfileID = (profileVO.subscriberId).replace(/\-/g, '_');	
					userName = (profileVO.name).replace(/\ /g, '_');	
					if(loggedUsers[userProfileID] == undefined){profileVO
						loggedUsers[userProfileID] = {userName : profileVO.userName,displayName : profileVO.name,profileId : userProfileID,picture : ""};
					}					
					imcommunicate.createChatBox_3(userProfileID,"client");
				//	$("#chat2_"+chatboxtitle).show();
					imcommunicate.reCreateChatbox(userProfileID);
					
				}else{
					notificationmsg.info("Chat Box type should be either 1 ,2 or 3");
				}
	
			}catch(e){	alert("Error during add to chart . "+e);return false;}
			
		}else if(event.type == AppConstants.Event.MESSAGES_USER_LOGGEDIN){
			try{
				var userVo = renderingEngine.getComponent("Context").getUserVo();
				profileUserName= (userVo.name == undefined ? userVo.userName : userVo.name);
				myProfileId = userVo.subscriberId;
				myProfileId=(myProfileId).replace(/\-/g, '_');
				eUsername = subscriberId.userName;
			}catch(e){	return false;}	
			
		}else if(event.type == AppConstants.Event.MESSAGES_WEBSOCKET_LOGIN_EVENTS){	
			if(myProfileId){
				imcommunicate.initPage();
				imcommunicate.doOpen(myProfileId);
			}
		}else if(event.type == AppConstants.Event.LOGOUT){			
			//doClose();
			loggedUsers = "";
			imcommunicate.doClose();
			//exitPage();			
			/*if($("#friendslist").html()!=null){
				alert($("#friendslist").html());
				$("#friendslist").html('');
			}*/
			//window.location.reload();
		}
	};
	this.creatingOnline = creatingOnline;
	function creatingOnline(){
		try{
			for(i=0;i<serverLoggedUser.length;i++ ) {
				var user = 0;
				var userId = 0;
				if(serverLoggedUser[i].split("@")[0] != myProfileId){
					user = serverLoggedUser[i].split("@")[0];
					userId = serverLoggedUser[i].split("@")[1];
					if($("#offline_"+user).html()!= null){
						$("#offline_"+user).remove();
					}
					if($("#online_"+user).html()==null && loggedUsers[user] != undefined){
						$("#onlinefriend").append('<div id="online_'+user+'"><div style="display:none">' + user + '</div>');
						$("#online_" + user ).append('<ul class="section menu"><li><a href="#" class="menuitem" ><div class="profile"><image src="../images/male_user.png"></image></div><div class="profilename">'+loggedUsers[user].userName+'</div></a><div id="status_'+user+'" class="imgactive"><div id="message_'+user+'"></div></div></li><div id="chat_'+user+'"></div></div><ul>');
						$("#online_"+ user).click(function()
						{
							 $("#chattingfriend").slideToggle("slow");
							 $("#onlinefriend").hide("slow");
							 $("#offlinefriend").hide("slow");
							 createChatBox_3($($(this).children()[0]).text(),"client");
							 reCreateChatbox($($(this).children()[0]).text())
						});
					}
				}
			}
			resetGroupUserList();
		}catch(e){
			notificationmsg.info("Connect Failed "+e);
			}
	};
	this.creatingOffline = creatingOffline;
	function creatingOffline(user){
		try{
			if($("#online_"+user).html() != null){
				$("#online_"+user).remove();
			}
			if($("#offline_"+user).html()==null && loggedUsers[user] != undefined){
				$("#offlinefriend").append('<div id="offline_'+user+'"><div style="display:none">' + user + '</div>');
				$("#offline_" + user ).append('<ul class="section menu"><li><a href="#" class="menuitem" ><div class="profile"><image src="../images/male_user.png"></image></div><div class="profilename">'+loggedUsers[user].userName+'</div></a><div id="status_'+user+'" class="imginactive"><div id="message_'+user+'"></div></div></li><div id="chat_'+user+'"></div></div></ul>');
				$("#offline_" + user).click(function(){					
					 $("#chattingfriend").slideToggle("slow");
					 $("#onlinefriend").hide("slow");
					 $("#offlinefriend").hide("slow");
					 createChatBox_3($($(this).children()[0]).text(),"client");
					 reCreateChatbox($($(this).children()[0]).text())
				});
			}
		}catch(e){notificationmsg.info(" creatingOffline " + e);}
	};
	
	///////////////////////////////////////////////////////////////////////////
	//<<<<<<<<<<<<<<<<<<  Chat Box Creation Outside >>>>>>>>>>>>>>//
	///////////////////////////////////////////////////////////////////////////
	
	var chatBox_ = new Array();
	var groupMembers = new Array();
	var usersInGroup = new Array();
	
	this.createChatBox_3 = createChatBox_3;
	function createChatBox_3(user,type){		
		var chatboxtitle = user;
		var leftheight = $('#left-side').css("height");
		var leftwidth = $('#left-side').css("width");
		var count = $('#left-side .easyui-tabs').length;		
		height = parseInt(leftheight);
		height = (height-130);
		height = (height-42*(count-1))
		if($("#chat2_"+chatboxtitle).html() == ''){			
			if((chatboxtitle+"").substring(0,3) != 100){	
				$("#chat2_"+chatboxtitle).append('<ul id="chatboxhead2" class="submenu"> ' + 
						'<div class="NJ"><div id="video_' + chatboxtitle + '" class="NK NK-Y8" title="Start video call">&nbsp;</div></div> ' + 
						'<div class="NJ"><div id="phone_' + chatboxtitle + '" class="NL NL-KF" title="Invite to voice/video chat">&nbsp;</div></div> '+
						//'<div><a id="old_session' + chatboxtitle + '" class="chatboxtitle" href="javascript:void(0)"><image src="images/old_session.png" class="old_session" title="old session"></a></div> '+ 
						'<div class="NJ"><div id="groupchat_' + chatboxtitle + '" class="NH NH-RYbm0e" title="Add people to this chat">&nbsp;</div></div> '+ 
						'<div class="NJ"><a id="closesess_' + chatboxtitle + '" class="chatboxoptions2" href="javascript:void(0)"><image src="images/endMessage.png" class="closesession" title="Message save and clear window"></a></div></li><li id="groupChatname'+chatboxtitle+'"><input id="entername'+chatboxtitle+'" value="Enter Name"/><button id="done'+chatboxtitle+'" class="donebutton">Invite</button></ul><div id="chatboxcontent_'+chatboxtitle+'" class="chatboxcontent2"></div><div id="active_' + chatboxtitle + '" class="chatboxinput2" ><textarea id="chatt_' + chatboxtitle + '" class="chatboxtextarea2" ></textarea></div>');
				if(type != "server"){
					//$("#chat2_"+chatboxtitle).slideToggle("slow");
					$("#chat2_"+chatboxtitle+".chatboxtextarea2").focus();
				}
				chatBox_.push(chatboxtitle);
			}else{
				$("#chattingfriend").append('<ul class="submenu" id="chatheader_'+chatboxtitle+'"><li><a href="#">' + loggedUsers[user].userName + '</a></li></ul><div id="chat2_' + chatboxtitle + '"></div>');
				$("#chat2_"+chatboxtitle).append('<ul id="chatboxhead2" class="submenu" style="background:#F5FCF6;border-bottom: 1px solid #C7E6AA;height: 31px;"><li><div><a id="groupchat_' + chatboxtitle + '" class="chatboxtitle" href="javascript:void(0)"><image src="images/tb_group_chat.png" class="groupchat" title="Add to group chat"></a></div><div><a id="userList_' + chatboxtitle + '" class="chatboxtitle" href="javascript:void(0)"><image src="images/users_list.png" class="groupchat" title="Show Users List"></a></div><div><a id="closesess_' + chatboxtitle + '" class="chatboxoptions2" href="javascript:void(0)"><image src="images/endMessage.png" class="closesession" title="Message save and clear window"></a></div></li></ul><div id="grpUsersList_'+chatboxtitle+'" class="grpUsersList_"></div><div id="groupChatname'+chatboxtitle+'"><input id="entername'+chatboxtitle+'" value="Enter Name"/><button id="done'+chatboxtitle+'">Done</button></div><div id="search_'+chatboxtitle+'" class="grpchatbox"><input id="search'+chatboxtitle+'" style="width:86%;" title="Search friends"/></div><div id="chatboxcontent_'+chatboxtitle+'" class="chatboxcontent2"></div><div id="active_' + chatboxtitle + '" class="chatboxinput2" ><textarea id="chatt_' + chatboxtitle + '" class="chatboxtextarea2" ></textarea></div>');
				$("#chat2_"+chatboxtitle).slideToggle("slow");
				$("#chat2_"+chatboxtitle+".chatboxtextarea2").focus();
				if(type=="server"){
					imcommunicate.showGroupUsersList(chatboxtitle,"server");
				}
				
				$("#userList_" + chatboxtitle).click(function(){
					imcommunicate.showGroupUsersList(chatboxtitle);
				});
				
			}
			$.each($('#left-side').find('.easyui-tabs'),function(key,value){			
				$(value).find('.chatboxcontent2').css('height',height+'px');
			});
			$("#chatt_"+chatboxtitle).css('width',parseInt(leftwidth)-15);
			if(type == "server"){
				if($("#chattingfriend").css('display') == 'none'){
					$("#chattingfriend").slideToggle("slow");
				}
			}
			
			/*$("#chatheader_" + chatboxtitle).click(function(){
				if($("#chat2_" + chatboxtitle).css('display')=='none'){
					$("#chat2_" + chatboxtitle).slideToggle("slow");
				}else{
					$("#chat2_" + chatboxtitle).hide("slow");
				}
				//imcommunicate.reCreateChatbox(chatboxtitle);
			});*/
			$("#closesess_" + chatboxtitle).click(function(){
				//imcommunicate.closeSession_3(chatboxtitle,user);
				//imcommunicate.removeChattingList(chatboxtitle);
				//notificationmsg.success("Message Saved Successfully ");
				//$("#chat2_"+chatBox_[chatBox_.length-1]).css('display','block');	
			});
			$("#chatt_" + chatboxtitle).keydown(function(event){
				
				imcommunicate.checkChatBoxInputKey_3(event,this,chatboxtitle,user);
				
			});
			$("#active_" + chatboxtitle).click(function(){
				
				imcommunicate.activeChatBox(chatboxtitle);
				
			});
			$("#old_session" + chatboxtitle).click(function(){
				imcommunicate.getOldChatSession(myProfileId);
				
			});
			
			$("#search_"+chatboxtitle).css('display','none');
			$("#groupChatname"+chatboxtitle).css('display','none');
			
			$("#entername"+chatboxtitle).click(function(){
				if(this.value=="Enter Name"){
					this.value="";
				}
			});
			$("#groupchat_" + chatboxtitle).click(function(){				
				if(type=="server"){
					return;
				}
				if((chatboxtitle+"").substring(0,3) != 100){
					$("#groupChatname"+chatboxtitle).slideToggle("slow");
				}else{
					$("#grpUsersList_"+chatboxtitle).hide('slow');
					$("#search_"+chatboxtitle).slideToggle("slow");
					$("#search"+chatboxtitle).val("");
					$("#search"+chatboxtitle).focus();
					if(groupMembers.length == 0){
						for(key in loggedUsers){ 
							if((key+"").substring(0,3)!=100){
								for(i in serverLoggedUser){
									if(serverLoggedUser[i].split("@")[0] == key){
										groupMembers.push({label:loggedUsers[key].userName,category:key,groupId:chatboxtitle});
									}
								}
								
							}
						}
					}
							
						$("#search"+chatboxtitle).autocomplete({
							delay: 0,
							source: groupMembers,
							select: function (event, ui) {
								$("#search_"+chatboxtitle).css('display','none');
								var array = groupMap[ui.item.groupId];								
								var flag = false;								
								if(array != undefined){								
									for(var i=0;i<array.length;i++){										
										if(array[i] == userMap[ui.item.category]){
											flag = true;
											break;
										}
									}										
								}
								
								if(!flag && userMap[ui.item.category] != undefined){
									if(usersInGroup[ui.item.groupId] == undefined){
										var myProfileName = profileUserName.split(" ")[1] + " " + profileUserName.split(" ")[2];
										usersInGroup[ui.item.groupId] = myProfileName+","+loggedUsers[ui.item.category].userName;
									}else{
										usersInGroup[ui.item.groupId] = usersInGroup[ui.item.groupId]+","+	loggedUsers[ui.item.category].userName;
									}	
									$("#grpUsersList_"+ ui.item.groupId).html( usersInGroup[ui.item.groupId] );
									var obj = {"groupId":ui.item.groupId,"groupName":loggedUsers[ui.item.groupId].userName,"profileId":ui.item.category,"usersList":usersInGroup[ui.item.groupId]};
									if($("#grpUsersList_"+ ui.item.groupId).css('display') == 'none'){
										$("#grpUsersList_"+ ui.item.groupId).show();
									}
									imcommunicate.loadUserForChartRoom(obj);
									imcommunicate.removeChattingList(ui.item.category);	
								}								
								
							}
							
						});
					}
			
			});
			$("#done"+chatboxtitle).click( function() {
				//$("#groupChatname"+chatboxtitle).hide();
				var groupName = $("#entername"+chatboxtitle).val();
				if(groupName){
					var groupId = 0;
					groupMembers.length=0;
					for(groupId=1001;groupId<1010;groupId++){						
						if(loggedUsers[groupId] == undefined){
							break;
						}
					}
					loggedUsers[groupId]={"userName":groupName};
					$('#chat2_'+chatboxtitle).remove();
					$('#chatheader_'+chatboxtitle).remove();
					$("#groupChatname"+chatboxtitle).hide();
					imcommunicate.removeChattingList(chatboxtitle);
					imcommunicate.createChatBox_3(groupId,"client");
					$("#chat2_"+groupId).slideToggle("slow");
					
				}
			});
			
			//chatBox_.push(chatboxtitle);
			chatboxFocus[chatboxtitle] = false;

			/*$("#chatheader_"+chatboxtitle).mouseover(function(){
				$("#chatheader_"+chatboxtitle).removeClass("chatheadder").addClass("chatheadderselected");
			}).mouseout(function(){
				$("#chatheader_"+chatboxtitle).removeClass("chatheadderselected").addClass("chatheadder");
			});*/
			$("#chatt_"+chatboxtitle).css('width',($("#chat2_"+chatboxtitle).width())-15);
			$("#chat2_"+chatboxtitle+" .chatboxtextarea2").blur(function(){
				chatboxFocus[chatboxtitle] = false;
				$("#chat2_"+chatboxtitle+" .chatboxtextarea2").removeClass('chatboxtextareaselected');
				$("#chatt_"+chatboxtitle).css('width',($("#chat2_"+chatboxtitle).width())-15);
			}).focus(function(){
				chatboxFocus[chatboxtitle] = true;
				newMessages[chatboxtitle] = false;
				$('#chat2_'+chatboxtitle+' #chatboxhead2').removeClass('chatboxblink');
				$("#chat2_"+chatboxtitle+" .chatboxtextarea2").addClass('chatboxtextareaselected');
			});
			$("#chatboxcontent_"+chatboxtitle).click(function() {
				//if($('#chat2_'+chatboxtitle).css('display') != 'none') {
					$("#chat2_"+chatboxtitle+" .chatboxtextarea2").focus();
				//}
			});
			if(type=="server"){
				/*if(chatBox_.length==1){
					$('#chat2_'+chatboxtitle).css('display','block');	
				}else{
					$("#message_"+chatboxtitle).removeClass("nomessage").addClass("message");
					$('#chat2_'+chatboxtitle).css('display','none');
				}*/
			}
		}else{
			/*if ($('#chat2_'+chatboxtitle).css('display') == 'none') {
				$("#message_"+chatboxtitle).removeClass("message").addClass("nomessage");
			}*/
		}
		
	};
	
	this.showGroupUsersList=showGroupUsersList;
	function showGroupUsersList(groupId,type){
		if(type == "server"){
			$("#grpUsersList_"+ groupId).html( usersInGroup[groupId] );
		}
		
		if($("#search_"+ groupId).css('display') == 'block'){
			$("#search_"+ groupId).css('display','none');
		}
		
		if($("#grpUsersList_"+ groupId).html() != ""){
			$("#grpUsersList_"+ groupId).slideToggle("slow");
		}else{
			$("#grpUsersList_"+ groupId).html("No users are in list");
			$("#grpUsersList_"+ groupId).slideToggle("slow");
		}
		
	};
	
	this.showTooltipForGroup = showTooltipForGroup;
	function showTooltipForGroup(groupId){
		Tips.add(this, event,usersInGroup[groupId], { title:'Group Users List', style: 'rounded', stem: true, tipJoint: [ 'center', 'bottom' ] });
	};
	
	this.removeChattingList = removeChattingList;
	function removeChattingList(chatboxtitle){
		for(var i=0;i<chatBox_.length;i++){
			if(chatBox_[i] == chatboxtitle){
				chatBox_.splice(i,1);
				break;
			}
		}
	}
	
	this.reCreateChatbox = reCreateChatbox;
	function reCreateChatbox(chatboxtitle){
		for(x in chatBox_) {
			if(chatBox_[x] == chatboxtitle && $("#chat2_"+chatboxtitle).css('display') == 'none'){
				$("#chat2_" + chatboxtitle).slideToggle("slow");	
				$('#'+chatBox_[x]).find("#chatheader_" + chatBox_[x]).removeClass('chat-redious-all').addClass('chat-top-redious');
			}else{
				$("#chat2_" + chatBox_[x]).hide("slow");
				$('#'+chatBox_[x]).find("#chatheader_" + chatBox_[x]).removeClass('chat-top-redious').addClass('chat-redious-all');
			}
		}
		//reLoadChatbox();
		//$("#chat2_"+chatboxtitle).css('display','block');
	};
	
	this.checkToChatBoxOpen = checkToChatBoxOpen;
	function checkToChatBoxOpen(chatboxtitle){
		for(x in chatBox_){
			if($("#chat2_" + chatBox_[x]).css('display') == 'block' && chatBox_[x] != chatboxtitle){
				$("#chat2_" + chatboxtitle).hide();
				return;
			}
		}
		if($("#chat2_" + chatboxtitle).css('display') == 'none'){
			$("#chat2_" + chatboxtitle).show("slow");
		}
	};
	
	this.reLoadChatbox = reLoadChatbox;
	function reLoadChatbox(){
		for(x in chatBox_) {
			if ($("#chat2_"+chatBox_[x]).css('display') != 'none') {
				$("#chat2_"+chatBox_[x]).css('display','none');	
			}
		}
	};
	
	this.chatFromSession_3 = chatFromSession_3;
	function chatFromSession_3(sender,type,message){
		var username = "";
		var online = "";
		if (message){
			if(type=="group"){
				chatboxtitle = sender;
				//username = $.trim(loggedUsers[accesUserId].userName).split(" ")[1];
				username = loggedUsers[accesUserId].userName;
				online = document.getElementById('status_'+accesUserId).className;
			}else if(type=="SYS"){
				chatboxtitle = sender;
				username="Server";
			}else{
				chatboxtitle = sender;
				$.trim(loggedUsers[sender].userName)
				//username = $.trim(loggedUsers[sender].userName).split(" ")[1];
				username = loggedUsers[sender].userName;
				online = document.getElementById('status_'+sender).className;
			}
			if ($("#chat2_"+chatboxtitle).css('display') == 'none') {
				//$("#message_"+chatboxtitle).removeClass("nomessage").addClass("message");
				//$("#message_"+chatboxtitle).attr("title","Message from "+loggedUsers[sender].userName);
				notificationmsg.log(username+" : "+message);
			}
			$("#chattingfriend").css('display','block');
			//$("#chat2_"+chatboxtitle+" .chatboxcontent2").append('<div class="chatboxmessage"><span class="chatboxmessagefrom">'+username+':&nbsp;&nbsp;</span><span class="chatboxmessagecontent">'+message+'</span></div>');
			$("#chat2_"+chatboxtitle+" .chatboxcontent2").append('<div class="chatboxmessage"><div class="chatimage"></div><span class="chatboxmessagefrom">'+username+':</span><br><span class="chatboxmessagecontent">'+message+'</span><hr class="position"></div>');
		}
		if(online != "imgactive"){
			chatboxtitle = sender;
			$("#chat2_"+chatboxtitle+" .chatboxcontent2").append('<div class="chatboxmessage"><span class="chatboxmessagecontent"><font style=\'color:#888\'>'+loggedUsers[sender].displayName+' is offline</font></span></div>');
			$("#chat2_"+chatboxtitle+" .chatboxcontent2").scrollTop($("#chat2_"+chatboxtitle+" .chatboxcontent2")[0].scrollHeight);
		}
		
		
		for (i=0;i<chatBoxes.length;i++) {
			chatboxtitle = chatBoxes[i];
			$("#chat2_"+chatboxtitle+" .chatboxcontent2").scrollTop($("#chat_"+chatboxtitle+" .chatboxcontent2")[0].scrollHeight);
			setTimeout('$("#chat2_"+chatboxtitle+" .chatboxcontent2").scrollTop($("#chat2_"+chatboxtitle+" .chatboxcontent2")[0].scrollHeight);', 100); // yet another strange ie bug
		}
		
		if(type == "server"){
			checkToChatBoxOpen(chatboxtitle);
		}
	};
	this.resetGroupUserList = resetGroupUserList;
	function resetGroupUserList(){
		if(groupMembers.length !=0){
			groupMembers.length = 0;
		}
	};
	
	/*
	 * End
	 */ 
	
	
	///////////////////////////////////////////////////////////////////////////
	//<<<<<<<<<<<<<<<<<<  Chat Box Creation inside Friend List >>>>>>>>>>>>>>//
	///////////////////////////////////////////////////////////////////////////
	
	
	this.createChatBox2 = createChatBox2;
	var minimize = 0;
	function createChatBox2(user,type){
		var chatboxtitle = user;
		if($("#chat_"+chatboxtitle).html().length != 0) {
			if(type=="client"){
				if ($("#chat_"+chatboxtitle).css('display') != 'none') {
					$("#chat_"+chatboxtitle).css('display','none');				
				}else{
					$("#chat_"+chatboxtitle).css('display','block');
					$("#chat_"+chatboxtitle+".chatboxtextarea2").focus();
				}
				$("#message_"+chatboxtitle).removeClass("message").addClass("nomessage");
			}
			return;
		}		
		$("#chat_"+chatboxtitle).append('<ul class="chatboxhead2"><a id="video_' + chatboxtitle + '" class="chatboxtitle" href="javascript:void(0)"><image src="images/camera_blue.png" title="Video call"></a><a id="phone_' + chatboxtitle + '" class="chatboxtitle" href="javascript:void(0)"><image src="../images/tb_phone.png" class="phonecall" title="Phone call"></a><a id="groupchat_' + chatboxtitle + '" class="chatboxtitle" href="javascript:void(0)"><image src="../images/tb_group_chat.gif" class="groupchat" title="Add to group chat"></a><div class="chatboxoptions2"><a id="closesess_' + chatboxtitle + '" class="chatboxtitle" href="javascript:void(0)"><image src="../images/endMessage.png" class="closesession" title="Message save and clear window"></a></ul><br clear="all"/></div><div id="chatboxcontent_'+chatboxtitle+'" class="chatboxcontent2"></div><div id="active_' + chatboxtitle + '" class="chatboxinput2" ><textarea id="chatt_' + chatboxtitle + '" class="chatboxtextarea2" ></textarea></div>');
		
		$("#chat_"+chatboxtitle+".chatboxtextarea2").focus();
		
		$("#toggle_" + chatboxtitle).click(function(){
			/*toggleChatBoxGrowth(chatboxtitle);*/
		});		
		$("#close_" + chatboxtitle).click(function(){			
			closeChatBox(chatboxtitle);
		});
		$("#active_" + chatboxtitle).click(function(){
			activeChatBox(chatboxtitle);
		});
		$("#chatt_" + chatboxtitle).keydown(function(event){
			checkChatBoxInputKey2(event,this,chatboxtitle,user);
		});
		$("#closesess_" + chatboxtitle).click(function(){
			closeSession2(chatboxtitle,user);			
		});
		
		chatboxFocus[chatboxtitle] = false;
		
		$("#chat_"+chatboxtitle+" .chatboxtextarea2").blur(function(){
			chatboxFocus[chatboxtitle] = false;
			$("#chat_"+chatboxtitle+" .chatboxtextarea2").removeClass('chatboxtextareaselected');
		}).focus(function(){
			chatboxFocus[chatboxtitle] = true;
			newMessages[chatboxtitle] = false;
			$('#chat_'+chatboxtitle+' #chatboxhead2').removeClass('chatboxblink');
			$("#chat_"+chatboxtitle+" .chatboxtextarea2").addClass('chatboxtextareaselected');
		});
		$("#chat_"+chatboxtitle).click(function() {
			if ($('#chat_'+chatboxtitle+' .chatboxcontent2').css('display') != 'none') {
				$("#chat_"+chatboxtitle+" .chatboxtextarea2").focus();
			}
		});
		if(type=="server"){
			$("#message_"+chatboxtitle).removeClass("nomessage").addClass("message");
			$('#chat_'+chatboxtitle).css('display','none');	
		}
		
	};
	
	function checkChatBoxInputKey2(event,chatboxtextarea,chatboxtitle,user) {		 
		if(event.keyCode == 13 && event.shiftKey == 0)  {
			message = $(chatboxtextarea).val();
			message = message.replace(/^\s+|\s+$/g,"");		
			broadcastMsg(message,user);
			username = profileUserName;			
			$(chatboxtextarea).val('');
			$(chatboxtextarea).focus();
			$(chatboxtextarea).css('height','44px');
			if (message != '') {
						message = message.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;");
						$("#chat_"+chatboxtitle+" .chatboxcontent2").append('<div class="chatboxmessage"><span class="chatboxmessagefrom">'+username+':&nbsp;&nbsp;</span><span class="chatboxmessagecontent">'+message+'</span></div>');
						$("#chat_"+chatboxtitle+" .chatboxcontent2").scrollTop($("#chat_"+chatboxtitle+" .chatboxcontent2")[0].scrollHeight);
			}
				chatHeartbeatTime = minChatHeartbeat;
				chatHeartbeatCount = 1;
		
				return false;
		}
	
		var adjustedHeight = chatboxtextarea.clientHeight;
		var maxHeight = 94;
	
		if (maxHeight > adjustedHeight) {
			adjustedHeight = Math.max(chatboxtextarea.scrollHeight, adjustedHeight);
			if (maxHeight)
				adjustedHeight = Math.min(maxHeight, adjustedHeight);
			if (adjustedHeight > chatboxtextarea.clientHeight)
				$(chatboxtextarea).css('height',adjustedHeight+8 +'px');
		} else {
			$(chatboxtextarea).css('overflow','auto');
		}
			 
	};
	this.checkChatBoxInputKey_3 = checkChatBoxInputKey_3;
	function checkChatBoxInputKey_3(event,chatboxtextarea2,chatboxtitle,user) {		 
		if(event.keyCode == 13 && event.shiftKey == 0)  {
			message = $(chatboxtextarea2).val();
			message = message.replace(/^\s+|\s+$/g,"");	
			broadcastMsg(message,user);			
			username = profileUserName;	
			var chatContent = new HIN.ChatContent();
			chatContent.content = message;
			imcommunicate.messageList.push(chatContent);			
			$(chatboxtextarea2).val('');
			$(chatboxtextarea2).focus();
			
			/**
			 * Ckeck user status 
			 **/
			if((chatboxtitle+"").substring(0,3) != 100){
				//var online = document.getElementById('status_' + chatboxtitle).className;
				//if(online != "imgactive"){
					$("#chat2_"+chatboxtitle+" .chatboxcontent2").append('<div class="chatboxmessage"><span class="chatboxmessagecontent"><font style=\'color:#888\'>'+loggedUsers[chatboxtitle].displayName+' is offline. '+CommonUtil.dateFormat(new Date())+'</font></span></div>');
					$("#chat2_"+chatboxtitle+" .chatboxcontent2").scrollTop($("#chat2_"+chatboxtitle+" .chatboxcontent2")[0].scrollHeight);
				//}
			}
			$(chatboxtextarea2).css('height','44px');
			if (message != '') {
						message = message.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;");
						//$("#chat2_"+chatboxtitle+" .chatboxcontent2").append('<div class="chatboxmessage"><span class="chatboxmessageto">'+username+':&nbsp;&nbsp;</span><span class="chatboxmessagecontentto">'+message+'</span></div>');
						$("#chat2_"+chatboxtitle+" .chatboxcontent2").append('<div class="chatboxmessage"><div class="chatimage"></div><span class="chatboxmessagefrom">'+username+':</span><br><span class="chatboxmessagecontent">'+message+'</span><hr class="position"></div>');
						$("#chat2_"+chatboxtitle+" .chatboxcontent2").scrollTop($("#chat2_"+chatboxtitle+" .chatboxcontent2")[0].scrollHeight);
			}
			return false;
		}
		var adjustedHeight = chatboxtextarea2.clientHeight;
		var maxHeight = 94;
		
		if (maxHeight > adjustedHeight) {
			adjustedHeight = Math.max(chatboxtextarea2.scrollHeight, adjustedHeight);
			if (maxHeight)
				adjustedHeight = Math.min(maxHeight, adjustedHeight);
			if (adjustedHeight > chatboxtextarea2.clientHeight)
				$(chatboxtextarea2).css('height',adjustedHeight+8 +'px');
		} else {
			$(chatboxtextarea2).css('overflow','auto');
		}
		
	};
	
	this.chatFromSession2 = chatFromSession2;
	
	function chatFromSession2(sender,type,message){	
		
		var username = loggedUsers[sender].userName.split(" ")[1];
		var online = document.getElementById('status_'+sender).className;
		if (message){
			if(type=="group"){
				chatboxtitle = userMap[1001];
			}else if(type=="SYS"){
				chatboxtitle = sender;
				username="Server";
			}else{
				chatboxtitle = sender;
			}
			if ($("#chat_"+chatboxtitle).css('display') == 'none') {
				$("#message_"+chatboxtitle).removeClass("nomessage").addClass("message");
				$("#message_"+chatboxtitle).attr("title","Message from "+loggedUsers[sender].userName);
			}
			$("#chat_"+chatboxtitle+" .chatboxcontent2").append('<hr><div class="chatboxmessage"><span class="chatboxmessagefrom">'+username+':&nbsp;&nbsp;</span><span class="chatboxmessagecontent">'+message+'</span></div>');
			
		}
		if(online != "imgactive"){
			chatboxtitle = sender;
			$("#chat_"+chatboxtitle+" .chatboxcontent2").append('<div class="chatboxmessage"><span class="chatboxmessagecontent"><font style=\'color:#888\'>'+loggedUsers[sender].displayName+' is offline</font></span></div>');
			$("#chat_"+chatboxtitle+" .chatboxcontent2").scrollTop($("#chat_"+chatboxtitle+" .chatboxcontent")[0].scrollHeight);
		}
	
		for (i=0;i<chatBoxes.length;i++) {
			chatboxtitle = chatBoxes[i];
			$("#chat_"+chatboxtitle+" .chatboxcontent2").scrollTop($("#chat_"+chatboxtitle+" .chatboxcontent2")[0].scrollHeight);
			setTimeout('$("#chat_"+chatboxtitle+" .chatboxcontent2").scrollTop($("#chat_"+chatboxtitle+" .chatboxcontent2")[0].scrollHeight);', 100); // yet another strange ie bug
		}
		//$("#chatt_"+ chatboxtitle).html('');
	};

	//----------------------END--------------------------------//
	
	var windowFocus = true;
	var username;
	var chatHeartbeatCount = 0;
	var minChatHeartbeat = 1000;
	var maxChatHeartbeat = 33000;
	var chatHeartbeatTime = minChatHeartbeat;
	var originalTitle;
	var blinkOrder = 0;
	
	var chatboxFocus = new Array();
	var newMessages = new Array();
	var newMessagesWin = new Array();
	var chatBoxes = new Array();
	/*
	$(document).ready(function(){
		originalTitle = document.title;
		//startChatSession();
	
		$([window, document]).blur(function(){
			windowFocus = false;
		}).focus(function(){
			windowFocus = true;
			document.title = originalTitle;
		});
	});
	*/
	///////////////////////////////////////////////////////////////////////////
	//<<<<<<<<<<<<<<<<<<  Chat Box Creation using Pop-up >>>>>>>>>>>>>>//
	///////////////////////////////////////////////////////////////////////////

	function restructureChatBoxes() {
		align = 0;
		for (x in chatBoxes) {
			chatboxtitle = chatBoxes[x];
	
			if ($("#chatbox_"+chatboxtitle).css('display') != 'none') {
				if (align == 0) {
					$("#chatbox_"+chatboxtitle).css('right', '20px');
				} else {
					width = (align)*(225+7)+20;
					$("#chatbox_"+chatboxtitle).css('right', width+'px');
				}
				align++;
			}
		}
	};

	function chatWith(user) {	
		createChatBox(user);
		var chatboxtitle = user;
		/*	if(userMap[user] != undefined){
				chatboxtitle = userMap[user];	
			}else{
				chatboxtitle = user;
			}*/
		$("#chatbox_"+chatboxtitle+" .chatboxtextarea").focus();
	};

	function createChatBox(user,minimizeChatBox) {
		var chatboxtitle = user;
		/*if(userMap[user] != undefined){
			chatboxtitle = userMap[user];	
		}else{
			chatboxtitle = user;
		}	*/	
		
		if ($("#chatbox_"+chatboxtitle).length > 0) {
			if ($("#chatbox_"+chatboxtitle).css('display') == 'none') {
				$("#chatbox_"+chatboxtitle).css('display','block');
				restructureChatBoxes();
			}
			$("#chatbox_"+chatboxtitle+" .chatboxtextarea").focus();
			return;
		}
		$(" <div />" )
			.attr("id","chatbox_"+chatboxtitle)
			.addClass("chatbox")
			.html('<div class="chatboxhead"><div class="chatboxtitle">'+loggedUsers[user].displayName+'&nbsp;&nbsp;&nbsp;&nbsp;</div><a id="closesess_' + chatboxtitle + '" class="chatboxtitle" href="javascript:void(0)"><image src="images/endMessage.png" title="Message Save and Clear"></a><div class="chatboxoptions"><a id="toggle_' + chatboxtitle + '" href="javascript:void(0)" ><image src="images/minimize.png" title="Minimize"></a> <a id="close_' + chatboxtitle + '" href="javascript:void(0)" ><image src="images/close.png" title="Close Chat Box"></a></div><br clear="all"/></div><div id="chatboxcontent_'+chatboxtitle+'" class="chatboxcontent"></div><div id="active_' + chatboxtitle + '" class="chatboxinput" ><textarea id="textarea_' + chatboxtitle + '" class="chatboxtextarea" ></textarea></div>')
			.appendTo($( "body" ));
		
		$("#toggle_" + chatboxtitle).click(function(){
			toggleChatBoxGrowth(chatboxtitle);
		});
		$("#close_" + chatboxtitle).click(function(){
			//notificationmsg.info(chatboxtitle);
			closeChatBox(chatboxtitle);
		});
		$("#active_" + chatboxtitle).click(function(){
			activeChatBox(chatboxtitle);
		});
		$("#textarea_" + chatboxtitle).keydown(function(event){
			//notificationmsg.info(chatboxtitle);
			checkChatBoxInputKey(event,this,chatboxtitle,user);
		});
		$("#closesess_" + chatboxtitle).click(function(){
			closeSession(chatboxtitle,user);			
		});
	
		
				   
		$("#chatbox_"+chatboxtitle).css('bottom', '0px');
		
		chatBoxeslength = 0;
	
		for (x in chatBoxes) {
			if ($("#chatbox_"+chatBoxes[x]).css('display') != 'none') {
				chatBoxeslength++;
			}
		}
	
		if (chatBoxeslength == 0) {
			$("#chatbox_"+chatboxtitle).css('right', '20px');
		} else {
			width = (chatBoxeslength)*(225+7)+20;
			$("#chatbox_"+chatboxtitle).css('right', width+'px');
		}
		
		chatBoxes.push(chatboxtitle);
	
		if (minimizeChatBox == 1) {
			minimizedChatBoxes = new Array();
	
			if ($.cookie('chatbox_minimized')) {
				minimizedChatBoxes = $.cookie('chatbox_minimized').split(/\|/);
			}
			minimize = 0;
			for (j=0;j<minimizedChatBoxes.length;j++) {
				if (minimizedChatBoxes[j] == chatboxtitle) {
					minimize = 1;
				}
			}
	
			if (minimize == 1) {
				$('#chatbox_'+chatboxtitle+' .chatboxcontent').css('display','none');
				$('#chatbox_'+chatboxtitle+' .chatboxinput').css('display','none');
			}
		}
	
		chatboxFocus[chatboxtitle] = false;
	
		$("#chatbox_"+chatboxtitle+" .chatboxtextarea").blur(function(){
			chatboxFocus[chatboxtitle] = false;
			$("#chatbox_"+chatboxtitle+" .chatboxtextarea").removeClass('chatboxtextareaselected');
		}).focus(function(){
			chatboxFocus[chatboxtitle] = true;
			newMessages[chatboxtitle] = false;
			$('#chatbox_'+chatboxtitle+' .chatboxhead').removeClass('chatboxblink');
			$("#chatbox_"+chatboxtitle+" .chatboxtextarea").addClass('chatboxtextareaselected');
		});
	
		$("#chatbox_"+chatboxtitle).click(function() {
			if ($('#chatbox_'+chatboxtitle+' .chatboxcontent').css('display') != 'none') {
				$("#chatbox_"+chatboxtitle+" .chatboxtextarea").focus();
			}
		});
	
		$("#chatbox_"+chatboxtitle).show();		
			
	};

/*
	function chatHeartbeat(){
	
		var itemsfound = 0;
		
		if (windowFocus == false) {
	 
			var blinkNumber = 0;
			var titleChanged = 0;
			for (x in newMessagesWin) {
				if (newMessagesWin[x] == true) {
					++blinkNumber;
					if (blinkNumber >= blinkOrder) {
						document.title = x+' says...';
						titleChanged = 1;
						break;	
					}
				}
			}
			
			if (titleChanged == 0) {
				document.title = originalTitle;
				blinkOrder = 0;
			} else {
				++blinkOrder;
			}
	
		} else {
			for (x in newMessagesWin) {
				newMessagesWin[x] = false;
			}
		}
	
		for (x in newMessages) {
			if (newMessages[x] == true) {
				if (chatboxFocus[x] == false) {
					//FIXME: add toggle all or none policy, otherwise it looks funny
					$('#chatbox_'+x+' .chatboxhead').toggleClass('chatboxblink');
				}
			}
		}
		
		$.ajax({
		  url: "chat.php?action=chatheartbeat",
		  cache: false,
		  dataType: "json",
		  success: function(data) {
	
			$.each(data.items, function(i,item){
				if (item)	{ // fix strange ie bug
	
					chatboxtitle = item.f;
	
					if ($("#chatbox_"+chatboxtitle).length <= 0) {
						createChatBox(chatboxtitle);
					}
					if ($("#chatbox_"+chatboxtitle).css('display') == 'none') {
						$("#chatbox_"+chatboxtitle).css('display','block');
						restructureChatBoxes();
					}
					
					if (item.s == 1) {
						item.f = username;
					}
	
					if (item.s == 2) {
						$("#chatbox_"+chatboxtitle+" .chatboxcontent").append('<div class="chatboxmessage"><span class="chatboxinfo">'+item.m+'</span></div>');
					} else {
						newMessages[chatboxtitle] = true;
						newMessagesWin[chatboxtitle] = true;
						$("#chatbox_"+chatboxtitle+" .chatboxcontent").append('<div class="chatboxmessage"><span class="chatboxmessagefrom">'+item.f+':&nbsp;&nbsp;</span><span class="chatboxmessagecontent">'+item.m+'</span></div>');
					}
	
					$("#chatbox_"+chatboxtitle+" .chatboxcontent").scrollTop($("#chatbox_"+chatboxtitle+" .chatboxcontent")[0].scrollHeight);
					itemsfound += 1;
				}
			});
	
			chatHeartbeatCount++;
	
			if (itemsfound > 0) {
				chatHeartbeatTime = minChatHeartbeat;
				chatHeartbeatCount = 1;
			} else if (chatHeartbeatCount >= 10) {
				chatHeartbeatTime *= 2;
				chatHeartbeatCount = 1;
				if (chatHeartbeatTime > maxChatHeartbeat) {
					chatHeartbeatTime = maxChatHeartbeat;
				}
			}
			
			//setTimeout('chatHeartbeat();',chatHeartbeatTime);
		}});
	};
*/
	function closeChatBox(chatboxtitle) {
		$('#chatbox_'+chatboxtitle).css('display','none');
		restructureChatBoxes();
	
		$.post("chat.php?action=closechat", { chatbox: chatboxtitle} , function(data){	
		});
	
	};

	function toggleChatBoxGrowth(chatboxtitle) {
		if ($('#chatbox_'+chatboxtitle+' .chatboxcontent').css('display') == 'none') {  
			
			var minimizedChatBoxes = new Array();
			
			if ($.cookie('chatbox_minimized')) {
				minimizedChatBoxes = $.cookie('chatbox_minimized').split(/\|/);
			}
	
			var newCookie = '';
	
			for (i=0;i<minimizedChatBoxes.length;i++) {
				if (minimizedChatBoxes[i] != chatboxtitle) {
					newCookie += chatboxtitle+'|';
				}
			}
	
			newCookie = newCookie.slice(0, -1)
	
	
			$.cookie('chatbox_minimized', newCookie);
			$('#chatbox_'+chatboxtitle+' .chatboxcontent').css('display','block');
			$('#chatbox_'+chatboxtitle+' .chatboxinput').css('display','block');
			$("#chatbox_"+chatboxtitle+" .chatboxcontent").scrollTop($("#chatbox_"+chatboxtitle+" .chatboxcontent")[0].scrollHeight);
		} else {
			
			var newCookie = chatboxtitle;
	
			if ($.cookie('chatbox_minimized')) {
				newCookie += '|'+$.cookie('chatbox_minimized');
			}
	
	
			$.cookie('chatbox_minimized',newCookie);
			$('#chatbox_'+chatboxtitle+' .chatboxcontent').css('display','none');
			$('#chatbox_'+chatboxtitle+' .chatboxinput').css('display','none');
		}
		
	};
	function activeChatBox(user){
		try{
			if((user+"").substring(0,3)==100){
				loadGroupChartRoom(user,"");
			}else{
				loadUserForChart(user,"");	
			}
		}catch(e){ notificationmsg.info("activeChatBox : "+e);return false;}
	};
	

	function checkChatBoxInputKey(event,chatboxtextarea,chatboxtitle,user) {
		 
		if(event.keyCode == 13 && event.shiftKey == 0)  {
			message = $(chatboxtextarea).val();
			message = message.replace(/^\s+|\s+$/g,"");		
			broadcastMsg(message,user);
			/*if(userMap[mySourceId] != undefined){
				username = userMap[mySourceId];
			}else{
				username = user;
			}*/
			username = profileUserName.split(" ")[1];			
			$(chatboxtextarea).val('');
			$(chatboxtextarea).focus();
			$(chatboxtextarea).css('height','44px');
			if (message != '') {
					//$.post("chat.php?action=sendchat", {to: chatboxtitle, message: message} , function(data){
						message = message.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;");
						//$("#chatbox_"+chatboxtitle+" .chatboxcontent").append('<div class="chatboxmessage" id="popMessage"><span class="chatboxmessagefrom">'+username+':&nbsp;&nbsp;</span><span class="chatboxmessagecontent">'+message+'</span></div>');
						$("#chatbox_"+chatboxtitle+" .chatboxcontent").append('<div class="chatboxmessage"><span class="chatboxmessagefrom">'+username+':&nbsp;&nbsp;</span><span class="chatboxmessagecontent">'+message+'</span></div>');
						$("#chatbox_"+chatboxtitle+" .chatboxcontent").scrollTop($("#chatbox_"+chatboxtitle+" .chatboxcontent")[0].scrollHeight);
					//});
			}
				chatHeartbeatTime = minChatHeartbeat;
				chatHeartbeatCount = 1;
		
				return false;
		}
	
		var adjustedHeight = chatboxtextarea.clientHeight;
		var maxHeight = 94;
	
		if (maxHeight > adjustedHeight) {
			adjustedHeight = Math.max(chatboxtextarea.scrollHeight, adjustedHeight);
			if (maxHeight)
				adjustedHeight = Math.min(maxHeight, adjustedHeight);
			if (adjustedHeight > chatboxtextarea.clientHeight)
				$(chatboxtextarea).css('height',adjustedHeight+8 +'px');
		} else {
			$(chatboxtextarea).css('overflow','auto');
		}
			 
	};
	
	

	function chatFromSession(sender,type,message){
				
				username = loggedUsers[sender].userName.split(" ")[1];
				var online = document.getElementById('status_'+sender).className;
				if (message){
					if(type=="group"){
						chatboxtitle = userMap[1001];
					}else if(type=="SYS"){
						chatboxtitle = sender;
						username="Server";
					}else{
						chatboxtitle = sender;
					}					
					$("#chatbox_"+chatboxtitle+" .chatboxcontent").append('<div class="chatboxmessage"><span class="chatboxmessagefrom">'+username+':&nbsp;&nbsp;</span><span class="chatboxmessagecontent">'+message+'</span></div>');
					
				}
				if(online != "imgactive"){
					chatboxtitle = sender;
					$("#chatbox_"+chatboxtitle+" .chatboxcontent").append('<div class="chatboxmessage"><span class="chatboxmessagecontent"><font style=\'color:#888\'>'+loggedUsers[sender].displayName+' is offline</font></span></div>');
					$("#chatbox_"+chatboxtitle+" .chatboxcontent").scrollTop($("#chatbox_"+chatboxtitle+" .chatboxcontent")[0].scrollHeight);
				}
			
			for (i=0;i<chatBoxes.length;i++) {
				chatboxtitle = chatBoxes[i];
				$("#chatbox_"+chatboxtitle+" .chatboxcontent").scrollTop($("#chatbox_"+chatboxtitle+" .chatboxcontent")[0].scrollHeight);
				setTimeout('$("#chatbox_"+chatboxtitle+" .chatboxcontent").scrollTop($("#chatbox_"+chatboxtitle+" .chatboxcontent")[0].scrollHeight);', 100); // yet another strange ie bug
			}
		
		//setTimeout('chatHeartbeat();',chatHeartbeatTime);
	};
	
/*
	function startChatSession(){ 
		$.ajax({
		  url: "chat.php?action=startchatsession",
		  cache: false,
		  dataType: "json",
		  success: function(data) {
	 
			username = data.username;
	
			$.each(data.items, function(i,item){
				if (item)	{ // fix strange ie bug
	
					chatboxtitle = item.f;
	
					if ($("#chatbox_"+chatboxtitle).length <= 0) {
						createChatBox(chatboxtitle,1);
					}
					
					if (item.s == 1) {
						item.f = username;
					}
	
					if (item.s == 2) {
						$("#chatbox_"+chatboxtitle+" .chatboxcontent").append('<div class="chatboxmessage"><span class="chatboxinfo">'+item.m+'</span></div>');
					} else {
						$("#chatbox_"+chatboxtitle+" .chatboxcontent").append('<div class="chatboxmessage"><span class="chatboxmessagefrom">'+item.f+':&nbsp;&nbsp;</span><span class="chatboxmessagecontent">'+item.m+'</span></div>');
					}
				}
			});
			
			for (i=0;i<chatBoxes.length;i++) {
				chatboxtitle = chatBoxes[i];
				$("#chatbox_"+chatboxtitle+" .chatboxcontent").scrollTop($("#chatbox_"+chatboxtitle+" .chatboxcontent")[0].scrollHeight);
				setTimeout('$("#chatbox_"+chatboxtitle+" .chatboxcontent").scrollTop($("#chatbox_"+chatboxtitle+" .chatboxcontent")[0].scrollHeight);', 100); // yet another strange ie bug
			}
		
		//setTimeout('chatHeartbeat();',chatHeartbeatTime);
			
		}});
	};
*/
/**
 * Cookie plugin
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

	jQuery.cookie = function(name, value, options) {
		try{
		    if (typeof value != 'undefined') { // name and value given, set cookie
		        options = options || {};
		        if (value === null) {
		            value = '';
		            options.expires = -1;
		        }
		        var expires = '';
		        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
		            var date;
		            if (typeof options.expires == 'number') {
		                date = new Date();
		                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
		            } else {
		                date = options.expires;
		            }
		            expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
		        }
		        // CAUTION: Needed to parenthesize options.path and options.domain
		        // in the following expressions, otherwise they evaluate to undefined
		        // in the packed version for some reason...
		        var path = options.path ? '; path=' + (options.path) : '';
		        var domain = options.domain ? '; domain=' + (options.domain) : '';
		        var secure = options.secure ? '; secure' : '';
		        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
		    } else { // only name given, get cookie
		        var cookieValue = null;
		        if (document.cookie && document.cookie != '') {
		            var cookies = document.cookie.split(';');
		            for (var i = 0; i < cookies.length; i++) {
		                var cookie = jQuery.trim(cookies[i]);
		                // Does this cookie string begin with the name we want?
		                if (cookie.substring(0, name.length + 1) == (name + '=')) {
		                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
		                    break;
		                }
		            }
		        }
		        return cookieValue;
		    }
		}catch(e){	return false;}
	};
	this.closeSession = closeSession;
	function closeSession(chatboxtitle,user){
		var msg = $("#chatboxcontent_"+chatboxtitle).text();
		try{
			//Code//
			 accesUserId = userMap[user];
			var lRes = lWSC.broadcastText(
			accesUserId+"#"+2000,
			"Close Charting"
			);
		}catch(e){}
		$("#chatboxcontent_"+chatboxtitle).text('');
		closeChatBox(chatboxtitle);
	};
	this.closeSession2 = closeSession2;
	function closeSession2(chatboxtitle,user){
		var msg = $("#chatboxcontent_"+chatboxtitle).text();
		try{
			 accesUserId = userMap[user];
			var lRes = lWSC.broadcastText(
			accesUserId+"#"+2000,
			"Close Charting"
			);
		}catch(e){}
		$("#chatboxcontent_"+chatboxtitle).text('');
		$('#chat_'+chatboxtitle).css('display','none');
	};
	this.closeSession_3 = closeSession_3;
	function closeSession_3(chatboxtitle,user){
		var msg = $("#chatboxcontent_"+chatboxtitle).text();
		try{
			accesUserId = userMap[chatboxtitle];
			var lRes = lWSC.broadcastText(
					accesUserId+"#"+mySourceId,
			"Close Charting"
			);
		}catch(e){}
		//$("#chatboxcontent_"+chatboxtitle).text('');
		//$('#chat2_'+chatboxtitle).css('display','none');
		$('#chat2_'+chatboxtitle).remove();
		$('#chatheader_'+chatboxtitle).remove();
		reLoadChatbox();
	};
	
	this.getOldChatSession = getOldChatSession;
	function getOldChatSession(profileId) {
		var encoded = $.toJSON({
			requestType : "oldsession",	
			profileId : profileId
		});

		/* Make the server request to authenticate the user */
		$.ajax({
			type : "POST",
			url : "/hin-web/ChatServlet",
			data : "data=" + encoded,
			dataType : "json",
			cache : false,
			success : function(resp) {
				if(resp != null){
					setOldMessage(resp.messages);
					//eLog.innerHTML = getOldMessage();
					//notificationmsg.info(getOldMessage());	
					selectTab("chathistory");
					$("#chathistorycontent").html(getOldMessage());					
					
				}
			},

			error : function(request, error) {
				notificationmsg.error("Unable To View Services");
			}
		});
	};
	

	//From websocket Chart

	var lJWSID = "jWebSocket Chat",
	lWSC = null,
	eLog = null,epopMessage=null,
	ePool = null,
	eMessage = null,
	eDebug = null,
	eKeepAlive = null,
	looedUser = null,
	looedUsers = null,
	statusImg=null,
	accessUsers = null,messageArea=null,eOnline="",eChartRoom="";
	
	var IN = 0;
	var OUT = 1;
	var EVT = 2;
	var SYS = "SYS";
	var USR = null;


	// append a line to the log text area
	function log( aUsername, aEvent, aString ) {
		try{
			var lFlag;
			switch( aEvent ) {
				case IN: lFlag = "<"; break;
				case OUT: lFlag = ">"; break;
				case EVT: lFlag = "*"; break;
				default: lFlag = "?";
			}
			// set a default user name if not yet logged in
			if( !aUsername ) {
				aUsername = lWSC.getUsername();
			}
			if( !aUsername ) {
				aUsername = "USR";
			}
			/*eLog.innerHTML +=
					aUsername + " " +
					lFlag + " " +
					aString + "<br>";
		
			if( eLog.scrollHeight > eLog.clientHeight ) {
				eLog.scrollTop = eLog.scrollHeight - eLog.clientHeight;
			}*/
		}catch(e){	return false;}
	};

	function clearLog() {
		//eLog.innerHTML = "";
		//eLog.scrollTop = 0;
	};
	
	function doFocus( aElement ) {
		aElement.focus();
		aElement.select();
	};

	function doOpen(eUsername) {
		try{
			// adjust this URL to your jWebSocket server
			var lURL = jws.JWS_SERVER_URL + "/;prot=json,timeout=360000";
			log( SYS, OUT, "Connecting to " + lJWSID + " at " + lURL + "..."+ eUsername );								
		
			// try to establish connection to jWebSocket server
			lWSC.logon( lURL, eUsername, "", {
		
				// OnOpen callback
				OnOpen: function( aEvent ) {
					log( SYS, IN, "Connection to " + lJWSID + " established." );
					//eStatus.innerHTML = "<img src="'../..'/''images/index.jpg"/>;
		
					// start keep alive if user selected that option
					imcommunicate.checkKeepAlive({ immediate: false });
				},
		
				// OnMessage callback
			OnMessage: function( aEvent, aToken ) {
				// for debug purposes			
				
				if( aToken ) {
					// is it a response from a previous request of this client?					
					log( "", EVT, "<font style='color:#888'>" +
							( aToken ? aToken.type : "-" ) + ": " +
							aEvent.data + "</font>");
					if( aToken.type == "welcome" ) {
					}
					if( aToken.type == "response" ) {	
						try{						
							if(accesUserId==0 && aToken.reqType=="broadcast"){
								log( SYS, IN, "<font style='color:#DF0101'>Dear "+ eUsername +" Please add the User To Chart</font>" );
							}
							// figure out of which request
							
							if( aToken.reqType == "login" ) {
								if( aToken.code == 0 ) {
									mySourceId=aToken.sourceId;
									log( SYS, IN, "Welcome '" + aToken.username + "'" );
									// select message field for convenience
									// call getAuthClients method from
									// jWebSocket System Client Plug-In
									lWSC.getAuthClients({
										pool: null
									});
								} else {
									log( SYS, IN, "Error logging in '" + + "': " + aToken.msg );
									// select username again for convenience
									//doFocus( eUsername );
								}
							}
							if( aToken.reqType == "getClients" ) {
								serverLoggedUser = aToken.clients;
								var user = "";
								var userId = 0;
								try{
									for(i=0;i<serverLoggedUser.length;i++ ) {
										user = serverLoggedUser[i].split("@")[0];
										userId = serverLoggedUser[i].split("@")[1];
										userMap[user]=userId;
									/*	if(userId != mySourceId){
											$("#status_"+user).removeClass("inactive").addClass("active");
										}else{
											$("#status_"+user).removeClass("active").addClass("inactive");
										}*/
									}
									creatingOnline();
								}catch(e){	notificationmsg.info(e);return false;}
							}
						}catch(e){	notificationmsg.info(e);return false;}
						// is it an event w/o a previous request ?
					} else if( aToken.type == "event" ) {
						//interpret the event name
						if( aToken.name == "login" ) {
							try{
								if(serverLoggedUser == undefined){
									serverLoggedUser = new Array();
								}
								serverLoggedUser[serverLoggedUser.length] = aToken.username+"@"+aToken.sourceId;
								if(loggedUsers[aToken.username] != undefined){
									notificationmsg.info(loggedUsers[aToken.username].userName+" is Login ." );
								}								
								log( SYS, EVT, aToken.username+" is Login ." );								
								createLogedServerUser();
								creatingOnline();
								//$("#status_"+aToken.username).removeClass("inactive").addClass("active");
							}catch(e){	notificationmsg.info(e);return false;}
						}else if( aToken.name == "logout" ) {
							try{
								for(i=0;i<serverLoggedUser.length;i++ ) {
									if(serverLoggedUser[i].split("@")[1]==aToken.sourceId){
										if(userMap[serverLoggedUser[i].split("@")[0]] != undefined){
											log( aToken.name, EVT, serverLoggedUser[i].split("@")[0] +" is log out." );
											if(loggedUsers[serverLoggedUser[i].split("@")[0]] != undefined){
												notificationmsg.info(loggedUsers[serverLoggedUser[i].split("@")[0]].userName +" is Disconnect .");
											}
											creatingOffline(serverLoggedUser[i].split("@")[0]);
											//$("#status_"+serverLoggedUser[i].split("@")[0]).removeClass("active").addClass("inactive");
											serverLoggedUser.splice(i,1);
											createLogedServerUser();
											
										}									
									}
								}	
							}catch(e){	alert("logout"+e);notificationmsg.info(e);return false;}
							
						}else if( aToken.name == "disconnect" ) {	
							try{
								for(i=0;i<serverLoggedUser.length;i++ ) {
									if(serverLoggedUser[i].split("@")[1]==aToken.sourceId){
										if(userMap[serverLoggedUser[i].split("@")[0]] != undefined){	
											log( aToken.name, EVT, serverLoggedUser[i].split("@")[0] +" is Disconnect ." );
											if(loggedUsers[serverLoggedUser[i].split("@")[0]] != undefined){
												notificationmsg.info(loggedUsers[serverLoggedUser[i].split("@")[0]].userName +" is Disconnect .");
											}
											//$("#status_"+serverLoggedUser[i].split("@")[0]).removeClass("active").addClass("inactive");
											creatingOffline(serverLoggedUser[i].split("@")[0]);
											serverLoggedUser.splice(i,1);
											createLogedServerUser();
										}									
									}
								}	
								
							}catch(e){	alert("disconnect"+e);notificationmsg.info(e);return false;}							
						}else{
							log( aToken.type , IN ,aToken.name );	
						}
						
					} else if( aToken.type == "goodBye" ) {
						log( SYS, IN, lJWSID + " says good bye (reason: " + aToken.reason + ")!" );					
	
					//	doFocus( eUsername );
						// is it any token from another client
					} else if( aToken.type == "broadcast" ) {
						if( aToken.data) {
							try{
								if(aToken.data != null && aToken.data=="group"){
									if(groupMap[(aToken.pool).groupId] != undefined){
										var array = groupMap[(aToken.pool).groupId];
										array[array.length] = new Array(userMap[(aToken.pool).profileId]);
										groupMap[(aToken.pool).groupId] = array;
										/*---group users list----*/
										usersInGroup[(aToken.pool).groupId]=(aToken.pool).usersList;
										if($("#chatheader_"+ (aToken.pool).groupId).html() != null){
											$("#grpUsersList_"+ (aToken.pool).groupId).html( usersInGroup[(aToken.pool).groupId] );
										}
										/*--- End----*/
										if((aToken.pool).profileId==myProfileId){
											notificationmsg.info("New User " + loggedUsers[(aToken.pool).profileId] + " is added at group " + (aToken.pool).groupName);
										}
										log( "broadcast", IN, "New User " + (aToken.pool).profileId + " is added at group " + (aToken.pool).groupName );
									}else{
										loggedUsers[(aToken.pool).groupId]={"userName":(aToken.pool).groupName};
										groupMap[(aToken.pool).groupId] = new Array(aToken.sourceId,userMap[(aToken.pool).profileId]);
										/*---group users list----*/
										usersInGroup[(aToken.pool).groupId]=(aToken.pool).usersList;
										if($("#chatheader_"+ (aToken.pool).groupId).html() != null){
											$("#grpUsersList_"+ (aToken.pool).groupId).html( usersInGroup[(aToken.pool).groupId] );
										}
										/*--- End----*/
										if((aToken.pool).profileId==myProfileId){
											notificationmsg.info("Group chat created for the name " + (aToken.pool).groupName);
										}
										log( "broadcast", IN, "New Group Id " + (aToken.pool).groupId + " is Created for the name " + (aToken.pool).groupName );
									}

								}
								else if(aToken.pool != 0 && aToken.pool != 1001 && aToken.pool == mySourceId){	
									try{
										log( aToken.sender, IN, aToken.data );		
										loadUserForChart(aToken.sender,aToken.data,"server");
									}catch(e){notificationmsg.info(e);return false;}
									
								}else if(aToken.pool != 0 && (aToken.pool+"").substring(0,3)==100){
									var array = groupMap[aToken.pool]
									if(array != undefined){
										var countUser = array.length;
										log( "Group-1 ", IN, mySourceId+"==> "+countUser);
										for(j=0; j < countUser; j++){
											log( "Group-2 ", IN, array[j]+"="+mySourceId);
											if(loggedUsers[aToken.sender] != undefined && array[j]==mySourceId){									
												loadGroupChartRoom(aToken.pool,aToken.sender,aToken.data);
											}
										}
									}
								}
							}catch(e){	notificationmsg.info(e);return false;}
						}
					}
				/**	log( "", EVT, "<font style='color:#888'>" +
							( aToken ? aToken.type : "-" ) + ": " +
							aEvent.data + "</font>");*/
				}				
			},
	
			// OnClose callback
			OnClose: function( aEvent ) {				
				log( SYS, IN, "Disconnected from " + lJWSID + ".");	
				notificationmsg.info("Disconnected from " + lJWSID + ".");
				try{
					for(i=0;i<serverLoggedUser.length;i++ ) {
						if(serverLoggedUser[i].split("@")[0] != undefined){
							if(loggedUsers[serverLoggedUser[i].split("@")[0]] != undefined){
								notificationmsg.info(loggedUsers[serverLoggedUser[i].split("@")[0]].userName +" is Disconnect .");
							}
						}
						
						//log( SYS, EVT, serverLoggedUser[i].split("@")[0] +" is Disconnect ." );
						//
						//$("#status_"+serverLoggedUser[i].split("@")[0]).removeClass("imgactive").addClass("imginactive");
					}	
					serverLoggedUser = new Array();
					userMap = {};
					groupMap = {};
					loggedUsers = new Array();
				}catch(e){	notificationmsg.info(e);return false;}	
				lWSC.stopKeepAlive();		
			}
		});
		}catch(error){
			return false;
		}
	};

	function loadUserForChart(user,message,type){
		try{
			if(user != undefined && userMap[user] != undefined){				
				accesUserId = userMap[user];
				if(CHATBOX_TYPE==1){
					chatWith(user);
				}else if(CHATBOX_TYPE==2){
					createChatBox2(user,"server");	
				}else if(CHATBOX_TYPE==3){
					createChatBox_3(user,"server");	
				}else{
					notificationmsg.info("Invalid Chat Type.");
				}
				if(message != undefined && message.length != 0){
					if(CHATBOX_TYPE==1){
						chatFromSession(user,"",message);
					}else if(CHATBOX_TYPE==2){
						chatFromSession2(user,"",message);
					}else if(CHATBOX_TYPE==3 && type == "server"){
						chatFromSession_3(user,"server",message);
					}else if(CHATBOX_TYPE==3){
						chatFromSession_3(user,"",message);
					}else{
						notificationmsg.info("Invalid Chat Type.");
					}
				}
			}
		}catch(e){notificationmsg.info("Error IMCommunication.loadUserForChart: " + e);	return false;}
	};
	

	function loadUserForChartRoom(poolObj){
		try{
			accesUserId = userMap[poolObj.profileId];
			var lRes = lWSC.broadcastText(
				poolObj,
				"group"
			);
			if(groupMap[poolObj.groupId] != undefined){
				var array = groupMap[poolObj.groupId];
				array[array.length] = new Array(userMap[poolObj.profileId]);
				groupMap[poolObj.groupId] = array;
			}else{
				groupMap[poolObj.groupId] = new Array(mySourceId,userMap[poolObj.profileId]);
				log( "Clints", IN, "Group Id " + poolObj.groupId + " is Created for the name " + poolObj.groupName );
			}
		}catch(e){notificationmsg.info(e);	return false;}
	};
	
	

	function loadGroupChartRoom(groupId,profileId,message){
		try{
			accesUserId = profileId;	
			createChatBox_3(groupId,"server");
			if(message != undefined && message.length>0){
				chatFromSession_3(groupId,"group",message);
			}
		}catch(e){notificationmsg.info(e);	return false;}
	};

	function createLogedServerUser(){	
		for(i=0;i<serverLoggedUser.length;i++ ) {	
			try{
				var user = serverLoggedUser[i].split("@")[0];	
				var userId = serverLoggedUser[i].split("@")[1];
				userMap[user]=userId;
			}catch(e){
				return false;
			}
		}	
	};


	function getClients() {
		try{
			var lRes = lWSC.getAuthClients({
				pool: null
			});				
			log( SYS, OUT, "getClients: " + lRes.msg );
		}catch(e){	return false;}
	};

	function doClose() {
		try{
			// disconnect automatically logs out!
			if(lWSC!=null){
				lWSC.stopKeepAlive();
				var lRes = lWSC.close({
					// wait a maximum of 3 seconds for server good bye message
					timeout: 3000
				});
				log( SYS, OUT, "logout: " + lRes.msg );
			}
		}catch(e){notificationmsg.info(e);	return false;}
	};
	
	function broadcastMsg(message,user){
		try{
			if((user+"").substring(0,3)==100){
				accesUserId = user;
			}else{
				accesUserId = userMap[user];
			}
		 var lMsg = message;
			if( lMsg.length > 0 ) {
				log( USR, OUT, lMsg );
				var lRes = lWSC.broadcastText(
				accesUserId,		// broadcast to all clients (not limited to a certain pool)
				lMsg	// broadcast this message
				);
				// log error only, on success don't confuse the user
				if( lRes.code != 0 ) {
					if(userMap[accesUserId] != undefined){		
						chatWith(accesUserId);
						chatFromSession(userMap[accesUserId],"SYS",userMap[mySourceId] + " is "+lRes.msg);
						log( SYS, OUT, "broadcast: " + lRes.msg );
						return false;
					}
				}
			}
		}catch(e){notificationmsg.info(e);	return false;}
	};
	
	function broadcast() {
		try{
			var lMsg = eMessage.value;
			if( lMsg.length > 0 ) {
				log( USR, OUT, lMsg );
				var lRes = lWSC.broadcastText(
				accesUserId,		// broadcast to all clients (not limited to a certain pool)
				lMsg	// broadcast this message
				);
				// log error only, on success don't confuse the user
				if( lRes.code != 0 ) {
					log( SYS, OUT, "broadcast: " + lRes.msg );								
				}
				eMessage.value = "";
			}
			doFocus( eMessage );
		}catch(e){	return false;}
	};
	
	function checkKeepAlive( aOptions ) {
		try{
			if( !aOptions ) {
				aOptions = {};
			}
			aOptions.interval = 30000;
			if(true) {
				lWSC.startKeepAlive( aOptions );
			} else {
				lWSC.stopKeepAlive();
			}
		}catch(e){	return false;}
	};

	function usrKeyDnLsnr( aEvent ) {
		// on enter in username field try to login
		if( aEvent.keyCode == 13 ) {
			doOpen();
		}
	};
	
	function msgKeyDnLsnr( aEvent ) {
		// on enter in message field send broadcast the message
		if( !aEvent.shiftKey && aEvent.keyCode == 13 ) {
			broadcast();
		}
	};
	
	function elemFocusLsnr( aEvent ) {
		// on focus select full text of element (for username and message)
		jws.events.getTarget( aEvent ).select();
	};

	function initPage() {
		try{
			// get some required HTML elements
			/*eLog = jws.$( "inboxcontent" );
			$("#inboxcontent").css("position","relative");
			$("#inboxcontent").css("height","400px");
			$("#inboxcontent").css("overflow","auto");*/
			
			// check if WebSockets are supported by the browser
			if( jws.browserSupportsWebSockets() ) {
				// instaniate new TokenClient, either JSON, CSV or XML
				lWSC = new jws.jWebSocketJSONClient();
				
				//jws.events.addEventListener( eOnline, "focus", elemFocusLsnr );
			} else {
			
				var lMsg = jws.MSG_WS_NOT_SUPPORTED;
				notificationmsg.info( lMsg );
				log( SYS, IN, lMsg );
			}
		}catch(e){	return false;}
	};
	
	function exitPage() {
		try{
			// this allows the server to release the current session
			// immediately w/o waiting on the timeout.
			if( lWSC ) {
				lWSC.close({
					// force immediate client side disconnect
					timeout: 0
				});
			}
		}catch(e){	return false;}
	};
	function getOldMessage(){
		return oldMessage;
	};
	function setOldMessage(oldMessage){
		this.oldMessage = oldMessage;
	};
}

