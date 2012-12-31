/*

Copyright (c) 2009 Anant Garg (anantgarg.com | inscripts.com)

This script may be used for non-commercial purposes only. For any
commercial purposes, please contact the author at 
anant.garg@inscripts.com

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

*/

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

$(document).ready(function(){
	originalTitle = document.title;
	startChatSession();

	$([window, document]).blur(function(){
		windowFocus = false;
	}).focus(function(){
		windowFocus = true;
		document.title = originalTitle;
	});
});

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
}

function chatWith(user) {	
	createChatBox(user);
	var chatboxtitle = userMap[user];	
	$("#chatbox_"+chatboxtitle+" .chatboxtextarea").focus();
}

function createChatBox(user,minimizeChatBox) {
	chatboxtitle = userMap[user]
	if ($("#chatbox_"+chatboxtitle).length > 0) {
		if ($("#chatbox_"+chatboxtitle).css('display') == 'none') {
			$("#chatbox_"+chatboxtitle).css('display','block');
			restructureChatBoxes();
		}
		$("#chatbox_"+chatboxtitle+" .chatboxtextarea").focus();
		return;
	}

	$(" <div />" ).attr("id","chatbox_"+chatboxtitle)
	.addClass("chatbox")
	.html('<div class="chatboxhead"><div class="chatboxtitle">'+chatboxtitle+'</div><div class="chatboxoptions"><a href="javascript:void(0)" onclick="javascript:toggleChatBoxGrowth(\''+chatboxtitle+'\')">-</a> <a href="javascript:void(0)" onclick="javascript:closeChatBox(\''+chatboxtitle+'\')">X</a></div><br clear="all"/></div><div class="chatboxcontent"></div><div class="chatboxinput" onclick="javascript:activeChatBox(\''+user+'\')"><textarea class="chatboxtextarea" onkeydown="javascript:return checkChatBoxInputKey(event,this,\''+chatboxtitle+'\',\''+user+'\');"></textarea></div>')
	.appendTo($( "body" ));
			   
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
}


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
		
		setTimeout('chatHeartbeat();',chatHeartbeatTime);
	}});
}

function closeChatBox(chatboxtitle) {
	$('#chatbox_'+chatboxtitle).css('display','none');
	restructureChatBoxes();

	$.post("chat.php?action=closechat", { chatbox: chatboxtitle} , function(data){	
	});

}

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
	
}
function activeChatBox(user){	
	if(user==1001){
		loadGroupChartRoom(user,"");
	}else{
		loadUserForChart(user,"");	
	}
}

function checkChatBoxInputKey(event,chatboxtextarea,chatboxtitle,user) {
	 
	if(event.keyCode == 13 && event.shiftKey == 0)  {
		message = $(chatboxtextarea).val();
		message = message.replace(/^\s+|\s+$/g,"");		
		broadcastMsg(message);
		username = userMap[mySourceId];

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
	 
}

function chatFromSession(sender,type,message){  	
		
		username = sender;		
			if (message){
				if(type=="group"){
					chatboxtitle = userMap[1001];
				}else if(type=="SYS"){
					chatboxtitle = username;
					username="";
				}else{
					chatboxtitle = username;
				}
				$("#chatbox_"+chatboxtitle+" .chatboxcontent").append('<div class="chatboxmessage"><span class="chatboxmessagefrom">'+username+':&nbsp;&nbsp;</span><span class="chatboxmessagecontent">'+message+'</span></div>');
				
			}
		
		for (i=0;i<chatBoxes.length;i++) {
			chatboxtitle = chatBoxes[i];
			$("#chatbox_"+chatboxtitle+" .chatboxcontent").scrollTop($("#chatbox_"+chatboxtitle+" .chatboxcontent")[0].scrollHeight);
			setTimeout('$("#chatbox_"+chatboxtitle+" .chatboxcontent").scrollTop($("#chatbox_"+chatboxtitle+" .chatboxcontent")[0].scrollHeight);', 100); // yet another strange ie bug
		}
	
	setTimeout('chatHeartbeat();',chatHeartbeatTime);
}

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
	
	setTimeout('chatHeartbeat();',chatHeartbeatTime);
		
	}});
}

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
};

