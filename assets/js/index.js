$(function () {
  //获取并渲染用户信息
  getUserinfo();
  //为退出按钮绑定事件
  $(".btnLogOut").on("click", function () {
    const layer = layui.layer;
    layer.confirm("确认退出?", { icon: 3, title: "提示" }, function (index) {
      //清空本地存储中的token
      localStorage.removeItem("token");
      //跳转到登录页面
      location.href = "/login.html";
      //关闭confirm询问框
      layer.close(index);
    });
  });
});

//封装获取用户信息的函数
function getUserinfo() {
  //发起ajax请求
  $.ajax({
    method: "GET",
    url: "/my/userinfo",
    // headers: {
    //   Authorization: localStorage.getItem("token") || "",
    // },
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg("获取用户信息失败！");
      } else {
        //调用渲染用户头像的函数
        renderUserAvatar(res.data);
      }
    },
    // //不论成功还是失败都会调用这个函数
    // complete: function (res) {
    //   if (
    //     res.responseJSON.status === 1 &&
    //     res.responseJSON.msg === "身份认证失败！"
    //   ) {
    //     //清空token
    //     localStorage.removeItem("token");
    //     //强制跳转回login
    //     location.href = "/login.html";
    //   }
    // },
  });
}
//封装渲染用户头像的函数
function renderUserAvatar(user) {
  //1.获取用户昵称
  const name = user.nickname || user.username;
  //2.渲染欢迎标识
  $(".welcome").html(`欢迎 ${name}`);
  //3.渲染用户头像
  if (!user.user_pic) {
    //3.1渲染图片头像
    $(".layui-nav-img").attr("src", user.user_pic), show();
    $(".text-avatar").hide();
  } else {
    //3.2渲染文本头像
    $(".layui-nav-img").hide();
    const first = name[0].toUpperCase();
    $(".text-avatar").html(first).show();
  }
}
