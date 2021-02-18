$(function () {

    // 发送get请求
    const get = url => {
        return $.get(url)
    }

    // 显示格式化时间
    const getFormatDate = dt => {
        return moment(dt).format('LL')
    }

    // 获取url参数
    const getUrlParams = () => {
        let paramStr = location.href.split('?')[1] || ''
        paramStr = paramStr.split('#')[0]
        const res = {}
        paramStr.split('&').forEach(item => {
            const arr = item.split('=')
            const key = arr[0]
            const val = arr[1]
            res[key] = val
        })
        return res
    }

    // 获取DOM元素
    var $blogContainer = $(".article_container").find(".left_main");

    // 拼接url
    const urlParams = getUrlParams()
    const url = '/api/blog/detail?id=' + urlParams.id
    get(url).then(res => {
        if (res.errno != 0) {
            alert('数据错误')
            return
        }

        const data = res.data || []
        console.log( typeof data.content)
        $blogContainer.append($(`
        <div class="article article${data.id} article_box">
            <div class="title"><a href="javascript:;" class="blog_links"><h1>${data.title}</h1></a>
            <div class="dec_heng"></div>
            </div>
            <div class="sub_info">
                <p><i class="iconfont icon-fabiao"></i>发表于:&nbsp;&nbsp;<span class="input_time">${getFormatDate(data.createtime)}</span></p>
                <span class="dots">·</span>
                <p><i class="iconfont icon-zishu"></i>字数统计:&nbsp;&nbsp;<span class="num_sum">${data.content.length}</span></p>
                <span class="dots">·</span>
                <p><span><i class="iconfont icon-biaoqian"></i><a href="javascript:;" class="biaoqian">${data.type}</a></span></p>
            </div>
            <div id="blog_content${data.id}" class="arts">
                <textarea id="append-test" style="display:none;">
                ${data.content}
                </textarea>
            </div>
        `))
        edi(data.id)
    })

    // var blogIndex = window.location.search.substring(4)

    // // console.log(blogIndex)
    // $.ajax({
    //     url: "./source/blog.json",
    //     dataType: "json",
    //     success: function (data) {
    //         var blogContainer = $(".article_container").find(".left_main");
    //         var $item
    //         $.each(data, function (index, elm) {
    //             if (blogIndex == parseInt(elm.id)) {
    //                 $item = createBlog(index, elm)

    //                 $.ajax({
    //                     url: `./source/article${index}.txt`,
    //                     success: function (data) {
    //                         container = $(`#blog_content${index}`)
    //                         container.siblings(".sub_info").find(".num_sum").html(data.length)
    //                         // 取出数据放进textarea
    //                         var textarea = container.find("#append-test")
    //                         textarea.html(data)
    //                         edi(index)
    //                     },
    //                     error: function (e) {
    //                         console.log(e)
    //                     }
    //                 })
    //             }

    //         })
    //         blogContainer.prepend($item)
    //     },
    //     error: function (e) {
    //         console.log(e)
    //     }
    // })


    // function createBlog(index, ele) {
    //     var $item = $(`
    //         <div class="article article${index} article_box">
    //         <div class="title"><a href="javascript:;" class="blog_links"><h1>${ele.blogtitle}</h1></a>
    //         <div class="dec_heng"></div>
    //         </div>
    //         <div class="sub_info">
    //             <p><i class="iconfont icon-fabiao"></i>发表于:&nbsp;&nbsp;<span class="input_time">${ele.blogtime}</span></p>
    //             <span class="dots">·</span>
    //             <p><i class="iconfont icon-zishu"></i>字数统计:&nbsp;&nbsp;<span class="num_sum"></span></p>
    //             <span class="dots">·</span>
    //             <p><span><i class="iconfont icon-biaoqian"></i><a href="javascript:;" class="biaoqian">${ele.blogtags}</a></span></p>
    //         </div>
    //         <div id="blog_content${index}" class="arts">
    //         <textarea id="append-test" style="display:none;">
    //         </textarea>
    //         </div>
    //         `)

    //     return $item
    // }



    //editor编译器
    var testeditor;
    function edi(index) {
        testeditor = editormd(`blog_content${index}`, {
            width: "95%",
            height: 800,
            syncScrolling: "single",
            path: "node_modules/editor.md/lib/",
            toolbar: true,
            onload: function () {
                this.previewing();
                var editor = this.editor;
                editor.find("." + this.classPrefix + "preview-close-btn").hide();
                editor.find("." + this.classPrefix + "preview").css("width", "710");
            }
        })
    }

})