//From websocket Chart

var lJWSID = "jWebSocket Chat",
lWSC = null,
eLog = null,epopMessage=null,
eUsername = null,
ePool = null,
eMessage = null,
eDebug = null,
eKeepAlive = null,
looedUser = null,
looedUsers = null,
accesUserId = 0,
accessUsers = null,messageArea=null,eOnline="",eChartRoom="";

var IN = 0;
var OUT = 1;
var EVT = 2;
var SYS = "SYS";
var USR = null;
var serverLoggedUser = new Array();
var groupChartMap = new Array();
var mySourceId = 0;
var userMap = {};

// append a line to the log text area
function log( aUsername, aEvent, aString ) {
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
	eLog.innerHTML +=
			aUsername + " " +
			lFlag + " " +
			aString + "<br>";	

	if( eLog.scrollHeight > eLog.clientHeight ) {
		eLog.scrollTop = eLog.scrollHeight - eLog.clientHeight;
	}
}

function clearLog() {
	eLog.innerHTML = "";
	eLog.scrollTop = 0;
}

function doFocus( aElement ) {
	aElement.focus();
	aElement.select();
}

function doOpen() {
	// adjust this URL to your jWebSocket server
	var lURL = jws.JWS_SERVER_URL + "/;prot=json,timeout=360000";
	log( SYS, OUT, "Connecting to " + lJWSID + " at " + lURL + "..."+ eUsername.value );								

	// try to establish connection to jWebSocket server
	lWSC.logon( lURL, eUsername.value, "", {

		// OnOpen callback
		OnOpen: function( aEvent ) {
			log( SYS, IN, "Connection to " + lJWSID + " established." );
			// start keep alive if user selected that option
			checkKeepAlive({ immediate: false });
		},

		// OnMessage callback
		OnMessage: function( aEvent, aToken ) {
			// for debug purposes
			if( eDebug.checked ) {
				/*log( SYS, EVT, "<font style='color:#888'>" +
					( aToken ? aToken.type : "-" ) + ": " +
					aEvent.data + "</font>");*/
			}
			log( "", EVT, "<font style='color:#888'>" +
					( aToken ? aToken.type : "-" ) + ": " +
					aEvent.data + "</font>");
			
			if( aToken ) {
				// is it a response from a previous request of this client?
				//onClientLogin();
				if( aToken.type == "welcome" ) {
					mySourceId = aToken.sourceId;					
				}
				if( aToken.type == "response" ) {
					if(accesUserId==0 && aToken.reqType=="broadcast"){
						log( SYS, IN, "<font style='color:#DF0101'>Dear "+ eUsername.value+" Please add the User To Chart</font>" );
					}
					// figure out of which request
					if(aToken.count==1){
						serverLoggedUser = aToken.clients ;
					}
					if( aToken.reqType == "login" ) {
						if( aToken.code == 0 ) {
							log( SYS, IN, "Welcome '" + aToken.username + "'" );
							// select message field for convenience
							doFocus( eMessage );
							// call getAuthClients method from
							// jWebSocket System Client Plug-In
							lWSC.getAuthClients({
								pool: null
							});
						} else {
							log( SYS, IN, "Error logging in '" + + "': " + aToken.msg );
							// select username again for convenience
							doFocus( eUsername );
						}
					} else if( aToken.reqType == "getClients" ) {
						var url = "Total User Logged : ";	
						var eUrl="";
						var str = aToken.clients;						
						for(i=0;i<str.length;i++ ) {
							var userId = str[i].split("@")[0];
							userMap[str[i].split("@")[1]]=userId;
							if(userId != eUsername.value){
								url +=" <a href='javascript:loadUserForChart("+str[i].split("@")[1]+");'>"+str[i]+"</a> ";	
								eUrl +=" <a href='javascript:loadUserForChart("+serverLoggedUser[i].split("@")[1]+");'>"+serverLoggedUser[i]+"</a> <font color='green'><a href='javascript:loadUserForChartRoom("+serverLoggedUser[i].split("@")[1]+");'> + </a></font><br>";
							}else{
								url += eUsername.value;
							}
							eOnline.innerHTML = eUrl;
						}
						looedUsers.innerHTML = url;
						doFocus(eOnline);
						//looedUsers.innerHTML =  "<a href='javascript:openPOPWindow();'>"+aToken.clients+"</a>"+url;
						//log( SYS, IN, "Clients (" + aToken.count + "): " + aToken.clients );
					}
					// is it an event w/o a previous request ?
				} else if( aToken.type == "event" ) {
					// interpret the event name
					if( aToken.name == "login" ) {
						serverLoggedUser[serverLoggedUser.length] = aToken.username+"@"+aToken.sourceId;						
						//log( SYS, EVT, "Server :" + aToken.pool );
						createLogedServerUser();					
						
					}
					if( aToken.name == "logout" ) {
						//log( "Before", EVT, "Server :" +serverLoggedUser.length +" = "+userMap[aToken.sourceId] );
						for(i=0;i<serverLoggedUser.length;i++ ) {
							if(serverLoggedUser[i].split("@")[1]==aToken.sourceId){
								serverLoggedUser.splice(i,1);
							}
						}
						delete userMap[aToken.sourceId];
						//log( "after", EVT, "Server :" +serverLoggedUser.length +" = "+userMap[aToken.sourceId] );
						

					}
					if( aToken.name == "disconnect" ) {
						createLogedServerUser();
					}
					// :
				} else if( aToken.type == "goodBye" ) {
					log( SYS, IN, lJWSID + " says good bye (reason: " + aToken.reason + ")!" );					

					doFocus( eUsername );
					// is it any token from another client
				} else if( aToken.type == "broadcast" ) {
					if( aToken.data) {
						log( "Logs", IN, aToken.pool+"-"+mySourceId);
						if(aToken.data != null && aToken.data=="group"){							
							if(groupChartMap.length==0){
								groupChartMap[groupChartMap.length]=aToken.sourceId;
							}								
							if(aToken.pool != ""){
								groupChartMap[groupChartMap.length]=aToken.pool;								
							}
						}else if(aToken.pool != 0 && aToken.pool != 1001 && aToken.pool == mySourceId){										
							log( aToken.sender, IN, aToken.data );								
							loadUserForChart(aToken.sourceId,aToken.data);
							
						}else if(aToken.pool != 0 && aToken.pool==1001){
							loadUserForChartRoom2();
							var countUser = groupChartMap.length;
							log( "Group-1 ", IN, mySourceId+"==> "+countUser);
							for(j=0; j < countUser; j++){
								log( "Group-2 ", IN, groupChartMap[j]+"="+mySourceId);
								if(groupChartMap[j]==mySourceId){									
									loadGroupChartRoom(aToken.sourceId,aToken.data);
								}
							}							
						}
					}
				}
			}
		},

		// OnClose callback
		OnClose: function( aEvent ) {
			//keepAlive({ immediate: false });
			log( SYS, IN, "Disconnected from " + lJWSID + ".");	
			//lWSC.stopKeepAlive();		
			//log( SYS, IN, "Disconnected from " + lJWSID + ".");					
			//doFocus( eUsername );
		}
	});
}

