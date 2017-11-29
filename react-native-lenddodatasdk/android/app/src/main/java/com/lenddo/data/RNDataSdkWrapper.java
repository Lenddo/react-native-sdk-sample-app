package com.lenddo.data;


import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.lenddo.data.AndroidData;
import com.lenddo.data.models.ClientOptions;
import java.util.UUID;

public class RNDataSdkWrapper extends ReactContextBaseJavaModule {

    private static Callback requestCallback;
    private ReactApplicationContext reactContext;
    private String partnerScriptId;
    private String apiSecret;

    public RNDataSdkWrapper(ReactApplicationContext reactContext, String partnerScriptId, String apiSecret) {
        super(reactContext);
        this.reactContext = reactContext;
        this.partnerScriptId = partnerScriptId;
        this.apiSecret = apiSecret;
    }


    @Override
    public String getName() {
        return "RNDataSdkWrapper";
    }


    @ReactMethod
    public void setup() {
        Log.d("TEST", "setup:: partnerScriptId:: " + partnerScriptId + ", apiSecret:: " + apiSecret);
        ClientOptions clientOptions = new ClientOptions();
        clientOptions.enableLogDisplay(true);
        AndroidData.setup(reactContext, partnerScriptId, apiSecret, clientOptions);
    }


    @ReactMethod
    public void test() {
        Log.d("TEST", "TEST HURRAY!");
    }


    @ReactMethod
    public void startAndroidData() {
        AndroidData.startAndroidData(getCurrentActivity(), generateApplicationId());
    }


    private synchronized String generateApplicationId() {
        return UUID.randomUUID().toString();
    }
}
