let token = localStorage.getItem("token");
let myUserId = window.localStorage.getItem("myUserId");
let myUserInfo = initInfo(myUserId);
let userId = window.localStorage.getItem("userId");
let userInfo = initInfo(userId);
console.log(userInfo);
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
      userAvatarURL: this.$baseurl + userInfo.avatar,
      myUserAvatarURL: this.$baseurl + myUserInfo.avatar,
      activeName: "activity",
      username: userInfo.nickname,
      userIndustry: userInfo.profession,
      isMe: userId === myUserId ? true : false,
      voteNum: 133,
      questionNum: 22,
      follows: userInfo.followingsCount,
      followers: userInfo.followersCount,
      questionAsked: "",
      isShowAsk: false,
      form: {
        question: "",
        description: "",
      },
      formLabelWidth: "120px",
      following: userInfo.followings,
    };
  },
  methods: {
    handleClick(tab, event) {
      //console.log(tab, event);
    },
    editProfile() {
      window.location.href = "editProfile.html";
    },
    seeFollow() {
      this.activeName = "follow";
    },
    seeFan() {
      this.activeName = "fan";
    },
    follow() {
      $.ajax({
        type: "POST",
        url: "http://47.100.62.222:80/user/" + userId + "/followers",
        headers: {
          //请求头
          Authorization: token, //登录获取的token (String)
        },
        success: function (result) {
          if (result.code == 00000) {
            alert("关注成功");
          } else if (result.code == 10501) {
            alert("用户id非法");
          }
        },
      });
    },
    cancleFollow() {
      $.ajax({
        type: "DELETE",
        url: "http://47.100.62.222:80/user/" + userId + "/followers",
        headers: {
          //请求头
          Authorization: token, //登录获取的token (String)
        },
        success: function (result) {
          if (result.code == 00000) {
            alert("取消关注成功");
          } else if (result.code == 10501) {
            alert("用户id非法");
          }
        },
      });
    },
    submitQuestion() {
      isShowAsk = false;
    },
  },
  components: {
    "list-item-follow": {
      props: ["item"],
      template: "#list-item-follow",
      data() {
        return {};
      },
      methods: {
        follow(item) {
          $.ajax({
            type: "POST",
            url: "http://47.100.62.222:80/user/" + item.id + "/followers",
            headers: {
              //请求头
              Authorization: token, //登录获取的token (String)
            },
            success: function (result) {
              if (result.code == 00000) {
                alert("关注成功");
              } else if (result.code == 10501) {
                alert("用户id非法");
              }
            },
          });
        },
        cancleFollow(item) {
          $.ajax({
            type: "DELETE",
            url: "http://47.100.62.222:80/user/" + item.id + "/followers",
            headers: {
              //请求头
              Authorization: token, //登录获取的token (String)
            },
            success: function (result) {
              if (result.code == 00000) {
                alert("取消关注成功");
              } else if (result.code == 10501) {
                alert("用户id非法");
              }
            },
          });
        },
        toUserHomepage(item) {
          window.localStorage.setItem("userId", item.id);
        },
      },
    },
  },
  computed: {
    followings() {
      let followings = [
        {
          id: 22,
          nickname: "dd",
          brief: "ss",
          answersCount: 2,
          followersCount: 3,
          avatar: "../img/avatar.jpg",
          isFollowing: true,
          isFollowed: true,
        },
      ];
      $.ajax({
        type: "GET",
        async: false,
        url: "http://47.100.62.222:80/user/" + userId + "/followings",
        headers: {
          //请求头
          Authorization: token, //登录获取的token (String)
        },
        data: {
          offset: 0,
          limit: 5,
        },
        success: function (result) {
          if (result.code == 00000) {
            followings = result.data.followings;
            console.log(followings);
          } else if (result.code == 10501) {
            alert("userId非法！");
          }
        },
      });
      return followings;
    },
    fans() {
      let fans = [
        {
          id: 22,
          nickname: "dd",
          brief: "ss",
          answersCount: 2,
          followersCount: 3,
          avatar: "../img/avatar.jpg",
          isFollowing: true,
          isFollowed: true,
        },
      ];
      $.ajax({
        type: "GET",
        async: false,
        url: "http://47.100.62.222:80/user/" + userId + "/followers",
        headers: {
          //请求头
          Authorization: token, //登录获取的token (String)
        },
        data: {
          offset: 0,
          limit: 5,
        },
        success: function (result) {
          if (result.code == 00000) {
            fans = result.data.followers;
            console.log(fans);
          } else if (result.code == 10501) {
            alert("userId非法！");
          }
        },
      });
      return fans;
    },
  },
});

//测试用
function follow(id) {
  $.ajax({
    type: "POST",
    url: "http://47.100.62.222:80/user/" + id + "/followers",
    headers: {
      //请求头
      Authorization: token, //登录获取的token (String)
    },
    success: function (result) {
      if (result.code == 00000) {
        alert("关注成功");
      } else if (result.code == 10501) {
        alert("用户id非法");
      }
    },
  });
}

function cancleFollow(id) {
  $.ajax({
    type: "DELETE",
    url: "http://47.100.62.222:80/user/" + id + "/followers",
    headers: {
      //请求头
      Authorization: token, //登录获取的token (String)
    },
    success: function (result) {
      if (result.code == 00000) {
        alert("取消关注成功");
      } else if (result.code == 10501) {
        alert("用户id非法");
      }
    },
  });
}

//follow(18);