function loadUserForChart(user,message ){
	accesUserId = user;				
	accessUsers.innerHTML = "Connected User : "+userMap[user];
	chatWith(user);
	if(message.length != 0){
	chatFromSession(userMap[user],"",message);}
	looedUser.innerHTML =  userMap[user];	
}

function loadUserForChartRoom(user){
	var name ="";	
	accesUserId =1001;
	var lRes = lWSC.broadcastText(
		user,
		"group"
	);
	groupChartMap[0] = mySourceId;
	groupChartMap[groupChartMap.length] = user;	
	for(i=0;i<groupChartMap.length;i++){
		if(groupChartMap[i] != mySourceId){
			if(name==""){
				name=userMap[groupChartMap[i]];
			}else{
				name += "_"+userMap[groupChartMap[i]];
			}
		}
	}
	userMap[1001] = name;
	eChartRoom.innerHTML = "<a href='javascript:loadGroupChartRoom();'>"+name+"</a> ";
}
function loadUserForChartRoom2(user){	
	var name ="";
	for(i=0;i<groupChartMap.length;i++){
		if(groupChartMap[i] != mySourceId){
			if(name==""){
				name=userMap[groupChartMap[i]];
			}else{
				name += "_"+userMap[groupChartMap[i]];
			}
		}
	}	
	userMap[1001] = name;
	eChartRoom.innerHTML = "<a href='javascript:loadGroupChartRoom();'>"+name+"</a> ";
}

