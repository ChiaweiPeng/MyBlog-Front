$(function () {
    // 发送get请求
    const get = url => {
        return $.get(url)
    }

    // 数组去重
    function unique(arr) {
        var array = [];
        if (!Array.isArray(arr)) return
        for (var i = 0; i < arr.length; i++) {
            if (array.indexOf(arr[i]) === -1) {
                array.push(arr[i])
            }
        }
        return array
    }

    let url = '/api/blog/list'
    get(url).then(res => {
        if (res.errno != 0) {
            alert('数据错误')
            return
        }

        const data = res.data || []
        let tags = []
        data.forEach(item => {
            item.type.split(',').forEach(val => {
                tags.push(val)
            })
        })
        const ntags = unique(tags)
        ntags.forEach(item => {
            $(".article_Ul").append($(`
            <li class="articlesLists ${item}"><i></i><a href="">${item}</a>
            </li>
            `))
        })
    })

    
    // 点击跳转
    $("body").delegate(".articlesLists", "click", function () {
        var blogTag = this.getAttribute('class').substring(14)
        $(location).attr('href', '../tag-detail.html?type=' + blogTag)
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



