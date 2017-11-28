package com.lenddodatasdk;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import java.util.Arrays;
import java.util.List;

public class RNDataSdkWrapperPackage implements ReactPackage {
  private String partnerScriptId, apiSecret;

    public RNDataSdkWrapperPackage(String partnerScriptId, String apiSecret){
      this.partnerScriptId = partnerScriptId;
      this.apiSecret = apiSecret;
    }

    @Override
    public List<NativeModule> createNativeModules(
            ReactApplicationContext reactContext) {
        return Arrays.<NativeModule>asList(new RNDataSdkWrapper(reactContext, partnerScriptId, apiSecret));
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Arrays.<ViewManager>asList();
    }

}
