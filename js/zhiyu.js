let token = localStorage.getItem("token");
let myUserId = window.localStorage.getItem("myUserId");
let myUserInfo = initInfo(myUserId);
const vm = new Vue({
  el: "#zhiyu",
  data() {
    return {
      myUserAvatarURL: this.$baseurl + myUserInfo.avatar,
      activeName: "recommend",
      voteNum: 133,
      questionNum: 22,
      follows: myUserInfo.followingsCount,
      followers: myUserInfo.followersCount,
      questionAsked: "",
      isShowAsk: false,
      form: {
        question: "",
        description: "",
      },
      formLabelWidth: "120px",
    };
  },
  methods: {
    handleClick(tab, event) {
      //console.log(tab, event);
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
    seeFollow() {
      this.activeName = "follow";
    },
    seeFan() {
      this.activeName = "fan";
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
    "list-item-hot": {
      props: ["item", "index"],
      template: "#list-item-hot",
      data() {
        return {};
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
        url: "http://47.100.62.222:80/user/" + myUserId + "/followings",
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
        url: "http://47.100.62.222:80/user/" + myUserId + "/followers",
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
    recommends() {
      let recommends = [
        {
          title: "如何看待知乎",
          description: "知裕知乎知裕知乎知裕知乎知裕知乎",
          voteNum: 11,
        },
        {
          title: "如何看待知裕",
          description: "知裕知乎知裕知乎知裕知乎知裕知乎",
          voteNum: 8,
        },
      ];
      // $.ajax({
      //   type: "GET",
      //   async: false,
      //   url: "http://47.100.62.222:80/user/" + myUserId + "/followers",
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
      //       fans = result.data.followers;
      //       console.log(fans);
      //     } else if (result.code == 10501) {
      //       alert("userId非法！");
      //     }
      //   },
      // });
      return recommends;
    },
    hots() {
      let hots = [
        {
          title: "如何看待知乎",
          description:
            "知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎",
          voteNum: 11,
        },
        {
          title: "如何看待知裕",
          description: "知裕知乎知裕知乎知裕知乎知裕知乎",
          voteNum: 8,
        },
      ];
      // $.ajax({
      //   type: "GET",
      //   async: false,
      //   url: "http://47.100.62.222:80/user/" + myUserId + "/followers",
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
      //       fans = result.data.followers;
      //       console.log(fans);
      //     } else if (result.code == 10501) {
      //       alert("userId非法！");
      //     }
      //   },
      // });
      return hots;
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