function loadGroupChartRoom(user,message){	
	accesUserId = 1001;	
	chatWith(1001);
	if(message.length>0){
		chatFromSession(userMap[user],"group",message);
	}
	return;
}

function createLogedServerUser(){

	var url = "Total User Logged : ";
	var eUrl = "";												
	for(i=0;i<serverLoggedUser.length;i++ ) {										
		var userId = serverLoggedUser[i].split("@")[0];	
		userMap[serverLoggedUser[i].split("@")[1]]=userId;							
		if(userId != eUsername.value){								
			url +=" <a href='javascript:loadUserForChart("+serverLoggedUser[i].split("@")[1]+");'>"+serverLoggedUser[i]+"</a> ";
			eUrl +=" <a href='javascript:loadUserForChart("+serverLoggedUser[i].split("@")[1]+");'>"+serverLoggedUser[i]+"</a> <font color='green'><a href='javascript:loadUserForChartRoom("+serverLoggedUser[i].split("@")[1]+");'> + </a></font><br>";
		}else{
			url += eUsername.value;
		}
		eOnline.innerHTML = eUrl;
	}
	looedUsers.innerHTML = url;
	doFocus(eOnline);
	return;
}


function getClients() {
	var lRes = lWSC.getAuthClients({
		pool: null
	});				
	log( SYS, OUT, "getClients: " + lRes.msg );
}

function doClose() {
	// disconnect automatically logs out!
	lWSC.stopKeepAlive();
	var lRes = lWSC.close({
		// wait a maximum of 3 seconds for server good bye message
		timeout: 3000
	});
	log( SYS, OUT, "logout: " + lRes.msg );
}
function broadcastMsg(message){
 //alert("Message "+message);
 var lMsg = message;
	if( lMsg.length > 0 ) {
		log( USR, OUT, lMsg );
		var lRes = lWSC.broadcastText(
		accesUserId,		// broadcast to all clients (not limited to a certain pool)
		lMsg	// broadcast this message
	);
		// log error only, on success don't confuse the user
		if( lRes.code != 0 ) {
			chatWith(accesUserId);
			chatFromSession(userMap[accesUserId],"SYS",userMap[mySourceId] + " is "+lRes.msg);
			log( SYS, OUT, "broadcast: " + lRes.msg );
			return false;
		}
		eMessage.value = "";
	}
	doFocus( eMessage );
}

function broadcast() {
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
}

function checkKeepAlive( aOptions ) {
	if( !aOptions ) {
		aOptions = {};
	}
	aOptions.interval = 30000;
	if( eKeepAlive.checked ) {
		keepAlive(aOptions);
	} else {
		lWSC.stopKeepAlive();
	}
}
function keepAlive( aOptions ) {	
	aOptions.interval = 30000;	
	lWSC.startKeepAlive( aOptions );	
}

function usrKeyDnLsnr( aEvent ) {
	// on enter in username field try to login
	if( aEvent.keyCode == 13 ) {
		doOpen();
	}
}

