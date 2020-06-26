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
          commentList: [
            {
              id: 1,
              content: "答得好！点赞了",
              datetime: "2020-06-26 09:02:25",
              user: {
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
              commentReplyList: [
                {
                  id: 11,
                  content: "你的牌打得忒好了",
                  datetime: "2020-06-26 12:44:06",
                  user: {
                    id: 19,
                    nickname: "zhiyu_掌门人",
                    gender: 0,
                    avatar: "/img/avatar/default_avatar.jpg",
                    brief: "知裕从哪里来，到哪里去",
                    introduction: "",
                    habitation: "",
                    profession: "知裕业",
                    education: "",
                    account: {
                      id: 25,
                      username: "abc127",
                      password: "abc127",
                    },
                  },
                  repliedId: 1,
                },
                {
                  id: 12,
                  content: "我的牌确实打得好",
                  datetime: "2020-06-26 13:16:24",
                  user: {
                    id: 17,
                    nickname: "abc125 Id=17",
                    gender: 1,
                    avatar: "/img/avatar/default_avatar.png",
                    brief: "专注睡觉50年",
                    introduction: "",
                    habitation: "",
                    profession: "睡觉大业",
                    education: "",
                    account: {
                      id: 23,
                      username: "abc125",
                      password: "abc125",
                    },
                  },
                  repliedId: 11,
                },
              ],
            },
            {
              id: 3,
              content: "答主这么强",
              datetime: "2020-06-26 10:26:21",
              user: {
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
              commentReplyList: [],
            },
            {
              id: 5,
              content: "我愿称你为最强！",
              datetime: "2020-06-26 11:23:20",
              user: {
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
              commentReplyList: [],
            },
            {
              id: 6,
              content: "我是id===19",
              datetime: "2020-06-26 11:40:42",
              user: {
                id: 19,
                nickname: "zhiyu_掌门人",
                gender: 0,
                avatar: "/img/avatar/default_avatar.jpg",
                brief: "知裕从哪里来，到哪里去",
                introduction: "",
                habitation: "",
                profession: "知裕业",
                education: "",
                account: {
                  id: 25,
                  username: "abc127",
                  password: "abc127",
                },
              },
              commentReplyList: [],
            },
          ],
          commentReplyList: [],
          isShowReplyInput: false,
          replyContent: "",
          commentContent: "",
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
        {
          id: 17,
          content:
            "![](http://t8.baidu.com/it/u=2247852322,986532796&fm=79&app=86&size=h300&n=0&g=4n&f=jpeg?sec=1593659788&t=30cb2fbdb1e77a81aa45f95c7a25a80b)",
          datetime: "2020-06-25 11:16:54",
          author: {
            id: 19,
            nickname: "zhiyu_掌门人",
            gender: 0,
            avatar: "/img/avatar/default_avatar.jpg",
            brief: "知裕从哪里来，到哪里去",
            introduction: "",
            habitation: "",
            profession: "知裕业",
            education: "",
            account: {
              id: 25,
              username: "abc127",
              password: "abc127",
            },
          },
          question: null,
          like: false,
          likeNumber: 2,
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
            console.log(answers);
          } else if (result.code == 10501) {
            alert("参数非法！");
          }
        },
      });
      return answers;
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
      ];
      $.ajax({
        type: "GET",
        async: false,
        // url: "http://47.100.62.222:80/hot",
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
