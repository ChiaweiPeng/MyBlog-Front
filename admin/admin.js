$(function () {

    // 刷新跳转到源页面
    window.onload = function () {
        location.hash = '#list'
    }

    // 发送get请求
    const get = url => {
        return $.get(url)
    }

    // 发送post请求
    function post(url, data = {}) {
        return $.ajax({
            type: 'post',
            url,
            data: JSON.stringify(data),
            contentType: 'application/json'
        })
    }

    // 显示格式化时间
    const getFormatDate = dt => {
        return moment(dt).format('LL')
    }

    // 侧边栏样式切换
    $('.nav>li').click(function (e) {
        $('.nav>li').removeClass('active')
        $(this).toggleClass('active')
    })


    // 根据hash值改变内容区域
    $(window).bind('hashchange', function () {

        let params = location.hash

        if (params.indexOf('list') > 0) {
            $('.content').removeClass('active')
            $('.list-content').addClass('active')
            $('.small-nav').html('博客列表')
        }
        if (params.indexOf('newBlog') > 0) {
            $('.content').removeClass('active')
            $('.new-blog').addClass('active')
            $('.small-nav').html('新建博客')

            // 必须切换页面再插入editor
            $('#markdown').append($(`
            <div id="myEditor">
                <textarea style="display:none;">### Hello Editor.md !</textarea>
             </div>
            `))

            var editor = editormd("myEditor", {
                width: "100%",
                height: 500,
                emoji: true,
                path: "../node_modules/editor.md/lib/"  // Autoload modules mode, codemirror, marked... dependents libs path
            });


        }
        if (params.indexOf('edit') > 0) {
            $('.small-nav').html('新建博客 > 更新博客')
            // 当前在编辑页，先获取当前id博客内容
            const id = location.hash.split('?')[1].slice(3)
            const $title = $('.new-blog>>.blog-title')
            const $content = $('.editormd-markdown-textarea')
            const $subtitle = $('.new-blog>>.blog-subtitle')
            const $type = $('.new-blog>>.blog-type')
            const $select = $('.new-blog>>#type-sel')
                
            let getUrl = '/api/blog/detail?id=' + id
            get(getUrl).then(res => {
                if (res.errno != 0) {
                    alert('数据错误')
                    return
                }

                const data = res.data || []
                $title.val(data.title)
                $content.val(data.content)
                $subtitle.val(data.sub_title)
                $type.val(data.type.slice(5))
                // 注意目前仅支持 选择框为 Tech或Life
                $select.val(data.type.substring(0, 4))
            })

            // 添加取消编辑按钮
            $('.new-blog').append($(`
                <div id="close-update" title="点击取消编辑"><span class="glyphicon glyphicon-remove"></span></div> 
            `))

            $('.new-blog').delegate('#close-update', 'click', function (e) {
                window.location.reload()
            })

            // 添加提交编辑按钮
            $btnUpdate = $('.new-blog>>#update')
            $('.new-blog>>.btn').css('display', 'none')
            $btnUpdate.css('display', 'block')

            // 提交编辑
            $btnUpdate.click(() => {
                const postUrl = '/api/blog/update?id=' + id
                const title = $title.val().trim()
                const content = $content.val().trim()
                const sub_title = $subtitle.val().trim()
                const type = $select.val() + ',' + $type.val().trim()

                const postData = {
                    title,
                    content,
                    sub_title,
                    type
                }

                post(postUrl, postData).then(res => {
                    if (res.errno != 0) {
                        alert('操作失败')
                        return
                    }

                    alert('博客更新成功！')
                    // 打开该更新的博客，并刷新后台页面
                    window.open('/detail.html?id=' + id)
                    location.href = '/admin/admin.html'
                })
            })
        }
        if (params.indexOf('other') > 0) {
            $('.content').removeClass('active')
            $('.other-option').addClass('active')
            $('.small-nav').html('更多操作')
        }
    })


    // 获取博客数据插入表格
    // 加入isadmin 用来给后端判断是否登录标识
    let listUrl = '/api/blog/list?isadmin=1'
    $List = $('.list-content>table>tbody')
    get(listUrl).then(res => {
        if (res.errno != 0) {
            if (res.message.indexOf('未登录') > 0) {
                alert('您尚未登录')
                return
            }
            alert('数据错误')
            return
        }

        const data = res.data || []

        data.forEach(item => {
            $List.append($(`
            <tr>
                <td class="blog-Id">${item.id}</td>
                <td class="blog-Title">${item.title}</td>
                <td class="blog-subtitle">${item.sub_title}</td>
                <td class="blog-type">${item.type}</td>
                <td class="blog-createtime">${getFormatDate(item.createtime)}</td>
                <td><a href="javascript:;" id="open" class="${item.id}">打开</a> | <a href="javascript:;" id="edit" class="${item.id}">编辑</a> | <a href="javascript:;"
                    id="delete" class="${item.id}">删除</a></td>
            </tr>
            `))
        })
    })



    // 处理操作
    // 打开博客
    $('table').delegate('#open', 'click', function (e) {
        let id = $(this).attr('class')
        window.open('/detail.html?id=' + id)
    })

    // 删除博客
    $('table').delegate('#delete', 'click', function (e) {
        if (confirm('是否删除该篇博客？')) {
            let id = $(this).attr('class')
            let delUrl = '/api/blog/delete?id=' + id

            post(delUrl).then(res => {
                if (res.errno != 0) {
                    alert('数据错误')
                    return
                }
                alert('删除博客成功')
                location.href = '/admin/admin.html'
            })
        }
    })

    // 更新博客
    $('table').delegate('#edit', 'click', function (e) {
        const id = $(this).attr('class')
        location.hash = '#newBlog#edit?id=' + id
    })

    // 新建博客
    $('#submit').click(function () {
        const title = $('.new-blog>>.blog-title').val().trim()
        const $typeSel = $('.new-blog>>#type-sel').val().trim()
        const type = $typeSel+','+ $('.new-blog>>.blog-type').val().trim()
        const sub_title = $('.new-blog>>.blog-subtitle').val().trim()
        const content = $('.editormd-markdown-textarea').val().trim()

        if (title === '' || content === '') {
            alert('请保证标题和内容不为空哦')
            return
        }

        let url = '/api/blog/new'
        data = {
            title,
            content,
            type,
            sub_title
        }

        post(url, data).then(res => {
            if (res.errno != 0) {
                if (res.message.indexOf('未登录') > 0) {
                    alert('您尚未登录，无法进行该操作')
                    return
                }
                alert('数据错误')
                return
            }
            alert('新增博客成功')
            location.href = '/admin/admin.html'
        })
    })

})