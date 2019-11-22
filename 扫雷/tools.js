function loadScript(url, callback) {
    let script = document.createElement("script");
    script.type = "text/javascript";

    if (script.readyState) {// IE的
        scripr.onreadystatechange = function () {
            if (script.readyState == 'complete' || script.readyState == 'loaded') {
                callback();
            }
        }
    } else {
        script.onload = function () {// Safari chrome firefox opera的
            callback();
        }
    }
    script.src = url;
    document.head.appendChild(script);
}

function addEvent(ele, type, handle) {
    if (ele.addEventListener) {
        ele.addEventListener(type, handle, false);
    } else if (ele.attachEvent) {
        ele.attachEvent('on' + type, function () {
            handle.call(ele);
        });
    } else {
        ele['on' + type] = handle;
    }
}

function removeEvent(ele, type, handle) {
    if (ele.removeEventListener) {
        ele.removeEventListener(type, handle, false);
    } else {
        ele.deatachEvent('on' + type, handle);
    }
}

function cancelHandler(event) {
    let e = event || window.event;
    if (e.preventDefault) {
        e.preventDefault();
    } else {
        e.returnValue = false;
    }
}

function stopBubble(event) {
    event = event || window.event;
    if (event.stopPropagation) {
        event.stopPropagation();
    } else {
        event.cancleBubble = true;
    }
}

function getScrollOffset() {
    if (window.pageXoffset) {
        return {
            x: window.pageXOffset,
            y: window.pageYOffset
        }
    } else {
        return {
            x: document.body.scrollLeft + document.documentElement.scrollLeft,
            y: document.body.scrollTop + document.documentElement.scrollTop
        }
    }
}

function getSibling(node, n) {
    while (n) {
        if (n > 0) {
            node = node.nextSibling;
            while (node.nodeType != 1) {
                node = node.nextSibling;
                if (!node) {
                    return null;
                }
            }
            n--;
        }
        if (n < 0) {
            node = node.previousSibling;
            while (node.nodeType != 1) {
                node = node.previousSibling;
                if (!node) {
                    return null;
                }
            }
            n++;
        }
    }
    return node;
}

function getViewportOffset() {
    if (window.innerWidth) {
        return {
            w: window.innerWidth,
            h: window.innerHeight
        }
    } else {
        if (document.compatMode === "BackCompat") {
            return {
                w: document.body.clientWidth,
                h: document.body.clientHeight
            }
        } else {
            return {
                w: document.documentElement.clientWidth,
                h: document.documentElement.clientHeight
            }
        }
    }
}

Element.prototype.insertAfter = function (a, b) {
    var node = b.nextElementSibling;
    if (node) {
        this.insertBefore(a, node);
    } else {
        this.appendChild(a);
    }
}

function reverseChild(node) {
    let len = node.children.length,
        arr = [];
    for (let i = len - 1; i >= 0; i--) {
        arr.push(node.removeChild(node.children[i]));
    }
    for (let i = 0; i < len; i++) {
        node.appendChild(arr[i]);
    }
}


