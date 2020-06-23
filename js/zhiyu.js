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
    "list-item-recommend": {
      props: ["item"],
      template: "#list-item-recommend",
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
          id: 1,
          title: "如何看待知乎",
          nickname: "汪汪汪",
          description:
            "知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎",
          likeNumber: 11,
          datetime: "2020-06-14",
          commentNum: 45,
          isLike: true,
        },
        {
          id: 2,
          title: "如何看待知乎?",
          nickname: "搬砖工",
          description: "知裕知乎知裕知乎",
          likeNumber: 14,
          datetime: "2020-06-14",
          commentNum: 22,
          isLike: false,
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
          id: 1,
          title: "如何看待知乎",
          description:
            "知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎知裕知乎",
          likeNumber: 11,
          datetime: "2020-06-14",
        },
        {
          id: 2,
          title: "如何看待知乎?",
          description: "知裕知乎知裕知乎",
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
            console.log(hots);
          } else {
            alert("非法！");
          }
        },
      });
      return hots;
    },
  },
});
