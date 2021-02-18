$(function () {
    let nowSec = unescape(window.location.search.substring(4))
    //console.log(nowSec)

    // 分解搜索字符
    function handleSec(str) {
        var s = str.split(',')
        for (var i = 0; i < s.length; i++) {
            if (s[i] === '') {
                s = s.slice(0, i)
            }
        }
        return s
    }

    getAjaxContent(nowSec)
    function getAjaxContent(search) {
        var str = handleSec(search)
        $.ajax({
            url: "./source/blog.json",
            dataType: "json",
            success: function (data) {
                $.each(data, function (index, ele) {
                    for (var j = 0; j < str.length; j++) {
                        //console.log(ele['blogtitle'].toLowerCase())
                        if (str[j] == ele['blogtitle'].toLowerCase()) {
                            console.log(ele)
                            var $item = createItem(index, ele)
                            $(".article_Ul").prepend($item)
                        }

                    }
                })
            },
            error: function (e) {
                console.log(e)
            }
        })
    }


    function createItem(index, ele) {
        var $item = $(`
        <li class="${index + 1} articlesLists"><i></i><span class="time">${ele.blogtime}</span><a href="">${ele.blogtitle}</a>
        </li>`)

        return $item
    }



    // 点击跳转
    $("body").delegate(".articlesLists", "click", function () {
        var blogIndex = parseInt(this.getAttribute('class'))
        $(location).attr('href', '../detail.html?id=' + blogIndex)

        return false
    })

    // 小蓝点hover效果
    $("body").delegate(".articlesLists>a", "mouseenter", function () {
        $(this).siblings("i").css("background", "rgb(250, 114, 114)")
    })
    $("body").delegate(".articlesLists>a", "mouseleave", function () {
        $(this).siblings("i").css("background", "rgb(86, 86, 247)")
    })


})



