package com.hin.hl7messaging.platform.android.messageconfig.jsinterface;

import android.app.Activity;
import android.content.Intent;
import android.webkit.WebView;
import android.widget.Toast;

import com.hin.hl7messaging.platform.android.profileview.ProfileViewActivity;

public class CalendarJsInterface {
	
	private Activity activity;
	private WebView webView;
	public CalendarJsInterface(Activity activity, WebView webView) {
		this.activity = activity;
		this.webView = webView;
    }

	public void doEchoTest(String echo){
        Toast toast = Toast.makeText(webView.getContext(), echo, Toast.LENGTH_SHORT);
        toast.show();    
    }  
	    
	    public void navigateToActivity(String profileId)
		 {
			 
			 Intent intent;
				intent = new Intent(activity,ProfileViewActivity.class);
				//System.out.println(ProfileId);
				intent.putExtra("ProfileId", profileId);
				activity.startActivity(intent);  
		 }  
}
