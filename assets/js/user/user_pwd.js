$(function () {
  //验证表单
  const form = layui.form;
  form.verify({
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    samePwd: function (value) {
      if (value === $("[name=oldPwd]").val()) {
        return "新旧密码不能相同！";
      }
    },
    rePwd: function (value) {
      if (value !== $("[name=newPwd]").val()) {
        return "两次密码不一致！";
      }
    },
  });
  //监听表单的提交行为
  $(".layui-form").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/updatepwd",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layui.layer.msg("重置密码失败！");
        }
        layui.layer.msg("重置密码成功！");
        //重置表单,转换为DOM元素，调用reset方法
        $(".layui-form")[0].reset();
      },
    });
  });
});
