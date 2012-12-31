package com.hin.hl7messaging.platform.android.calendar;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;

import com.hin.hl7messaging.platform.android.messageconfig.jsinterface.CalendarJsInterface;

public class CalendarActivity extends Activity {
	private WebView webview;
	public CalendarActivity()
	{
		
	}
	
	@Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        webview = new WebView(this);
        
        WebSettings webSettings = webview.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setLoadsImagesAutomatically(true);
        
        webview.addJavascriptInterface(new CalendarJsInterface(this, webview), "JSI");
        setContentView(webview);
        
        webview.loadUrl("http://172.25.250.73:8081/hin-web/mobile/Calendar/html/Calendar.html");
        
    }
	
	
}