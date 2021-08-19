// 注意：每次调用$.get()或$.post()或$.ajax()的时候，
// 会先调用ajaxPrefilter这个函数，在此函数中，可以
// 拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    // 在发起真正的Ajax请求之前，统一拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;

    // 统一为有权限的接口设置headers请求头
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂载complete回调函数
    // 不论成功还是失败，最终都会调用complete回调函数
    options.complete = function(res) {
        // status: 1, message: "身份认证失败！
        console.log(res);
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1、强制清空token
            localStorage.removeItem('token');
            // 2、强制跳转至登录页面
            location.href = 'login.html';
        }
    }

})