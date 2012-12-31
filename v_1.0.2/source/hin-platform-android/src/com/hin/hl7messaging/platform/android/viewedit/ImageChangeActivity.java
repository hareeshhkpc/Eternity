package com.hin.hl7messaging.platform.android.viewedit;

import java.io.ByteArrayOutputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;

import android.R;
import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.Bitmap.CompressFormat;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.util.Base64;
import android.util.Base64OutputStream;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.hin.hl7messaging.platform.android.messageconfig.jsinterface.ViewEditJSInterface;

public class ImageChangeActivity extends ViewEditActivity {

	private static final int SELECT_PHOTO = 100;
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
		webSettings.setLoadsImagesAutomatically(true);

		webview.addJavascriptInterface(new ViewEditJSInterface(this, webview),
				"JSInterface");
		setContentView(webview);

		Toast.makeText(this, "in ImageChange Activity", Toast.LENGTH_SHORT)
				.show();

		
		Intent photoPickerIntent = new Intent(Intent.ACTION_PICK);
		photoPickerIntent.setType("image/*");
		startActivityForResult(photoPickerIntent, SELECT_PHOTO);

	}

	
	
	@Override
	protected void onActivityResult(int requestCode, int resultCode,
			Intent imageReturnedIntent) {
		
		// super.onActivityResult(requestCode, resultCode, imageReturnedIntent);
		// Toast.makeText(this, "in activity result",
		// Toast.LENGTH_SHORT).show();
		switch (requestCode) {
		case SELECT_PHOTO:
			//Toast.makeText(this, "in switch case", Toast.LENGTH_SHORT).show();
			if (resultCode == RESULT_OK) {
				// Toast.makeText(this, "in if", Toast.LENGTH_SHORT).show();
				Uri selectedImage = imageReturnedIntent.getData();
				InputStream imageStream;
				try {
					imageStream = getContentResolver().openInputStream(
							selectedImage);
					Bitmap yourSelectedImage = BitmapFactory
							.decodeStream(imageStream);

					byte[] byteResult = getByteArray(yourSelectedImage);
					String base64 = new String(Base64.encode(byteResult, Base64.DEFAULT));

					// Toast.makeText(this, "result :"+base64,
					// Toast.LENGTH_SHORT).show();

					// backToPage(base64);

					Intent intent = this.getIntent();
					intent.putExtra("img", base64);
					this.setResult(RESULT_OK, intent);
					// startActivityForResult(intent,SELECT_PHOTO);
					super.onActivityResult(requestCode, resultCode, intent);
					
					
					
					
					finish();

				} catch (FileNotFoundException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}

			}
		}
	}

	public byte[] getByteArray(Bitmap bitmap) {
		//Toast.makeText(this, "in bitmap to  bytearray", Toast.LENGTH_SHORT).show();
		ByteArrayOutputStream bos = new ByteArrayOutputStream();
		bitmap.compress(CompressFormat.PNG, 0, bos);
		return bos.toByteArray();
	}

}
