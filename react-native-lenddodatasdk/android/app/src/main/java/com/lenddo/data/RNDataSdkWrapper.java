package com.lenddo.data;


import android.support.annotation.NonNull;
import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.lenddo.data.AndroidData;
import com.lenddo.data.listeners.OnDataSendingCompleteCallback;
import com.lenddo.data.models.ClientOptions;

import java.util.UUID;

public class RNDataSdkWrapper extends ReactContextBaseJavaModule {
    private static final String TAG = "RNDataSdkWrapper";
    private static Callback requestCallback;
    private ReactApplicationContext reactContext;
    private String partnerScriptId;
    private String apiSecret;
    private String applicationId;

    public RNDataSdkWrapper(ReactApplicationContext reactContext, String partnerScriptId, String apiSecret) {
        super(reactContext);
        Log.d(TAG, "RNDataSdkWrapper");
        this.reactContext = reactContext;
        this.partnerScriptId = partnerScriptId;
        this.apiSecret = apiSecret;
    }

    @ReactMethod
    public void setProviderAccessToken(@NonNull String provider, @NonNull String accessToken, @NonNull String providerId, Object extra_data, long expiration, OnDataSendingCompleteCallback callback) {
        Log.d(TAG, "setProviderAccessToken:: provider:: " + provider + ", accessToken:: " + accessToken + ", providerId:: " + providerId + ", extra_data:: " + extra_data + ", callback:: " + callback);
        AndroidData.setProviderAccessToken(reactContext, provider, accessToken, providerId, extra_data, expiration, callback);
    }

    @ReactMethod
    public boolean statisticsEnabled() {
        Log.d(TAG, "statisticsEnabled");
        return AndroidData.statisticsEnabled(reactContext);
    }

    @ReactMethod
    public void clear() {
        Log.d(TAG, "clear");
        AndroidData.clear(reactContext);
    }

    @ReactMethod
    public String getProfileType() {
        Log.d(TAG, "getProfileType");
        return AndroidData.getProfileType(reactContext);
    }

    @ReactMethod
    public void sendPartnerApplicationData(String payload) {
        sendPartnerApplicationData(payload, (OnDataSendingCompleteCallback) null);
    }

    @ReactMethod
    public void sendPartnerApplicationData(String payload, OnDataSendingCompleteCallback callback) {
        Log.d(TAG, "sendPartnerApplicationData:: payload:: " + payload);
        AndroidData.sendPartnerApplicationData(reactContext, payload, callback);
    }

    @ReactMethod
    public void submitFormFillingAnalytics() {
        Log.d(TAG, "submitFormFillingAnalytics");
        AndroidData.submitFormFillingAnalytics(reactContext);
    }

    @Override
    public String getName() {
        return "RNDataSdkWrapper";
    }

    @ReactMethod
    public void setup() {
        Log.d(TAG, "setup:: partnerScriptId:: " + partnerScriptId + ", apiSecret:: " + apiSecret);
        ClientOptions clientOptions = new ClientOptions();
        clientOptions.enableLogDisplay(true);
        AndroidData.setup(reactContext, partnerScriptId, apiSecret, clientOptions);
    }

    @ReactMethod
    public void startAndroidData() {
        applicationId = generateApplicationId();
        Log.d(TAG, "startAndroidData:: applicationId:: " + applicationId);
        AndroidData.startAndroidData(getCurrentActivity(), applicationId);
    }

    @ReactMethod
    public void setProviderAccessToken(@NonNull String provider, @NonNull String accessToken, @NonNull String providerId, Object extra_data, long expiration) {
        setProviderAccessToken(provider, accessToken, providerId, extra_data, expiration, null);
    }

    private synchronized String generateApplicationId() {
        return UUID.randomUUID().toString();
    }
}
