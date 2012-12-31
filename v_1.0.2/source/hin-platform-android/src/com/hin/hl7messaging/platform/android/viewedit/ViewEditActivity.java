package com.hin.hl7messaging.platform.android.viewedit;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.EditText;
import android.widget.Toast;

import com.hin.hl7messaging.platform.android.R;
import com.hin.hl7messaging.platform.android.messageconfig.jsinterface.ViewEditJSInterface;
import com.hin.hl7messaging.platform.android.search.FindProfileActivity;



public class ViewEditActivity extends Activity{
	
/*private static final int REQ_CODE_PICK_IMAGE = 0;*/
//ID for the menu exit option
/*private final int ID_MENU_VIEWEDIT = 1;
private final int ID_MENU_SAVE = 2;
private final int ID_MENU_FIND = 3;
private final int ID_MENU_CONTACTS = 4;*/
private WebView webview;
private String imageData = "";
private volatile String label = "ViewEditActivity";
EditText editText;


	private ViewEditJSInterface jsInterface;
	private Handler mHandler = new Handler();

	
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
      
        jsInterface= new ViewEditJSInterface(this,webview);
	    webview.addJavascriptInterface(jsInterface, "JSInterface");
	    
	    setContentView(webview);
	    
	   webview.loadUrl("http://172.25.250.145:8081/hin-web/mobile/viewedit/html/ProfileNew.html");
	}
	
 	
	@Override
	public boolean onCreateOptionsMenu(Menu menu)
	    {
		super.onCreateOptionsMenu(menu);

	    /*menu.add(Menu.NONE,ID_MENU_VIEWEDIT,Menu.NONE,R.string.vieweditOption);*/
	    /*menu.add(Menu.NONE,ID_MENU_SAVE,Menu.NONE,R.string.saveOption);
	    menu.add(Menu.NONE,ID_MENU_FIND,Menu.NONE,R.string.findOption);
	    menu.add(Menu.NONE,ID_MENU_CONTACTS,Menu.NONE,"Contacts");*/
		
		MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.menu, menu);
        return true;
	    
	 
	    //return true;
	}
	
	   @Override
	    public boolean onOptionsItemSelected(MenuItem item)
	    {
	    	//check selected menu item
	    	if(item.getItemId() == R.id.view)
	    	{
	    		//viewEdit(item.getItemId());
	    		//return true;
	    		//Toast.makeText(this, "view again", Toast.LENGTH_SHORT).show();
	    		Intent intent = new Intent(this, ViewEditActivity.class);
	             startActivity(intent);      
	             finish();
	    	}
	    	
	    	if(item.getItemId() == R.id.save)
	    	{
	    		//Toast.makeText(this, "save clicked", Toast.LENGTH_SHORT).show();
	    		webview.loadUrl("javascript: profile.saveProfile();");			
	    		return true;
	    	}
	    	
	    	 if(item.getItemId() == R.id.find)
	    	{
	    		//webview.loadUrl("javascript: dataTypeApi.EDimage.getEDimage();");
	    		//find(item.getItemId());
	             Intent intent = new Intent(this, FindProfileActivity.class);
	             startActivity(intent);      
	             finish();
	    		//return true;
	    	}
	    	return super.onOptionsItemSelected(item);

	    }


	public void viewEdit(int id){
	    	Toast.makeText(this, "function viewEdit", Toast.LENGTH_SHORT).show();
	    }
	   
	   public void save(){
	    	Toast.makeText(this, "function save", Toast.LENGTH_SHORT).show();
	    	
	    }
	   
	   public void find(int id){
	    	Toast.makeText(this, "function find", Toast.LENGTH_SHORT).show();
	    }
	     
		
		@Override
		protected void onActivityResult( int requestCode, int resultCode, Intent imageReturnedIntent) {
			 super.onActivityResult(requestCode, resultCode, imageReturnedIntent);
			 
			final String str = imageReturnedIntent.getStringExtra("img");
			
			final String imageString="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";
			
			Toast.makeText(this, "in onActivityResult : "+str, Toast.LENGTH_SHORT).show();
			final String c= "swethaswetha";
			
			 //jsInterface= new ViewEditJSInterface(this,webview);
			 
			 //setImageData(imageString);
			 //setLabel("jsInterface ViewEditActivity");
			 //webview.addJavascriptInterface(jsInterface, "JSInterface");

			 mHandler.post(new Runnable() {
		            public void run() {
		            	webview.loadUrl("javascript: imgeReady('"+imageString+"');");
		            	//jsInterface.setImageData(str);
		            }
			 });
			 
			
			//webview.loadUrl("javascript: dataTypeApi.imageVariable='swetha';");
			//webview.loadUrl("javascript: imageAssignValue('swetha');");
			
			
		}


		public String getImageData() {
			return imageData;
		}


		public void setImageData(String imageData) {
			this.imageData = imageData;
		}


		public String getLabel() {
			return label;
		}


		public void setLabel(String label) {
			this.label = label;
		}
		
		
	    
}
	