function msgKeyDnLsnr( aEvent ) {
	// on enter in message field send broadcast the message
	if( !aEvent.shiftKey && aEvent.keyCode == 13 ) {
		broadcast();
	}
}

function elemFocusLsnr( aEvent ) {
	// on focus select full text of element (for username and message)
	jws.events.getTarget( aEvent ).select();
}

var lNextWindowId = 1;


function openSubWindow( userName ) {

	window.open(
	// "http://www.jwebsocket.org/demos/chat/chat.htm"
	"chat.htm",
	"chatWindow" + lNextWindowId,
	"width=900,height=700,left=" + (50 + lNextWindowId * 30) + ",top=" + (50 + lNextWindowId * 25)
	);

	lNextWindowId++;
	if( lNextWindowId > 10 ) {
		lNextWindowId = 1;
	}
}

function initPage() {
	// get some required HTML elements
	eLog = jws.$( "sdivChat" );
	epopMessage = jws.$( "popMessage" );
	eUsername = jws.$( "stxfUsername" );
	ePool = jws.$( "stxfPool" );
	eReceiver = jws.$( "stxfReceiver" );
	eMessage = jws.$( "stxaMsg" );	

	eDebug = jws.$( "schkDebug" );
	eKeepAlive = jws.$( "schkKeepAlive" );

	looedUsers = jws.$( "logged-users" );
	looedUser = jws.$( "logged-user" );
	accessUsers = jws.$( "access-users" );
	eOnline = jws.$( "onlineUsers" );
	eChartRoom = jws.$( "onlineChartRoom" );
	
	
	
	
	looedUser.innerHTML =  "Message";
	// check if WebSockets are supported by the browser
	if( jws.browserSupportsWebSockets() ) {
		// instaniate new TokenClient, either JSON, CSV or XML
		lWSC = new jws.jWebSocketJSONClient();
		// lWSC = new jws.jWebSocketCSVClient();

		jws.events.addEventListener( eUsername, "keydown", usrKeyDnLsnr );
		jws.events.addEventListener( eMessage, "keydown", msgKeyDnLsnr );
		jws.events.addEventListener( epopMessage, "keydown", msgKeyDnLsnr );
		
		jws.events.addEventListener( eUsername, "focus", elemFocusLsnr );
		jws.events.addEventListener( eMessage, "focus", elemFocusLsnr );
		jws.events.addEventListener( accessUsers, "focus", elemFocusLsnr );
		jws.events.addEventListener( looedUser, "focus", elemFocusLsnr );
		jws.events.addEventListener( eOnline, "focus", elemFocusLsnr );

		
		
/*
		eUsername.addEventListener( "keydown", usrKeyDnLsnr, false );
		eMessage.addEventListener( "keydown", msgKeyDnLsnr, false );
		eUsername.addEventListener( "focus", elemFocusLsnr, false );
		eMessage.addEventListener( "focus", elemFocusLsnr, false );

*/
		eUsername.focus();
		eUsername.select();
	} else {
		jws.$( "sbtnSend" ).setAttribute( "disabled", "disabled" );
		jws.$( "sbtnLogin" ).setAttribute( "disabled", "disabled" );
		jws.$( "sbtnLogout" ).setAttribute( "disabled", "disabled" );
		jws.$( "sbtnGetClients" ).setAttribute( "disabled", "disabled" );
		jws.$( "sbtnClearLog" ).setAttribute( "disabled", "disabled" );

		eDebug.setAttribute( "disabled", "disabled" );
		eKeepAlive.setAttribute( "disabled", "disabled" );
		eUsername.setAttribute( "disabled", "disabled" );
		eMessage.setAttribute( "disabled", "disabled" );

		var lMsg = jws.MSG_WS_NOT_SUPPORTED;
		alert( lMsg );
		log( SYS, IN, lMsg );
	}
}

function exitPage() {
	// this allows the server to release the current session
	// immediately w/o waiting on the timeout.
	if( lWSC ) {
		lWSC.close({
			// force immediate client side disconnect
			timeout: 0
		});
	}
}			