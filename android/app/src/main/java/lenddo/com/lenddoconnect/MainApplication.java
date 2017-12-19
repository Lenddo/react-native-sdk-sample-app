package lenddo.com.lenddoconnect;

import android.app.Application;
import android.content.Context;
import android.support.multidex.MultiDex;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.lenddo.data.RNDataSdkWrapperPackage;
import com.rncollapsingtoolbar.RNCollapsingToolbarPackage;
import com.rnnestedscrollview.RNNestedScrollViewPackage;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new RNCollapsingToolbarPackage(),
                    new RNNestedScrollViewPackage(),
                    new RNDataSdkWrapperPackage(getPartnerScriptIds(), getApiSecrets())
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
    }

    private List<String> getPartnerScriptIds() {
        List<String> partnerScriptIds = new ArrayList<String>();
        partnerScriptIds.add(getResources().getString(R.string.partner_script_id));
        partnerScriptIds.add(getResources().getString(R.string.partner_script_id_kr));
        return partnerScriptIds;
    }

    private List<String> getApiSecrets() {
        List<String> apiSecrets = new ArrayList<String>();
        apiSecrets.add(getResources().getString(R.string.api_secret));
        apiSecrets.add(getResources().getString(R.string.api_secret_kr));
        return apiSecrets;
    }

}