const vm = new Vue({
  el: "#editProfile",
  data() {
    return {
      userAvatarURL: "../img/avatar.jpg",
      activeName: "activity",
      input: "",

      username: "user01",
      isShowUsername: true,
      oldUsername: "",

      gender: "未知",
      isShowGender: true,
      oldGender: "",

      brief: "",
      isShowBrief: true,
      oldBrief: "",

      habitation: "",
      isShowHabitation: true,
      oldHabitation: "",

      profession: "",
      isShowProfession: true,
      oldProfession: "",

      education: "",
      isShowEducation: true,
      oldEducation: "",

      introduction: "",
      isShowIntroduction: true,
      oldIntroduction: "",
    };
    /*
      return {
        userAvatarURL: userInfo.avatar,
        activeName: "activity",
        username: userInfo.nickname,
        userIndustry: userInfo.profession,
        isMe: true,
        voteNum: 133,
        questionNum: 22,
        follows: userInfo.followingsCount,
        followers: userInfo.followersCount,
      };
    */
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

    editUsername() {
      this.oldUsername = this.username;
      this.isShowUsername = false;
    },
    cancleSaveUsername() {
      this.username = this.oldUsername;
      this.isShowUsername = true;
    },
    saveUsername() {
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
      this.isShowIntroduction = true;
    },
  },
});
