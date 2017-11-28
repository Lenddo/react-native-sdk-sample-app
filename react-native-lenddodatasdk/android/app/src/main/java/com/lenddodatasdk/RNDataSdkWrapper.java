package com.lenddodatasdk;


import android.content.Context;
import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.lenddo.data.AndroidData;

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
        AndroidData.setup(reactContext, partnerScriptId, apiSecret);
    }


    @ReactMethod
    public void test() {
        Log.d("TEST", "test:: partnerScriptId:: " + partnerScriptId + ", apiSecret:: " + apiSecret);
        Log.d("TEST", "TEST HURRAY!");
    }
}
