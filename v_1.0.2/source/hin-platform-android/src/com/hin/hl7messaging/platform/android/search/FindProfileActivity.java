package com.hin.hl7messaging.platform.android.search;
import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;

import com.hin.hl7messaging.platform.android.R;
import com.hin.hl7messaging.platform.android.messageconfig.jsinterface.SearchProfileJSInterface;
public class FindProfileActivity  extends Activity {
private WebView webview;
	
    public FindProfileActivity(){
    
    }

    /**
     * Called with the activity is first created.
     */
   @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        webview = new WebView(this);
        
        WebSettings webSettings = webview.getSettings();
        webSettings.setSavePassword(true);
        webSettings.setSaveFormData(true);
        webSettings.setJavaScriptEnabled(true);
        webSettings.setSupportZoom(false);
        webSettings.setLoadsImagesAutomatically(true);
        
        webview.addJavascriptInterface(new SearchProfileJSInterface(this, webview), getResources().getString(R.string.config_js_interface));
        setContentView(webview);
        webview.loadUrl("http://172.25.250.241:8081/hin-web/mobile/search-profile/html/FindProfile.html");
        
    }
    
}
