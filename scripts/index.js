$(function () {
    /* 首页部分功能JS */

    //幻灯片播放
    tabPics()
    var tabTimer;
    var pics = $(".banner_tab").find(".tab_pics>li")
    var tabDots = $(".banner_tab").find(".tab_dots>ul>li")
    tabDots.click(function () {
        $(this).siblings().stop().fadeTo(200, 0.5)
        $(this).stop().fadeTo(200, 0.8)
        var nowIndex = $(this).index();
        pics.eq(nowIndex).stop().fadeIn(1000)
        pics.eq(nowIndex).siblings().stop().fadeOut()
    })
    function tabPics() {
        var tabIndex = 1;
        tabTimer = setInterval(function () {
            tabDots.eq(tabIndex).siblings().stop().fadeTo(200, 0.5)
            tabDots.eq(tabIndex).stop().fadeTo(2000, 0.8)

            pics.eq(tabIndex).stop().fadeIn(2500)
            pics.eq(tabIndex).siblings().stop().fadeOut()
            if (tabIndex == 3) {
                tabIndex = 0;
            } else {
                tabIndex++;
            }
        }, 10000)
    }


    //正文区
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

    // 拼接url
    let url = '/api/blog/list'
    const urlParams = getUrlParams()
    if (urlParams.type) {
        url += '?type=' + urlParams.type
    }
    if (urlParams.keyword) {
        url += '?keyword=' + urlParams.keyword
    }

    // 获取DOM元素
    var $blogContainer = $(".article_container").find(".left_main");

    get(url).then(res => {
        // console.log(res.data)
        if(res.errno != 0) {
            alert('数据错误')
            return
        }

        // 获取数据成功，遍历博客列表，展示
        const data = res.data || []
        data.forEach (item => {
            $blogContainer.append($(`
            <div class="article article${item.id} article_box">
            <div class="title"><a href="javascript:;" class="blog_links"><h1>${item.title}</h1></a>
            <div class="dec_heng"></div>
            </div>
            <div class="sub_info">
                <p><i class="iconfont icon-fabiao"></i>发表于:&nbsp;&nbsp;<span class="input_time">${getFormatDate(item.createtime)}</span></p>
                <span class="dots">·</span>
                <p><span><i class="iconfont icon-biaoqian"></i><a href="javascropt:;" class="biaoqian">${item.type}</a></span></p>
            </div>
            <div class="sub_title"><h2>${item.sub_title}</h2></div>
            <div class="blog_btn clearfix"><button class="${item.id} myBtn">阅读全文<i class="iconfont icon-xiajiantou2"></i></button></div>
            </div>
            `))
        })
    })

    $("body").delegate(".myBtn", "click", function () {
        var clickIndex = parseInt(this.getAttribute('class'))
        $(location).attr('href', '../detail.html?id=' + clickIndex)
    })


    // title移入出现横线
    $("body").delegate(".blog_links", "mouseenter", function () {
        $(this).siblings(".dec_heng").stop().animate({
            width: "70%",
        }, 500)
    });
    $("body").delegate(".blog_links", "mouseleave", function () {
        $(this).siblings(".dec_heng").stop().animate({
            width: 0,
        }, 500)
    })

})