package com.wikitude.samples.advanced.plugins.input;

import com.wikitude.architect.ArchitectView;
import com.wikitude.common.ErrorCallback;
import com.wikitude.common.WikitudeError;
import com.wikitude.samples.advanced.ArchitectViewExtension;
import com.wikitude.sdksamples.R;

import android.app.Activity;
import android.support.annotation.NonNull;
import android.util.Log;
import android.widget.Toast;

/**
 * This Activity is the java counterpart of the 13_PluginsAPI_3_SimpleInputPlugin AR-Experience.
 * It registers a native Plugin which uses camera frames from a custom camera implementation
 * and will let the Wikitude SDK render the camera frame and augmentations.
 *
 * Please Note that the custom camera implementations are very minimal and a more advanced Camera implementation
 * should be used in apps.
 */
public class SimpleInputPluginExtension extends ArchitectViewExtension {

    private static final String TAG = "SimpleInputPlugin";

    private FrameInputPluginModule inputModule;
    private boolean onPauseCalled = false;

    public SimpleInputPluginExtension(Activity activity, ArchitectView architectView) {
        super(activity, architectView);
    }

    @Override
    public void onPostCreate() {
        /*
         * Registers the plugin with the name "simple_input_plugin".
         * The library containing the native plugin is libwikitudePlugins.so.
         */
        architectView.registerNativePlugins("wikitudePlugins", "simple_input_plugin", new ErrorCallback() {
            @Override
            public void onError(@NonNull WikitudeError error) {
                Toast.makeText(activity, R.string.error_loading_plugins, Toast.LENGTH_SHORT).show();
                Log.e(TAG, "Plugin failed to load. Reason: " + error.getMessage());
            }
        });
        initNative();
        inputModule = new FrameInputPluginModule(activity, getInputModuleHandle());
    }

    /**
     * Called from c++ onCameraReleased of the CameraFrameInputPluginModule.
     */
    public void onSDKCameraReleased() {
        inputModule.start();
    }

    /**
     * Called from c++ on pause of the Plugin.
     */
    public void onInputPluginPaused() {
        inputModule.stop();
        onPauseCalled = true;
    }

    /**
     * Called from c++ on resume of the Plugin.
     */
    public void onInputPluginResumed() {
        /* initial start happens in `onSDKCameraReleased`, subsequent starts happen here */
        if (onPauseCalled) {
            inputModule.start();
        }
    }

    /**
     * Called from c++ on destroy of the Plugin.
     */
    public void onInputPluginDestroyed() {

    }

    private native void initNative();
    private native long getInputModuleHandle();
}
