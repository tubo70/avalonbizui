/**
 * Created by quan on 13-11-19.
 */
avalon.bizui = avalon.bizui || {}
var bizui = avalon.bizui
bizui.eastWestRegion = {east: 1, west: 1}
bizui.southNorthRegion = {south: 1, north: 1}
/*bizui.dispatchEvent = function (el, event) {
 if (document.createEventObject) {
 // IE浏览器支持fireEvent方法
 var evt = document.createEventObject();
 return el.fireEvent('on' + event, evt)
 }
 else {
 // 其他标准浏览器使用dispatchEvent方法
 var evt = document.createEvent('HTMLEvents');
 // initEvent接受3个参数：
 // 事件类型，是否冒泡，是否阻止浏览器的默认行为
 evt.initEvent(event, true, true);
 return !el.dispatchEvent(evt);
 }
 }*/
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
bizui.getChildren = function (element, vmodelId, vmodels, childName, onlyBizui) {
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
bizui.zIndex = 18990
bizui.vmodels = {}
bizui.vmodels['panel'] = avalon.mix(true, {}, bizui.containerVModel, {
    $bizuiType: 'panel',
    region: 'none',
    border: true,
    split: false,
    title: '',
    headerHeight: 25,
    headerToolAmount: 0,
    collapsible: false,
    collapsed: false,
    getContentSize: function () {
        return {
            width: this.width,
            height: this.height - this.headerHeight
        }
    },
    content: '<div></div>'
})
bizui.vmodels['viewport'] = avalon.mix(true, {}, bizui.containerVModel, {
    $bizuiType: 'viewport',
    $regions: [],
    $regionOrders: {},
    $addedRegionAmount: 0

})

bizui.vmodels['tool'] = avalon.mix(true, {}, bizui.baseVModel, {
    $bizuiType: 'tool',
    type: 'close',
    box: true,
    disabled: false,
    handler: avalon.noop
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
        //newModel = constructor(element, data, vmodels)
        if (vmodel && vmodel.$callback && newModel) {
            vmodel.$callback.apply(vmodel,[newModel])
        }
        ret = 1
    } //如果碰到此组件还没有加载的情况，将停止扫描它的内部
    data.remove = ret;
}