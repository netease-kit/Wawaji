package com.netease.nim.ufocatcher.demo.ui.adapter;

import android.content.Context;
import android.widget.ImageView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.RequestOptions;
import com.netease.nim.ufocatcher.demo.R;
import com.netease.nim.ufocatcher.demo.app.AppCache;

import java.util.HashMap;
import java.util.Map;

import jp.wasabeef.glide.transformations.BlurTransformation;

/**
 * Created by hzxuwen on 2016/1/19.
 */
public class ChatRoomHelper {
    private static final int[] imageRes = {R.mipmap.room_cover_1, R.mipmap.room_cover_2,
            R.mipmap.room_cover_3, R.mipmap.room_cover_4};

    private static Map<String, Integer> roomCoverMap = new HashMap<>();
    private static int index = 0;

    public static void setCoverImage(String roomId, ImageView coverImage, boolean blur) {
        if (roomCoverMap.containsKey(roomId)) {
            blurCoverImage(blur, coverImage, roomCoverMap.get(roomId));
        } else {
            if (index >= imageRes.length) {
                index = 0;
            }
            roomCoverMap.put(roomId, imageRes[index]);
            blurCoverImage(blur, coverImage, imageRes[index]);
            index++;
        }
    }

    private static void blurCoverImage(boolean blur, final ImageView imageView, final int resId) {
        final Context context = AppCache.getContext();

        if (!blur) {
            Glide.with(context).load(resId).into(imageView);
        } else {
            Glide.with(context).load(resId)
                    .apply(new RequestOptions().bitmapTransform(new BlurTransformation(5)))
                    .into(imageView);
        }
    }
}
