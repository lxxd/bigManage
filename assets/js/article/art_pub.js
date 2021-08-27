$(function() {
    var layer = layui.layer;
    var form = layui.form;
    // 初始化富文本编辑器
    initEditor();
    initCate();
    // 定义加载文章类别的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章列表失败！');
                }
                var htmlStr = template('tpl-cate', res);
                $('#cate_id').html(htmlStr);
                // 更新加载
                form.render();
            }
        })
    }
    // 定义图片裁剪的相关方法
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面的按钮，绑定点击事件处理函数
    $('#btnChooseImage').on('click', function() {
        $('#coverFile').click();
    });

    // 监听coverFile的change事件，获取用户选择的文件列表
    $('#coverFile').on('change', function(e) {
        // 获取到文件的列表数组,判断用户是否选择文件
        var files = e.target.files;
        if (files.length === 0) {
            return layer.msg('请选择文件！');
        }

        // 1.拿到用户选择的文件
        var file = e.target.files[0];

        // 2.根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(file);
        // 3.先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义文章的发布状态
    var art_state = '已发布';
    // 为 存为草稿 按钮，绑定点击事件
    $('#btnSave2').on('click', function() {
            art_state = '草稿';
        })
        // 为表单绑定submit提交事件
    $('#form-pub').on('submit', function(e) {
            // 1、阻止表单的默认提交行为
            e.preventDefault();
            // 2、基于form表单，快速创建一个FormData对象
            var fd = new FormData($(this)[0]);
            // 3、将文章的发布状态，存到fd中
            fd.append('state', art_state);
            // fd.forEach(function(v, k) {
            //     console.log(k, v);
            // })

            // 4、将封面裁剪过后的图片，输出为一个文件对象
            $image
                .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                    width: 400,
                    height: 280
                })
                .toBlob(function(blob) {
                    // 将 Canvas 画布上的内容，转化为文件对象
                    // 得到文件对象后，进行后续的操作
                    // 5、将文件对象，存储到fd中
                    fd.append('cover_img', blob);
                    // fd.forEach(function(v, k) {
                    //         console.log(k, v);
                    //     })
                    // 6、发起Ajax请求，将文章数据提交到服务器
                    publishArticle(fd);
                })

        })
        // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器发送FormData类型的数据，必须添加一下两行代码
            contentType: false,
            processData: false,

            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！');
                }
                layer.msg('发布文章成功！');
                // 发布文章成功后，跳转到文章列表页
                location.href = 'art_list.html';
                window.parent.dj();
            }
        })
    }
})