let token = localStorage.getItem("token");
let myUserId = window.localStorage.getItem("myUserId");
let myUserInfo = initInfo(myUserId);
let questionAsked = window.localStorage.getItem("questionAsked");

const vm = new Vue({
  el: "#search",
  data() {
    return {
      myUserAvatarURL: this.$baseurl + myUserInfo.avatar,
      myUsername: myUserInfo.nickname,
      questionAsked: questionAsked,
      isShowAsk: false,
      form: {
        question: "",
        description: "",
      },
      formLabelWidth: "120px",
      dmList: [],
      searchs: [],
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
    //获取并整理得搜索列表
    $.ajax({
      type: "POST",
      async: false,
      url: "http://localhost/search",
      data: {
        keyword: questionAsked,
      },
      success: function (result) {
        if (result.code == 00000) {
          let questionAnswerList = result.data.questionAnswerList;
          for (let i = 0; i < questionAnswerList.length; i++) {
            let temp = {};
            temp.id = questionAnswerList[i].first.id;
            temp.title = questionAnswerList[i].first.title;
            if (!questionAnswerList[i].second) {
              temp.isHaveAnswer = false;
            } else {
              temp.isHaveAnswer = true;
              temp.nickname = questionAnswerList[i].second.author.nickname;
              temp.content = questionAnswerList[i].second.content;
            }
            _self.searchs.push(temp);
          }
        }
      },
    });
  },
  components: {
    "list-item-search": {
      props: ["item"],
      template: "#list-item-search",
      data() {
        return {};
      },
      methods: {
        toQuestion(id) {
          window.localStorage.setItem("questionId", id);
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
    searchQuestion() {
      window.localStorage.setItem("questionAsked", this.questionAsked);
      window.location.href = "../html/search.html";
    },
    toAnswer() {
      window.location.href = "../html/answer.html";
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
    getSearchs() {
      let temp = {
        id: 5,
        title: "如何看待知裕",
        nickname: "搬砖工",
        content: "少时诵诗书多付过过个个",
      };
      this.searchs.push(temp);
      this.searchs.push(temp);
    },
  },
  computed: {
    hots() {
      let hots = [];
      $.ajax({
        type: "GET",
        async: false,
        url: "http://127.0.0.1/hot",
        success: function (result) {
          if (result.code == 00000) {
            hots = result.data.hotQuestionList;
            hots = hots.slice(0, 5);
          } else {
            alert("非法！");
            window.history.go(-1);
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

function md2html(id) {
  editormd.markdownToHTML(id, {
    htmlDecode: "style,script,iframe", //可以过滤标签解码
    emoji: true,
    taskList: true,
    tex: true, // 默认不解析
    flowChart: true, // 默认不解析
    sequenceDiagram: true, // 默认不解析
  });
}
