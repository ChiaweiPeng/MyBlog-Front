$(function () {

    // 渐隐渐现函数
    function showHover(elm, time, fadeOutNum, subElm) {
        if (subElm) {
            elm.hover(function () {
                subElm.stop().fadeTo(time, 1)
            }, function () {
                subElm.stop().fadeTo(time, fadeOutNum)
            })
        } else {
            elm.hover(function () {
                $(this).stop().fadeTo(time, 1)
            }, function () {
                $(this).stop().fadeTo(time, fadeOutNum)
            })
        }

    }

    // 二级菜单渐隐渐现
    let $topArt = $(".top_nav").find(".top_art")
    let $subMenu = $topArt.find(".sub_menu")
    showHover($topArt, 300, 0, $subMenu)


    let $logo = $(".top_logo")
    let $logoMenu = $logo.find(".sub_menu_self")
    showHover($logo, 300, 0, $logoMenu)


    //夜间模式切换
    $("body").delegate(".mode_tabDots", "click", function () {
        if (parseInt($(this).css("left")) == 25) {
            $(this).animate({
                left: 0
            }, 200, function () {
                $("html").addClass("nightmode")
                $(".editormd-preview").addClass("editormd-preview-theme-dark")
            })
        } else if (parseInt($(this).css("left")) == 0) {
            $(this).animate({
                left: 25
            }, 200, function () {
                $("html").removeClass("nightmode")
                $(".editormd-preview").removeClass("editormd-preview-theme-dark")
            })
        }
    })

    // 根据当前时间自动切换
    var data = new Date();
    var timeNow = parseInt(data.getHours());
    if (timeNow >= 20 || timeNow <= 7) {
        console.log("night")
        $(".mode_tabDots").trigger("click")
    }


    //搜索弹出框
    $(".search_contain>input").focus(function () {
        $(this).css("border", "2px solid #0099e0")
    })
    $(".search_contain>input").blur(function () {
        $(this).css("border", "2px solid lightblue")
    })

    $(".search_contain>span").click(function () {
        $(".global_search").fadeOut()
    })

    $(".top_search").click(function () {
        $(".global_search").fadeIn()
        return false
    })


    //导航栏跟随页面滚动
    var nowset;
    $(window).scroll(function () {
        var offsetTop = $(window).scrollTop()
        if (nowset > offsetTop) {
            if (offsetTop < 50) {
                $(".bgcolor").stop().animate({
                    opacity: 0.1
                }, 100)
            }
            $(".top_nav").slideDown(300)
        }
        else {
            if (offsetTop > 150) {
                $(".top_nav").stop().slideUp(300)
                $(".bgcolor").stop().animate({
                    opacity: 0.8
                }, 300)
            }
            else {
                $(".top_nav").stop().slideDown(300)
            }
        }
        nowset = offsetTop;
    })


    // 个人信息栏跟随页面
    $(window).scroll(function () {
        var offset2 = $(window).scrollTop()
        // console.log(offset2)
        if (offset2 >= 500) {
            $(".right_recom").addClass("scrollWith")
        } else {
            $(".right_recom").removeClass("scrollWith")
        }
    })


    /* 正文区 */
    // 右侧图像放大
    $(".right_selfrecom").find(".touxiang").hover(function () {
        $(this).stop().animate({
            width: 100,
            paddingTop: 100,
            backgroundSize: 100
        }, 200)
    }, function () {
        $(this).stop().animate({
            width: 80,
            paddingTop: 80,
            backgroundSize: 80
        }, 200)
    })

    // 二维码弹出
    let $tx = $(".touxiang")
    let $qr = $tx.siblings(".qr")
    showHover($tx, 300, 0, $qr)

    $(".icon-weixin2").hover(function () {
        $(this).parent("a").css("position", "relative")
        $(this).siblings(".qr").stop().fadeIn(300)
    }, function () {
        $(this).siblings(".qr").stop().fadeOut(300)
    })

    // 返回顶部
    $(".goTop").click(function () {
        $(this).stop().animate({
            bottom: 100
        }, 500, function () {
            $(this).css("bottom", 20)
        })
        $("body,html").animate({
            scrollTop: 0
        }, 500)

        return false
    })

    // 箭头点击移动
    $(".header_banner_arrow").click(function () {
        $("body,html").animate({
            scrollTop: 500
        }, 500)
    })

    // 全局搜索
    var $myBtn = $(".search_contain>button")
    var $myInp = $(".search_contain>input")
    $myBtn.click(function () {
        var $inp = $myInp.val().trim().toLowerCase()
        console.log($inp)

        // 发送get请求
        const get = url => {
            return $.get(url)
        }

        // 拼接url
        let url = '/api/blog/list?keyword=' + $inp

        // 直接通过数据库keyword关键字搜索
        get(url).then( res => {
            if(res.errno != 0) {
                alert('数据错误')
                return 
            }
            
            const data = res.data || []

            if(data.length === 0) {
                alert('您找个der呢，俺这没有')
                return
            }
            location.href = './index.html?keyword=' + $inp

        })

        // var $arr = []
        // $.ajax({
        //     url: "./source/blog.json",
        //     dataType: 'json',
        //     success(data) {
        //         $.each(data, function (index, elm) {
        //             var $title = elm['blogtitle'].toLowerCase()
        //             if ($title.indexOf($inp) > -1) {
        //                 $arr.push($title)
        //             }

        //         })
        //         handleTitle($arr)
        //     },
        //     error(e) {
        //         console.log(e)
        //     }
        // })
    })


    // 字符串拼接
    // function handleTitle(obj) {
    //     //console.log(obj)
    //     if (!obj.length) {
    //         alert('您搜索的内容不存在')
    //     } else {
    //         var $T = ''
    //         for (var i of obj) {
    //             $T = $T + i + ','
    //         }
    //         $(location).attr('href', '../search.html?id=' + escape($T))
    //     }
    // }


    var clientWidth = document.documentElement.clientWidth || body.documentElement.clientWidth
    if (clientWidth <= 375) {
        $(".top_nav_mob").css('display', 'block')
        $(".top_nav_pc").css('display', 'none')
    } else {
        $(".top_nav_mob").css('display', 'none')
        $(".top_nav_pc").css('display', 'block')
    }

    //console.log($(".top_nav_mob").css('display'))
    if ($(".top_nav_mob").css('display') == 'flex') {
        var $zd = $(".top_nav_mob").find(".top_left_nav")
        var $mobMenu = $zd.find('.mob-sub-menu')

        $zd.click(function () {
            if ($mobMenu.css('display') == 'block') {
                $mobMenu.stop().slideUp(300)
            } else {
                $mobMenu.stop().slideDown(300)
            }
        })
    }


    // 双击导航栏头像弹出登录窗口
    var $loginArea = $(`
    <div class="login_area" style="display:none">
        <div class="login_contain">
            <input type="text" class="username" placeholder="请输入您的用户名">
            <input type="password" class="password" placeholder="请输入您的密码">
            <div class="btn">
                <button id="btn-login">登录</button>
            </div>
            <span id="login-close"><i class="iconfont icon-cha"></i></span>
        </div>
    </div>
    `) 

    $('header').append($loginArea)


    var $login = $(".touxiang")
    
    $login.dblclick( () => {
        $loginArea.fadeIn()
        return
    })

    $('header').delegate('#login-close', 'click', ()=>{
        $loginArea.fadeOut()
    })

    // 发送post请求
    function post(url,data = {}) {
        return $.ajax({
            type:'post',
            url,
            data: JSON.stringify(data),
            contentType: 'application/json'
        })
    }

    $('header').delegate('#btn-login', 'click', ()=>{
        const username = $('.username').val()
        const password = $('.password').val()
        const url = '/api/user/login'
        const data = {
            username,
            password
        }

        post(url, data).then( res => {
            if(res.errno != 0) {
                // 登录失败
                alert(res.message)
            } else {
                // 登录成功，跳转后台
                alert(res.message)
                location.href = '../fenlei.html'
            }
        })
    })
})