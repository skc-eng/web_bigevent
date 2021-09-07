$(function () {
    var form = layui.form
    form.verify({
        samePwd: function (value) {
            if (value == $('[name=oldPwd]').val()) {
                return '新旧密码不能相同'
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) return "新密码必须一致"
        }
    })
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) return layui.layer.msg(res.message)
                layui.layer.msg(res.message + '请重新登')
                setTimeout(function () {
                    window.parent.location.href = '/login.html'
                }, 1000)


            }
        })

    })
    $('[type=reset]').on('click', function (e) {
        e.preventDefault()
        $('[name=oldPwd]').val('')
        $('[name=newPwd]').val('')
        $('[name=renewPwd]').val('')
    })
})