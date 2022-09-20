//每次调用$.get()或$.post()或$.ajax()函数之前都会先调用这个函数
//这个函数中可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
  //在这个函数中统一拼接请求的根路径
  options.url = "http://ajax.frontend.itheima.net" + options.url;
});
