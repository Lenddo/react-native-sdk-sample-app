package com.lenddo.data;


import android.support.annotation.NonNull;
import android.util.Log;
import android.text.TextUtils;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.GuardedRunnable;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.UiThreadUtil;
import com.lenddo.data.AndroidData;
import com.lenddo.data.listeners.OnDataSendingCompleteCallback;
import com.lenddo.data.models.ClientOptions;
import com.lenddo.core.analytics.FormFillingAnalytics;
import com.lenddo.data.models.ApplicationPartnerData;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;

import java.util.HashMap;
import java.util.Map;


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
    public void setProviderAccessToken(@NonNull String provider, @NonNull String accessToken, @NonNull String providerId, String extra_data, String expiration, final Callback callback) {
        Log.d(TAG, "setProviderAccessToken:: provider:: " + provider + ", accessToken:: " + accessToken + ", providerId:: " + providerId + ", extra_data:: " + extra_data + ", expiration:: " + expiration);
        if (callback != null) {
            AndroidData.setProviderAccessToken(reactContext, provider, accessToken, providerId, extra_data, expiration == null || expiration.equals("null") ? 0 : Long.valueOf(expiration), new OnDataSendingCompleteCallback() {
                @Override
                public void onDataSendingSuccess() {
                    UiThreadUtil.runOnUiThread(
                            new GuardedRunnable(reactContext) {
                                @Override
                                public void runGuarded() {
                                    try {
                                        Log.d(TAG, "Send Partner Data Callback: Success!");
                                        callback.invoke("Send Partner Data Callback: Success!");
                                    } catch (Exception e) {
                                        //Catches the exception: java.lang.RuntimeException·Illegal callback invocation from native module
                                    }
                                }
                            });
                }

                @Override
                public void onDataSendingError(int statusCode, final String errorMessage) {
                    UiThreadUtil.runOnUiThread(
                            new GuardedRunnable(reactContext) {
                                @Override
                                public void runGuarded() {
                                    try {
                                        Log.d(TAG, "Send Partner Data Callback: Error: " + errorMessage);
                                        callback.invoke("Send Partner Data Callback: Error: " + errorMessage);
                                    } catch (Exception e) {
                                        //Catches the exception: java.lang.RuntimeException·Illegal callback invocation from native module
                                    }
                                }
                            });
                }

                @Override
                public void onDataSendingFailed(final Throwable t) {
                    UiThreadUtil.runOnUiThread(
                            new GuardedRunnable(reactContext) {
                                @Override
                                public void runGuarded() {
                                    try {
                                        Log.d(TAG, "Send Partner Data Callback: Failed: " + t.getMessage());
                                        callback.invoke("Send Partner Data Callback: Failed: " + t.getMessage());
                                    } catch (Exception e) {
                                        //Catches the exception: java.lang.RuntimeException·Illegal callback invocation from native module
                                    }
                                }
                            });
                }
            });
        } else {
            AndroidData.setProviderAccessToken(reactContext, provider, accessToken, providerId, extra_data, expiration == null || expiration.equals("null")  ? 0 : Long.valueOf(expiration));
        }
    }

    @ReactMethod
    public void statisticsEnabled(Callback callback) {
        Log.d(TAG, "statisticsEnabled");
        try {
            callback.invoke(AndroidData.statisticsEnabled(reactContext));
        } catch (Exception e) {

        }
    }

    @ReactMethod
    public void clear() {
        Log.d(TAG, "clear");
        AndroidData.clear(reactContext);
    }

    @ReactMethod
    public void getProfileType(Callback callback) {
        Log.d(TAG, "getProfileType");
        try {
            callback.invoke(AndroidData.getProfileType(reactContext));
        } catch (Exception e) {

        }
    }

