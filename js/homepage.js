let token = localStorage.getItem("token");
let myUserId = window.localStorage.getItem("myUserId");
let myUserInfo = initInfo(myUserId);
let userId = window.localStorage.getItem("userId");
let userInfo = initInfo(userId);
console.log(userInfo);
const vm = new Vue({
  el: "#homepage",
  data() {
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
      PageSize: 1,
      fanCurrentPage: 1,
      fans: [],
      followCurrentPage: 1,
      followings: [],
    };
  },
  mounted: function () {
    let _self = this;
    $.ajax({
      type: "GET",
      async: false,
      // url: "http://47.100.62.222:80/user/" + userId + "/followers",
      url: "http://localhost/user/" + userId + "/followers",
      headers: {
        //请求头
        Authorization: token, //登录获取的token (String)
      },
      data: {
        offset: 0,
        limit: this.PageSize,
      },
      success: function (result) {
        if (result.code == 00000) {
          _self.fans = result.data.followers;
        } else if (result.code == 10501) {
          alert("userId非法！");
        }
      },
    });
    // this.fans = this.getFan(this.fanCurrentPage, this.PageSize);
    $.ajax({
      type: "GET",
      async: false,
      // url: "http://47.100.62.222:80/user/" + userId + "/followings",
      url: "http://127.0.0.1/user/" + userId + "/followings",
      headers: {
        //请求头
        Authorization: token, //登录获取的token (String)
      },
      data: {
        offset: 0,
        limit: this.PageSize,
      },
      success: function (result) {
        if (result.code == 00000) {
          _self.followings = result.data.followings;
          console.log(result.data);
        } else if (result.code == 10501) {
          alert("userId非法！");
        }
      },
    });
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
    editProfile() {
      window.location.href = "editProfile.html";
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
          } else if (result.code == 10501) {
            alert("用户id非法");
          } else if (result.code == 10601) {
            alert("插入数据失败");
          }
        },
      });
      isShowAsk = false;
    },
    follow() {
      $.ajax({
        type: "POST",
        // url: "http://47.100.62.222:80/user/" + userId + "/followers",
        url: "http://localhost/user/" + userId + "/followers",
        headers: {
          //请求头
          Authorization: token, //登录获取的token (String)
        },
        success: function (result) {
          if (result.code == 00000) {
            alert("关注成功");
            window.location.reload();
          } else if (result.code == 10501) {
            alert("用户id非法");
          }
        },
      });
    },
    cancleFollow() {
      $.ajax({
        type: "DELETE",
        // url: "http://47.100.62.222:80/user/" + userId + "/followers",
        url: "http://localhost/user/" + userId + "/followers",
        headers: {
          //请求头
          Authorization: token, //登录获取的token (String)
        },
        success: function (result) {
          if (result.code == 00000) {
            alert("取消关注成功");
            window.location.reload();
          } else if (result.code == 10501) {
            alert("用户id非法");
          }
        },
      });
    },
    getFan(currentPage, pageSize) {
      fans = [];
      $.ajax({
        type: "GET",
        async: false,
        // url: "http://47.100.62.222:80/user/" + userId + "/followers",
        url: "http://localhost/user/" + userId + "/followers",
        headers: {
          //请求头
          Authorization: token, //登录获取的token (String)
        },
        data: {
          offset: (currentPage - 1) * pageSize,
          limit: pageSize,
        },
        success: function (result) {
          if (result.code == 00000) {
            fans = result.data.followers;
          } else if (result.code == 10501) {
            alert("userId非法！");
          }
        },
      });
      return fans;
    },
    fanHandleCurrentChange(val) {
      this.fanCurrentPage = val;
      this.fans = this.getFan(val, this.PageSize);
    },
    getFollowings(currentPage, pageSize) {
      followings = [];
      $.ajax({
        type: "GET",
        async: false,
        // url: "http://47.100.62.222:80/user/" + userId + "/followings",
        url: "http://localhost/user/" + userId + "/followings",
        headers: {
          //请求头
          Authorization: token, //登录获取的token (String)
        },
        data: {
          offset: (currentPage - 1) * pageSize,
          limit: pageSize,
        },
        success: function (result) {
          if (result.code == 00000) {
            // vm.followings = result.data.followings;
            followings = result.data.followings;
            return result.data.followings;
          } else if (result.code == 10501) {
            alert("userId非法！");
          }
        },
      });
      return followings;
    },
    followHandleCurrentChange(val) {
      this.followCurrentPage = val;
      this.followings = this.getFollowings(val, this.PageSize);
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
            // url: "http://47.100.62.222:80/user/" + item.id + "/followers",
            url: "http://localhost/user/" + item.id + "/followers",
            headers: {
              //请求头
              Authorization: token, //登录获取的token (String)
            },
            success: function (result) {
              if (result.code == 00000) {
                alert("关注成功");
                window.location.reload();
              } else if (result.code == 10501) {
                alert("用户id非法");
              }
            },
          });
        },
        cancleFollow(item) {
          $.ajax({
            type: "DELETE",
            // url: "http://47.100.62.222:80/user/" + item.id + "/followers",
            url: "http://localhost/user/" + item.id + "/followers",
            headers: {
              //请求头
              Authorization: token, //登录获取的token (String)
            },
            success: function (result) {
              if (result.code == 00000) {
                alert("取消关注成功");
                window.location.reload();
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
    "list-item-ask": {
      props: ["item"],
      template: "#list-item-ask",
      data() {
        return {};
      },
      methods: {},
    },
    "list-item-answer": {
      props: ["item"],
      template: "#list-item-answer",
      data() {
        return {};
      },
      methods: {},
    },
  },
  computed: {
    // followings() {
    //   let followings = [
    //     {
    //       id: 22,
    //       nickname: "dd",
    //       brief: "ss",
    //       answersCount: 2,
    //       followersCount: 3,
    //       avatar: "../img/avatar.jpg",
    //       isFollowing: true,
    //       isFollowed: true,
    //     },
    //   ];
    //   $.ajax({
    //     type: "GET",
    //     async: false,
    //     url: "http://47.100.62.222:80/user/" + userId + "/followings",
    //     // url: "http://127.0.0.1/user/" + userId + "/followings",
    //     headers: {
    //       //请求头
    //       Authorization: token, //登录获取的token (String)
    //     },
    //     data: {
    //       offset: 0,
    //       limit: 5,
    //     },
    //     success: function (result) {
    //       if (result.code == 00000) {
    //         followings = result.data.followings;
    //         console.log(followings);
    //       } else if (result.code == 10501) {
    //         alert("userId非法！");
    //       }
    //     },
    //   });
    //   return followings;
    // },
    // fans() {
    //   let fans = [
    //     {
    //       id: 22,
    //       nickname: "dd",
    //       brief: "ss",
    //       answersCount: 2,
    //       followersCount: 3,
    //       avatar: "../img/avatar.jpg",
    //       isFollowing: true,
    //       isFollowed: true,
    //     },
    //   ];
    //   $.ajax({
    //     type: "GET",
    //     async: false,
    //     url: "http://47.100.62.222:80/user/" + userId + "/followers",
    //     headers: {
    //       //请求头
    //       Authorization: token, //登录获取的token (String)
    //     },
    //     data: {
    //       offset: 0,
    //       limit: 5,
    //     },
    //     success: function (result) {
    //       if (result.code == 00000) {
    //         console.log(fans);
    //         fans = result.data.followers;
    //       } else if (result.code == 10501) {
    //         alert("userId非法！");
    //       }
    //     },
    //   });
    //   return fans;
    // },
    asks() {
      let asks = [
        {
          title: "如何看待知裕？",
          time: "2020-06-20",
          answersCount: "3",
        },
      ];
      // $.ajax({
      //   type: "GET",
      //   async: false,
      //   url: "http://47.100.62.222:80/user/" + userId + "/followers",
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
      //       asks = result.data.followers;
      //       console.log(asks);
      //     } else if (result.code == 10501) {
      //       alert("userId非法！");
      //     }
      //   },
      // });
      return asks;
    },
    answers() {
      let answers = [
        {
          title: "如何看待知裕？",
          nickname: "BB",
          brief: "专业搬砖",
          content: "rrrrrdd发发发发",
          avatar: "../img/avatar.jpg",
          voteNum: 44,
          commentNum: 2,
        },
        {
          title: "如何看待知裕？",
          nickname: "BB",
          brief: "专业搬砖",
          content: "rrrrrdd发发发发",
          avatar: "../img/avatar.jpg",
          voteNum: 44,
          commentNum: 2,
        },
      ];
      // $.ajax({
      //   type: "GET",
      //   async: false,
      //   url: "http://47.100.62.222:80/user/" + userId + "/followers",
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
      //       answers = result.data.followers;
      //       console.log(answers);
      //     } else if (result.code == 10501) {
      //       alert("userId非法！");
      //     }
      //   },
      // });
      return answers;
    },
  },
});

//测试用
function follow(id) {
  $.ajax({
    type: "POST",
    // url: "http://47.100.62.222:80/user/" + id + "/followers",
    url: "http://localhost/user/" + id + "/followers",
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
    // url: "http://47.100.62.222:80/user/" + id + "/followers",
    url: "http://localhost/user/" + id + "/followers",
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
// follow(10);
// follow(18);
