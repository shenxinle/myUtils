(function ($) {
/*
*  lazyload
*/
    $.fn.lazyload = function () {
        var imgs = this,
            windowHeight = $(window).height();

        function loadVisibleImgs() {
            var minOffset = $(window).scrollTop(),
                maxOffset = minOffset + windowHeight;

            imgs = imgs.filter(function (index) {
                var imgOffsetTop = this.offsetTop,
                    imgHeight = this.offsetHeight;
                if(imgOffsetTop + imgHeight > minOffset && imgOffsetTop < maxOffset) {
                    $(this).attr('src', $(this).attr('data-src'));
                    return false;
                } else {
                    return true;
                }
            })
        }

        $(window).on('scroll', function () {
            // console.log('hi');
            if(imgs.length > 0) {
                loadVisibleImgs();
                // console.log(imgs);
            } else {
                $(window).off('scroll', arguments.callee);
            }
        });
        loadVisibleImgs();

    }

}(window.jQuery || window.Zepto));