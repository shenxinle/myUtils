## 一些基于 jQuery / Zepto 的组件

* [jQuery.stickUp.js](#user-content-jquerystickupjs)
* [jQuery.carousel.js](#user-content-jquerycarouseljs)
* [jQuery.pagepiling.js](#user-content-jquerypagepilingjs)
* [jQuery.headRoom.js](#user-content-jqueryheadroomjs)
* [lazyload.js](#user-content-lazyloadjs)
* [m.carousel.js](#user-content-mcarouseljs)

### jQuery.stickUp.js

document 滚动时让目标元素 fixed 在浏览器窗口顶部 [demo](http://shenxinle.github.io/myUtils/demos/stickUp.html)

使用

    <script src="../bower_components/jquery/dist/jquery.min.js"></script>
    <script src="../src/jQuery.stickUp.js"></script>

    $(function () {
        $('.fixedElem').stickUp();
    });


### jQuery.carousel.js

轮播图组件 [demo](http://shenxinle.github.io/myUtils/demos/carousel.html)

使用

    html:
    <div class="carousel">
        <ul>
            <li><img src="imgs/001.jpg"></li>
            <li><img src="imgs/002.jpg"></li>
            <li><img src="imgs/003.jpg"></li>
            <li><img src="imgs/004.jpg"></li>
        </ul>
    </div>

    css:
    .carousel {
        width: 600px;
        height: 400px;
        overflow: auto;
        margin: 0 auto;
    }
    .carousel ul {
        list-style: none;
    }
    .carousel li {
        float: left;
    }

    js:
    <script src="../bower_components/jquery/dist/jquery.min.js"></script>
    <script src="../src/jQuery.carousel.js"></script>

    var carousel = $('.carousel').carousel({
        speed: 300,     // 速度（ms）
        delay: 3000,    // 轮播时间间隔（ms）
        indicator: true,    // 是否显示指示图标
        arrow: true,    // 是否加上一个/下一个按钮
        interval: true,     // 自动轮播
        hoverStop: false    // 自动轮播时鼠标移上去是否暂停轮播
    });

返回 prev/next 方法用于自定义切换到上一幅/下一幅画面

### jQuery.pagepiling.js 

滚动翻页组件 [demo](http://shenxinle.github.io/myUtils/demos/pagepiling.html)

使用

    html:
    <div class="pagepiling">
        <div class="section section1"></div>
        <div class="section"></div>
        <div class="section"></div>
        <div class="section"></div>
    </div>

    css:
    div.pagepiling {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }
    div.pagepiling > div.section {
        position: absolute;
        width: 100%;
        height: 100%;
    }
    div.section1 {
        z-index: 1;
    }

    js:
    <script src="../bower_components/jquery/dist/jquery.min.js"></script>
    <script src="../src/jQuery.pagepiling.js"></script>
    $(function () {
        $('.pagepiling').pagepiling();
    });

### jQuery.headRoom.js

向下滚动时隐藏 fixed header nav, 向上滚动时显示出来 [demo](http://shenxinle.github.io/myUtils/demos/headRoom.html)

使用

    $(function () {
        $('.header').headRoom();
    });

### lazyload.js

基于 jQuery / Zepto 图片懒加载组件 [pc demo](http://shenxinle.github.io/myUtils/demos/lazyload.html) / [mobile demo](http://shenxinle.github.io/myUtils/demos/m.lazyload.html)

使用

    <img src="imgs/placeholder.jpg" data-src="imgs/001.jpg" >

    $('img[data-src]').lazyload();

### m.carousel.js

基于 Zepto 的移动端轮播图组件 [demo](http://shenxinle.github.io/myUtils/demos/m.carousel.html)

使用

    html:
    <div class="carousel">
        <ul>
            <li><img src="imgs/001.jpg"></li>
            <li><img src="imgs/002.jpg"></li>
            <li><img src="imgs/003.jpg"></li>
            <li><img src="imgs/004.jpg"></li>
        </ul>
    </div>

    css:
    .carousel {
        width: 20rem;
        height: 14rem;
        overflow: auto;
        margin: 0 auto;
    }
    .carousel ul {
        list-style: none;
    }
    .carousel li {
        float: left;
    }

    js:
    <script src="../bower_components/zepto/zepto.min.js"></script>
    <script src="../src/m.carousel.js"></script>

    var carousel = $('.carousel').carousel({
        speed: 0.3,     // 速度（s）
        delay: 3,    // 轮播时间间隔（s）
        indicator: true,    // 是否显示指示图标
        interval: true     // 自动轮播
    });