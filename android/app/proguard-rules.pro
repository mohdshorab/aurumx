# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# Keep react-native-config classes
-keep class com.lugg.RNCConfig.RNCConfigModule { *; }
-keep class com.lugg.RNCConfig.** { *; }

# MMKV keep rules
-keep class com.tencent.mmkv.** { *; }
-keep class com.facebook.soloader.** { *; }

# React Native / Web/Network warnings bypass
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn javax.annotation.**
-dontwarn org.conscrypt.**
-keepnames class okhttp3.internal.publicsuffix.PublicSuffixDatabase
