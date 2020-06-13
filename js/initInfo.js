function initInfo(userId) {
  let userInfo = {};
  $.ajax({
    type: "GET",
    dataType: "json",
    async: false,
    url: "http://47.100.62.222:80/user/" + userId,
    success: function (result) {
      if (result.code == 00000) {
        alert("ok");
        userInfo = result.data;
      } else if (result.code == 10501) {
        alert("userId非法！");
      }
    },
  });
  return userInfo;
}
