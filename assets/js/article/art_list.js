$(function () {
  const layer = layui.layer;
  const form = layui.form;
  const laypage = layui.laypage;
  //定义一个查询的参数对象
  let q = {
    pagenum: 1, //页码值，默认请求第一页的数据
    pagesize: 2, //每页显示几条数据，默认为2
    cate_id: "", //文章分类的id
    state: "", //文章的发布状态
  };
  //初始化文章列表
  initArticleList();
  //初始化分类列表
  initCate();
  //通知layui重新渲染表单结构
  form.render();

  //通过代理的方式为删除按钮绑定点击事件
  $("tbody").on("click", "#btn-delate", function () {
    //点击删除按钮之后，先获得当前页面上删除按钮的个数
    const len = $("#btn-delate").length;
    //弹出确认框
    const id = $(this).attr("data-id");
    //eg1
    layer.confirm("确认删除?", { icon: 3, title: "提示" }, function (index) {
      $.ajax({
        method: "POST",
        url: "/my/article/delete/" + id,
        success: function (res) {
          if (res.status !== 0) return layer.msg("删除文章失败！");
          layer.msg("删除文章成功！");
          //此时需要判断删除之后这页上是否还有数据
          //如果没有数据，则需要让页码值先-1，再渲染页面
          if (len === 1) {
            //先判断此时页码值是否为1
            q.pagenum = q.pagenum === 1 ? q.pagenum : q.pagenum - 1;
          }
          initArticleList();
          layer.close(index);
        },
      });
    });
  });
  //封装初始化文章列表的函数
  function initArticleList() {
    $.ajax({
      method: "GET",
      url: "/my/article/list",
      data: q,
      success: function (res) {
        if (res.status !== 0) return layer.msg("获取文章列表失败！");
        layer.msg("获取文章列表成功！");
        const htmlStr = template("tpl-list", res);
        $("tbody").html(htmlStr);
        //渲染分页
        renderPage(res.total);
      },
    });
  }

  //定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);
    const y = padZero(dt.getFullYear());
    const m = padZero(dt.getMonth());
    const d = padZero(dt.getDate());
    const hh = padZero(dt.getHours());
    const mm = padZero(dt.getMinutes());
    const ss = padZero(dt.getSeconds());
    return `${y}-${m}-${d} ${hh}:${mm}:${ss} `;
  };

  //定义补零函数
  function padZero(n) {
    n > 9 ? n : "0" + n;
  }

  //定义初始化文章分类的函数
  function initCate() {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取文章分类失败！");
        }
        //调用模板引擎渲染分类
        const htmlStr = template("tpl-cate", res);
        $("[name=cate_id").html(htmlStr);
      },
    });
  }

  //定义渲染分页的方法
  function renderPage(total) {
    laypage.render({
      elem: "pageBox", //定义分页容器
      count: "total", //总数据条数
      limit: q.pagesize, //每页显示的数据条数
      curr: q.pagenum, //设置默认被选中的分页
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      limits: [2, 3, 5, 10],
      //触发jump回调的方式有两种：
      //1.通过调用laypage.render方法触发jump回调
      //2.通过切换页码的方法
      jump: function (obj, first) {
        //可以通过first的值来判断是哪种方式触发的jump回调
        //如果first的值为true，则证明是第一种方式触发
        //如果first的值为false，证明是第二种方式触发
        //把最新的页码值赋值到q这个查询参数对象中
        q.pagenum = obj.curr;
        //把最新的条目数赋值到q这个查询参数对象中
        q.pagesize = obj.limit;
        //通过判断first值来防止出现死循环
        if (!first) {
          initArticleList();
        }
      },
    });
  }

  //监听筛选表单的提交行为
  $("#form-search").on("submit", function (e) {
    e.preventDefault();
    //获取表单中对应的数据
    const cate_id = $("[name=cate_id]").val();
    const state = $("[name=state]").val();
    //为查询对象q的对应属性赋值
    q.cate_id = cate_id;
    q.state = state;
    //重新渲染表格
    initArticleList();
  });
});
