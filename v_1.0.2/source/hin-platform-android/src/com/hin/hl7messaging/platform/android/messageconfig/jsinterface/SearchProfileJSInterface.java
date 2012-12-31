package com.hin.hl7messaging.platform.android.messageconfig.jsinterface;
import java.util.HashMap;
import java.util.Map;

import com.hin.hl7messaging.platform.android.R;
import com.hin.hl7messaging.platform.android.search.SearchProfileViewActivity;

import android.app.Activity;
import android.content.Intent;
import android.os.Handler;
import android.util.Log;
import android.webkit.WebView;
public class SearchProfileJSInterface {
	private Activity activity;
	private Handler mHandler = new Handler();
	private WebView webView;
	
	private static Map<String, Class<?>> activityMap = new HashMap<String, Class<?>>();
	static {

		activityMap.put("profileView", SearchProfileViewActivity.class);

	}
	
	public SearchProfileJSInterface(Activity activity, WebView webView) {
		this.activity = activity;
		this.webView = webView;
    }
	
	public void navigateToActivity(String activityName,String ProfileId){
    	Intent intent;
		intent = new Intent(activity, activityMap.get(activityName));
		System.out.println(ProfileId);
		intent.putExtra("ProfileId", ProfileId);
		activity.startActivity(intent); 
    }
}
