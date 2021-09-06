$(function() {
    // 点击去注册账号
    $('#link-reg').on('click', function() {
        $('.login-box').hide();
        $('.reg-box').show();
        $('.login-box [name=username]').val('')
        $('.login-box [name = password]').val('')
    })

    // 点击去登录
    $('#link-login').on('click', function() {
        $('.login-box').show();
        $('.reg-box').hide();
    })

    //使用layui的一些方法
    var form = layui.form;
    var layer = layui.layer;

    // 正则验证

    form.verify({
        username: function(value, item) { //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }

            //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
            if (value === 'xxx') {
                alert('用户名不能为敏感词');
                return true;
            }
        }

        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        ,
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        //两次密码必须一致
        repwd: function(value) {
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    });
    $('#form-reg').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/api/reguser",
            data: {
                username: $('.reg-box [name=username]').val(),
                password: $('.reg-box [name=password]').val()
            },
            success: function(res) {
                if (res.status !== 0) return layer.msg(res.message);
                layer.msg(res.message, function() {
                    $('#link-login').click()
                    var username = $('.reg-box [name=username]').val()
                    var password = $('.reg-box [name = password]').val()
                    console.log(username);
                    console.log(password);
                    $('.login-box [name=username]').val(username)
                    $('.login-box [name=password]').val(password)
                    $('.reg-box [name=username]').val('')
                    $('.reg-box [name = password]').val('')
                    $('.reg-box [name = repassword]').val('')

                });

            }
        });
    })
    $('#form-login').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            type: "POST",
            url: "/api/login",
            data: $(this).serialize(),
            success: function(res) {
                // console.log(res);
                if (res.status !== 0) return layer.msg(res.message)
                localStorage.setItem('token', res.token)
                location.href = 'index.html'
            }
        });
    })
})