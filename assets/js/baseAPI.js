//每次调用$.get()或$.post()或$.ajax()函数之前都会先调用这个函数
//这个函数中可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
  //在这个函数中统一拼接请求的根路径
  options.url = "http://ajax.frontend.itheima.net" + options.url;
  //统一为有权限的请求配置请求头
  if (options.url.indexOf("/my/") !== -1) {
    options.headers = 'Authorization: localStorage.getItem("token") || ""';
  }

  //全局统一挂载complete函数
  options.complete = function (res) {
    if (
      res.responseJSON.status === 1 &&
      res.responseJSON.msg === "身份认证失败！"
    ) {
      //清空token
      localStorage.removeItem("token");
      //强制跳转回login
      location.href = "/login.html";
    }
  },
});
