Vue.prototype.$baseurl = "http://47.100.62.222:80";
Vue.prototype.$isShowAsk = false;

// Vue.component("my-header", {
//   template: `<header role="banner" class="AppHeader">
//     <div class="AppHeader-inner">
//       <a href="zhiyu.html"><img src="../img/logo.png" /></a>
//       <ul role="navigation" class="AppHeader-tabs">
//         <li><a href="zhiyu.html">首页</a></li>
//         <li><a href="#">发现</a></li>
//         <li><a href="#">等你来答</a></li>
//         <li>
//           <el-input v-model="questionAsked" placeholder="搜索你的问题" size="small" class="inlist-block"></el-input>
//         </li>
//         <li>
//           <el-button type="primary" class="inlist-block" size="small" @click="isShowAsk = true">
//             提问
//           </el-button>
//         </li>
//       </ul>
//       <el-dropdown @command="handleCommand">
//         <div class="el-dropdown-link AppHeader-inner-avatar">
//           <img :src="myUserAvatarURL" />
//         </div>
//         <el-dropdown-menu slot="dropdown">
//           <el-dropdown-item command="a">我的主页</el-dropdown-item>
//           <el-dropdown-item command="b">退出</el-dropdown-item>
//         </el-dropdown-menu>
//       </el-dropdown>
//       <!-- <a href="../html/homepage.html" class="AppHeader-inner-avatar"
//         onclick="window.localStorage.setItem('userId', myUserId);">
//         <img :src="myUserAvatarURL" />
//       </a> -->
//     </div>
//   </header>`,
//   data() {
//     return {
//       questionAsked: "",
//     };
//   },
//   props: ["myUserAvaterURL"],
// });
