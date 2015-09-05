(function ($) {
    /*
    *  滚动后让目标元素 fixed 在浏览器窗口顶部
     */
    $.fn.stickUp = function () {
        var $this = this;
        var offsetTop = $this.offset().top;
        var offsetLeft = $this.offset().left;
        var fixed = false;

        $(window).on('scroll', function () {
            var scrollTop = $(document).scrollTop();
            // console.log(offsetTop, scrollTop);
            if(offsetTop <= scrollTop && !fixed) {
                $this.css({
                    'position': 'fixed',
                    'top': '0',
                    'left': offsetLeft
                });
                fixed = true;
            } else if(offsetTop > scrollTop && fixed) {
                $this.css({
                    'position': 'static',
                    'top': '',
                    'left': ''
                });
                fixed = false;
            }
        });
        return $this;
    };

})(jQuery);