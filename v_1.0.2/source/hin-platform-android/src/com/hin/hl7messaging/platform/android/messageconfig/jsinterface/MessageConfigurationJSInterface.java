/**
 * 
 */
package com.hin.hl7messaging.platform.android.messageconfig.jsinterface;

import java.util.HashMap;
import java.util.Map;

import android.app.Activity;
import android.content.Intent;
import android.os.Handler;
import android.util.Log;
import android.webkit.WebView;

import com.hin.hl7messaging.platform.android.login.LoginActivity;
import com.hin.hl7messaging.platform.android.login.RegisterAccountActivity;
import com.hin.hl7messaging.platform.android.login.WelcomePageActivity;
import com.hin.hl7messaging.platform.android.roles.NotificationActivity;
import com.hin.hl7messaging.platform.android.roles.PermissionActivity;
import com.hin.hl7messaging.platform.android.roles.RoleDefinitionActivity;
import com.hin.hl7messaging.platform.android.roles.RoleInstanceActivity;
import com.hin.hl7messaging.platform.android.roles.RolesActivity;
import com.hin.hl7messaging.platform.android.roles.SettingsActivity;

/**
 * @author Administrator
 *
 */
public class MessageConfigurationJSInterface {

	private Activity activity;
	private Handler mHandler = new Handler();
	private WebView webView;
	
	private static Map<String, Class<?>> activityMap = new HashMap<String, Class<?>>();
	static {
		activityMap.put("roles", RolesActivity.class);
		activityMap.put("notifications", NotificationActivity.class);
		activityMap.put("settings", SettingsActivity.class);
		activityMap.put("selectedRoleDefinition", RoleDefinitionActivity.class);
		activityMap.put("permisssion", PermissionActivity.class);
		activityMap.put("roleInstance", RoleInstanceActivity.class);
		activityMap.put("login", LoginActivity.class);
		activityMap.put("register", RegisterAccountActivity.class);
		activityMap.put("welcome", WelcomePageActivity.class);
	}
	
	public MessageConfigurationJSInterface(Activity activity, WebView webView) {
		this.activity = activity;
		this.webView = webView;
    }
    
    public void nagivateToActivity(String activityName){
    	Intent intent;
		intent = new Intent(activity, activityMap.get(activityName));
		activity.startActivity(intent);    	
    }
    
    public void nagivateToPage(String activityClass){
    	Intent intent; 
		try {
			intent = new Intent(activity, Class.forName(activityClass));
			activity.startActivity(intent);
		} catch (ClassNotFoundException e) {
			Log.e("HealthNetwork", "Error while loading activity", e);
		}
    	
    }

    /**
     * This is not called on the UI thread. Post a runnable to invoke
     * loadUrl on the UI thread.
     */
    public void clickOnAndroid() {
        mHandler.post(new Runnable() {
            public void run() {
            	webView.loadUrl("javascript:jsHello()");
            }
        });

    }
    
    public void nagivateToActivityWithParameter(String activityName,String xmlDom,String selectedRole){
		Intent intent;
		intent = new Intent(activity, activityMap.get(activityName));
		intent.putExtra("xmlDom", xmlDom);
		intent.putExtra("selectedRole", selectedRole);
		activity.startActivity(intent); 
    }
}