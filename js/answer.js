let token = localStorage.getItem("token");
let userId = window.localStorage.getItem("userId");
let userInfo = initInfo(userId);
let myUserId = window.localStorage.getItem("myUserId");
let myUserInfo = initInfo(myUserId);

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
    //imageUploadURL: "http://localhost:80/uploadImg",
    toolbarIcons: function () {
      //自定义工具栏，后面有详细介绍
      return editormd.toolbarModes["full"]; // full, simple, mini
    },
  });
  let baseUrl = "http://47.100.62.222:80/";
  $("#submitButton").click(() => {
    let formData = new FormData();
    let content = $("#content").val();
    formData.append("content", content);
    formData.append("questionId", 1);

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
  });
});

const vm = new Vue({
  el: "#answer",
  mounted: function () {
    // let E = window.wangEditor;
    // let editor = new E("#editor");
    // editor.customConfig.debug = true;
    // editor.customConfig.zIndex = 10;
    // editor.create();
  },
  data() {
    return {
      userAvatarURL: this.$baseurl + userInfo.avatar,
      myUserAvatarURL: this.$baseurl + myUserInfo.avatar,
      activeName: "activity",
      questionAsked: "",
      isShowAsk: false,
      question: "dddd",
      description: "333333",
      form: {
        question: "",
        description: "",
      },
      formLabelWidth: "120px",
    };
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
  },
});
