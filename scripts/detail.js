$(function () {
    var blogIndex = window.location.search.substring(4)

    console.log(blogIndex)
    $.ajax({
        url: "./source/blog.json",
        dataType: "json",
        success: function (data) {
            var blogContainer = $(".article_container").find(".left_main");
            var $item
            $.each(data, function (index, elm) {
                if ( blogIndex == parseInt(elm.id) ){
                    $item = createBlog(index,elm)

                    $.ajax({
                        url: `./source/article${index}.txt`,
                        success: function (data) {
                            container = $(`#blog_content${index}`)
                            container.siblings(".sub_info").find(".num_sum").html(data.length)
                            // 取出数据放进textarea
                            var textarea = container.find("#append-test")
                            textarea.html(data)
                            edi(index)
                        },
                        error: function (e) {
                            console.log(e)
                        }
                    })
                }
                
            })
            blogContainer.prepend($item)
        },
        error: function (e) {
            console.log(e)
        }
    })


    function createBlog(index, ele) {
        var $item = $(`
            <div class="article article${index} article_box">
            <div class="title"><a href="javascript:;" class="blog_links"><h1>${ele.blogtitle}</h1></a>
            <div class="dec_heng"></div>
            </div>
            <div class="sub_info">
                <p><i class="iconfont icon-fabiao"></i>发表于:&nbsp;&nbsp;<span class="input_time">${ele.blogtime}</span></p>
                <span class="dots">·</span>
                <p><i class="iconfont icon-zishu"></i>字数统计:&nbsp;&nbsp;<span class="num_sum"></span></p>
                <span class="dots">·</span>
                <p><span><i class="iconfont icon-biaoqian"></i><a href="javascript:;" class="biaoqian">${ele.blogtags}</a></span></p>
            </div>
            <div id="blog_content${index}" class="arts">
            <textarea id="append-test" style="display:none;">
            </textarea>
            </div>
            `)

        return $item
    }



    //editor编译器
    var testeditor;
    function edi(index) {
        testeditor = editormd(`blog_content${index}`, {
            width: "95%",
            height:800,
            syncScrolling: "single",
            path: "node_modules/editor.md/lib/",
            toolbar: true,
            onload: function () {
                this.previewing();
                var editor = this.editor;
                editor.find("." + this.classPrefix + "preview-close-btn").hide();
                editor.find("." + this.classPrefix + "preview").css("width","710");
            }
        })
    }

})