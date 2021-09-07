$(function () {
    getUserInfo();
})

var layer = layui.layer

$("#btnLogout").on('click', function () {
    layer.confirm('确定退出登录?', {
        icon: 3,
        title: '提示'
    }, function (index) {
        //do something
        localStorage.removeItem('token')
        location.href = '/login.html'
        //关闭询问框
        layer.close(index);
    });

})

//获取用户信息
function getUserInfo() {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) return layui.layer.msg('获取用户信息失败！')
            renderAvatar(res.data);
        },
    });
}

//渲染头像
function renderAvatar(user) {
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;' + name);
    //用户头像,没有图片就用第一个字母或汉字
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}