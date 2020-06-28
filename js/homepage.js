let token = localStorage.getItem("token");
let myUserId = window.localStorage.getItem("myUserId");
let myUserInfo = initInfo(myUserId);
let userId = window.localStorage.getItem("userId");
let userInfo = initInfo(userId);
const vm = new Vue({
  el: "#homepage",
  data() {
    return {
      userId: userId,
      userInfo: userInfo,
      userAvatarURL: this.$baseurl + userInfo.avatar,
      myUserAvatarURL: this.$baseurl + myUserInfo.avatar,
      activeName: "answer",
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
    searchQuestion() {
      window.localStorage.setItem("questionAsked", this.questionAsked);
      window.location.href = "../html/search.html";
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
      props: ["item", "user_info"],
      template: "#list-item-answer",
      data() {
        return {
          //利用组件的v-if="refresh"来控制其重新渲染，
          //watch监视stateChange的变化来改变refresh=false,next-tick=true使其重新渲染
          //changedId记录需要重新组件的id，然后用updated钩子让markdown再转html
          refresh: true,
          stateChange: 0,
          changedId: 1,

          isShowCommentDialog: false,
          isShowReplyDialog: false,
          commentList: [],
          commentReplyList: [],
          isShowReplyInput: false,
          replyContent: "",
          commentContent: "",

          //控制每个评论的回复输入栏显示与否
          //当点击“回复”按钮，showedReplyId就为该评论的id，isShowReplyInput为true
          //每个评论下面的回复输入栏v-show="isShowReplyInput && showedReplyId === comment.id"
          //如此这样就能控制仅当前评论的回复输入栏显示，“取消回复”按钮亦然
          //而“回复”按钮的v-show="!isShowReplyInput || showedReplyId !== comment.id"
          //当我点开一个回复输入栏，而对应的评论id不是展开回复输入栏的评论的id，则依然显示“回复”按钮
          showedReplyId: -1,
        };
      },
      methods: {
        toQuestion(id) {
          window.localStorage.setItem("questionId", id);
        },
        like(id) {
          let _self = this;
          $.ajax({
            type: "POST",
            url: "http://localhost/answer/like",
            contentType: "application/json",
            data: JSON.stringify(id),
            headers: {
              //请求头
              Authorization: token, //登录获取的token (String)
            },
            success: function (result) {
              if (result.code == 00000) {
                _self.item.like = true;
                _self.item.likeNumber++;
                _self.stateChange++;
                _self.changedId = id;
              } else if (result.code == 10501) {
                alert("回答id非法");
              }
            },
          });
        },
        dislike(id) {
          let _self = this;
          $.ajax({
            type: "DELETE",
            url: "http://localhost/answer/like",
            contentType: "application/json",
            data: JSON.stringify(id),
            headers: {
              //请求头
              Authorization: token, //登录获取的token (String)
            },
            success: function (result) {
              if (result.code == 00000) {
                _self.item.like = false;
                _self.item.likeNumber--;
                _self.stateChange++;
                _self.changedId = id;
              } else if (result.code == 10501) {
                alert("回答id非法");
              }
            },
          });
        },
        toUserHomepage(id) {
          window.localStorage.setItem("userId", id);
        },
        openCommentDialog(id) {
          let _self = this;
          $.ajax({
            type: "GET",
            url: "http://localhost/comment/from_answer/" + id,
            success: function (result) {
              if (result.code == 00000) {
                _self.commentList = result.data.commentList;
              } else if (result.code == 10501) {
                alert("回答id非法");
              }
            },
          });
          this.isShowCommentDialog = true;
        },
        showReplyInput(id) {
          this.showedReplyId = id;
          this.isShowReplyInput = true;
        },
        showReplyDialog(id) {
          this.commentReplyList = [];
          let tempId = 0;
          //找到回复列表对应的评论
          for (let i = 0; i < this.commentList.length; i++) {
            if (this.commentList[i].id === id) {
              this.commentReplyList = this.commentList[i].commentReplyList;
              tempId = i;
              break;
            }
          }
          //在该评论的回复列表中查找，每个回复对应的被回复人的名字
          //首先看是不是针对评论发起的回复
          //如果不是，再查repliedId对应哪个回复，从而查询到被回复人的名字
          for (let i = 0; i < this.commentReplyList.length; i++) {
            if (
              this.commentReplyList[i].repliedId === this.commentList[tempId].id
            ) {
              this.commentReplyList[i].repliedNickname = this.commentList[
                tempId
              ].user.nickname;
              continue;
            }
            for (let j = 0; j < this.commentReplyList.length; j++) {
              if (
                this.commentReplyList[i].repliedId ===
                this.commentReplyList[j].id
              ) {
                this.commentReplyList[i].repliedNickname = this.commentList[
                  j
                ].user.nickname;
                break;
              }
            }
          }
          this.isShowReplyDialog = true;
        },
        sendReply(commentId, repliedId) {
          let _self = this;
          $.ajax({
            type: "POST",
            url: "http://localhost/comment/reply_to_comment",
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
            data: JSON.stringify({
              commentId: commentId,
              repliedId: repliedId,
              content: this.replyContent,
            }),
            success: function (result) {
              if (result.code == 00000) {
                for (let i = 0; i < _self.commentReplyList.length; i++) {
                  if (result.data.repliedId === _self.commentReplyList[i].id) {
                    result.data.repliedNickname =
                      _self.commentReplyList[i].user.nickname;
                  }
                }
                _self.commentReplyList.push(result.data);
                //强制commentList进行响应式更新
                _self.commentList.push({});
                _self.commentList.pop();
                _self.replyContent = "";
                _self.isShowReplyInput = false;
              } else if (result.code == 10501) {
                alert("回答id非法");
              }
            },
          });
        },
        sendComment(answerId) {
          let _self = this;
          $.ajax({
            type: "POST",
            url: "http://localhost/comment/add_to_answer",
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
            data: JSON.stringify({
              answerId: answerId,
              content: this.commentContent,
            }),
            success: function (result) {
              if (result.code == 00000) {
                _self.commentList.push(result.data);
                _self.commentContent = "";
              } else if (result.code == 10501) {
                alert("回答id非法");
              }
            },
          });
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
      mounted: function () {
        md2html(this.item.id);
      },
      updated: function () {
        md2html(this.changedId);
      },
    },
    // "list-item-answer": {
    //   props: ["item"],
    //   template: "#list-item-answer",
    //   data() {
    //     return {};
    //   },
    //   methods: {
    //     toQuestion(id) {
    //       window.localStorage.setItem("questionId", id);
    //     },
    //   },
    // },
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
      $.ajax({
        type: "GET",
        async: false,
        url: "http://localhost/question/from_user/" + userId,
        success: function (result) {
          if (result.code == 00000) {
            asks = result.data.questionList;
          } else if (result.code == 10501) {
            alert("userId非法！");
          }
        },
      });
      return asks;
    },
    answers() {
      let answers = [
        {
          id: 16,
          content: "有zhiyu_5678这个人吗？",
          datetime: "2020-06-25 10:53:05",
          author: {
            id: 10,
            nickname: "Newgate",
            gender: 1,
            avatar: "/img/avatar/default_avatar.png",
            brief: "22255566",
            introduction: "5555",
            habitation: "222",
            profession: "搬砖",
            education: "3",
            account: {
              id: 15,
              username: "abc124",
              password: "abc124",
            },
          },
          question: null,
          like: true,
          likeNumber: 41,
        },
      ];
      $.ajax({
        type: "GET",
        async: false,
        url: "http://localhost/answer/from_user/" + userId,
        headers: {
          //请求头
          Authorization: token, //登录获取的token (String)
        },
        success: function (result) {
          if (result.code == 00000) {
            answers = result.data.answerList;
          } else if (result.code == 10501) {
            alert("参数非法！");
          }
        },
      });
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
