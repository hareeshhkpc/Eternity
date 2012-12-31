var boxStyle = "border:1px solid blue;width:80%;height: 130px; overflow:auto;font-family: Verdana, Arial;font-size:11px;color:#2D353B";
var inputBoxH;
function isMobile() {
	var i;
	var uagent = navigator.userAgent.toLowerCase();
	var s = "iphone,ipod,kindle fire,silk,enddd";
	var a = s.split(",");
	for (i = 0; i < a.length; i++) {
		if (uagent.search(a[i]) > -1)
			return true;
	}
	return false;
};
function ptMobilePage() {
	boxStyle = "border:1px solid blue;width:90%;height: 150px; overflow:auto;font-family: Verdana, Arial;font-size:12px;color:#2D353B";
	var t = document.getElementById("topLinkData");
	var v = t.textContent;
	if (!v)
		v = t.innerText;
	var a = v.split("\n");
	t.style.cssText = "display:none;";
	var d = document.getElementById("content");
	var s = "Welcome to XmlGrid.net Mobile Version.<br><br>";
	s += "For more functionalities please use a desktop or laptop to visit us.";
	d.innerHTML = s;
};
function ptFullPage() {
	var r, c, i;

	var d = document.getElementById("pageHeadLink");
	var t = document.getElementById("topLinkData");

	var tb = document.createElement("table");
	d.appendChild(tb);
	r = document.createElement("tr");
	r.setAttribute("index", 0);
	tb.appendChild(r);

	var v = t.textContent;
	if (!v)
		v = t.innerText;

	var a = [];
	if (v && v.length > 0)
		a = v.split("\n");
	t.style.cssText = "display:none;";

	var k = 0;
	for ( var i = 0; i < a.length; i++) {
		if (k > 5) {
			k = 0;
			r = document.createElement("tr");
			r.setAttribute("index", 1);
			tb.appendChild(r);
		}
		if (a[i].length > 10) {
			c = ptOneLink(a[i]);
			r.appendChild(c);
			k += 1;
		}
	}
};
function ptMainPage() {
	var i;
	if (isMobile() == false)
		ptFullPage();
	else
		ptMobilePage();

};
function ptOneLink(a) {	
	var a, c, s, t;
	var b = a.split(";");
	t = "";
	c = document.createElement("td");
	c.setAttribute("class", "menuTd");
	if (b[0].length > 2)
		t = "target=\"" + b[0] + "\"";
	s = "<a " + t + " href=\"" + b[1] + "\" title=\"" + b[2] + "\">" + b[3]
			+ "</a>";
	c.innerHTML = s;
	return c;
};
function ptInputBox(hid, key) {
	inputBoxH = document.createElement("div");
	inputBoxH.innerHTML = "copy and paste your XML data in this box and click <b>Submit</b> button, or click <b>Open File</b> or <b>By URL</b> to load your XML data.";
	inputBoxH.style.cssText = boxStyle;
	inputBoxH.contentEditable = "true";
	inputBoxH.onfocus = initInputBox;
	textObjectId = "textObjectId" + key;
	/* textObjectId = $('#' + hid).find("#textObjectId").attr("id"); */
	/* alert("textObjectId" + textObjectId); */
	inputBoxH.setAttribute("id", textObjectId);
	var h = document.getElementById(hid);
	h.innerHTML = "";
	h.appendChild(inputBoxH);
	var btn = ctInputButton(doInputBox, "View",
			"click here to load your XML code", null, 1);
	h.appendChild(btn);

};
function initInputBox() {
	inputBoxH.innerHTML = "";
};
