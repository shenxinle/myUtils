(function ($) {
    /*
    *  向下滚动时隐藏 fixed header nav, 向上滚动时显示出来
    */
    $.fn.headRoom = function () {
        var $this = this,
            offsetLeft = $this.offset().left,
            headHeight = $this.height(),
            animationTime = 100,
            startHidePosition = 1.5*headHeight,
            scrollTop = undefined,
            onAnimation = false;

        $this.css({
            'position': 'fixed',
            'top': '0',
            'left': offsetLeft,
            'z-index': '99'
        });

        function hideHead() {
            if(onAnimation == true) {
                return;
            }
            onAnimation = true;
            $this.animate({
                'top': -headHeight
            }, animationTime, function () {
                onAnimation = false;
            });
        }

        function showHead() {
            if(onAnimation == true) {
                return;
            }
            onAnimation = true;
            $this.animate({
                'top': '0'
            }, animationTime, function () {
                onAnimation = false;
            });
        }

        $(window).on('scroll', function () {
            var newScrollTop = $(window).scrollTop();
            if(scrollTop !== undefined) {
                if(scrollTop < newScrollTop && scrollTop > startHidePosition) {
                    hideHead();
                } else if(scrollTop > newScrollTop) {
                    showHead();
                }
            }
            scrollTop = newScrollTop;
        })
    }

}(window.jQuery));