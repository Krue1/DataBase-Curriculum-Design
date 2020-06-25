let token = localStorage.getItem("token");
let myUserId = window.localStorage.getItem("myUserId");
let myUserInfo = initInfo(myUserId);
let questionId = window.localStorage.getItem("questionId");
let questionInfo = {
  id: 11,
  title: "如何看待zhiyu_5678其人？",
  description: "如何看待zhiyu_5678其人，何许人也",
  datetime: "2020-06-23 15:39:19",
  likeNumber: 0,
};
$.ajax({
  type: "GET",
  dataType: "json",
  async: false,
  url: "http://localhost/question/" + questionId,
  headers: {
    //请求头
    Authorization: token, //登录获取的token (String)
  },
  success: function (result) {
    if (result.code == 00000) {
      questionInfo = result.data;
    } else if (result.code == 10501) {
      alert("questionId非法！");
    }
  },
});

const vm = new Vue({
  el: "#question",
  data() {
    return {
      myUserAvatarURL: this.$baseurl + myUserInfo.avatar,
      questionAsked: "",
      isShowAsk: false,
      question: questionInfo.title,
      description: questionInfo.description,
      questionLikeNumber: questionInfo.likeNumber,
      questionDatetime: questionInfo.datetime,
      isLikeQuestion: questionInfo.like,
      form: {
        question: "",
        description: "",
      },
      formLabelWidth: "120px",
      // answerNum: questionInfo.answerNum,
      answerNum: 2,
      dmList: [],
    };
  },
  mounted: function () {
    let _self = this;
    $.ajax({
      type: "GET",
      async: false,
      url: "http://localhost/message/unchecked",
      headers: {
        //请求头
        Authorization: token, //登录获取的token (String)
      },
      success: function (result) {
        if (result.code == 00000) {
          _self.dmList = result.data;
        }
      },
    });
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
            url: "http://localhost/user/" + item.id + "/followers",
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
            url: "http://localhost/user/" + item.id + "/followers",
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
        toUserHomepage(id) {
          window.localStorage.setItem("userId", id);
        },
      },
    },
    "hot-question": {
      props: ["item"],
      template: "#hot-question",
      data() {
        return {};
      },
      methods: {
        toQuestion(id) {
          window.localStorage.setItem("questionId", id);
        },
      },
    },
    "list-item-dm": {
      props: ["item", "my_username"],
      template: "#list-item-dm",
      data() {
        return {
          isShowDmDialog: false,
          messages: [],
          form: {
            content: "",
          },
          theOther: {},
          me: {},
        };
      },
      methods: {
        openDmDialog(id) {
          let _self = this;
          $.ajax({
            type: "GET",
            async: false,
            url: "http://localhost:80/chat/" + id,
            headers: {
              //请求头
              Authorization: token, //登录获取的token (String)
            },
            success: function (result) {
              if (result.code == 00000) {
                _self.messages = result.data.messages;
                _self.theOther = result.data.theOther;
                _self.me = result.data.me;
              }
            },
          });
          this.isShowDmDialog = true;
        },
        sendDm(id) {
          let _self = this;
          $.ajax({
            type: "POST",
            async: false,
            url: "http://localhost/message",
            headers: {
              //请求头
              Authorization: token, //登录获取的token (String)
            },
            data: {
              receiverId: id,
              content: _self.form.content,
            },
            success: function (result) {
              if (result.code == 00000) {
                result.data.messages[0].me = 1;
                _self.messages.push(result.data.messages[0]);
                console.log(_self.messages);
                _self.form.content = "";
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
        // url: "http://47.100.62.222:80/question/add",
        url: "http://127.0.0.1/question/add",
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
            vm.form.question = "";
            vm.form.description = "";
            vm.isShowAsk = false;
            window.location.reload();
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
      $.ajax({
        type: "POST",
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
            window.location.reload();
          }
        },
      });
    },
    cancleLikeQuestion() {
      $.ajax({
        type: "DELETE",
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
            alert("取消点赞成功");
            window.location.reload();
          }
        },
      });
    },
    getDmList() {
      dmList = [];
      $.ajax({
        type: "GET",
        async: false,
        url: "http://localhost/message/unchecked",
        headers: {
          //请求头
          Authorization: token, //登录获取的token (String)
        },
        success: function (result) {
          if (result.code == 00000) {
            dmList = result.data;
          } else if (result.code == 10501) {
            alert("userId非法！");
          }
        },
      });
      return dmList;
    },
  },
  computed: {
    answers() {
      let answers = [
        {
          id: 16,
          content: "有zhiyu_5678这个人吗？",
          datetime: "2020-06-25 10:53:05",
          author: {
            id: 10,
            nickname: "Newgate",
            gender: 1,
            avatar: "/img/avatar/default_avatar.png",
            brief: "22255566",
            introduction: "5555",
            habitation: "222",
            profession: "搬砖",
            education: "3",
            account: {
              id: 15,
              username: "abc124",
              password: "abc124",
            },
          },
          question: null,
          like: true,
          likeNumber: 41,
        },
        {
          id: 17,
          content:
            "![](http://t8.baidu.com/it/u=2247852322,986532796&fm=79&app=86&size=h300&n=0&g=4n&f=jpeg?sec=1593659788&t=30cb2fbdb1e77a81aa45f95c7a25a80b)",
          datetime: "2020-06-25 11:16:54",
          author: {
            id: 19,
            nickname: "zhiyu_掌门人",
            gender: 0,
            avatar: "/img/avatar/default_avatar.jpg",
            brief: "知裕从哪里来，到哪里去",
            introduction: "",
            habitation: "",
            profession: "知裕业",
            education: "",
            account: {
              id: 25,
              username: "abc127",
              password: "abc127",
            },
          },
          question: null,
          like: false,
          likeNumber: 2,
        },
      ];
      $.ajax({
        type: "GET",
        async: false,
        url: "http://localhost/answer/" + questionId,
        headers: {
          //请求头
          Authorization: token, //登录获取的token (String)
        },
        success: function (result) {
          if (result.code == 00000) {
            answers = result.data.answerInfoDTOList;
            console.log(answers);
          } else if (result.code == 10501) {
            alert("参数非法！");
          }
        },
      });
      // $(".list-item-content").html(
      //   '<textarea class="append-test" style="display:none;"></textarea>'
      // );
      // $(".append-test").val(res.data.content);
      // editormd.markdownToHTML("QuestionMain-Inner-Content", {
      //   htmlDecode: "style,script,iframe", //可以过滤标签解码
      //   emoji: true,
      //   taskList: true,
      //   tex: true, // 默认不解析
      //   flowChart: true, // 默认不解析
      //   sequenceDiagram: true, // 默认不解析
      // });
      return answers;
    },
    hots() {
      let hots = [
        {
          id: 1,
          title: "如何看待知乎",
          description:
            "知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎",
          likeNumber: 11,
          datetime: "2020-06-14",
        },
      ];
      $.ajax({
        type: "GET",
        async: false,
        // url: "http://47.100.62.222:80/hot",
        url: "http://127.0.0.1/hot",
        success: function (result) {
          if (result.code == 00000) {
            hots = result.data.hotQuestionList;
            hots = hots.slice(0, 5);
          } else {
            alert("非法！");
          }
        },
      });
      return hots;
    },
    uncheckedNums() {
      let uncheckedNums = 1;
      $.ajax({
        type: "GET",
        async: false,
        url: "http://localhost/message/uncheckedNums",
        headers: {
          //请求头
          Authorization: token, //登录获取的token (String)
        },
        success: function (result) {
          if (result.code == 00000) {
            uncheckedNums = result.data.uncheckedNums;
          }
        },
      });
      return uncheckedNums;
    },
  },
});
