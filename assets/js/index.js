$(function() {
        // 调用getUserInfo()获取用户的基本信息
        getUserInfo();

        var layer = layui.layer;

        // 点击“退出”按钮实现退出功能
        $("#btnLogout").on("click", function() {
            // 询问用户是否退出
            layer.confirm('确认退出登录吗？', { icon: 3, title: '提示' }, function(index) {
                //do something
                // 1、清空本地存储的token
                localStorage.removeItem('token');
                // 2、重新跳转至登录页面
                location.href = 'login.html';
                // 3、关闭confirm询问框
                layer.close(index);
            });

        })

    })
    // 获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            // layui-nav-img
            console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 如果登陆成功，则调用渲染用户头像的方法
            renderAvatar(res.data);

        }
    })
}
// 渲染用户头像的方法
function renderAvatar(user) {
    var name = user.nickname || user.username;
    $("#welcome").html("欢迎&nbsp;&nbsp" + name);
    if (user.user_pic !== null) {
        $(".layui-nav-img").attr("src", user.user_pic).show();
        $(".text-avatar").hide();
    } else {
        $(".text-avatar").text(name[0].toUpperCase()).show();
        $(".layui-nav-img").hide();
    }
}