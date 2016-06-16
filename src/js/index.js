(function (window,Modernizer) {
    if (!Modernizer) {
        throw Error('Modernizer is not defined ...');
    }

    var getCss = function(o,key){
        // ie || ff/chrome
        return o.currentStyle? o.currentStyle[key] : window.getComputedStyle(o,false)[key];
    };


    var curIndex = -1;

    var curDom = null;


    var bindEvent = function (dom,type,cb) {

        if(typeof cb != 'function'){
            throw new TypeError('binding listener must be function ... ');
        }
        //ie8 above
        if(typeof window.addEventListener == 'function'){
            dom.addEventListener(type,cb);
        // under ie8
        }else if(typeof window.attachEvent == 'function'){
            dom.attachEvent('on'+type,cb);
        }else{
            dom['on'+type] = cb;
        }
    };
    
    var unbindEvent = function (dom, type, cb) {
        if(typeof cb != 'function'){
            throw new TypeError('unbinding listener must be function ... ');
        }
        //ie8 above
        if(typeof window.addEventListener == 'function'){
            dom.removeEventListener(type,cb);
            // under ie8
        }else if(typeof window.attachEvent == 'function'){
            dom.detachEvent('on'+type,cb);
        }else{
            dom['on'+type] = null;
        }
    };


    function onDragStart(dom,node){

        var startEvent = '';
        var endEvent = '';
        var onEvent = '';
        if(Modernizer.touch){
            startEvent = 'touchstart';
            endEvent = 'touchend';
            onEvent = 'touchmove';
        }else{
            startEvent = 'mousedown';
            endEvent = 'mouseup';
            onEvent = 'mousemove';
        }

        bindEvent(dom,startEvent,function(e){
            e.preventDefault();
            e =  e || window.event;
            var _target = dom;
            //removeClass(_target,'spin');
            addClass(_target,'ondrag');
            epollClass(_target,'current');
            removeClass(_target.parentNode.children);
            node.left = parseFloat(getCss(_target,'left'));
            node.top = parseFloat(getCss(_target,'top'));
            if(Modernizer.touch){
                node.currentX = e.touches[0].clientX;
                node.currentY = e.touches[0].clientY;
            }else{
                node.currentX = e.clientX;
                node.currentY = e.clientY;
            }
            curIndex = node.index;
            curDom = dom;
            onDraging(onEvent);
        });

        bindEvent(document,endEvent,function(e){

            unbindEvent(document,onEvent,handleDrag);

            // if dragging no block,break
            if(curIndex < 0){
                return;
            }
            var _target = curDom;
            //addClass(_target,'spin');
            removeClass(_target,'ondrag');
            offDraging(onEvent);
            curIndex = -1;
            curDom = null;
        });
        bindEvent(document,'onselectstart',function(){
            return false;
        });
    }

    function handleDrag(e){
        e =  e || window.event;
        var _target = curDom;
        var node = nodes[curIndex];
        var x, y,style;
        if(Modernizer.touch){

            x = e.touches[0].clientX - node.currentX + node.left;
            y = e.touches[0].clientY - node.currentY + node.top;
            style = ';left:'+x+'px;top:'+y+'px;';
            _target.style=style;
        }else{

            x = e.clientX - node.currentX + node.left;
            y = e.clientY - node.currentY + node.top;
            style = ';left:'+x+'px;top:'+y+'px;';
            _target.style=style;
        }
    }

    function onDraging(eventType){
        bindEvent(document,eventType,handleDrag);
    }

    function offDraging(eventType){
        unbindEvent(document,eventType,handleDrag);
    }


    function addClass(dom,clz){
        if(clz && typeof clz  == 'string'){
            if(!hasClass(dom,clz)){
                dom.className = dom.className + ' ' + clz;
            }
        }
    }

    function removeClass(dom,clz){
        if(clz && typeof clz  == 'string'){
            if(dom.className){
                dom.className = dom.className.replace(new RegExp(clz,'g'),'');
                dom.className = dom.className.replace(new RegExp('  ','g'),' ');
            }
        }
    }

    function epollClass(dom,clz){
        var cs = dom.parentNode.children;
        for(var i = 0;i < cs.length; i ++){
            removeClass(cs[i],clz);
        }
        addClass(dom,clz);
    }

    function hasClass(dom,clz){
        if(clz && typeof clz  == 'string'){
            if(dom.className){
                return new RegExp(clz,"g").test(dom.className);
            }
            return false;
        }
        return false;
    }


    var blocks = document.getElementsByClassName('block');

    var nodes = [];

    for(var i = 0;i < blocks.length;i++){
        var block = blocks[i];
        var node = {
            currentX : 0,
            currentY : 0,
            left : 0,
            top : 0,
            index:i
        };
        nodes.push(node);
        onDragStart(block,node);
    }

})(window,window.Modernizr);