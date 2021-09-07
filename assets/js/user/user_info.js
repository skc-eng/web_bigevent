$(function () {
    var form = layui.form
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称必须在1~6位字符之间'
            }
        }
    })
    initUserInfo()
    // 获取信息
    function initUserInfo() {
        $.ajax({
            type: "GET",
            url: "/my/userinfo",
            success: function (res) {
                if (res.status !== 0) return layui.layer.msg(res.message)
                form.val('formUserInfo', res.data)

            }
        });
    }
    // 修改
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            type: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) return layui.layer.msg(res.message)
                layui.layer.msg(res.message)
                window.parent.getUserInfo()
            }
        })

    })
    // 重置
    $('[type = reset]').on('click', function (e) {
        e.preventDefault()
        initUserInfo()
    })
})