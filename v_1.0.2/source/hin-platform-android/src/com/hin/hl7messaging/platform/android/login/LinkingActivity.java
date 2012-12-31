package com.hin.hl7messaging.platform.android.login;

import java.util.List;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import com.hin.hl7messaging.platform.android.messageconfig.jsinterface.RegisterJSInterface;


public class LinkingActivity extends Activity{
	
private WebView webview;

	
	/** Called when the activity is first created. */
	@Override
	public void onCreate(Bundle savedInstanceState) {
	    super.onCreate(savedInstanceState);
	
	    webview = new WebView(this);
	    webview.setWebViewClient(new EmbeddedWebViewClient());
	    
	    WebSettings webSettings = webview.getSettings();
        webSettings.setSavePassword(false);
        webSettings.setSaveFormData(false);
        webSettings.setJavaScriptEnabled(true);
        webSettings.setSupportZoom(false);
	    
	    webview.addJavascriptInterface(new RegisterJSInterface(this, webview), "JSI");
	    setContentView(webview);
	    
	    webview.loadUrl("http://172.25.250.163:8081/hin-web/mobile/register/html/LinkedProfile.html");
	    
	}
	
	public void showToast(String toast) {
        Toast.makeText(this, toast, Toast.LENGTH_SHORT).show();
    }
	
	private class EmbeddedWebViewClient extends WebViewClient {
		
	    @Override
	    public void onPageFinished(WebView view, String url) {       
	    	Intent intent=getIntent();
	    	Uri uri = intent.getData();
	    	if("http".equals(uri.getScheme())) {
	    		String id = uri.getQueryParameter("id");
	    		//showToast(id);
	    		webview.loadUrl("javascript:loadProfile('"+id+"');"); 
	    	}
	    }
	}
	
}
