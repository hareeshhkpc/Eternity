/*
 * Copyright (C) 2007 The Android Open Source Project
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.hin.hl7messaging.platform.android.messageconfig;

import android.app.Activity;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import com.hin.hl7messaging.platform.android.R;
import com.hin.hl7messaging.platform.android.messageconfig.jsinterface.MessageConfigurationJSInterface;


/**
 * A minimal "Hello, World!" application.
 */
public class MessageConfigurationActivity extends Activity {
	
	private WebView webview;
	
    public MessageConfigurationActivity() {
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
        webview.setWebViewClient(new WebViewClient(){
			/* (non-Javadoc)
			 * @see android.webkit.WebViewClient#shouldOverrideKeyEvent(android.webkit.WebView, android.view.KeyEvent)
			 */
			@Override
			public boolean shouldOverrideKeyEvent(WebView view, KeyEvent event) {
				return false;
			}        	
        });
        
        webview.addJavascriptInterface(new MessageConfigurationJSInterface(this, webview), getResources().getString(R.string.config_js_interface));
        setContentView(webview);
        
        webview.loadUrl("http://172.25.251.11:8082/hin-web/mobile/config/html/index.html");
        
        //webview.loadUrl("file:///android_asset/config/index.html");
        
        //ActivityUtil.loadPage(this, webview, "config/index.html");        
        
        //webview.loadUrl("http://10.0.2.2:8082/preview/demos/main/#ajax");
        //webview.loadUrl("file:///android_asset/touch/demos/main-menu.html");

        //webview.loadData("<h1>Welcome !</h1>", "text/html", "UTF-8");
    }
    
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event)  {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            webview.goBack();
            return true;
        }

        return super.onKeyDown(keyCode, event);
    }
    
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.message_config_menu, menu);
        return true;
     }
    
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case R.id.save:     Toast.makeText(this, "Save option!", Toast.LENGTH_LONG).show();
                                break;
            case R.id.cancel:     Toast.makeText(this, "Cancel option!", Toast.LENGTH_LONG).show();
                                break;
            case R.id.test: Toast.makeText(this, "Test option!", Toast.LENGTH_LONG).show();
                                break;
        }
        return true;
    }
}

