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
import android.widget.Toast;

import com.hin.hl7messaging.platform.android.login.LinkingActivity;
import com.hin.hl7messaging.platform.android.login.LoginActivity;
import com.hin.hl7messaging.platform.android.login.RegisterAccountActivity;
import com.hin.hl7messaging.platform.android.login.WelcomePageActivity;


/**
 * @author Administrator
 *
 */
public class RegisterJSInterface {

	private Activity activity;
	private Handler mHandler = new Handler();
	private WebView webView;
	
	private static Map<String, Class<?>> activityMap = new HashMap<String, Class<?>>();
	static {
		activityMap.put("login", LoginActivity.class);
		activityMap.put("register", RegisterAccountActivity.class);
		activityMap.put("welcome", WelcomePageActivity.class);
		activityMap.put("linking", LinkingActivity.class);
	}
	
	public RegisterJSInterface(Activity activity, WebView webView) {
		this.activity = activity;
		this.webView = webView;
    }
    
    public void navigateToActivity(String activityName){
    	Intent intent;
		intent = new Intent(activity, activityMap.get(activityName));
		activity.startActivity(intent);    	
    }
    
    public void navigateToPage(String activityClass){
    	Intent intent; 
		try {
			intent = new Intent(activity, Class.forName(activityClass));
			activity.startActivity(intent);
		} catch (ClassNotFoundException e) {
			Log.e("HealthNetwork", "Error while loading activity", e);
		}
    	
    }
    
    public void showToast(String echo) {
       Toast toast= Toast.makeText(webView.getContext(), echo, Toast.LENGTH_SHORT);
       toast.show();
    }
	
    public void setPreferences(String usn, String pwd, String string) {
    	showToast(usn);
    	showToast(pwd);
    	showToast(string);
    	
    	/*Editor edit = preferences.edit();
    	edit.putString("username", usn);
    	edit.commit();
    	
    	String username = preferences.getString("username", "n/a");
    	display("4rm shared: "+username);*/
    }
    
    public void removePreferences(String string) {
    	showToast(string);
    }
    
    public void getPreferences() {
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
}