/*
Tác giả Script: Yui Chy
*/

const reg1 = /^https:\/\/testflight\.apple\.com\/v3\/accounts\/(.+?)\/apps$/;
const reg2 = /^https:\/\/testflight\.apple\.com\/join\/([A-Za-z0-9]+)$/;

if (reg1.test($request.url)) {
  $prefs.setValueForKey(null, "request_id");
  let url = $request.url;
  let key = url.replace(/^.*\/accounts\/(.+?)\/apps$/, "$1");
  const headers = Object.fromEntries(Object.entries($request.headers).map(([key, value]) => [key.toLowerCase(), value]));

  let session_id = headers["x-session-id"];
  let session_digest = headers["x-session-digest"];
  let request_id = headers["x-request-id"];
  $prefs.setValueForKey(key, "key");
  $prefs.setValueForKey(session_id, "session_id");
  $prefs.setValueForKey(session_digest, "session_digest");
  $prefs.setValueForKey(request_id, "request_id");
  if ($prefs.valueForKey("request_id") !== null) {
    $notify("TestFlight tự động tham gia", "Lấy thông tin thành công", "");
  } else {
    $notify("TestFlight tự động tham gia", "Lấy thông tin thất bại", "Vui lòng thêm testflight.apple.com");
  }
  $done({});
} else if (reg2.test($request.url)) {
  let appId = $prefs.valueForKey("APP_ID");
  if (!appId) {
    appId = "";
  }
  let arr = appId.split(",");
  const id = reg2.exec($request.url)[1];
  arr.push(id);
  arr = unique(arr).filter((a) => a);
  if (arr.length > 0) {
    appId = arr.join(",");
  }
  $prefs.setValueForKey(appId, "APP_ID");
  $notify("TestFlight tự động tham gia", `Đã thêm APP_ID: ${id}`, `ID hiện tại: ${appId}`);
  $done({});
}

function unique(arr) {
  return Array.from(new Set(arr));
}