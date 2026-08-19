package bf.parfaitdesign.desmohair;

import android.app.Application;
import android.util.Log;

import com.google.firebase.FirebaseApp;

public class App extends Application {
    private static final String TAG = "ParfaitDesmohair";

    @Override
    public void onCreate() {
        super.onCreate();
        try {
            FirebaseApp.initializeApp(this);
            Log.i(TAG, "Firebase initialized successfully");
        } catch (Exception e) {
            Log.e(TAG, "Firebase initialization failed: " + e.getMessage(), e);
        }
    }
}
