$(function () {
  const layer = layui.layer;
  const form = layui.form;
  initCate();
  // 初始化富文本编辑器
  initEditor();
  // 1. 初始化图片裁剪器
  var $image = $("#image");
  // 2. 裁剪选项
  var options = { aspectRatio: 400 / 280, preview: ".img-preview" };
  // 3. 初始化裁剪区域
  $image.cropper(options);
  //定义初始化文章类别的函数
  function initCate() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("初始化文章类别失败！");
        }
        //调用模板引擎渲染数据
        const htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);
        //一定要记得调用form.render()方法重新渲染
        form.render();
      },
    });
  }
  //为【选择封面】按钮绑定点击事件处理函数
  $("#btnChoose").on("click", function () {
    $("#coverFile").click();
  });

  //监听文件选择框的change事件
  $("#coverFile").on("change", function (e) {
    //获取文件的数组
    const file = e.target.files;
    //检测用户是否选择了文件
    if (file.length === 0) return;
    //根据文件创建对应的URL地址
    const newImgURL = URL.createObjectURL(file[0]);
    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", newImgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });
  //定义文章的状态
  let art_state = "已发布";
  //为【存为草稿】按钮绑定点击事件
  $("#btnSave2").on("click", function () {
    art_state = "草稿";
  });

  //为表单绑定submit提交事件
  $("#form-pub").on("submit", function (e) {
    //阻止表单的默认提交行为
    e.preventDefault();
    //基于form表单，快速创建一个formData对象
    const fd = new FormData($("#form-pub")[0]);
    //将发布状态存入fd
    fd.append("state", art_state);
    //将封面裁剪过后的图片输出为一个文件对象
    $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        // 5. 将文件对象，存储到 fd 中
        fd.append("cover_img", blob);
        publishArticle(fd);
      });
  });

  //定义发布文章的函数
  function publishArticle(fd) {
    $.ajax({
      method: "POST",
      url: "/my/article/add",
      data: fd,
      //如果是FormData格式的数据，必须包含以下两项
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("发布文章失败！");
        }
        layer.msg("发布文章成功！");
        //跳转到文章列表页
        location.href = "/article/art_list.html";
      },
    });
  }
});
