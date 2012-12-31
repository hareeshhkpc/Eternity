package com.hin.hl7messaging.platform.android.messageconfig.jsinterface;

import android.webkit.WebView;
import android.widget.Toast;

public class JSInterface {

	private WebView mAppView;
	public JSInterface  (WebView appView) {
	        this.mAppView = appView;
	    }

	    public void doEchoTest(String echo){
	        Toast toast = Toast.makeText(mAppView.getContext(), echo, Toast.LENGTH_SHORT);
	        toast.show();
	    }

}
