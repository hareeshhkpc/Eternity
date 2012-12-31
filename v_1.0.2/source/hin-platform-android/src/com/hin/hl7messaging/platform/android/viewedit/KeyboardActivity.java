package com.hin.hl7messaging.platform.android.viewedit;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.text.InputType;
import android.text.method.DigitsKeyListener;
import android.view.inputmethod.InputMethodManager;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.EditText;
import android.widget.Toast;

import com.hin.hl7messaging.platform.android.messageconfig.jsinterface.RegisterJSInterface;
import com.hin.hl7messaging.platform.android.messageconfig.jsinterface.ViewEditJSInterface;

public class KeyboardActivity  extends Activity{
	
	
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
	    
	    //webview.addJavascriptInterface(new ViewEditJSInterface(this, webview), "JSI");
	    setContentView(webview);
	    
	    Toast.makeText(this, "in KeyboardActivity", Toast.LENGTH_SHORT).show();
	    
	   
	    
	   /* EditText input = new EditText(this);
	    input.setInputType(InputType.TYPE_CLASS_NUMBER);
	    input.requestFocus();
	    
	    InputMethodManager imm = (InputMethodManager)getSystemService(Context.INPUT_METHOD_SERVICE); imm.showSoftInput(input, InputMethodManager.SHOW_IMPLICIT);*/
	    
	    EditText editView = new EditText(this);
	    editView.setRawInputType(android.text.InputType.TYPE_CLASS_PHONE);
	    
	    Toast.makeText(this, "in hehe", Toast.LENGTH_SHORT).show();
	    
	   //InputMethodManager imm =(InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);imm.showSoftInput(editView, InputMethodManager.SHOW_IMPLICIT);
	   /* editView.setKeyListener(new DigitsKeyListener());
	    editView.setInputType(InputType.TYPE_CLASS_NUMBER);
	    editView.requestFocus();*/

	}

}
