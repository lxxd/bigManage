$(function() {
    // 点击“注册账号”的链接
    $("#link_reg").on("click", function() {
        $(".login-box").hide();
        $(".reg-box").show();
    });
    $("#link_login").on("click", function() {
        $(".login-box").show();
        $(".reg-box").hide();
    });
    // 从layui中获取form对象
    var form = layui.form;
    var layer = layui.layer;
    // 通过form.verity()函数自定义校验规则
    form.verify({
        // 自定义一个pwd密码的校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        repwd: function(value) {
            var mm = $("#first-mm").val();
            if (value !== mm) {
                return "两次密码不一致！";
            }
        }
    })

    // 监听注册表单的提交事件
    $("#form_reg").on("submit", function(e) {
            // 1、阻止表单的默认行为
            e.preventDefault();
            var data = {
                username: $(".usName").val(),
                password: $(".psWord").val()
            };
            // 2、发起Ajax的POST请求
            $.post("/api/reguser", data, function(res) {
                if (res.status !== 0) {
                    // return console.log(res.message);
                    return layer.msg(res.message);
                } else {
                    // console.log("注册成功！");
                    layer.msg("注册成功，请登录！")
                    $("#link_login").click();
                }
            })
        })
        // 监听登录表单的提交事件
    $("#form_login").submit(function(e) {
        // 阻止默认的提交行为
        e.preventDefault();
        $.ajax({
            url: "/api/login",
            method: "POST",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg("登录失败！")
                }
                layer.msg("登录成功！");
                // 将登录成功得到的token字符串，保存到localStorage中
                localStorage.setItem("token", res.token);
                // 跳转到后台主页
                location.href = "index.html";
            }
        })
    })
})