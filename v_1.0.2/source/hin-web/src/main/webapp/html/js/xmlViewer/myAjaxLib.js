/*
myAjaxLib.js
*/
function ajaxInterface(url,method,callback,obj,params)
{
	alert("ajaxInterface");
	var xmlhttp;
	var p=new Object();
	p.obj=obj;
	if (window.XMLHttpRequest)
  	{/* code for IE7+, Firefox, Chrome, Opera, Safari */
 		 xmlhttp=new XMLHttpRequest();
  	}
	else
 	{/* code for IE6, IE5 */
  		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
  	}
	xmlhttp.onreadystatechange=function()
  	{
		try{
 			if (xmlhttp.readyState==4 && xmlhttp.status==200)
    			{
				p.responseText=xmlhttp.responseText;
    				callback(p);
    			}
 			else if (xmlhttp.readyState==4)
			{
// 				alert("Error in ajaxInterface: " + xmlhttp.responseText);
 			}
		}
		catch(err)
		{
//			alert(err.message);
		}
  	}
	xmlhttp.open(method,url,true);
	if(method=="POST")
		doPost(xmlhttp,params);
	else
		xmlhttp.send();
};
function doPost(xmlhttp,params)
{
	alert("doPost");
	var qs;
	qs="";
	for (i in params)
  	{
   	qs += "&" + i + "=" + params[i];
  	}
    	xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded;");
	xmlhttp.send(qs);
};

function sendDataToServer(url,target)
{
	alert("sendDataToServer");
var obj=new Object();
obj.handleId=target;
ajaxInterface(url,'GET',null,obj);
};
