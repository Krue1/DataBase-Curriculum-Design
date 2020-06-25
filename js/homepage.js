let token = localStorage.getItem("token");
let myUserId = window.localStorage.getItem("myUserId");
let myUserInfo = initInfo(myUserId);
let userId = window.localStorage.getItem("userId");
let userInfo = initInfo(userId);
const vm = new Vue({
  el: "#homepage",
  data() {
    return {
      userAvatarURL: this.$baseurl + userInfo.avatar,
      myUserAvatarURL: this.$baseurl + myUserInfo.avatar,
      activeName: "activity",
      username: userInfo.nickname,
      myUsername: myUserInfo.nickname,
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
      PageSize: 2,
      fanCurrentPage: 1,
      fans: [],
      followCurrentPage: 1,
      followings: [],
      dmList: [
        {
          senderId: 18,
          nickname: "bb",
          avatar: "../img/avatar.jpg",
          uncheckedNums: 4,
        },
        {
          senderId: 17,
          nickname: "搬砖",
          avatar: "../img/avatar.jpg",
          uncheckedNums: 1,
        },
      ],
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
        } else if (result.code == 10501) {
          alert("userId非法！");
        }
      },
    });
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
    defriend() {
      $.ajax({
        type: "POST",
        url: "http://localhost/defriend",
        headers: {
          //请求头
          Authorization: token, //登录获取的token (String)
        },
        data: {
          userId: userId,
        },
        success: function (result) {
          if (result.code == 00000) {
            alert("拉黑成功");
          } else if (result.code == 10501) {
            alert("userId非法！");
          }
        },
      });
    },
    cancleDefriend() {
      $.ajax({
        type: "DELETE",
        url: "http://localhost/defriend",
        headers: {
          //请求头
          Authorization: token, //登录获取的token (String)
        },
        data: {
          userId: userId,
        },
        success: function (result) {
          if (result.code == 00000) {
            alert("取消拉黑成功");
          } else if (result.code == 10501) {
            alert("userId非法！");
          }
        },
      });
    },
  },
  components: {
    "list-item-follow": {
      props: ["item"],
      template: "#list-item-follow",
      data() {
        return {
          refresh: true,
          stateChange: 0,
        };
      },
      methods: {
        follow(item) {
          let _self = this;
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
                _self.item.following = true;
                _self.stateChange++;
                // window.location.reload();
              } else if (result.code == 10501) {
                alert("用户id非法");
              }
            },
          });
        },
        cancleFollow(item) {
          let _self = this;
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
                _self.item.following = false;
                _self.stateChange++;
                // window.location.reload();
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
      watch: {
        stateChange() {
          this.refresh = false;
          this.$nextTick(() => {
            this.refresh = true;
          });
        },
      },
    },
    "list-item-ask": {
      props: ["item"],
      template: "#list-item-ask",
      data() {
        return {};
      },
      methods: {
        toQuestion(id) {
          window.localStorage.setItem("questionId", id);
        },
      },
    },
    "list-item-answer": {
      props: ["item"],
      template: "#list-item-answer",
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
                console.log(_self.messages);
                _self.form.content = "";
              }
            },
          });
        },
      },
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
