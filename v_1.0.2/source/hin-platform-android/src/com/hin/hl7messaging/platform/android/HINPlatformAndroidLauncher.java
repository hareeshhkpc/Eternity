package com.hin.hl7messaging.platform.android;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;

import com.hin.hl7messaging.platform.android.login.LoginActivity;
import com.hin.hl7messaging.platform.android.messageconfig.PhoneGapActivity;
import com.hin.hl7messaging.platform.android.roles.RolesActivity;
import com.hin.hl7messaging.platform.android.search.FindProfileActivity;
import com.hin.hl7messaging.platform.android.viewedit.ViewEditActivity;


public class HINPlatformAndroidLauncher extends Activity {
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
    }
    
    public void loadConfig(View view){
    	startActivity(new Intent(this, PhoneGapActivity.class));
    } 
    
    public void viewEdit(View view){
    	startActivity(new Intent(this, ViewEditActivity.class));
    }
	
	public void loadSearchActivity(View view){
    	startActivity(new Intent(this, FindProfileActivity.class));
    }


    public void loadLogin(View view){
    	startActivity(new Intent(this, LoginActivity.class));
    }
    
	/*public void loadProfileViewActivity(View view){
    	startActivity(new Intent(this, ProfileViewActivity.class));
    }*/
    
	/*public void loadProfileViewActivity(View view){
    	startActivity(new Intent(this, ProfileViewActivity.class));
    }*/
	public void roleActivity(View view){
    	startActivity(new Intent(this, RolesActivity.class));

    }


    

}