let userId = window.localStorage.getItem("userId");
let userInfo = initInfo(userId);
const vm = new Vue({
  el: "#homepage",
  data() {
    /*
    return {
      userAvatarURL: "../img/avatar.jpg",
      activeName: "activity",
      username: "user01",
      userIndustry: "建筑业",
      isMe: true,
      voteNum: 133,
      questionNum: 22,
      follows: 122,
      followers: 99,
      input: "",
    };
    */

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
      questionAsked: "",
    };
  },
  methods: {
    handleClick(tab, event) {
      //console.log(tab, event);
    },
    editProfile() {
      window.location.href = "editProfile.html";
    },
  },
});
