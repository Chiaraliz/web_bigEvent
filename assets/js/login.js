// 点击去注册
$("#link_reg").on("click", function () {
  $(".login-box").hide();
  $(".reg-box").show();
});

//点击去注册
$("#link_login").on("click", function () {
  $(".login-box").show();
  $(".reg-box").hide();
});

//从layui中获取form
const form = layui.form;
const layer = layui.layer;
//通过form.verify()函数自定义校验规则
form.verify({
  pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
  repwd: function (value) {
    const pwd = $(".reg-box [name=password]").val();
    if (value !== pwd) {
      return "两次密码不一致";
    }
  },
});

//监听注册表单的提交事件
$("#form_reg").on("submit", function (e) {
  //阻止表单的默认提交行为
  e.preventDefault();
  //获取表单数据
  const data = {
    username: $("#form_reg [name=username]").val(),
    password: $("#form_reg [name=password]").val(),
  };
  //发起Ajax请求
  $.post("/api/reguser", data, function (res) {
    if (res.status !== 0) {
      return layer.msg(res.message);
    }
    layer.msg("注册成功，请登录！");
    // 手动调用点击行为
    $("#link_login").click();
  });
});

//监听登录表单的提交事件
$("#form_login").submit(function (e) {
  e.preventDefault();
  $.ajax({
    url: "/api/login",
    method: "POST",
    data: $(this).serialize(),
    success: function (res) {
      if (res.status !== 0) {
        return layer.msg("登录失败！");
      }
      layer.msg("登录成功！");
      //   存储token值
      localStorage.setItem("token", res.token);
      //   跳转页面
      location.href("/index.html");
    },
  });
});
