//token = localStorage.getItem("token");
function initInfo(userId) {
  let userInfo = {};
  $.ajax({
    type: "GET",
    dataType: "json",
    async: false,
    // url: "http://47.100.62.222:80/user/" + userId,
    url: "http://localhost/user/" + userId,
    headers: {
      //请求头
      Authorization: token, //登录获取的token (String)
    },
    success: function (result) {
      if (result.code == 00000) {
        userInfo = result.data;
      } else if (result.code == 10501) {
        alert("userId非法！");
      }
    },
  });
  return userInfo;
}
