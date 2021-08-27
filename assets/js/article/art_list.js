$(function() {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    //定义一个补0 的函数
    function addZero(val) {
        return val > 9 ? val : '0' + val;
    }
    // 定义美化时间的过滤器
    template.defaults.imports.dateFormate = function(date) {
        var dt = new Date(date);
        var y = addZero(dt.getFullYear());
        var m = addZero(dt.getMonth() + 1);
        var d = addZero(dt.getDate());
        var hh = addZero(dt.getHours());
        var mm = addZero(dt.getMinutes());
        var ss = addZero(dt.getSeconds());
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;

    }

    // 定义一个查询的参数，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值，默认请求第一页的数据
        pagesize: 2, //每页显示几条数据，默认每页显示2条
        cate_id: '', //文章分类的id
        state: '' //文章的发布状态
    }
    initTable();

    //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // console.log(res);
                // 使用模板引擎渲染页面结构
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                // layer.msg('获取文章列表成功！')
                // 调用渲染分页的方法
                renderPage(res.total);
            }
        })
    }
    initCate();
    // 初始化文章类别的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败!');
                }
                // layer.msg('初始化文章分类成功!');
                var htmlStr = template('tpl-cate', res);
                $('#cate_id').html(htmlStr);
                // 通知layui重新渲染表单区域的UI结构
                form.render();

            }
        })
    }
    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        //获取表单中选中的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 为查询对象q中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的筛选条件，重新渲染表格数据
        initTable();
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用layery的render方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', //指向存放分页的容器
            count: total, //数据总数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分页
            // 自定义排版
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候，触发jump回调
            // 触发jump回调的方式有2种
            // （1）点击页码的时候会触发
            // （2）只要调用了laypage.render()就会触发
            jump: function(obj, first) {
                // 把最新的页码值，复制到q这个查询参数对象中
                q.pagenum = obj.curr;
                // 把最新的条目数，赋值到q这个查询参数对象的pagesize属性中
                q.pagesize = obj.limit;
                // console.log(first);
                // 根据first的值来判断哪种方式触发的jump，
                // 如果是true,则是第2种，不需调用initTavble(),造成死循环
                // 否则是第1种，此时则调用initTable()刷新数据
                if (!first) {
                    initTable();
                }
            }
        });
    }

    // 通过代理的形式，为删除按钮绑定事件
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id');
        // 获取删除按钮的个数,解决当前页全部删除重新加载为空的bug
        var len = $('.btn-delete').length;
        // console.log(id);
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！');
                    }
                    layer.msg('删除文章成功！');
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余数据，
                    // 如果没有剩余数据则让页码值-1后再调用initTable()
                    // 如果len（即当前页只有一个delete按钮），
                    // 则证明删除此文章后该页无数据，页码值需要-1
                    if (len === 1) {
                        // 页码值最小为1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    }
                    initTable();
                }
            })
            layer.close(index);
        });

    })
})