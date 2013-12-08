/**
 * Created by quan on 13-11-19.
 */
(function () {
    var userAgent = navigator.userAgent.toLowerCase(),
        check = function (regex) {
            return regex.test(userAgent);
        },
        isStrict = document.compatMode == "CSS1Compat",
        version = function (is, regex) {
            var m;
            return (is && (m = regex.exec(userAgent))) ? parseFloat(m[1]) : 0;
        },
        docMode = document.documentMode,
        isOpera = check(/opera/),
        isOpera10_5 = isOpera && check(/version\/10\.5/),
        isChrome = check(/\bchrome\b/),
        isWebKit = check(/webkit/),
        isSafari = !isChrome && check(/safari/),
        isSafari2 = isSafari && check(/applewebkit\/4/), // unique to Safari 2
        isSafari3 = isSafari && check(/version\/3/),
        isSafari4 = isSafari && check(/version\/4/),
        isSafari5_0 = isSafari && check(/version\/5\.0/),
        isSafari5 = isSafari && check(/version\/5/),
        isIE = !isOpera && check(/msie/),
        isIE7 = isIE && ((check(/msie 7/) && docMode != 8 && docMode != 9 && docMode != 10) || docMode == 7),
        isIE8 = isIE && ((check(/msie 8/) && docMode != 7 && docMode != 9 && docMode != 10) || docMode == 8),
        isIE9 = isIE && ((check(/msie 9/) && docMode != 7 && docMode != 8 && docMode != 10) || docMode == 9),
        isIE10 = isIE && ((check(/msie 10/) && docMode != 7 && docMode != 8 && docMode != 9) || docMode == 10),
        isIE6 = isIE && check(/msie 6/),
        isGecko = !isWebKit && check(/gecko/),
        isGecko3 = isGecko && check(/rv:1\.9/),
        isGecko4 = isGecko && check(/rv:2\.0/),
        isGecko5 = isGecko && check(/rv:5\./),
        isGecko10 = isGecko && check(/rv:10\./),
        isFF3_0 = isGecko3 && check(/rv:1\.9\.0/),
        isFF3_5 = isGecko3 && check(/rv:1\.9\.1/),
        isFF3_6 = isGecko3 && check(/rv:1\.9\.2/),
        isWindows = check(/windows|win32/),
        isMac = check(/macintosh|mac os x/),
        isLinux = check(/linux/),
    //scrollbarSize = null,
        chromeVersion = version(true, /\bchrome\/(\d+\.\d+)/),
        firefoxVersion = version(true, /\bfirefox\/(\d+\.\d+)/),
        ieVersion = version(isIE, /msie (\d+\.\d+)/),
        operaVersion = version(isOpera, /version\/(\d+\.\d+)/),
        safariVersion = version(isSafari, /version\/(\d+\.\d+)/),
        webKitVersion = version(isWebKit, /webkit\/(\d+\.\d+)/),
        isSecure = /^https/i.test(window.location.protocol)
    avalon.bizui = avalon.bizui || {}
    bizui = avalon.bizui;
    avalon.mix(bizui, {
        isStrict: isStrict,
        isIEQuirks: isIE && (!isStrict && (isIE6 || isIE7 || isIE8 || isIE9)),
        isOpera: isOpera,
        isOpera10_5: isOpera10_5,
        isWebKit: isWebKit,
        isChrome: isChrome,
        isSafari: isSafari,
        isSafari3: isSafari3,
        isSafari4: isSafari4,
        isSafari5: isSafari5,
        isSafari5_0: isSafari5_0,
        isSafari2: isSafari2,
        isIE: isIE,
        isIE6: isIE6,
        isIE7: isIE7,
        isIE7m: isIE6 || isIE7,
        isIE7p: isIE && !isIE6,
        isIE8: isIE8,
        isIE8m: isIE6 || isIE7 || isIE8,
        isIE8p: isIE && !(isIE6 || isIE7),
        isIE9: isIE9,
        isIE9m: isIE6 || isIE7 || isIE8 || isIE9,
        isIE9p: isIE && !(isIE6 || isIE7 || isIE8),
        isIE10: isIE10,
        isIE10m: isIE6 || isIE7 || isIE8 || isIE9 || isIE10,
        isIE10p: isIE && !(isIE6 || isIE7 || isIE8 || isIE9),
        isGecko: isGecko,
        isGecko3: isGecko3,
        isGecko4: isGecko4,
        isGecko5: isGecko5,
        isGecko10: isGecko10,
        isFF3_0: isFF3_0,
        isFF3_5: isFF3_5,
        isFF3_6: isFF3_6,
        isFF4: 4 <= firefoxVersion && firefoxVersion < 5,
        isFF5: 5 <= firefoxVersion && firefoxVersion < 6,
        isFF10: 10 <= firefoxVersion && firefoxVersion < 11,
        isLinux: isLinux,
        isWindows: isWindows,
        isMac: isMac,
        chromeVersion: chromeVersion,
        firefoxVersion: firefoxVersion,
        ieVersion: ieVersion,
        operaVersion: operaVersion,
        safariVersion: safariVersion,
        webKitVersion: webKitVersion,
        isSecure: isSecure,
        eastWestRegion: {east: 1, west: 1},
        southNorthRegion: {south: 1, north: 1},
        zIndex: 19000,
        vmodels: {}
    })
    bizui.filterData = function (obj, prefix) {
        var result = {}
        for (var i in obj) {
            if (i.indexOf(prefix) === 0) {
                result[  i.replace(prefix, "").replace(/\w/, function (a) {
                    return a.toLowerCase()
                }) ] = obj[i]
            }
        }
        return result
    }
    bizui.idObjGen = function (prefix) {
        var id = prefix + setTimeout('1')
        return {bizuiId: id}
    }
    bizui.getChildren = function (element, vmodelId, vmodels, childName, onlyBizui, attachChild) {
        var comps = [], children = [], bizuiOptions = {}, el, deletes = []

        for (var i = 0, il = element.childNodes.length; i < il; i++) {
            el = element.childNodes[i]
            if (el.tagName) {
                var $el = avalon(el)
                var arg = $el.attr('ms-bizui')
                if (arg) {
                    var args = arg.split(',')
                    if (args[0] && childName && args[0] != childName) {
                        deletes.push(el)
                        continue
                    }
                    var vmodel = vmodels[0]
                    var bizuiId = args.length >= 2 ? args[1] : '$'

                    var childOptions = bizui.filterData(avalon(el).data(), args[0])
                    var vmOptsName = args.length == 3 ? args[2] : args[0]
                    var vmOptions = vmodel && vmOptsName && typeof vmodel[vmOptsName] == "object" ? vmodel[vmOptsName] : {}
                    if (vmOptions.$model) {
                        vmOptions = vmOptions.$model
                    }
                    childOptions = avalon.mix(true, {}, bizui.vmodels[args[0]], childOptions, vmOptions)
                    if (bizuiId == '$') {
                        bizuiId = childOptions.$bizuiType + setTimeout('1')
                    }
                    childOptions.bizuiId = bizuiId
                    $el.attr('ms-bizui', childOptions.$bizuiType + ',' + bizuiId + ',$' + bizuiId)
                    if (attachChild === true) {
                        childOptions.$element = el
                    }
                    el.stopScan = true
                    comps.push(childOptions)
                }
            }
            else {
                if (childName || onlyBizui === true) {
                    deletes.push(el)
                }
            }
        }
        for (var i = 0, il = deletes.length; i < il; i++) {
            element.removeChild(deletes[i])
        }
        for (var i = 0, il = comps.length; i < il; i++) {
            var comp = comps[i]
            var $bizuiId = '$' + comp.bizuiId
            children.push({
                $region: comp.region,
                $bizuiId: comp.bizuiId,
                $bizuiType: comp.$bizuiType,
                $left: comp.left,
                $top: comp.top,
                $height: comp.height,
                $width: comp.width
            })
            bizuiOptions[$bizuiId] = comp
        }
        return {children: children, bizuiOptions: bizuiOptions}
    }
    bizui.baseVModel = {
        bizuiId: '',
        $bizuiType: 'base',
        $layout: '',
        $containerId: '',
        $callback: avalon.noop,
        hidden: false,
        disabled: false,
        baseCls:'x-',
        ui:'',
        uiCls:'',
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        tooltip: '',
        ui: '',
        setLeft: function (left) {
            if (typeof left == 'number') {
                this.left = left
            }
            return this
        },
        setTop: function (top) {
            if (typeof top == 'number') {
                this.top = top
            }
            return this
        },
        setSize: function (width, height) {
            var me = this
            if (width && typeof width == 'object') {
                width = width.width
                height = width.height
            }
            if (typeof width == 'number') {
                me.width = width
            }
            if (typeof height == 'number') {
                me.height = height
            }
            return me
        },
        getContentSize: function () {
            return {
                width: this.width,
                height: this.height
            }
        },
        getSize: function () {
            var me = this
            return {width: me.width,
                height: me.height
            }
        },
        onContainerSizeChanged: avalon.noop
    }
    bizui.containerVModel = avalon.mix(true, {}, bizui.baseVModel, {
        $bizuiType: 'container',
        $childIds: [],
        src: '',
        $callback: function (vm) {
            var me = this
            vm.$containerId = me.bizuiId
            me.$childIds.push(vm.bizuiId)
        },
        add: function (comp) {

        },
        setLeft: function (left) {
            if (typeof left == 'number') {
                this.left = left
            }
        },
        setTop: function (top) {
            if (typeof top == 'number') {
                this.top = top
            }
        },
        setSize: function (width, height) {
            var me = this
            if (width && typeof width == 'object') {
                width = width.width
                height = width.height
            }
            if (typeof width == 'number') {
                me.width = width
            }
            if (typeof height == 'number') {
                me.height = height
            }
            for (var i = 0, il = me.$childIds.length; i < il; i++) {
                var child = avalon.vmodels[me.$childIds[i]]
                if (child && child.onContainerSizeChanged) {
                    child.onContainerSizeChanged(me.getContentSize())
                }
            }
        }
    })
    avalon.bindingHandlers['bizui'] = function (data, vmodels) {
        var args = data.value.match(avalon.rword), element = data.element, widget = args[0], ret = 0
        if (args[1] === "$") {
            args[1] = void 0
        }
        element.stopScan = true
        var constructor = avalon.bizui[widget]
        if (typeof constructor === "function") {//ms-widget="tabs,tabsAAA,optname"

            var vmodel = vmodels[0], opts = args[2] || widget //options在最近的一个VM中的名字
            var vmOptions = vmodel && opts && typeof vmodel[opts] == "object" ? vmodel[opts] : {}
            if (!args[1]) {
                if (vmOptions.bizuiId) {
                    args[1] = vmOptions.bizuiId
                } else {
                    args[1] = widget + setTimeout('1')
                    vmOptions.bizuiId = args[1]
                }
            } else {
                vmOptions.bizuiId = args[1]
            }
            data.node.value = args.join(",")
            var elemData = bizui.filterData(avalon(element).data(), args[0])
            data[ widget + "Id"] = args[1]
            data[ widget + "Options"] = avalon.mix({}, constructor.defaults, vmOptions, elemData)
            element.stopScan = false
            var newModel = constructor(element, data, vmodels)
            if (vmodel && vmodel.$callback && newModel) {
                vmodel.$callback.apply(vmodel, [newModel])
            }
            ret = 1
        } //如果碰到此组件还没有加载的情况，将停止扫描它的内部
        data.remove = ret;
    }
    var initExtCss = function() {
        // find the body element
        var bd = bizui.body,
            prefix = 'x-',
            cls = [prefix + 'body'],
            htmlCls = [],
            //supportsLG = bizui.supports.CSS3LinearGradient,
            //supportsBR = bizui.supports.CSS3BorderRadius,
            html;

        if (!bd) {
            return false;
        }

        html = bd.parentNode;

        function add (c) {
            cls.push(prefix + c);
        }

        //Let's keep this human readable!
        if (bizui.isIE && bizui.isIE9m) {
            add('ie');

            // very often CSS needs to do checks like "IE7+" or "IE6 or 7". To help
            // reduce the clutter (since CSS/SCSS cannot do these tests), we add some
            // additional classes:
            //
            //      x-ie7p      : IE7+      :  7 <= ieVer
            //      x-ie7m      : IE7-      :  ieVer <= 7
            //      x-ie8p      : IE8+      :  8 <= ieVer
            //      x-ie8m      : IE8-      :  ieVer <= 8
            //      x-ie9p      : IE9+      :  9 <= ieVer
            //      x-ie78      : IE7 or 8  :  7 <= ieVer <= 8
            //
            if (bizui.isIE6) {
                add('ie6');
            } else { // ignore pre-IE6 :)
                add('ie7p');

                if (bizui.isIE7) {
                    add('ie7');
                } else {
                    add('ie8p');

                    if (bizui.isIE8) {
                        add('ie8');
                    } else {
                        add('ie9p');

                        if (bizui.isIE9) {
                            add('ie9');
                        }
                    }
                }
            }

            if (bizui.isIE7m) {
                add('ie7m');
            }
            if (bizui.isIE8m) {
                add('ie8m');
                add('nbr');
                add('nlg');
            }
            if (bizui.isIE9m) {
                add('ie9m');
            }
            if (bizui.isIE7 || bizui.isIE8) {
                add('ie78');
            }
        }

        if (bizui.isIE10) {
            add('ie10');
        }

        if (bizui.isGecko) {
            add('gecko');
            if (bizui.isGecko3) {
                add('gecko3');
            }
            if (bizui.isGecko4) {
                add('gecko4');
            }
            if (bizui.isGecko5) {
                add('gecko5');
            }
        }
        if (bizui.isOpera) {
            add('opera');
        }
        if (bizui.isWebKit) {
            add('webkit');
        }
        if (bizui.isSafari) {
            add('safari');
            if (bizui.isSafari2) {
                add('safari2');
            }
            if (bizui.isSafari3) {
                add('safari3');
            }
            if (bizui.isSafari4) {
                add('safari4');
            }
            if (bizui.isSafari5) {
                add('safari5');
            }
            if (bizui.isSafari5_0) {
                add('safari5_0')
            }
        }
        if (bizui.isChrome) {
            add('chrome');
        }
        if (bizui.isMac) {
            add('mac');
        }
        if (bizui.isLinux) {
            add('linux');
        }
        //if (!supportsBR) {
        //    add('nbr');
       // }
        //if (!supportsLG) {
         //   add('nlg');
        //}

        // add to the parent to allow for selectors x-strict x-border-box, also set the isBorderBox property correctly
        if (html) {
            if (bizui.isStrict && (bizui.isIE6 || bizui.isIE7)) {
                bizui.isBorderBox = false;
            }
            else {
                bizui.isBorderBox = true;
            }

            if(!bizui.isBorderBox) {
                htmlCls.push(prefix + 'content-box');
            }
            if (bizui.isStrict) {
                htmlCls.push(prefix + 'strict');
            } else {
                htmlCls.push(prefix + 'quirks');
            }
            avalon(html).addClass(htmlCls.join(' '));
        }

        avalon(bd).addClass(cls.join(' '));
        return true;
    };
    avalon.ready(function(){
        bizui.body = document.body || document.getElementsByTagName('body')[0]
        initExtCss()
    })
}())