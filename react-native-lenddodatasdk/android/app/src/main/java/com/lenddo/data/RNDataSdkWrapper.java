package com.lenddo.data;


import android.support.annotation.NonNull;
import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.lenddo.data.listeners.OnDataSendingCompleteCallback;
import com.lenddo.data.AndroidData;

import java.util.Map;
import java.util.HashMap;


public class RNDataSdkWrapper extends ReactContextBaseJavaModule {
    public static final String PROVIDER_FACEBOOK = "facebook";
    public static final String PROVIDER_LINKEDIN = "linkedin";
    public static final String PROVIDER_YAHOO = "yahoo";
    public static final String PROVIDER_WINDOWSLIVE = "windowslive";
    public static final String PROVIDER_GOOGLE = "google";
    public static final String PROVIDER_KAKAOTALK = "kakaostory";
    public static final String PROVIDER_TWITTER = "twitter";

    private static final String TAG = "RNDataSdkWrapper";
    private ReactApplicationContext reactContext;
    private String partnerScriptId;
    private String apiSecret;

    public RNDataSdkWrapper(ReactApplicationContext reactContext, String partnerScriptId, String apiSecret) {
        super(reactContext);
        Log.d(TAG, "RNDataSdkWrapper");
        this.reactContext = reactContext;
        this.partnerScriptId = partnerScriptId;
        this.apiSecret = apiSecret;
    }

    @ReactMethod
    public void setProviderAccessToken(@NonNull String provider, @NonNull String accessToken, @NonNull String providerId, Object extra_data, long expiration) {
        Log.d(TAG, "setProviderAccessToken:: provider:: " + provider + ", accessToken:: " + accessToken + ", providerId:: " + providerId + ", extra_data:: " + extra_data);
        AndroidData.setProviderAccessToken(reactContext, provider, accessToken, providerId, extra_data, expiration);
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
        sendPartnerApplicationData(payload, null);
    }

    @ReactMethod
    public void sendPartnerApplicationData(String payload, final Callback callback) {
        Log.d(TAG, "sendPartnerApplicationData:: payload:: " + payload);
        if (callback!=null) {
            AndroidData.sendPartnerApplicationData(reactContext, payload, new OnDataSendingCompleteCallback() {
                @Override
                public void onDataSendingSuccess() {
                    Log.d(TAG, "Send Partner Data Callback: Success!");
                    callback.invoke("Send Partner Data Callback: Success!");
                }

                @Override
                public void onDataSendingError(int statusCode, final String errorMessage) {
                    Log.d(TAG, "Send Partner Data Callback: Error: " + errorMessage);
                    callback.invoke("Send Partner Data Callback: Error: " + errorMessage);
                }

                @Override
                public void onDataSendingFailed(final Throwable t)  {
                    Log.d(TAG, "Send Partner Data Callback: Failed: " + t.getMessage());
                    callback.invoke("Send Partner Data Callback: Failed: " + t.getMessage());
                }
            });
        } else {
            AndroidData.sendPartnerApplicationData(reactContext, payload, null);
        }
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
        AndroidData.setup(reactContext, partnerScriptId, apiSecret);
    }

    @ReactMethod
    public void startAndroidData(String applicationId) {
        Log.d(TAG, "startAndroidData:: applicationId:: " + applicationId);
        AndroidData.startAndroidData(getCurrentActivity(), applicationId);
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put(PROVIDER_FACEBOOK, AndroidData.PROVIDER_FACEBOOK);
        constants.put(PROVIDER_LINKEDIN, AndroidData.PROVIDER_LINKEDIN);
        constants.put(PROVIDER_YAHOO, AndroidData.PROVIDER_YAHOO);
        constants.put(PROVIDER_WINDOWSLIVE, AndroidData.PROVIDER_WINDOWSLIVE);
        constants.put(PROVIDER_GOOGLE, AndroidData.PROVIDER_GOOGLE);
        constants.put(PROVIDER_KAKAOTALK, AndroidData.PROVIDER_KAKAOTALK);
        constants.put(PROVIDER_TWITTER, AndroidData.PROVIDER_TWITTER);
        return constants;
    }

}
