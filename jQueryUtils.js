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

    /*
    * 滚动翻页组件
     */
    $.fn.pagepiling = function () {
        // MDN 鼠标滚轮兼容方案
        // creates a global "addWheelListener" method
        // example: addWheelListener( elem, function( e ) { console.log( e.deltaY ); e.preventDefault(); } );
        (function(window,document) {
            var prefix = "", _addEventListener, onwheel, support;

            // detect event model
            if ( window.addEventListener ) {
                _addEventListener = "addEventListener";
            } else {
                _addEventListener = "attachEvent";
                prefix = "on";
            }

            // detect available wheel event
            support = "onwheel" in document.createElement("div") ? "wheel" : // 各个厂商的高版本浏览器都支持"wheel"
                      document.onmousewheel !== undefined ? "mousewheel" : // Webkit 和 IE一定支持"mousewheel"
                      "DOMMouseScroll"; // 低版本firefox

            window.addWheelListener = function( elem, callback, useCapture ) {
                _addWheelListener( elem, support, callback, useCapture );

                // handle MozMousePixelScroll in older Firefox
                if( support == "DOMMouseScroll" ) {
                    _addWheelListener( elem, "MozMousePixelScroll", callback, useCapture );
                }
            };

            function _addWheelListener( elem, eventName, callback, useCapture ) {
                elem[ _addEventListener ]( prefix + eventName, support == "wheel" ? callback : function( originalEvent ) {
                    !originalEvent && ( originalEvent = window.event );

                    // create a normalized event object
                    var event = {
                        // keep a ref to the original event object
                        originalEvent: originalEvent,
                        target: originalEvent.target || originalEvent.srcElement,
                        type: "wheel",
                        deltaMode: originalEvent.type == "MozMousePixelScroll" ? 0 : 1,
                        deltaX: 0,
                        deltaZ: 0,
                        preventDefault: function() {
                            originalEvent.preventDefault ?
                                originalEvent.preventDefault() :
                                originalEvent.returnValue = false;
                        }
                    };
                    
                    // calculate deltaY (and deltaX) according to the event
                    if ( support == "mousewheel" ) {
                        event.deltaY = - 1/40 * originalEvent.wheelDelta;
                        // Webkit also support wheelDeltaX
                        originalEvent.wheelDeltaX && ( event.deltaX = - 1/40 * originalEvent.wheelDeltaX );
                    } else {
                        event.deltaY = originalEvent.detail;
                    }

                    // it's time to fire the callback
                    return callback( event );

                }, useCapture || false );
            }
        })(window,document);

        var $this = this,
            sections = $this.children('.section'),
            pageCounts = sections.length,
            pageWidth,
            pageHeight,
            pageIndex = 0,
            switchTime = 400,
            onMoving = false,
            indicator = true,
            indicatorBgc = '#eee',
            indicatorBgcOn = '#111';
        updateDimention();
        // console.log(pageWidth, pageHeight);

        sections.each(function (index, elem) {
            $(elem).css({
                'z-index': pageCounts - index
            });
        });

        // indicator
        if(indicator) {console.log('hi');
            // indicator initialize
            var indicator = document.createElement('ul');
            var li = document.createElement('li');
            indicator.className = 'indicator';
            $(indicator).css({
                'position': 'absolute',
                'top': '50%',
                'right': '30px',
                'margin-top': -25*pageCounts/2,
                'list-style': 'none',
                'padding': '0',
                'z-index': '99'
            });
            $(li).css({
                'width': '15px',
                'height': '15px',
                'border': '2px solid #111',
                'border-radius': '50%',
                'margin-top': '10px',
                'background-color': indicatorBgc
            });
            for(var i = 0; i<pageCounts; i++) {
                $(indicator).append($(li).clone().attr('data-page', i));
            }
            $this.append(indicator);
            $this.find('ul.indicator li').eq(0).css({
                'background-color': indicatorBgcOn
            });

            // indicator event
            $this.find('ul.indicator li').on('click', function (e) {
                e.stopPropagation();
                var index = parseInt($(this).attr('data-page'));
                toPage(index);
            });
        }

        function updateDimention() {
            pageWidth = $this.width();
            pageHeight = $this.height();
        }

        function toPage(index) {
            if(onMoving) {
                return;
            }
            if(index !== pageIndex) {
                $this.find('ul.indicator li').eq(pageIndex).css({
                    'background-color': indicatorBgc
                });
                $this.find('ul.indicator li').eq(index).css({
                    'background-color': indicatorBgcOn
                });
            }
            if(index > pageIndex) {
                for(var i = pageIndex+1; i < index; i++) {
                    sections.eq(i).css({
                        'top': -pageHeight
                    });
                }
                onMoving = true;
                sections.eq(pageIndex).animate({
                    'top': -pageHeight
                }, switchTime, function () {
                    pageIndex = index;
                    onMoving = false;
                });
            } else if (index < pageIndex) {
                onMoving = true;
                sections.eq(index).animate({
                    'top': '0'
                }, switchTime, function () {
                    for(var i = index+1; i < pageIndex; i++) {
                        sections.eq(i).css({
                            'top': '0'
                        });
                    }
                    pageIndex = index;
                    onMoving = false;
                })
            }
        }

        function toPrevPage() {
            var prevPageIndex = (pageIndex + pageCounts - 1) % pageCounts;
            toPage(prevPageIndex);
        }

        function toNextPage() {
            var nextPageIndex = (pageIndex + 1) % pageCounts;
            toPage(nextPageIndex);
        }

        // binding event
        $(document).on('keydown', function (e) {
            // console.log(e);
            switch(e.keyCode) {
                case 37:
                case 38: toPrevPage(); break;
                case 39:
                case 40: toNextPage(); break;
            }
        });

        window.addWheelListener(document, function (e) {
            // console.log(e);
            var deltaY = e.deltaY;
            // console.log(deltaY);
            if(deltaY > 0) {
                toNextPage();
            } else if(deltaY < 0) {
                toPrevPage();
            }
        }, false);
    }

})(jQuery);