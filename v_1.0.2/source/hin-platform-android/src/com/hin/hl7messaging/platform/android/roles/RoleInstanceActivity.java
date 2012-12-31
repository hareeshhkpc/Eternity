package com.hin.hl7messaging.platform.android.roles;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;

public class RoleInstanceActivity extends Activity{

	
private WebView webview;
	
	@Override
	public void onCreate(Bundle savedInstanceState) {
	    super.onCreate(savedInstanceState);
	
	    webview = new WebView(this);
	    WebSettings webSettings = webview.getSettings();
        webSettings.setSavePassword(false);
        webSettings.setSaveFormData(false);
        webSettings.setJavaScriptEnabled(true);
        webSettings.setSupportZoom(false);
	    setContentView(webview);
	    webview.loadUrl("http://172.25.250.113:8081/hin-web/mobile/role/html/Role.html");
	}
	

}
