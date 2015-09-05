(function ($) {
    /*
    *  轮播图组件
    * 
     */
    $.fn.carousel = function (options) {
        // options setting
        var o = {
            speed: 300,
            delay: 3000,
            indicator: true,
            arrow: true,
            interval: true,
            hoverStop: false
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
            moving = false;

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

            // indicator event
            $this.find('ul.indicator li').on('click', function (e) {
                e.stopPropagation();
                index = parseInt($(this).attr('data-index'));
                if(!moving) {
                    if(onInterval) {
                        clearInterval(interval);
                        onInterval = false;
                    }
                    toIndex(index);
                }
            })
        }
        // arrow style initialize and event binding
        if(o.arrow && cCount > 1) {
            $this.append('<div class="prev">&lt;</div><div class="next">&gt;</div>');
            $this.find('div.prev, div.next').css({
                'position': 'absolute',
                'top': '50%',
                'margin-top': '-25px',
                'width': '30px',
                'height': '50px',
                'background-color': '#fff',
                'opacity': '.2',
                'filter': 'alpha(opacity=20)',
                'text-align': 'center',
                'font-weight': '600',
                'padding-top': '25px'
            }).on('mouseover', function () {
                $(this).css({
                    'opacity': '.6',
                    'filter': 'alpha(opacity=60)',
                    'cursor': 'pointer'
                });
            }).on('mouseout', function () {
                $(this).css({
                    'opacity': '.2',
                    'filter': 'alpha(opacity=20)'
                });
            });
            $this.find('div.prev').css({
                'left': '5px'
            }).on('click', function (e) {
                e.stopPropagation();
                prev();
            });
            $this.find('div.next').css({
                'right': '5px'
            }).on('click', function (e) {
                e.stopPropagation();
                next();
            });
        }

        function toIndex(index) {
            moving = true;
            $this.find('ul.carousel-inner').animate({
                'margin-left': -index*cWidth
            }, o.speed, function () {
                moving = false;
                if(o.interval && !onInterval) {
                    autoInterval();
                }
            });

            $this.find('ul.indicator li').css({
                'background-color': indicatorBgc
            });
            $this.find('ul.indicator li').eq(index).css({
                'background-color': indicatorBgcOn
            });
        }
        function autoInterval() {
            interval = setInterval(function () {
                index = ++index % cCount;
                toIndex(index);
            }, o.delay);
            onInterval = true;
        }
        function prev() {
            if(!moving) {
                if(onInterval) {
                    clearInterval(interval);
                    onInterval = false;
                }
                index = (index + cCount - 1) % cCount;
                toIndex(index);
            }
        }
        function next() {
            if(!moving) {
                if(onInterval) {
                    clearInterval(interval);
                    onInterval = false;
                }
                index = (index + 1) % cCount;
                toIndex(index);
            }
        }

        // interval and hoverStop
        if(o.interval && cCount > 1) {
            autoInterval();
        }
        if(o.interval && o.hoverStop) {
            $this.on('mouseover', function () {
                if(onInterval) {
                    clearInterval(interval);
                    onInterval = false;
                }
            }).on('mouseout', function () {
                if(!onInterval) {
                    autoInterval();
                }
            });
        }

        return {
            prev: prev,
            next: next
        };
    }

})(jQuery);