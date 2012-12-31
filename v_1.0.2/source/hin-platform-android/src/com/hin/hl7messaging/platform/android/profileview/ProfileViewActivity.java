package com.hin.hl7messaging.platform.android.profileview;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.hin.hl7messaging.platform.android.R;
import com.hin.hl7messaging.platform.android.messageconfig.jsinterface.SearchProfileJSInterface;

public class ProfileViewActivity extends Activity {
	private WebView webview;
	 public ProfileViewActivity() {
	    }
	 
	  @Override
	    public void onCreate(Bundle savedInstanceState) {
		  
		  super.onCreate(savedInstanceState);
	        webview = new WebView(this);
	        webview.setWebViewClient(new EmbeddedWebViewClient());
	        WebSettings webSettings = webview.getSettings();
	        webSettings.setSavePassword(true);
	        webSettings.setSaveFormData(true);
	        webSettings.setJavaScriptEnabled(true);
	        webSettings.setSupportZoom(false);
	        webSettings.setLoadsImagesAutomatically(true);
	        
	        webview.addJavascriptInterface(new SearchProfileJSInterface(this, webview), getResources().getString(R.string.config_js_interface));
	        setContentView(webview);
	        webview.loadUrl("http://172.25.250.73:8081/hin-web/mobile/profileView/html/ProfileView.html");
	        
	        
	  }
	  
	  private class EmbeddedWebViewClient extends WebViewClient {
			/*@Override
		    public boolean shouldOverrideUrlLoading(WebView view, String url) {
		        view.loadUrl("http://172.25.250.241:8081/hin-web/mobile/SearchProfile/html/View.html");
		        return true;
		    }*/

		    @Override
		    public void onPageFinished(WebView view, String url) {       
		    	Intent intent=getIntent();
		        String profileId=intent.getExtras().getString("ProfileId");
		       
		        	view.loadUrl("javascript:view.pageLoad(\""+profileId+"\")");
		        
		    }
		}
	  
	
	   
}



