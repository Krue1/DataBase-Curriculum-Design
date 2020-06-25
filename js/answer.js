let token = localStorage.getItem("token");
let myUserId = window.localStorage.getItem("myUserId");
let myUserInfo = initInfo(myUserId);
let questionId = window.localStorage.getItem("questionId");
let questionInfo = {};
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
let baseUrl = "http://localhost/";
let testEditor;
let testEditormdView;
let submitAnswer;
$(function () {
  testEditor = editormd("test-editormd", {
    placeholder: "本编辑器支持Markdown编辑，左边编写，右边预览", //默认显示的文字，这里就不解释了
    width: "100%",
    height: 640,
    syncScrolling: "single",
    path: "../editor.md-master/lib/", //你的path路径（原资源文件中lib包在我们项目中所放的位置）
    theme: "light", //工具栏主题
    previewTheme: "light", //预览主题
    //editorTheme: "pastel-on-light", //编辑主题
    saveHTMLToTextarea: true,
    emoji: false,
    taskList: true,
    tocm: true, // Using [TOCM]
    tex: true, // 开启科学公式TeX语言支持，默认关闭
    flowChart: true, // 开启流程图支持，默认关闭
    sequenceDiagram: true, // 开启时序/序列图支持，默认关闭,
    saveHTMLToTextarea: true,
    imageUpload: true,
    imageFormats: ["jpg", "jpeg", "png"],
    imageUploadURL: "http://localhost:80/uploadImg",
    toolbarIcons: function () {
      //自定义工具栏，后面有详细介绍
      return editormd.toolbarModes["full"]; // full, simple, mini
    },
  });
  // let baseUrl = "http://47.100.62.222:80/";
  $("#submitButton").click(() => {
    let formData = new FormData();
    let content = $("#content").val();
    formData.append("content", content);
    formData.append("questionId", questionId);

    $.ajax({
      url: baseUrl + "answer/content",
      type: "POST",
      data: formData,
      cache: false,
      processData: false,
      contentType: false,
      beforeSend: function (request) {
        request.setRequestHeader("Authorization", token);
      },
      success: function (res) {
        $("#test-editormd-view").html(
          '<textarea id="append-test" style="display:none;"></textarea>'
        );
        $("#append-test").val(res.data.content);
        editormd.markdownToHTML("test-editormd-view", {
          htmlDecode: "style,script,iframe", //可以过滤标签解码
          emoji: true,
          taskList: true,
          tex: true, // 默认不解析
          flowChart: true, // 默认不解析
          sequenceDiagram: true, // 默认不解析
        });
      },
    });
    alert("答案提交成功！");
    window.location.href = "../html/question.html";
  });
});

const vm = new Vue({
  el: "#answer",
  data() {
    return {
      myUserAvatarURL: this.$baseurl + myUserInfo.avatar,
      myUsername: myUserInfo.nickname,
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
    toAnswer() {
      // window.location.href = "../html/answer.html";
      console.log("page to answer");
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
            vm.form.question = "";
            vm.form.description = "";
            vm.isShowAsk = false;
          } else if (result.code == 10501) {
            alert("用户id非法");
          } else if (result.code == 10601) {
            alert("插入数据失败");
          }
        },
      });
      isShowAsk = false;
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
  },
  components: {
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
  },
  computed: {
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
  },
});
