package com.netease.nim.ufocatcher.demo.protocol;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONException;
import com.alibaba.fastjson.JSONObject;
import com.netease.nim.ufocatcher.demo.app.Preferences;
import com.netease.nim.ufocatcher.demo.common.http.HttpClientWrapper;
import com.netease.nim.ufocatcher.demo.common.http.NimHttpClient;
import com.netease.nim.ufocatcher.demo.common.log.LogUtil;
import com.netease.nim.ufocatcher.demo.protocol.model.JsonObject2Model;
import com.netease.nim.ufocatcher.demo.protocol.model.RoomInfo;
import com.netease.nim.ufocatcher.demo.protocol.model.TouristLoginInfo;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 网易云信Demo Http客户端。第三方开发者请连接自己的应用服务器。
 * <p/>
 * Created by huangjun on 2017/11/18.
 */
public class DemoServerController {

    private static final String TAG = "DemoServerController";

    // code
    private static final int RESULT_CODE_SUCCESS = 200;

    // api
    private static final String SERVICE_NAME = "dollsCatcher";
    private static final String API_NAME_TOURIST = "tourist";
    private static final String API_NAME_ROOM_LIST = "room/list";

    // header
    private static final String HEADER_KEY_DEMO_ID = "Demo-Id";
    private static final String HEADER_KEY_APP_KEY = "appkey";

    // request
    private static final String REQUEST_KEY_SID = "sid";

    // result
    private static final String RESULT_KEY_CODE = "code";
    private static final String RESULT_KEY_DATA = "data";

    private static final String RESULT_KEY_ROOM_LIST = "list";
    private static final String RESULT_KEY_ROOM_TOTAL = "total";

    public interface IHttpCallback<T> {
        void onSuccess(T t);

        void onFailed(int code, String errorMsg);
    }

    /**
     * case 1: 请求账号信息
     */
    public void fetchLoginInfo(final IHttpCallback<TouristLoginInfo> callback) {
        NimHttpClient.getInstance().execute(getTouristAPIUrl(), getCommonHeaders(), getCommonRequestParams(), (response, code, exception) -> {
            if (code != 200 || exception != null) {
                LogUtil.e(TAG, "http fetch login info failed, code=" + code + ", error=" + (exception != null ? exception.getMessage() : "null"));
                if (callback != null) {
                    callback.onFailed(code, exception != null ? exception.getMessage() : null);
                }
                return;
            }

            try {
                // ret 0
                JSONObject res = JSONObject.parseObject(response);
                // res 1
                int resCode = res.getIntValue(RESULT_KEY_CODE);
                if (resCode == RESULT_CODE_SUCCESS) {
                    // data 1
                    JSONObject data = res.getJSONObject(RESULT_KEY_DATA);
                    // login info 2
                    TouristLoginInfo loginInfo = null;
                    if (data != null) {
                        loginInfo = (TouristLoginInfo) JsonObject2Model.parseJsonObjectToModule(data, TouristLoginInfo.class);
                    }
                    // reply
                    callback.onSuccess(loginInfo);
                } else {
                    callback.onFailed(resCode, null);
                }
            } catch (JSONException e) {
                callback.onFailed(-1, e.getMessage());
            } catch (Exception e) {
                callback.onFailed(-2, e.getMessage());
            }
        });
    }

    /**
     * case 2: 获取聊天室列表
     */
    public void fetchRoomList(final IHttpCallback<List<RoomInfo>> callback) {
        NimHttpClient.getInstance().execute(getRoomListUrl(), getCommonHeaders(), getCommonRequestParams(), (response, code, exception) -> {
            if (code != 200 || exception != null) {
                LogUtil.e(TAG, "http fetch room list failed, code=" + code + ", error=" + (exception != null ? exception.getMessage() : "null"));
                if (callback != null) {
                    callback.onFailed(code, exception != null ? exception.getMessage() : null);
                }
                return;
            }

            try {
                // ret 0
                JSONObject res = JSONObject.parseObject(response);
                // res 1
                int resCode = res.getIntValue(RESULT_KEY_CODE);
                if (resCode == RESULT_CODE_SUCCESS) {
                    // data 1
                    List<RoomInfo> roomList = null;
                    JSONObject data = res.getJSONObject(RESULT_KEY_DATA);
                    if (data != null) {
                        // total 2
                        int total = data.getInteger(RESULT_KEY_ROOM_TOTAL);
                        // list 2
                        JSONArray array = data.getJSONArray(RESULT_KEY_ROOM_LIST);
                        roomList = new ArrayList<>(total);
                        JSONObject o;
                        RoomInfo r;
                        for (int i = 0; i < array.size(); i++) {
                            // room 3
                            o = array.getJSONObject(i);
                            r = (RoomInfo) JsonObject2Model.parseJsonObjectToModule(o, RoomInfo.class);
                            roomList.add(r);
                        }
                    }
                    // reply
                    callback.onSuccess(roomList);
                } else {
                    callback.onFailed(resCode, null);
                }
            } catch (JSONException e) {
                callback.onFailed(-1, e.getMessage());
            } catch (Exception e) {
                callback.onFailed(-2, e.getMessage());
            }
        });
    }

    /**
     * ******************************* api/header/params *******************************
     */

    private String getTouristAPIUrl() {
        return Servers.getServerAddress() + "/" + SERVICE_NAME + "/" + API_NAME_TOURIST;
    }

    private String getRoomListUrl() {
        return Servers.getServerAddress() + "/" + SERVICE_NAME + "/" + API_NAME_ROOM_LIST;
    }

    private Map<String, String> getCommonHeaders() {
        Map<String, String> headers = new HashMap<>(3);
        headers.put("Content-Type", "application/x-www-form-urlencoded");
        headers.put(HEADER_KEY_DEMO_ID, "dolls-catcher");
        headers.put(HEADER_KEY_APP_KEY, Servers.getAppKey());
        return headers;
    }

    private String getCommonRequestParams() {
        Map<String, Object> params = new HashMap<>(1);
        params.put(REQUEST_KEY_SID, Preferences.getAccount());
        return HttpClientWrapper.buildRequestParams(params);
    }

    /**
     * ******************************* single instance *******************************
     */

    private static DemoServerController instance;

    public static synchronized DemoServerController getInstance() {
        if (instance == null) {
            instance = new DemoServerController();
        }

        return instance;
    }
}
