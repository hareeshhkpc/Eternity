package com.hin.hl7messaging.platform.android.login;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;

import com.hin.hl7messaging.platform.android.messageconfig.jsinterface.RegisterJSInterface;

public class LoginActivity extends Activity{
	
private WebView webview;
	
	/** Called when the activity is first created. */
	@Override
	public void onCreate(Bundle savedInstanceState) {
	    super.onCreate(savedInstanceState);
	
	    webview = new WebView(this);
	    
	    WebSettings webSettings = webview.getSettings();
        webSettings.setSavePassword(false);
        webSettings.setSaveFormData(false);
        webSettings.setJavaScriptEnabled(true);
        webSettings.setSupportZoom(false);
	    
	    webview.addJavascriptInterface(new RegisterJSInterface(this, webview), "JSI");
	    setContentView(webview);
	    
	    webview.loadUrl("http://172.25.250.163:8081/hin-web/mobile/register/html/Login.html");
	}
}
