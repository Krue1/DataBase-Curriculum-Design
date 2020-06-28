let token = localStorage.getItem("token");
let userId = window.localStorage.getItem("userId");
let userInfo = initInfo(userId);
let myUserId = window.localStorage.getItem("myUserId");
let myUserInfo = initInfo(myUserId);
const vm = new Vue({
  el: "#editProfile",
  data() {
    return {
      userAvatarURL: this.$baseurl + userInfo.avatar,
      myUserAvatarURL: this.$baseurl + myUserInfo.avatar,
      activeName: "activity",
      questionAsked: "",
      isShowAsk: false,
      form: {
        question: "",
        description: "",
      },
      formLabelWidth: "120px",

      username: userInfo.nickname,
      isShowUsername: true,
      oldUsername: "",

      gender:
        userInfo.gender == 1 ? "男" : userInfo.gender == 0 ? "女" : "未知",
      isShowGender: true,
      oldGender: "",

      brief: userInfo.brief,
      isShowBrief: true,
      oldBrief: "",

      habitation: userInfo.habitation,
      isShowHabitation: true,
      oldHabitation: "",

      profession: userInfo.profession,
      isShowProfession: true,
      oldProfession: "",

      education: userInfo.education,
      isShowEducation: true,
      oldEducation: "",

      introduction: userInfo.introduction,
      isShowIntroduction: true,
      oldIntroduction: "",
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
    "edit-button": {
      template: "#editButton",
      data() {
        return {
          message: "dasiju",
        };
      },
      function: {},
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
    handleClick(tab, event) {
      console.log(tab, event);
    },
    searchQuestion() {
      window.localStorage.setItem("questionAsked", this.questionAsked);
      window.location.href = "../html/search.html";
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
    returnHomepage() {
      window.location.href = "homepage.html";
    },
    handleCommand(command) {
      if (command === "a") {
        window.localStorage.setItem("userId", myUserId);
        window.location.href = "../html/homepage.html";
      } else if (command === "b") {
        window.localStorage.clear();
        window.location.href = "../html/login.html";
      }
    },
    editUsername() {
      this.oldUsername = this.username;
      this.isShowUsername = false;
    },
    cancleSaveUsername() {
      this.username = this.oldUsername;
      this.isShowUsername = true;
    },
    saveUsername() {
      $.ajax({
        type: "POST",
        async: false,
        url: "http://localhost/me/info",
        headers: {
          //请求头
          Authorization: token, //登录获取的token (String)
        },
        data: {
          field: "nickname",
          value: vm.username,
        },
        success: function (result) {
          if (result.code == 00000) {
            userInfo = result.data;
          } else if (result.code == 10101) {
            vm.username = vm.oldUsername;
            alert("字段或修改值非法");
          }
        },
        error: function () {
          alert("错误");
          vm.username = vm.oldUsername;
        },
      });
      this.isShowUsername = true;
    },

    editGender() {
      this.oldGender = this.gender;
      this.isShowGender = false;
    },
    cancleSaveGender() {
      this.gender = this.oldGender;
      this.isShowGender = true;
    },
    saveGender() {
      $.ajax({
        type: "POST",
        async: false,
        url: "http://localhost/me/info",
        headers: {
          //请求头
          Authorization: token, //登录获取的token (String)
        },
        data: {
          field: "gender",
          value: vm.gender == "男" ? 1 : 0,
        },
        success: function (result) {
          if (result.code == 00000) {
            userInfo = result.data;
          } else if (result.code == 10101) {
            vm.gender = vm.oldGender;
            alert("字段或修改值非法");
          }
        },
        error: function () {
          alert("错误");
          vm.gender = vm.oldGender;
        },
      });
      this.isShowGender = true;
    },

    editBrief() {
      this.oldBrief = this.brief;
      this.isShowBrief = false;
    },
    cancleSaveBrief() {
      this.brief = this.oldBrief;
      this.isShowBrief = true;
    },
    saveBrief() {
      $.ajax({
        type: "POST",
        async: false,
        url: "http://localhost/me/info",
        headers: {
          //请求头
          Authorization: token, //登录获取的token (String)
        },
        data: {
          field: "brief",
          value: vm.brief,
        },
        success: function (result) {
          if (result.code == 00000) {
            userInfo = result.data;
          } else if (result.code == 10101) {
            alert("字段或修改值非法");
            vm.brief = vm.oldBrief;
          }
        },
        error: function () {
          alert("错误");
          vm.brief = vm.oldBrief;
        },
      });
      this.isShowBrief = true;
    },

    editHabitation() {
      this.oldHabitation = this.habitation;
      this.isShowHabitation = false;
    },
    cancleSaveHabitation() {
      this.habitation = this.oldHabitation;
      this.isShowHabitation = true;
    },
    saveHabitation() {
      $.ajax({
        type: "POST",
        async: false,
        url: "http://localhost/me/info",
        headers: {
          //请求头
          Authorization: token, //登录获取的token (String)
        },
        data: {
          field: "habitation",
          value: vm.habitation,
        },
        success: function (result) {
          if (result.code == 00000) {
            userInfo = result.data;
          } else if (result.code == 10101) {
            vm.habitation = vm.oldHabitation;
            alert("字段或修改值非法");
          }
        },
        error: function () {
          alert("错误");
          vm.habitation = vm.oldHabitation;
        },
      });
      this.isShowHabitation = true;
    },

    editProfession() {
      this.oldProfession = this.profession;
      this.isShowProfession = false;
    },
    cancleSaveProfession() {
      this.profession = this.oldProfession;
      this.isShowProfession = true;
    },
    saveProfession() {
      $.ajax({
        type: "POST",
        async: false,
        url: "http://localhost/me/info",
        headers: {
          //请求头
          Authorization: token, //登录获取的token (String)
        },
        data: {
          field: "profession",
          value: vm.profession,
        },
        success: function (result) {
          if (result.code == 00000) {
            userInfo = result.data;
          } else if (result.code == 10101) {
            vm.profession = vm.oldProfession;
            alert("字段或修改值非法");
          }
        },
        error: function () {
          alert("错误");
          vm.profession = vm.oldProfession;
        },
      });
      this.isShowProfession = true;
    },

    editEducation() {
      this.oldEducation = this.education;
      this.isShowEducation = false;
    },
    cancleSaveEducation() {
      this.education = this.oldEducation;
      this.isShowEducation = true;
    },
    saveEducation() {
      $.ajax({
        type: "POST",
        async: false,
        url: "http://localhost/me/info",
        headers: {
          //请求头
          Authorization: token, //登录获取的token (String)
        },
        data: {
          field: "education",
          value: vm.education,
        },
        success: function (result) {
          if (result.code == 00000) {
            userInfo = result.data;
          } else if (result.code == 10101) {
            vm.education = vm.oldEducation;
            alert("字段或修改值非法");
          }
        },
        error: function () {
          alert("错误");
          vm.education = vm.oldEducation;
        },
      });
      this.isShowEducation = true;
    },

    editIntroduction() {
      this.oldIntroduction = this.introduction;
      this.isShowIntroduction = false;
    },
    cancleSaveIntroduction() {
      this.introduction = this.oldIntroduction;
      this.isShowIntroduction = true;
    },
    saveIntroduction() {
      $.ajax({
        type: "POST",
        async: false,
        url: "http://localhost/me/info",
        headers: {
          //请求头
          Authorization: token, //登录获取的token (String)
        },
        data: {
          field: "introduction",
          value: vm.introduction,
        },
        success: function (result) {
          if (result.code == 00000) {
            userInfo = result.data;
          } else if (result.code == 10101) {
            vm.introduction = vm.oldIntroduction;
            alert("字段或修改值非法");
          }
        },
        error: function () {
          alert("错误");
          vm.introduction = vm.oldIntroduction;
        },
      });
      this.isShowIntroduction = true;
    },
    submitQuestion() {
      $.ajax({
        type: "POST",
        // url: "http://localhost/question/add",
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
  },
});

console.log(vm.userAvatarURL);
