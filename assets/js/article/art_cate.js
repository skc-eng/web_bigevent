$(function () {
    // 获取列表
    initArtCateList();
    var layer = layui.layer;
    var form = layui.form;

    //获取表格数据
    function initArtCateList() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                var htmlStr = template("tpl-table", res);
                $("tbody").html(htmlStr);
            }
        });
    }

    // 弹出层索引
    var indexAdd = null;
    //添加类别按钮
    $("#btnAddCate").on("click", function () {
        indexAdd = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: "添加文章分类",
            content: $("#dialog-add").html()
        });
    });
    //添加类别
    $("body").on("submit", "#form-add", function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                initArtCateList();
                layer.msg(res.message);
                layer.close(indexAdd);
            }
        });
    });

    var indexEdit = null;
    $("tbody").on("click", ".btn-edit", function (e) {
        e.preventDefault()
        indexEdit = layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: "修改文章分类",
            content: $("#dialog-edit").html()
        });

        //   直接选择器获得内容
        // var index = $(this).attr("data-index");
        // var td1 = $("tbody tr")
        //     .eq(index)
        //     .children("td")
        //     .eq(0)
        //     .html();
        // var td2 = $("tbody tr")
        //     .eq(index)
        //     .children("td")
        //     .eq(1)
        //     .html();
        // console.log(td1, td2);
        // $("#form-edit [name=name]").val(td1);
        // $("#form-edit [name=alias]").val(td2);

        // 请求获得原数据
        var id = $(this).attr("data-id");
        $.ajax({
            type: "GET",
            url: "/my/article/cates/" + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                console.log(res);
                form.val("form-edit", res.data);
            }
        });
    });
    // 编辑后提交
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })
    // 删除
    $('body').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id');
        layer.confirm('确定删除此项吗?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            //do something
            $.ajax({
                type: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    layer.close(index);
                    initArtCateList()
                }
            })

        });

    })

});