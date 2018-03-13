package com.lenddo.data;


import android.text.TextUtils;
import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.GuardedRunnable;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.UiThreadUtil;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.lenddo.mobile.datasdk.AndroidData;
import com.lenddo.mobile.datasdk.listeners.OnDataSendingCompleteCallback;
import com.lenddo.mobile.datasdk.models.ApplicationPartnerData;
import com.lenddo.mobile.datasdk.models.ClientOptions;
import com.lenddo.mobile.datasdk.utils.AndroidDataUtils;
import com.lenddo.mobile.core.LenddoCoreInfo;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class RNDataSdkWrapper extends ReactContextBaseJavaModule {
    public static final String PROVIDER_FACEBOOK = "facebook";
    public static final String PROVIDER_LINKEDIN = "linkedin";
    public static final String PROVIDER_YAHOO = "yahoo";
    public static final String PROVIDER_WINDOWSLIVE = "windowslive";
    public static final String PROVIDER_GOOGLE = "google";
    public static final String PROVIDER_KAKAOTALK = "kakaostory";
    public static final String PROVIDER_TWITTER = "twitter";
    public static final int FAIL = 0;
    public static final int SUCCESS = 1;
    public static final int ERROR = 2;

    private static final String TAG = "RNDataSdkWrapper";
    private ReactApplicationContext reactContext;
    private List<String> partnerScriptIds;
    private List<String> apiSecrets;
    private String partnerScriptId;
    private String apiSecret;


    public RNDataSdkWrapper(ReactApplicationContext reactContext, List<String> partnerScriptIds, List<String> apiSecrets) {
        super(reactContext);
        Log.d(TAG, "RNDataSdkWrapper");
        LenddoCoreInfo.initCoreInfo(reactContext);
        this.reactContext = reactContext;
        this.partnerScriptIds = partnerScriptIds;
        this.apiSecrets = apiSecrets;
    }

    @ReactMethod
    public void setProviderAccessToken(String provider, String accessToken, String providerId, String extra_data, String expiration, final Callback callback) {
        Log.d(TAG, "setProviderAccessToken:: provider:: " + provider + ", accessToken:: " + accessToken + ", providerId:: " + providerId + ", extra_data:: " + extra_data + ", expiration:: " + expiration);
        if (callback != null) {
            AndroidData.setProviderAccessToken(reactContext, TextUtils.isEmpty(provider) ? "" : provider, TextUtils.isEmpty(accessToken) ? "" : accessToken, TextUtils.isEmpty(providerId) ? "" : providerId, extra_data, TextUtils.isEmpty(expiration) || expiration.equals("null") ? 0 : Long.valueOf(expiration), new OnDataSendingCompleteCallback() {
                @Override
                public void onDataSendingSuccess() {
                    UiThreadUtil.runOnUiThread(
                            new GuardedRunnable(reactContext) {
                                @Override
                                public void runGuarded() {
                                    try {
                                        Log.d(TAG, "Send Provider Access Token Callback: Success!");
                                        callback.invoke(SUCCESS, "Success!");
                                    } catch (Exception e) {
                                        //Catches the exception: java.lang.RuntimeException·Illegal callback invocation from native module
                                    }
                                }
                            });
                }

                @Override
                public void onDataSendingError(final int statusCode, final String errorMessage) {
                    UiThreadUtil.runOnUiThread(
                            new GuardedRunnable(reactContext) {
                                @Override
                                public void runGuarded() {
                                    try {
                                        Log.d(TAG, "Send Provider Access Token Callback: Error: " + errorMessage);
                                        callback.invoke(ERROR, "Error: " + errorMessage, statusCode);
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
                                        Log.d(TAG, "Send Provider Access Token Callback: Failed: " + t.getMessage());
                                        callback.invoke(FAIL, "Failed: " + t.getMessage());
                                    } catch (Exception e) {
                                        //Catches the exception: java.lang.RuntimeException·Illegal callback invocation from native module
                                    }
                                }
                            });
                }
            });
        } else {
            AndroidData.setProviderAccessToken(reactContext, TextUtils.isEmpty(provider) ? "" : provider, TextUtils.isEmpty(accessToken) ? "" : accessToken, TextUtils.isEmpty(providerId) ? "" : providerId, extra_data, TextUtils.isEmpty(expiration) || expiration.equals("null") ? 0 : Long.valueOf(expiration));
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
    public void sendPartnerApplicationData(String firstName, String middleName, String lastName,
                                           String dateOfBirth, String mobile, String home,
                                           String email, String employer, String university,
                                           String motherMaidenFirstName, String motherMaidenMiddleName,
                                           String motherMaidenLastName, String addressLine1,
                                           String addressLine2, String city, String administrativeRegion,
                                           String countryCode, String postalCode, String latitude,
                                           String longitude, String applicationId, String jsonPayload,
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
        if (TextUtils.isEmpty(jsonPayload)) {
            apd.application = new JsonObject();
        } else {
            try {
                apd.application = new JsonParser().parse(jsonPayload).getAsJsonObject();
            } catch (Exception e) {
                e.printStackTrace();
                apd.application = new JsonObject();
            }
        }
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
                                        callback.invoke(SUCCESS, "Success!");
                                    } catch (Exception e) {
                                        //Catches the exception: java.lang.RuntimeException·Illegal callback invocation from native module
                                    }
                                }
                            });
                }

                @Override
                public void onDataSendingError(final int statusCode, final String errorMessage) {
                    UiThreadUtil.runOnUiThread(
                            new GuardedRunnable(reactContext) {
                                @Override
                                public void runGuarded() {
                                    try {
                                        Log.d(TAG, "Send Partner Data Callback: Error: " + errorMessage);
                                        callback.invoke(ERROR, "Error: " + errorMessage, statusCode);
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
                                        callback.invoke(FAIL, "Failed: " + t.getMessage());
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
                                        callback.invoke(SUCCESS, "Success!");
                                    } catch (Exception e) {
                                        //Catches the exception: java.lang.RuntimeException·Illegal callback invocation from native module
                                    }
                                }
                            });
                }

                @Override
                public void onDataSendingError(final int statusCode, final String errorMessage) {
                    UiThreadUtil.runOnUiThread(
                            new GuardedRunnable(reactContext) {
                                @Override
                                public void runGuarded() {
                                    try {
                                        Log.d(TAG, "Send Partner Data Callback: Error: " + errorMessage);
                                        callback.invoke(ERROR, "Error: " + errorMessage, statusCode);
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
                                        callback.invoke(FAIL, "Failed: " + t.getMessage());
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
        AndroidData.setup(reactContext, partnerScriptIds.get(0), apiSecrets.get(0), null);
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
                                    Log.d(TAG, "Data Sending Callback: Success!");
                                    callback.invoke(SUCCESS, "Success!");
                                } catch (Exception e) {
                                    //Catches the exception: java.lang.RuntimeException·Illegal callback invocation from native module
                                }
                            }
                        });
            }

            @Override
            public void onDataSendingError(final int statusCode, final String errorMessage) {
                UiThreadUtil.runOnUiThread(
                        new GuardedRunnable(reactContext) {
                            @Override
                            public void runGuarded() {
                                try {
                                    Log.d(TAG, "Data Sending Callback: Error: " + errorMessage);
                                    callback.invoke(ERROR, "Error: " + errorMessage, statusCode);
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
                                    Log.d(TAG, "Data Sending Callback: Failed: " + t.getMessage());
                                    callback.invoke(FAIL, "Failed: " + t.getMessage());
                                } catch (Exception e) {
                                    //Catches the exception: java.lang.RuntimeException·Illegal callback invocation from native module
                                }
                            }
                        });
            }
        });
        AndroidData.setup(reactContext, partnerScriptIds.get(0), apiSecrets.get(0), clientOptions);
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
        Log.d(TAG, "setup:: gatewayUrl:: " + gatewayUrl);
        Log.d(TAG, "setup:: wifiOnly:: " + wifiOnly);
        Log.d(TAG, "setup:: enableLogDisplay:: " + enableLogDisplay);
        Log.d(TAG, "setup:: enableSms:: " + enableSms);
        Log.d(TAG, "setup:: enableCallLog:: " + enableCallLog);
        Log.d(TAG, "setup:: enableContact:: " + enableContact);
        Log.d(TAG, "setup:: enableCalendarEvent:: " + enableCalendarEvent);
        Log.d(TAG, "setup:: enableInstalledApp:: " + enableInstalledApp);
        Log.d(TAG, "setup:: enableBrowserHistory:: " + enableBrowserHistory);
        Log.d(TAG, "setup:: enableLocation:: " + enableLocation);
        Log.d(TAG, "setup:: enableBattCharge:: " + enableBattCharge);
        Log.d(TAG, "setup:: enableGalleryMetaData:: " + enableGalleryMetaData);
        Log.d(TAG, "setup:: enableSmsBody:: " + enableSmsBody);
        Log.d(TAG, "setup:: enablePhoneNumber:: " + enablePhoneNumber);
        Log.d(TAG, "setup:: enableContactsName:: " + enableContactsName);
        Log.d(TAG, "setup:: enableContactsEmail:: " + enableContactsEmail);
        Log.d(TAG, "setup:: enableCalendarOrganizer:: " + enableCalendarOrganizer);
        Log.d(TAG, "setup:: enableCalendarDisplayName:: " + enableCalendarDisplayName);
        Log.d(TAG, "setup:: enableCalendarEmail:: " + enableCalendarEmail);

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
                                    Log.d(TAG, "Data Sending Callback: Success!");
                                    callback.invoke(SUCCESS, "Success!");
                                } catch (Exception e) {
                                    //Catches the exception: java.lang.RuntimeException·Illegal callback invocation from native module
                                }
                            }
                        });
            }

            @Override
            public void onDataSendingError(final int statusCode, final String errorMessage) {
                UiThreadUtil.runOnUiThread(
                        new GuardedRunnable(reactContext) {
                            @Override
                            public void runGuarded() {
                                try {
                                    Log.d(TAG, "Data Sending Callback: Error: " + errorMessage);
                                    callback.invoke(ERROR, "Error: " + errorMessage, statusCode);
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
                                    Log.d(TAG, "Data Sending Callback: Failed: " + t.getMessage());
                                    callback.invoke(FAIL, "Failed: " + t.getMessage());
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

    @ReactMethod
    public void getApplicationId(Callback callback) {
        Log.d(TAG, "getApplicationId");
        try {
            callback.invoke(AndroidDataUtils.getApplicationId(reactContext));
        } catch (Exception e) {

        }
    }

    @ReactMethod
    public void getDeviceUID(Callback callback) {
        Log.d(TAG, "getDeviceUID");
        try {
            callback.invoke(AndroidDataUtils.getDeviceUID(reactContext));
        } catch (Exception e) {

        }
    }

    @ReactMethod
    public void getServiceToken(Callback callback) {
        Log.d(TAG, "getServiceToken");
        try {
            callback.invoke(AndroidDataUtils.getServiceToken(reactContext));
        } catch (Exception e) {

        }
    }

    @ReactMethod
    public void setApplicationId(String applicationId) {
        Log.d(TAG, "setApplicationId: " + applicationId);
        AndroidDataUtils.setApplicationId(reactContext, applicationId);
    }


    @ReactMethod
    public void getPartnerScriptId(Callback callback) {
        Log.d(TAG, "getPartnerScriptId");
        try {
            callback.invoke(partnerScriptId);
        } catch (Exception e) {

        }
    }


    @ReactMethod
    public void getApiSecret(Callback callback) {
        Log.d(TAG, "getApiSecret");
        try {
            callback.invoke(apiSecret);
        } catch (Exception e) {

        }
    }


    @ReactMethod
    public void setPartnerScriptId(int index) {
        Log.d(TAG, "setPartnerScriptId: " + index);
        partnerScriptId = partnerScriptIds.get(index);
    }


    @ReactMethod
    public void setApiSecret(int index) {
        Log.d(TAG, "setApiSecret: " + index);
        apiSecret = apiSecrets.get(index);
    }

}
