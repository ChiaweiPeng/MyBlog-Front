$(function () {
    let nowType
    if (!window.location.search) {
        nowType = window.location.pathname.substring(1, 5)
        if (nowType.indexOf('guid') > -1) {
            nowType = ''
        }
    } else {
        nowType = decodeURIComponent(window.location.search.substring(6))
    }

    // 发送get请求
    const get = url => {
        return $.get(url)
    }

    // 显示格式化时间
    const getFormatDate = dt => {
        return moment(dt).format('LL')
    }

    // 拼接url
    let url = '/api/blog/list?type=' + nowType

    get(url).then(res => {
        if (res.errno != 0) {
            alert('数据错误')
            return
        }

        const data = res.data || []
        data.forEach(item => {
            $(".article_Ul").prepend($(`
            <li class="${item.id} articlesLists"><i></i><span class="time">${getFormatDate(item.createtime)}</span><a href="">${item.title}</a>
            </li>
        `))
        })

    })

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
            // console.log(artContainer.length)
            arts_num.text(artContainer.length)
        }, 200)
    }

})



