let token = localStorage.getItem("token");
let myUserId = window.localStorage.getItem("myUserId");
let myUserInfo = initInfo(myUserId);
let questionId = window.localStorage.getItem("questionId");
let questionInfo = null;
// $.ajax({
//   type: "GET",
//   dataType: "json",
//   async: false,
//   url: "http://47.100.62.222:80/question/" + questionId,
//   // url: "http://localhost/question/" + 1,
//   headers: {
//     //请求头
//     Authorization: token, //登录获取的token (String)
//   },
//   success: function (result) {
//     if (result.code == 00000) {
//       questionInfo = result.data;
//     } else if (result.code == 10501) {
//       alert("questionId非法！");
//     }
//   },
// });

const vm = new Vue({
  el: "#question",
  data() {
    return {
      myUserAvatarURL: this.$baseurl + myUserInfo.avatar,
      questionAsked: "",
      isShowAsk: false,
      question: "dddd",
      description: "333333",
      form: {
        question: "",
        description: "",
      },
      formLabelWidth: "120px",
      // answerNum: questionInfo.answerNum,
      answerNum: 2,
    };
  },
  components: {
    "list-item-answer": {
      props: ["item"],
      template: "#list-item-answer",
      data() {
        return {};
      },
      methods: {
        like(item) {
          $.ajax({
            type: "POST",
            url: "http://47.100.62.222:80/user/" + item.id + "/followers",
            headers: {
              //请求头
              Authorization: token, //登录获取的token (String)
            },
            success: function (result) {
              if (result.code == 00000) {
                alert("点赞成功");
              } else if (result.code == 10501) {
                alert("回答id非法");
              }
            },
          });
        },
        dislike(item) {
          $.ajax({
            type: "POST",
            url: "http://47.100.62.222:80/user/" + item.id + "/followers",
            headers: {
              //请求头
              Authorization: token, //登录获取的token (String)
            },
            success: function (result) {
              if (result.code == 00000) {
                alert("取消点赞成功");
              } else if (result.code == 10501) {
                alert("回答id非法");
              }
            },
          });
        },
      },
    },
  },
  methods: {
    handleCommand(command) {
      if (command === "a") {
        window.localStorage.setItem("userId", myUserId);
        window.location.href = "../html/homepage.html";
      } else if (command === "b") {
        window.localStorage.clear();
        window.location.href = "../html/login.html";
      }
    },
    submitQuestion() {
      $.ajax({
        type: "POST",
        url: "http://47.100.62.222:80/question/add",
        contentType: "application/json",
        data: JSON.stringify({
          title: vm.form.question,
          description: vm.form.description,
        }),
        headers: {
          //请求头
          Authorization: token, //登录获取的token (String)
        },
        success: function (result) {
          if (result.code == 00000) {
            alert("提交问题成功");
          } else if (result.code == 10501) {
            alert("用户id非法");
          } else if (result.code == 10601) {
            alert("插入数据失败");
          }
        },
      });
      isShowAsk = false;
    },
    toAnswer() {
      window.location.href = "../html/answer.html";
    },
    likeQuestion() {
      questionId = 2;
      $.ajax({
        type: "POST",
        // url: "http://47.100.62.222:80/question/like",
        url: "http://127.0.0.1/question/like",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(questionId),
        headers: {
          //请求头
          Authorization: token, //登录获取的token (String)
        },
        success: function (result) {
          if (result.code == 00000) {
            alert("点赞成功");
          } else if (result.code == 10501) {
            alert("用户id非法");
          }
        },
      });
    },
  },
  computed: {
    answers() {
      let answers = [
        {
          title: "如何看待知裕？",
          nickname: "BB",
          brief: "专业搬砖",
          content: "rrrrrdd发发发发",
          avatar: "../img/avatar.jpg",
          likeNumber: 44,
          commentNum: 2,
          isLike: true,
        },
        {
          title: "如何看待知裕？",
          nickname: "BB",
          brief: "专业搬砖",
          content: "rrrrrdd发发发发",
          avatar: "../img/avatar.jpg",
          likeNumber: 44,
          commentNum: 2,
          isLike: false,
        },
      ];
      // $.ajax({
      //   type: "GET",
      //   async: false,
      //   url: "http://47.100.62.222:80/user/" + userId + "/followers",
      //   headers: {
      //     //请求头
      //     Authorization: token, //登录获取的token (String)
      //   },
      //   data: {
      //     offset: 0,
      //     limit: 5,
      //   },
      //   success: function (result) {
      //     if (result.code == 00000) {
      //       answers = result.data.followers;
      //       console.log(answers);
      //     } else if (result.code == 10501) {
      //       alert("userId非法！");
      //     }
      //   },
      // });
      return answers;
    },
  },
});
