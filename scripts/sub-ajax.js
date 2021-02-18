$(function () {
    let nowType
    if (!window.location.search) {
        nowType = window.location.pathname.substring(1, 5)
        if (nowType.indexOf('guid') > -1) {
            nowType = ''
        }
    } else {
        nowType = decodeURIComponent(window.location.search.substring(4))
    }
    //console.log(nowType)
    getAjaxContent(nowType)

    function getAjaxContent(type) {
        $.ajax({
            url: "./source/blog.json",
            dataType: "json",
            success: function (data) {
                $.each(data, function (index, ele) {
                    if (type == '') {
                        var $item = createItem(index, ele)
                        $(".article_Ul").prepend($item)
                    } else {
                        for (var i in ele) {
                            if (ele[i] == type) {
                                var $item = createItem(index, ele)
                                $(".article_Ul").prepend($item)
                            }
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



    // 归档页计算篇数
    var arts_num = $(".arts_num")
    if (arts_num.length !== 0) {
        setTimeout(function () {
            var artContainer = $(".article_Ul").find(".articlesLists")
            console.log(artContainer.length)
            arts_num.text(artContainer.length)
        }, 200)
    }

})



