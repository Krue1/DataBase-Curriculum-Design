let account = document.querySelector("#account");
let passwd1 = document.querySelector("#password1");
let passwd2 = document.querySelector("#password2");

function checkAccount() {
  if (account.validity.patternMismatch) {
    account.setCustomValidity("帐号必须为6-16位的数字和字母的组合");
  } else account.setCustomValidity("");
}
function validate() {
  if (passwd2.validity.patternMismatch) {
    passwd2.setCustomValidity("密码必须为6-16位的数字和字母的组合");
  } else passwd2.setCustomValidity("");
  if (passwd1.value != passwd2.value) {
    passwd2.setCustomValidity("两次输入的密码不一致");
  } else passwd2.setCustomValidity("");
}
function checkPassword() {
  if (passwd1.validity.patternMismatch) {
    passwd1.setCustomValidity("密码必须为6-16位的数字和字母的组合");
  } else passwd1.setCustomValidity("");
}
account.addEventListener("blur", checkAccount);
passwd1.addEventListener("blur", checkPassword);
passwd2.addEventListener("blur", validate);

let signupBtn = document.querySelector("#signup-btn");

$("#signup-form").on("submit", function (e) {
  e.preventDefault();
  let userName = account.value;
  let passWord = passwd2.value;
  console.log("username:" + userName);
  console.log("password:" + passWord);

  $.ajax({
    type: "GET",
    dataType: "json",
    // url: "http://47.100.62.222:80/RSAPublicKey/" + userName,
    url: "http://localhost/RSAPublicKey/" + userName,
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
          // url: "http://47.100.62.222:80/register",
          url: "http://localhost/register",
          contentType: "application/json",
          data: JSON.stringify({
            username: userName,
            password: encryptedPassword,
          }),
          success: function (result) {
            if (result.code == 00000) {
              alert("注册成功");
              window.location.href = "login.html";
            } else if (result.code == 10101) {
              alert("用户名或密码不符合要求");
            } else if (result.code == 10303) {
              alert("帐号已被注册");
            } else if (result.code == 10302) {
              alert("注册失败");
            }
          },
        });
      }
    },
  });
});