//    @ReactMethod
//    public void addFormFillingAnalytics(ReadableMap object) {
//        FormFillingAnalytics.getInstance(reactContext).add(object);
//    }


    @ReactMethod
    public void sendPartnerApplicationData(String firstName, String middleName, String lastName,
                                           String dateOfBirth, String mobile, String home,
                                           String email, String employer, String university,
                                           String motherMaidenFirstName, String motherMaidenMiddleName,
                                           String motherMaidenLastName, String addressLine1,
                                           String addressLine2, String city, String administrativeRegion,
                                           String countryCode, String postalCode, String latitude,
                                           String longitude, String applicationId,
                                           final Callback callback) {
        ApplicationPartnerData.verification_data vd = new ApplicationPartnerData.verification_data();
        vd = new ApplicationPartnerData.verification_data();
        vd.address = new ApplicationPartnerData.verification_data.address();
        vd.employment_period = new ApplicationPartnerData.verification_data.employment_period();
        vd.mothers_maiden_name = new ApplicationPartnerData.verification_data.mothers_maiden_name();
        vd.name = new ApplicationPartnerData.verification_data.name();
        vd.phone = new ApplicationPartnerData.verification_data.phone();

        // Store data to model
        vd.name.first = TextUtils.isEmpty(firstName) ? null : firstName;
        vd.name.middle = TextUtils.isEmpty(middleName) ? null : middleName;
        vd.name.last = TextUtils.isEmpty(lastName) ? null : lastName;
        vd.date_of_birth = TextUtils.isEmpty(dateOfBirth) ? null : dateOfBirth;
        vd.phone.mobile = TextUtils.isEmpty(mobile) ? null : mobile;
        vd.phone.home = TextUtils.isEmpty(home) ? null : home;
        vd.email = TextUtils.isEmpty(email) ? null : email;
        vd.employer = TextUtils.isEmpty(employer) ? null : employer;
        vd.university = TextUtils.isEmpty(university) ? null : university;
        vd.mothers_maiden_name.first = TextUtils.isEmpty(motherMaidenFirstName) ? null : motherMaidenFirstName;
        vd.mothers_maiden_name.middle = TextUtils.isEmpty(motherMaidenMiddleName) ? null : motherMaidenMiddleName;
        vd.mothers_maiden_name.last = TextUtils.isEmpty(motherMaidenLastName) ? null : motherMaidenLastName;
        vd.address.line_1 = TextUtils.isEmpty(addressLine1) ? null : addressLine1;
        vd.address.line_2 = TextUtils.isEmpty(addressLine2) ? null : addressLine2;
        vd.address.city = TextUtils.isEmpty(city) ? null : city;
        vd.address.administrative_division = TextUtils.isEmpty(administrativeRegion) ? null : administrativeRegion;
        vd.address.country_code = TextUtils.isEmpty(countryCode) ? null : countryCode;
        vd.address.postal_code = TextUtils.isEmpty(postalCode) ? null : postalCode;

        if (!TextUtils.isEmpty(latitude)) {
            vd.address.latitude = Float.parseFloat(latitude);
        }

        if (!TextUtils.isEmpty(longitude)) {
            vd.address.longitude = Float.parseFloat(longitude);
        }

        ApplicationPartnerData apd = new ApplicationPartnerData();
        apd.reference_number = TextUtils.isEmpty(applicationId) ? null : applicationId;
        apd.application = new JsonObject();
        apd.verification_data = vd;

        String payload = new GsonBuilder().serializeSpecialFloatingPointValues().disableHtmlEscaping().create().toJson(apd);
        Log.d(TAG, "sendPartnerApplicationData:: payload:: " + payload);

        if (callback != null) {
            AndroidData.sendPartnerApplicationData(reactContext, payload, new OnDataSendingCompleteCallback() {
                @Override
                public void onDataSendingSuccess() {
                    UiThreadUtil.runOnUiThread(
                            new GuardedRunnable(reactContext) {
                                @Override
                                public void runGuarded() {
                                    try {
                                        Log.d(TAG, "Send Partner Data Callback: Success!");
                                        callback.invoke("Send Partner Data Callback: Success!");
                                    } catch (Exception e) {
                                        //Catches the exception: java.lang.RuntimeException·Illegal callback invocation from native module
                                    }
                                }
                            });
                }

                @Override
                public void onDataSendingError(int statusCode, final String errorMessage) {
                    UiThreadUtil.runOnUiThread(
                            new GuardedRunnable(reactContext) {
                                @Override
                                public void runGuarded() {
                                    try {
                                        Log.d(TAG, "Send Partner Data Callback: Error: " + errorMessage);
                                        callback.invoke("Send Partner Data Callback: Error: " + errorMessage);
                                    } catch (Exception e) {
                                        //Catches the exception: java.lang.RuntimeException·Illegal callback invocation from native module
                                    }
                                }
                            });
                }

                @Override
                public void onDataSendingFailed(final Throwable t) {
                    UiThreadUtil.runOnUiThread(
                            new GuardedRunnable(reactContext) {
                                @Override
                                public void runGuarded() {
                                    try {
                                        Log.d(TAG, "Send Partner Data Callback: Failed: " + t.getMessage());
                                        callback.invoke("Send Partner Data Callback: Failed: " + t.getMessage());
                                    } catch (Exception e) {
                                        //Catches the exception: java.lang.RuntimeException·Illegal callback invocation from native module
                                    }
                                }
                            });
                }
            });
        } else {
            AndroidData.sendPartnerApplicationData(reactContext, payload, null);
        }
    }

    @ReactMethod
    public void sendPartnerApplicationData(String payload, final Callback callback) {
        Log.d(TAG, "sendPartnerApplicationData:: payload:: " + payload);
        if (callback != null) {
            AndroidData.sendPartnerApplicationData(reactContext, payload, new OnDataSendingCompleteCallback() {
                @Override
                public void onDataSendingSuccess() {
                    UiThreadUtil.runOnUiThread(
                            new GuardedRunnable(reactContext) {
                                @Override
                                public void runGuarded() {
                                    try {
                                        Log.d(TAG, "Send Partner Data Callback: Success!");
                                        callback.invoke("Send Partner Data Callback: Success!");
                                    } catch (Exception e) {
                                        //Catches the exception: java.lang.RuntimeException·Illegal callback invocation from native module
                                    }
                                }
                            });
                }

                @Override
                public void onDataSendingError(int statusCode, final String errorMessage) {
                    UiThreadUtil.runOnUiThread(
                            new GuardedRunnable(reactContext) {
                                @Override
                                public void runGuarded() {
                                    try {
                                        Log.d(TAG, "Send Partner Data Callback: Error: " + errorMessage);
                                        callback.invoke("Send Partner Data Callback: Error: " + errorMessage);
                                    } catch (Exception e) {
                                        //Catches the exception: java.lang.RuntimeException·Illegal callback invocation from native module
                                    }
                                }
                            });
                }

                @Override
                public void onDataSendingFailed(final Throwable t) {
                    UiThreadUtil.runOnUiThread(
                            new GuardedRunnable(reactContext) {
                                @Override
                                public void runGuarded() {
                                    try {
                                        Log.d(TAG, "Send Partner Data Callback: Failed: " + t.getMessage());
                                        callback.invoke("Send Partner Data Callback: Failed: " + t.getMessage());
                                    } catch (Exception e) {
                                        //Catches the exception: java.lang.RuntimeException·Illegal callback invocation from native module
                                    }
                                }
                            });
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
        AndroidData.setup(reactContext, partnerScriptId, apiSecret);
    }

    @ReactMethod
    public void setup(final Callback callback) {
        ClientOptions clientOptions = new ClientOptions();
        clientOptions.registerDataSendingCompletionCallback(new OnDataSendingCompleteCallback() {
            @Override
            public void onDataSendingSuccess() {
                UiThreadUtil.runOnUiThread(
                        new GuardedRunnable(reactContext) {
                            @Override
                            public void runGuarded() {
                                try {
                                    callback.invoke("Data Sending Callback: Success");
                                } catch (Exception e) {
                                    //Catches the exception: java.lang.RuntimeException·Illegal callback invocation from native module
                                }
                            }
                        });
            }

            @Override
            public void onDataSendingError(int statusCode, final String errorMessage) {
                UiThreadUtil.runOnUiThread(
                        new GuardedRunnable(reactContext) {
                            @Override
                            public void runGuarded() {
                                try {
                                    callback.invoke("Data Sending Callback: Error: " + errorMessage);
                                } catch (Exception e) {
                                    //Catches the exception: java.lang.RuntimeException·Illegal callback invocation from native module
                                }
                            }
                        });
            }

            @Override
            public void onDataSendingFailed(final Throwable t) {
                UiThreadUtil.runOnUiThread(
                        new GuardedRunnable(reactContext) {
                            @Override
                            public void runGuarded() {
                                try {
                                    callback.invoke("Data Sending Callback: Failed: " + t.getMessage());
                                } catch (Exception e) {
                                    //Catches the exception: java.lang.RuntimeException·Illegal callback invocation from native module
                                }
                            }
                        });
            }
        });
        AndroidData.setup(reactContext, partnerScriptId, apiSecret, clientOptions);
    }

    @ReactMethod
    public void setup(String gatewayUrl, boolean wifiOnly,
                      boolean enableLogDisplay, boolean enableSms,
                      boolean enableCallLog, boolean enableContact,
                      boolean enableCalendarEvent, boolean enableInstalledApp,
                      boolean enableBrowserHistory, boolean enableLocation,
                      boolean enableBattCharge, boolean enableGalleryMetaData,
                      boolean enableSmsBody, boolean enablePhoneNumber,
                      boolean enableContactsName, boolean enableContactsEmail,
                      boolean enableCalendarOrganizer, boolean enableCalendarDisplayName,
                      boolean enableCalendarEmail, final Callback callback) {
        Log.d(TAG, "setup:: partnerScriptId:: " + partnerScriptId + ", apiSecret:: " + apiSecret);

        ClientOptions clientOptions = new ClientOptions();
        // Hostname (Gateway)
        if (gatewayUrl != null) {
            clientOptions.setApiGatewayUrl(gatewayUrl);
        }
        // Upload Mode
        clientOptions.setWifiOnly(wifiOnly);

        // Debug Logs
        clientOptions.enableLogDisplay(enableLogDisplay);

        // Data types
        if (!enableSms) clientOptions.disableSMSDataCollection();
        if (!enableCallLog) clientOptions.disableCallLogDataCollection();
        if (!enableContact) clientOptions.disableContactDataCollection();
        if (!enableCalendarEvent) clientOptions.disableCalendarEventDataCollection();
        if (!enableInstalledApp) clientOptions.disableInstalledAppDataCollection();
        if (!enableBrowserHistory) clientOptions.disableBrowserHistoryDataCollection();
        if (!enableLocation) clientOptions.disableLocationDataCollection();
        if (!enableBattCharge) clientOptions.disableBattChargeDataCollection();
        if (!enableGalleryMetaData) clientOptions.disableGalleryMetaDataCollection();
        // SMS Body Content
        if (!enableSmsBody) clientOptions.disableSMSBodyCollection();
        //Data Hashing
        if (enablePhoneNumber) clientOptions.enablePhoneNumberHashing();
        if (enableContactsName) clientOptions.enableContactsNameHashing();
        if (enableContactsEmail) clientOptions.enableContactsEmailHashing();
        if (enableCalendarOrganizer) clientOptions.enableCalendarOrganizerHashing();
        if (enableCalendarDisplayName) clientOptions.enableCalendarDisplayNameHashing();
        if (enableCalendarEmail) clientOptions.enableCalendarEmailHashing();

        clientOptions.registerDataSendingCompletionCallback(new OnDataSendingCompleteCallback() {
            @Override
            public void onDataSendingSuccess() {
                UiThreadUtil.runOnUiThread(
                        new GuardedRunnable(reactContext) {
                            @Override
                            public void runGuarded() {
                                try {
                                    callback.invoke("Data Sending Callback: Success");
                                } catch (Exception e) {
                                    //Catches the exception: java.lang.RuntimeException·Illegal callback invocation from native module
                                }
                            }
                        });
            }

            @Override
            public void onDataSendingError(int statusCode, final String errorMessage) {
                UiThreadUtil.runOnUiThread(
                        new GuardedRunnable(reactContext) {
                            @Override
                            public void runGuarded() {
                                try {
                                    callback.invoke("Data Sending Callback: Error: " + errorMessage);
                                } catch (Exception e) {
                                    //Catches the exception: java.lang.RuntimeException·Illegal callback invocation from native module
                                }
                            }
                        });
            }

            @Override
            public void onDataSendingFailed(final Throwable t) {
                UiThreadUtil.runOnUiThread(
                        new GuardedRunnable(reactContext) {
                            @Override
                            public void runGuarded() {
                                try {
                                    callback.invoke("Data Sending Callback: Failed: " + t.getMessage());
                                } catch (Exception e) {
                                    //Catches the exception: java.lang.RuntimeException·Illegal callback invocation from native module
                                }
                            }
                        });
            }
        });
        AndroidData.setup(reactContext, partnerScriptId, apiSecret, clientOptions);
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
