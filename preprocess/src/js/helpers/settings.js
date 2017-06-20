let settings = () => {
    /* eslint-disable no-unused-vars */
    let $win               = $(window), 
        $doc               = $(document),
        doc                = document,
        $html              = $('html'),
        windowSize         = {},
        scrollTop          = 0,
        breakpoints        = {},
        isMobile           = null,
        isTabletPortrait   = null,
        isTabletLandscape  = null,
        isDesktop          = null,
        isAndroid          = null,
        isiOS              = null,
        isiPhone           = null,
        isIE8              = null,
        isIE9              = null,
        isChrome           = null,
        regexChromeVersion = /\bchrome\/(\d+\.\d+)/,
        chromeVersion      = null,
        isOldAndroidBrower = false,
        iosVersion         = null,
        ua                 = navigator.userAgent;

    //Set value of all variables
    windowSize.width = $win.outerWidth();
    windowSize.height = $win.outerHeight();
    scrollTop = $win.scrollTop();
    breakpoints = {
        mobile: 736,
        tabletPortrait: 800,
        tabletLandscape: 1140
    };
    isAndroid = (ua.indexOf('Android') !== -1) || (ua.indexOf('android') !== -1);
    isiOS = ua.match(/(iPad|iPhone|iPod)/g);
    isiPhone = ua.match(/(iPhone)/g);
    isIE8 = (typeof window.addEventListener === 'undefined');
    isIE9 = ((typeof doc.documentMode !== 'undefined') && (doc.documentMode !== 9));
    isChrome = (ua.indexOf('Chrome') !== -1) || (ua.indexOf('chrome') !== -1);
    iosVersion = parseInt(('' + (/CPU.*OS ([0-9_]{1,5})|(CPU like).*AppleWebKit.*Mobile/i.exec(ua) || [0, ''])[1]).replace('undefined', '3_2').replace('_', '.').replace('_', '')) || null;

    //Use Mordernizr to detect touch events
    if (typeof Modernizr !== 'undefined' && Modernizr.touchevents) {
        if (isChrome) {
            chromeVersion = parseFloat(regexChromeVersion.exec(ua.toLowerCase())[1]);
        }
        //Android browser is unfortunately undetectable, so under version 23 of Chrome, considering it's an old Android browser
        if (isAndroid && (!isChrome || chromeVersion < 23)) {
            isOldAndroidBrower = true;
        }
    }

    //Settings object with all options
    let settings = {
        $doc: $(doc),
        $win: $win,
        $html: $html,
        $body: $('body'),
        $htmlbody: $('html, body'),
        $container: $('#maz-container'),
        $containerPopins: $('#maz-container-popins'),
        $header: $('header'),
        $footer: $('footer'),
        $nav: $('nav'),
        windowSize: windowSize,
        scrollTop: scrollTop,
        isMobile: isMobile,
        isAndroid: isAndroid,
        isiOS: isiOS,
        isiPhone: isiPhone,
        isIE8: isIE8,
        isIE9: isIE9,
        iosVersion: iosVersion,
        isOldAndroidBrower: isOldAndroidBrower,
        breakpoints: breakpoints,
        debug: true
    };

    //Create obj getters setters
    let obj = {
        get: function (key) {
            return settings[key];
        },
        set: function (key, value) {
            settings[key] = value;
        }
    };

    //Update Breakpoints
    function updateBreakPoint() {
        isMobile = obj.get('windowSize').width <= obj.get('breakpoints').mobile;
        isTabletPortrait = obj.get('windowSize').width > obj.get('breakpoints').mobile && obj.get('windowSize').width <= obj.get('breakpoints').tabletPortrait;
        isTabletLandscape = obj.get('windowSize').width > obj.get('breakpoints').tabletPortrait && obj.get('windowSize').width <= obj.get('breakpoints').tabletLandscape;
        isDesktop = (!isMobile && !isTabletPortrait && !isTabletLandscape);

        obj.set('isMobile', isMobile);
        obj.set('isTabletPortrait', isTabletPortrait);
        obj.set('isTabletLandscape', isTabletLandscape);
        obj.set('isDesktop', isDesktop);
    }

    //OnResize, update screen width/height
    function windowResize() {
        windowSize.width = $win.outerWidth();
        windowSize.height = $win.outerHeight();

        obj.set('windowSize', windowSize);
        updateBreakPoint();
    }

    //OnScroll, update scrollTop
    function windowScroll() {
        obj.set('scrollTop', $win.scrollTop());
    }

    updateBreakPoint();

    //Listen resize and scroll events
    $win.on('resize', windowResize);
    $win.on('scroll', windowScroll);

    return obj;
    /* eslint-disable no-unused-vars */
};

export default settings();
