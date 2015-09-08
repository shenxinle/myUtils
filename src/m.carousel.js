(function ($) {
    /*
    * 移动端轮播图组件
    */
    $.fn.carousel = function (options) {
        // options setting
        var o = {
            speed: 0.3,
            delay: 3,
            indicator: true,
            interval: true
        };
        $.extend(o, options);

        // useful variable
        var $this = this;
        var cWidth = $this.width(),
            cHeight = $this.height(),
            cCount = $this.find('ul li').length;
        var index = 0,
            indicatorBgc = '#444',
            indicatorBgcOn = '#eee',
            interval,
            onInterval = false,
            moving = false,
            marginLeft = 0;

        // carousel style initialize
        $this.css({
            'position': 'relative',
            'overflow': 'hidden'
        });
        $this.find('ul').width(cWidth*cCount)
                        .height(cHeight)
                        .addClass('carousel-inner')
            .find('li').width(cWidth)
                        .height(cHeight)
            .find('img').width('100%')
                        .height('100%');

        // indicator style initialize and event binding
        if(o.indicator && cCount > 1) {
            // indicator initialize
            var indicator = document.createElement('ul');
            var li = document.createElement('li');
            indicator.className = 'indicator';
            $(indicator).css({
                'position': 'absolute',
                'bottom': '20px',
                'left': '50%',
                'margin-left': -15*cCount/2
            });
            $(li).css({
                'width': '10px',
                'height': '10px',
                'border': '2px solid #ddd',
                'border-radius': '50%',
                'margin-right': '5px',
                'background-color': indicatorBgc
            });
            for(var i = 0; i<cCount; i++) {
                $(indicator).append($(li).clone().attr('data-index', i));
            }
            $this.append(indicator);
            $this.find('ul.indicator li').eq(0).css({
                'background-color': indicatorBgcOn
            });
        }

        var start = {},
            end = {},
            delta = {},
            swipeDir;

        // binding touch events
        $this.find('ul.carousel-inner').on('touchstart', touchstart);

        function touchstart(e) {
            if(moving) {
                return;
            }
            if(onInterval) {
                clearInterval(interval);
                onInterval = false;
            }

            start.x = e.touches[0].clientX;
            start.y = e.touches[0].clientY;
            start.time = (new Date()).getTime();

            $(this).on('touchmove', touchmove)
                .on('touchend', touchend);
        }

        function touchmove(e) {
            e.preventDefault();

            end.x = e.touches[0].clientX;
            end.y = e.touches[0].clientY;
            end.time = (new Date()).getTime();
            delta.x = end.x - start.x;
            delta.y = end.y - start.y;
            delta.time = end.time - start.time;

            swipeDir = Math.abs(delta.x) > Math.abs(delta.y) ? (delta.x > 0 ? 'swipeRight' : 'swipeLeft') : (delta.y > 0 ? 'swipeTop' : 'swipeBottom');

            if(swipeDir === 'swipeRight' || swipeDir === 'swipeLeft') {
                if(marginLeft + delta.x < 0 && marginLeft + delta.x > (1-cCount)*cWidth) {
                    $(this).css('margin-left', marginLeft + delta.x);
                }
            }
        }

        function touchend(e) {
            var condition1,
                condition2,
                condition3,
                sign;

            if(swipeDir === 'swipeRight' || swipeDir === 'swipeLeft') {
                sign = swipeDir === 'swipeRight' ? 1 : -1;
                condition1 = Math.abs(delta.x) > cWidth / 2.5;
                condition2 = Math.abs(delta.x) > cWidth / 10 && delta.time < 300;
                condition3 = (marginLeft + sign*cWidth <= 0) && (marginLeft + sign*cWidth >= (1-cCount)*cWidth);
                // console.log(condition1, condition2, condition3, marginLeft + sign*cWidth);

                if((condition1 || condition2) && condition3) {
                    toPos(marginLeft + sign*cWidth);
                } else {
                    toPos(marginLeft);
                }
            }

            // unbinding touchmove and touchend
            $(this).off('touchmove', touchmove)
                .off('touchend', touchend);

            autoInterval();
        }

        function toPos(marginLeftPos) {
            var carouselInner = $this.find('ul.carousel-inner');

            carouselInner.css({
                '-webkit-transition': 'margin-left ' + o.speed + 's ease-in-out',
                'transition': 'margin-left ' + o.speed + 's ease-in-out'
            });

            // update indicator bgc
            if(marginLeft !== marginLeftPos) {
                $this.find('ul.indicator li').eq(Math.abs(parseInt(marginLeft / cWidth))).css('background-color', indicatorBgc);
                $this.find('ul.indicator li').eq(Math.abs(parseInt(marginLeftPos / cWidth))).css('background-color', indicatorBgcOn);
            }

            marginLeft = marginLeftPos;
            moving = true;
            carouselInner.css('margin-left', marginLeft);
            setTimeout(function () {
                carouselInner.css({
                    '-webkit-transition': '',
                    'transition': ''
                });
                moving = false;
            }, o.speed * 1000);
        }

        function autoInterval() {
            if(o.interval && cCount > 1) {
                interval = setInterval(function () {
                    var index = Math.abs(parseInt(marginLeft / cWidth)),
                        next = (index + 1) % cCount;

                    toPos(-next*cWidth);
                }, o.delay * 1000);

                onInterval = true;
            }
        }

        // autoplay
        autoInterval();
    }
}(window.Zepto));