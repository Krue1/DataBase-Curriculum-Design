let account = document.querySelector("#account");
let password = document.querySelector("#password");

function checkAccount() {
  if (account.validity.patternMismatch) {
    account.setCustomValidity("帐号必须为6-16位的数字和字母的组合");
  } else account.setCustomValidity("");
}
function checkPassword() {
  if (password.validity.patternMismatch) {
    password.setCustomValidity("密码必须为6-16位的数字和字母的组合");
  } else password.setCustomValidity("");
}
account.addEventListener("blur", checkAccount);
password.addEventListener("blur", checkPassword);

$("#login-form").on("submit", function (e) {
  e.preventDefault();
  let userName = account.value;
  let passWord = password.value;
  console.log("username:" + userName);
  console.log("password:" + passWord);

  $.ajax({
    type: "GET",
    dataType: "json",
    url: "http://47.100.62.222:80/RSAPublicKey/" + userName,
    success: function (result) {
      console.log("加密返回码 :" + result.code);
      if (result.code == 00000) {
        let publicKey = result.data.publicKey;
        let encrypt = new JSEncrypt();
        encrypt.setPublicKey(publicKey);
        let encryptedPassword = encrypt.encrypt(passWord);

        $.ajax({
          type: "POST",
          dataType: "json",
          url: "http://47.100.62.222:80/login",
          contentType: "application/json",
          data: JSON.stringify({
            username: userName,
            password: encryptedPassword,
          }),
          success: function (result) {
            if (result.code == 00000) {
              alert("登录成功");
              window.localStorage.setItem("myUserId", result.data.id);
              window.localStorage.setItem("token", result.data.token);
              window.location.href = "homepage.html";
            } else if (result.code == 10101) {
              alert("用户名或密码不符合要求");
            } else if (result.code == 10201) {
              alert("帐号或密码错误");
            }
          },
        });
      }
    },
  });
});
