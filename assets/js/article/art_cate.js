$(function() {
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList();

    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res);
                var htmlStr = template('tpl-table', res);
                $("tbody").html(htmlStr);
            }
        })
    }
    var indexAdd = null;
    // 添加类别按钮绑定事件
    $("#btnAddCate").on('click', function() {
            indexAdd = layer.open({
                type: 1,
                area: ['500px', '250px'],
                title: '添加文章分类',
                content: $("#dialog-add").html()
            });
        })
        // 通过代理的形式，为form-add表单绑定submit事件
    $("body").on("submit", "#form-add", function(e) {
            e.preventDefault();
            // console.log('ok');
            $.ajax({
                method: 'POST',
                url: '/my/article/addcates',
                data: $(this).serialize(),
                success: function(res) {
                    // console.log(res);
                    if (res.status != 0) {
                        return layer.msg('新增分类失败！');
                    }
                    initArtCateList();
                    layer.msg('新增分类成功！');
                    //关闭弹出层
                    layer.close(indexAdd);
                }
            })
        })
        // 通过代理的形式，为btn-edit绑定click事件
    var indexEdit = null;
    $("tbody").on("click", ".btn-edit", function(e) {
            e.preventDefault();
            // console.log('ok');
            indexEdit = layer.open({
                type: 1,
                area: ['500px', '250px'],
                title: '修改文章分类',
                content: $("#dialog-edit").html()
            });
            var id = $(this).attr('data-id');
            $.ajax({
                method: 'GET',
                url: '/my/article/cates/' + id,
                success: function(res) {
                    form.val('form-edit', res.data);
                }
            })
        })
        // 通过代理的形式，为form-edit表单绑定submit事件
    $("body").on("submit", "#form-edit", function(e) {
            e.preventDefault();
            // console.log('ok');
            $.ajax({
                method: 'POST',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function(res) {
                    console.log(res);
                    if (res.status != 0) {
                        return layer.msg('更新分类数据失败！');
                    }
                    initArtCateList();
                    layer.msg('更新分类数据成功！');
                    //关闭弹出层
                    layer.close(indexEdit);
                }
            })
        })
        // 通过代理的形式，为删除按钮绑定事件
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr("data-id");
        layer.confirm('确认删除吗?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status != 0) {
                        return layer.msg('删除分类失败！');
                    }
                    layer.msg('删除分类成功！');
                    layer.close(index);
                    initArtCateList();
                }
            })

        });

    })

})