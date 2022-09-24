$(function () {
  const layer = layui.layer;
  const form = layui.form;
  //获取文章列表
  getArticleList();

  let indexAdd = null;
  //为【添加类别】按钮绑定事件
  $("#btnAdd").on("click", function () {
    //打开弹出层
    indexAdd = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "添加文章分类",
      content: $("#dialog-add").html(),
    });
  });

  function getArticleList() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        const htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
      },
    });
  }

  //通过代理的形式，为【添加分类】表单绑定submit事件
  $("body").on("submit", "#form-add", function () {
    $.ajax({
      method: "POST",
      url: "/my/article/addcates",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("添加分类失败！");
        }
        layer.msg("添加分类成功！");
        getArticleList();
        layer.close(indexAdd);
      },
    });
  });
  let indexEdit = null;
  //通过代理的形式，为【编辑】按钮绑定点击事件
  $("tbody").on("click", "#btn-edit", function () {
    //打开弹出层
    indexEdit = layer.open({
      type: 1,
      area: ["500px", "250px"],
      title: "修改文章分类",
      content: $("#dialog-edit").html(),
    });
    //根据点击的分类Id获取分类数据
    const id = $(this).attr("data-Id");
    $.ajax({
      method: "GET",
      url: "/my/article/cates/" + id,
      success: function (res) {
        //根据获取的数据填充表单
        form.val("form-edit", res.data);
      },
    });
  });

  //通过代理的形式，为【修改分类】表单绑定提交事件
  $("body").on("submit", "#form-edit", function () {
    $.ajax({
      method: "POST",
      url: "/my/article/updatecate",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("修改分类数据失败！");
        }
        layer.msg("修改分类数据成功！");
        getArticleList();
        layer.close(indexEdit);
      },
    });
  });

  //通过代理的形式，为【删除】按钮绑定点击事件
  $("tbody").on("click", "#btn-delate", function () {
    //弹出确认框
    layer.confirm("确认删除?", { icon: 3, title: "提示" }, function (index) {
      const id = $(this).attr("data-Id");
      $.ajax({
        method: "POST",
        url: "/my/article/deletecate/" + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg("删除分类失败！");
          }
          layer.msg("删除分类成功！");
          layer.close(index);
          getArticleList();
        },
      });
    });
  });
});
