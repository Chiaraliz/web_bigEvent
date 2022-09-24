$(function () {
  const form = layui.form;
  const layer = layui.layer;
  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return "昵称长度必须在 1 ~ 6 个字符之间！";
      }
    },
  });
  initUserinfo();
  //初始化用户信息
  function initUserinfo() {
    $.ajax({
      method: "GET",
      url: "/my/userinfo",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取用户信息失败！");
        } else {
          //调用form.val()快速为表单赋值
          form.val("formUserInfo", res.data);
        }
      },
    });
  }

  //为重置按钮绑定事件
  $(".btnReset").on("click", function (e) {
    //阻止表单默认清空行为
    e.preventDefault;
    //重新初始化用户信息
    initUserinfo();
  });

  //监听表单的提交行为
  $(".layui-form").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/userinfo",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("更新用户信息失败！");
        } else {
          layer.msg("更新用户信息成功！");
          //调用父页面中渲染用户信息的方法,重新渲染用户信息和头像
          window.parent.getUserinfo();
        }
      },
    });
  });
});
