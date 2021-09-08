$(function () {
  var layer = layui.layer;
  var form = layui.form;
  var laypage = layui.laypage;
  // 时间过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);

    var y = dt.getFullYear();
    var m = dt.getMonth() + 1;
    m = m < 10 ? "0" + m : m;
    var d = dt.getDate();
    d = d < 10 ? "0" + d : d;

    var hh = dt.getHours();
    hh = hh < 10 ? "0" + hh : hh;
    var mm = dt.getMinutes();
    mm = mm < 10 ? "0" + mm : mm;
    var ss = dt.getSeconds();
    ss = ss < 10 ? "0" + ss : ss;
    return y + "-" + m + "-" + d + "-" + hh + ":" + mm + ":" + ss;
  };

  // 查询的参数对象
  var q = {
    pagenum: 1, //第一页数据
    pagesize: 2, //每页显示几条数据
    cate_id: "", //文章分类的Id
    state: "" //文章的状态
  };
  initTable();
  //获取文章列表数据
  function initTable() {
    $.ajax({
      type: "GET",
      url: "/my/article/list",
      data: q,
      success: function (res) {
        // console.log(res);

        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        var htmlstr = template("tpl-table", res);
        $("tbody").html(htmlstr);
        renderPage(res.total);
      }
    });
  }
  initCate();
  // 拿到文章分类
  function initCate() {
    $.ajax({
      type: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message);
        }
        //模板引擎获得分类选项

        var htmlstr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlstr);
        //出现问题，渲染页面过早，需要重新渲染
        form.render();
      }
    });
  }

  // 筛选表单
  $("#form-search").on("submit", function (e) {
    e.preventDefault();
    var cate_id = $("[name=cate_id]").val();
    var state = $("[name=state]").val();
    q.cate_id = cate_id;
    q.state = state;
    initTable();
  });

  // 渲染分页的方法
  function renderPage(total) {
    laypage.render({
      elem: "pagebox",
      count: total, //数据总数
      limit: q.pagesize, //每页几条
      curr: q.pagenum, //默认第几页
      layout: ["count", "limit", "prev", "page", "next", "skip"],
      limits: [2, 3, 5, 10],
      jump: function (obj, first) {
        q.pagenum = obj.curr;
        q.pagesize = obj.limit;
        if (!first) {
          initTable();
        }
      }
    });
  }

  //删除
  $("tbody").on("click", ".btn-delate", function () {
    var len = $(".btndelate").length;
    layer.confirm("确认删除?", {
      icon: 3,
      title: "提示"
    }, function (index) {
      var id = $(this).attr("data-id");
      $.ajax({
        type: "GET",
        url: "/my/article/delete/" + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg(res.message);
          }
          layer.msg(res.message);
          if (len == 1) {
            q.pagenum = q.pagenum > 1 ? q.pagenum - 1 : 1;
          }
          initTable();
          layer.close(index);
        }
      });
    });
  });

  //编辑
  $("body").on('click', '.btn-edit', function () {
    var id = $(this).attr('data-id')
    layer.open({
      type: 1,
      area: ["60%", "60%"],
      title: "修改文章",
      content: $("#tpl-edit").html()
    });
    $.ajax({
      type: 'GET',
      url: '/my/article/' + id,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res.message)
        }

        form.val('form-pub', res.data)
      }
    })
  })


});