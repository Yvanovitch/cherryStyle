(function ($) {

jQuery.fn.hasScroll = function(axis){
    var overflow = this.css("overflow"),
        overflowAxis,
        bShouldScroll,
        bAllowedScroll,
        bOverrideScroll;
    
    if(typeof axis == "undefined" || axis == "y") {
        overflowAxis = this.css("overflow-y");
        (this.prop('tagName') == 'HTML')
            ? bShouldScroll = $('body').height() > $(window).height()
            : bShouldScroll = this.get(0).scrollHeight > this.innerHeight();
    }
    else overflowAxis = this.css("overflow-x");
    
    bAllowedScroll = (overflow == "auto" || overflow == "visible") ||
        (overflowAxis == "auto" || overflowAxis == "visible");
    
    bOverrideScroll = overflow == "scroll" || overflowAxis == "scroll";
    
    return (bShouldScroll && bAllowedScroll) || bOverrideScroll;
};

$.fn.mousedownScroll = function(fn, data){
    var ev_mds = function(e){
        if(inScrollRange(e)) fn.call(data, e);
    }
    $(this).on("mousedown", ev_mds);
    return ev_mds;
};

$.fn.mouseupScroll = function(fn, data){
    var ev_mus = function(e){
        if(inScrollRange(e)) fn.call(data, e);
    }
    $(this).on("mouseup", ev_mus);
    return ev_mus;
};

$.fn.mousedownContent = function(fn, data){
    var ev_mdc = function(e){
        if(!inScrollRange(e)) fn.call(data, e);
    }
    
    $(this).on("mousedown", ev_mdc);
    
    return ev_mdc;
};

$.fn.mouseupContent = function(fn, data){
    var ev_muc = function(e){
        if(!inScrollRange(e)) fn.call(data, e);
    }
    $(this).on("mouseup", ev_muc);
    return ev_muc;
};

var RECT = function(){
    this.top = 0;
    this.left = 0;
    this.bottom = 0;
    this.right = 0;
}

function inRect(rect, x, y){
    return (y >= rect.top && y <= rect.bottom) &&
        (x >= rect.left && x <= rect.right)
}

var scrollSize = measureScrollWidth();

function inScrollRange(event){
    var x = event.pageX,
        y = event.pageY,
        e = $(event.target),
        hasY = e.hasScroll(),
        hasX = e.hasScroll("x"),
        rX = null,
        rY = null,
        bInX = false,
        bInY = false;
    
    if(hasY){ 
        rY = new RECT();
        rY.top = e.offset().top;
        (e.prop('tagName') == 'HTML') ? rY.right = e.width() + scrollSize : rY.right = e.offset().left + e.width() ;
        rY.bottom = rY.top +e.height();
        rY.left = rY.right - scrollSize;
        
        //if(hasX) rY.bottom -= scrollSize;
        bInY = inRect(rY, x, y);
    }
    if(hasX){
        rX = new RECT();
        rX.bottom = e.offset().top + e.height();
        rX.left = e.offset().left;
        rX.top = rX.bottom - scrollSize;
        rX.right = rX.left + e.width();
        
        //if(hasY) rX.right -= scrollSize;
        bInX = inRect(rX, x, y);
    }
    
    return bInX || bInY;
}

function measureScrollWidth() {
    var scrollBarMeasure = $('<div />');
    $('body').append(scrollBarMeasure);
    scrollBarMeasure.width(50).height(50)
        .css({
            overflow: 'scroll',
            visibility: 'hidden',
            position: 'absolute'
        });

    var scrollBarMeasureContent = $('<div />').height(1);
    scrollBarMeasure.append(scrollBarMeasureContent);

    var insideWidth = scrollBarMeasureContent.width();
    var outsideWitdh = scrollBarMeasure.width();
    scrollBarMeasure.remove();

    return outsideWitdh - insideWidth;
};

function sendDebugMsg(msg){
    var eMsg = document.createElement("div");
     eMsg.innerHTML = msg;
     
    $("#debugger").prepend(eMsg);
    
    $(eMsg).animate({opacity: 0}, 1000, function(){
        $(this).remove();
    });
}

}) (jQuery);