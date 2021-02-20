

$(function () {


    $('.nav>li').click(function (e) {
        $('.nav>li').removeClass('active')
        $(this).toggleClass('active')
    })

    // 刷新跳转到源页面
    window.onload = function () {
        location.hash = ''
    }

    // 根据hash值改变内容区域
    $(window).bind('hashchange', function () {
        let params = location.hash
        // console.log(params)

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
                width:"100%",
                height:500,
                emoji:true,
                path: "../node_modules/editor.md/lib/"  // Autoload modules mode, codemirror, marked... dependents libs path
            });
        }
        if (params.indexOf('other') > 0) {
            $('.content').removeClass('active')
            $('.other-option').addClass('active')
            $('.small-nav').html('更多操作')
        }
    })


    // 获取博客列表
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

    // 获取数据插入表格
    let listUrl = '/api/blog/list'
    $List = $('.list-content>table>tbody')
    get(listUrl).then(res => {
        if (res.errno != 0) {
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
                <td class="blog-createtime">${getFormatDate(item.createtime)}</td>
                <td><a href="javascript:;" id="open" class="${item.id}">打开</a> | <a href="javascript:;" id="edit">编辑</a> | <a href="javascript:;"
                    id="delete" class="${item.id}">删除</a></td>
            </tr>
            `))
        })
    })



    // 处理操作
    // 打开博客
    $('table').delegate('#open', 'click', function (e) {
        let id = $(this).attr('class')
        window.open('/detail?id=' + id)
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

    // 新建博客
    $('#submit').click( function(){
        const title = $('.new-blog>>.blog-title').val().trim()
        const $typeSel = $('.new-blog>>#type-sel').val().trim()
        const type = $typeSel+','+ $('.new-blog>>.blog-type').val().trim()
        const sub_title = $('.new-blog>>.blog-subtitle').val().trim()
        const content = $('.editormd-markdown-textarea').val().trim()

        if(title === '' || content === '') {
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

        console.log(data)
        post(url, data).then( res => {
            if(res.errno != 0) {
                alert('数据错误')
                return
            }
            alert('新增博客成功')
            location.href='/admin/admin.html'
        })
    })
    
})