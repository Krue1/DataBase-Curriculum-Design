let token = localStorage.getItem("token");
let myUserId = window.localStorage.getItem("myUserId");
let myUserInfo = initInfo(myUserId);
let questionId = window.localStorage.getItem("questionId");
let questionInfo = {
  id: 11,
  title: "如何看待zhiyu_5678其人？",
  description: "如何看待zhiyu_5678其人，何许人也",
  datetime: "2020-06-23 15:39:19",
  likeNumber: 0,
};
$.ajax({
  type: "GET",
  dataType: "json",
  async: false,
  url: "http://localhost/question/" + questionId,
  headers: {
    //请求头
    Authorization: token, //登录获取的token (String)
  },
  success: function (result) {
    if (result.code == 00000) {
      questionInfo = result.data;
    } else if (result.code == 10501) {
      alert("questionId非法！");
    }
  },
});

const vm = new Vue({
  el: "#question",
  data() {
    return {
      myUserAvatarURL: this.$baseurl + myUserInfo.avatar,
      myUsername: myUserInfo.nickname,
      questionAsked: "",
      isShowAsk: false,
      question: questionInfo.title,
      description: questionInfo.description,
      questionLikeNumber: questionInfo.likeNumber,
      questionDatetime: questionInfo.datetime,
      isLikeQuestion: questionInfo.like,
      form: {
        question: "",
        description: "",
      },
      formLabelWidth: "120px",
      dmList: [],
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
    "list-item-answer": {
      props: ["item"],
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
          for (let i = 0; i < this.commentList.length; i++) {
            if (this.commentList[i].id === id) {
              this.commentReplyList = this.commentList[i].commentReplyList;
              break;
            }
          }
          console.log(this.commentReplyList);
          // this.isShowCommentDialog = true;
        },
        sendReply(commentId, repliedId) {
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
                alert("回复成功！");
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
    "hot-question": {
      props: ["item"],
      template: "#hot-question",
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
                _self.form.content = "";
              }
            },
          });
        },
      },
    },
  },
  methods: {
    handleCommand(command) {
      if (command === "a") {
        window.localStorage.setItem("userId", myUserId);
        window.location.href = "../html/homepage.html";
      } else if (command === "b") {
        window.localStorage.clear();
        window.location.href = "../html/login.html";
      }
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
    toAnswer() {
      window.location.href = "../html/answer.html";
    },
    likeQuestion() {
      $.ajax({
        type: "POST",
        url: "http://127.0.0.1/question/like",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(questionId),
        headers: {
          //请求头
          Authorization: token, //登录获取的token (String)
        },
        success: function (result) {
          if (result.code == 00000) {
            alert("点赞成功");
            window.location.reload();
          }
        },
      });
    },
    cancleLikeQuestion() {
      $.ajax({
        type: "DELETE",
        url: "http://127.0.0.1/question/like",
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify(questionId),
        headers: {
          //请求头
          Authorization: token, //登录获取的token (String)
        },
        success: function (result) {
          if (result.code == 00000) {
            alert("取消点赞成功");
            window.location.reload();
          }
        },
      });
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
  },
  computed: {
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
        url: "http://localhost/answer/from_question/" + questionId,
        headers: {
          //请求头
          Authorization: token, //登录获取的token (String)
        },
        success: function (result) {
          if (result.code == 00000) {
            answers = result.data.answerInfoDTOList;
          } else if (result.code == 10501) {
            alert("参数非法！");
          }
        },
      });
      return answers;
    },
    hots() {
      let hots = [];
      $.ajax({
        type: "GET",
        async: false,
        url: "http://127.0.0.1/hot",
        success: function (result) {
          if (result.code == 00000) {
            hots = result.data.hotQuestionList;
            hots = hots.slice(0, 5);
          } else {
            alert("非法！");
          }
        },
      });
      return hots;
    },
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
