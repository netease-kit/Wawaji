# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Uncomment this to preserve the talk_line_layout number information for
# debugging stack traces.
#-keepattributes SourceFile,LineNumberTable

# If you keep the talk_line_layout number information, uncomment this to
# hide the original source file name.
#-renamesourcefileattribute SourceFile

### @keep
-keep,allowobfuscation @interface com.netease.nim.ufocatcher.demo.common.annotation.Keep
-keep @com.netease.nim.ufocatcher.demo.common.annotation.Keep class *
-keepclassmembers class * {
    @com.netease.nim.ufocatcher.demo.common.annotation.Keep *;
}

### @KeepMemberNames
-keep,allowobfuscation @interface com.netease.nim.ufocatcher.demo.common.annotation.KeepMemberNames
-keep @com.netease.nim.ufocatcher.demo.common.annotation.KeepMemberNames class *
-keepclasseswithmembernames @com.netease.nim.ufocatcher.demo.common.annotation.KeepMemberNames class * {*;}

### NIM SDK
-dontwarn com.netease.**
-keep class com.netease.nimlib.** {*;}
-keep class com.netease.nrtc.** {*;}
-keep class com.netease.vcloud.** {*;}
-keep class com.netease.share.** {*;}
-keep class com.netease.neliveplayer.** {*;}

### glide 4
-keep public class * implements com.bumptech.glide.module.GlideModule
-keep public class * extends com.bumptech.glide.module.AppGlideModule
-keep class com.bumptech.glide.GeneratedAppGlideModuleImpl
-keep public enum com.bumptech.glide.load.resource.bitmap.ImageHeaderParser$** {
    **[] $VALUES;
    public *;
}
