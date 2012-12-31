package com.hin.hl7messaging.platform.android.search;
import com.hin.hl7messaging.platform.android.R;
import com.hin.hl7messaging.platform.android.messageconfig.jsinterface.MessageConfigurationJSInterface;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.View.OnClickListener;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
public class SearchProfileViewActivity extends Activity {
	private WebView webview;
	 public SearchProfileViewActivity(){
	    
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
        
        webview.addJavascriptInterface(new MessageConfigurationJSInterface(this, webview), getResources().getString(R.string.config_js_interface));
        setContentView(webview);
        Intent intent=getIntent();
        String profileId=intent.getExtras().getString("ProfileId");
        if(!profileId.equals("1")){
        	webview.loadUrl("http://172.25.250.73:8081/hin-web/mobile/profileView/html/ProfileView.html");
        }else{
        	webview.loadUrl("http://172.25.250.85:8080/hin-web/mobile/ProfileView/html/ProfileView.html");
        }
        
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
	        if(!profileId.equals("1")){
	        	view.loadUrl("javascript:view.pageLoad(\""+profileId+"\")");
	        }else{
	        	 view.loadUrl("javascript:retrieveOrgProfile(\""+profileId+"\")");       
	        }
	    }
	}
}
