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
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
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
        url: "http://47.100.62.222:80/me/info",
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
        url: "http://47.100.62.222:80/me/info",
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
        url: "http://47.100.62.222:80/me/info",
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
        url: "http://47.100.62.222:80/me/info",
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
        url: "http://47.100.62.222:80/me/info",
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
        url: "http://47.100.62.222:80/me/info",
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
        url: "http://47.100.62.222:80/me/info",
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
  },
  computed: {
    // genderShowed() {
    //   if (userInfo.gender === -1) {
    //     return "未知";
    //   } else if (userInfo.gender === 0) {
    //     return "女";
    //   } else if (userInfo.gender === 1) {
    //     return "男";
    //   }
    // },
  },
});

console.log(vm.userAvatarURL);
