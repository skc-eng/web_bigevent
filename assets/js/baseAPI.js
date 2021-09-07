$(function () {
    $.ajaxPrefilter(function (options) {
        //根目录拼接
        options.url = 'http://api-breakingnews-web.itheima.net' + options.url
        //headers请求头
        if (options.url.indexOf('/my/') !== -1) {
            options.headers = {
                Authorization: localStorage.getItem('token') || ''
            }
        }
        options.complete = function (res) {
            console.log(res);
            if (res.responseJSON.status == 1 && res.responseJSON.message == "身份认证失败！") {
                console.log('失败了');
                location.href = '/login.html'
            }
        }
    })
})