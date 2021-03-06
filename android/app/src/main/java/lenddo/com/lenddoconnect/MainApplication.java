package lenddo.com.lenddoconnect;

import android.app.Application;
import android.content.Context;
import android.support.multidex.MultiDex;

import com.facebook.react.ReactApplication;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.lenddo.mobile.data.RNDataSdkWrapperPackage;
import com.lenddo.mobile.onboarding.RNOnboardingSdkWrapperPackage;
import com.rncollapsingtoolbar.RNCollapsingToolbarPackage;
import com.rnnestedscrollview.RNNestedScrollViewPackage;
import com.lenddo.mobile.core.LenddoCoreInfo;
import com.lenddo.mobile.datasdk.AndroidData;
import com.lenddo.mobile.datasdk.models.ClientOptions;

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
            RNOnboardingSdkWrapperPackage rnOnboardingSdkWrapperPackage = new RNOnboardingSdkWrapperPackage();
            // rnOnboardingSdkWrapperPackage.setGoogleSignInHelper(new GoogleSignInHelper());
            // rnOnboardingSdkWrapperPackage.setFacebookSignInHelper(new FacebookSignInHelper());

            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new RNGestureHandlerPackage(),
                    new RNCollapsingToolbarPackage(),
                    new RNNestedScrollViewPackage(),
                    rnOnboardingSdkWrapperPackage,
                    new RNDataSdkWrapperPackage()
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

        LenddoCoreInfo.initCoreInfo(getApplicationContext());

        ClientOptions clientOptions = new ClientOptions();
        clientOptions.enableLogDisplay(true);

        AndroidData.setup(getApplicationContext(), clientOptions);

        // Default android setup
        // AndroidData.setup(getApplicationContext());
    }

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
    }
}