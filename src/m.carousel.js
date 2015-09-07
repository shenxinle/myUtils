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

        $this.find('ul.carousel-inner')
            .on('touchstart', function (e) {
                // console.log(e);
                start.x = e.touches[0].clientX;
                start.y = e.touches[0].clientY;
                start.time = (new Date()).getTime();
            })
            .on('touchmove', function (e) {
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
            })
            .on('touchend', function (e) {
                var condition1,
                    condition2,
                    condition3,
                    sign;
                var the = $(this);

                if(swipeDir === 'swipeRight' || swipeDir === 'swipeLeft') {
                    the.css({
                        '-webkit-transition': 'margin-left ' + o.speed + 's ease-in-out',
                        'transition': 'margin-left ' + o.speed + 's ease-in-out'
                    });

                    sign = swipeDir === 'swipeRight' ? 1 : -1;
                    condition1 = Math.abs(delta.x) > cWidth / 2;
                    condition2 = Math.abs(delta.x) > cWidth / 10 && delta.time < 200;
                    condition3 = (marginLeft + sign*cWidth <= 0) && (marginLeft + sign*cWidth >= (1-cCount)*cWidth);
                    // console.log(condition1, condition2, condition3, marginLeft + sign*cWidth);

                    if((condition1 || condition2) && condition3) {
                        marginLeft = marginLeft + sign*cWidth;
                    }
                    the.css('margin-left', marginLeft);
                    setTimeout(function () {
                        the.css({
                            '-webkit-transition': '',
                            'transition': ''
                        });
                    }, o.speed * 1000);
                }
            });


    }
}(window.Zepto));