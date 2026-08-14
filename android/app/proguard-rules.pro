# ProGuard rules for Parfait.design

# ============================================================
# Capacitor Core
# ============================================================
-keep public class com.getcapacitor.** { *; }
-keep public class com.getcapacitor.plugin.** { *; }
-keep public class com.getcapacitor.util.** { *; }
-keepclassmembers class com.getcapacitor.** {
    public *;
}
-keep @com.getcapacitor.annotation.CapacitorPlugin public class * {
    public void load();
    public void handleOnActivityResult(...);
    public void handleRequestPermissionsResult(...);
}

# ============================================================
# Capacitor Plugins used
# ============================================================
-keep public class com.getcapacitor.plugin.notification.** { *; }
-keep public class com.getcapacitor.plugin.pushnotification.** { *; }
-keep public class com.capacitorjs.plugins.localnotifications.** { *; }
-keep public class com.capacitorjs.plugins.pushnotifications.** { *; }

# ============================================================
# Firebase / FCM
# ============================================================
-keep public class com.google.firebase.** { *; }
-keep public class com.google.android.gms.** { *; }
-keep public class androidx.multidex.** { *; }
-keep class com.google.firebase.messaging.FirebaseMessagingService {
    public void onMessageReceived(...);
    public void onNewToken(...);
}
-keep class com.google.firebase.iid.FirebaseInstanceIdService { *; }
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes Exceptions
-keepattributes InnerClasses
-keepattributes EnclosingMethod

# ============================================================
# AndroidX / AppCompat
# ============================================================
-keep public class androidx.** { *; }
-keep public class android.support.** { *; }
-dontwarn androidx.**
-dontwarn android.support.**

# ============================================================
# React / TanStack / Motion
# ============================================================
-keep public class com.facebook.react.** { *; }
-keep public class com.facebook.hermes.** { *; }
-keep public class com.facebook.jni.** { *; }
-keep public class com.swmansion.reanimated.** { *; }
-keep public class com.facebook.react.bridge.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }
-dontwarn com.facebook.react.**
-dontwarn com.facebook.hermes.**
-dontwarn com.swmansion.reanimated.**

# ============================================================
# TanStack Router / Start generated code
# ============================================================
-keep class **$RouteContext { *; }
-keep class **$RouterState { *; }
-keep class **$$serializer { *; }
-keepclassmembers class * {
    @com.facebook.react.bridge.ReactMethod *;
}
-keepclassmembers class * {
    @com.getcapacitor.annotation.Permission *;
}

# ============================================================
# Supabase / Postgrest / Realtime if needed
# ============================================================
-keep class io.supabase.** { *; }
-keep class com.squareup.okhttp3.** { *; }
-keep class okhttp3.** { *; }
-keep class okio.** { *; }
-dontwarn io.supabase.**
-dontwarn com.squareup.okhttp3.**
-dontwarn okhttp3.**
-dontwarn okio.**

# ============================================================
# JSON / Kotlin serialization if used
# ============================================================
-keep class kotlin.** { *; }
-keep class kotlinx.** { *; }
-dontwarn kotlin.**
-dontwarn kotlinx.**

# ============================================================
# General
# ============================================================
-dontwarn javax.annotation.**
-dontwarn org.checkerframework.**
-dontwarn org.jetbrains.annotations.**
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile
