/**
 * Created by quan on 13-12-1.
 */
//TODO 增加自动居中
//Todo 增加buttons配置，这个需要button完成之后
define(['avalon', 'bizui.mask', 'bizui.tool', 'avalon.draggable'], function (avalon) {
    bizui.vmodels['window'] = avalon.mix(true, {}, bizui.vmodels['panel'], {
        $bizuiType: 'window',
        closable: true,//可关闭的
        //closeAction:'hidden',//'destory'
        draggable: true,//是否可拖动
        headerHeight: 21,
        ghost: false,//拖动的时候启用影子
        modal: true,
        resizable: true,//是否可改变大小
        resizing: false,
        resizingLeft: 0,
        resizingTop: 0,
        resizingWidth: 0,
        resizingHeight: 0,
        dragging: false,
        autoScroll:false,//内容区自动滚动条
        zIndex: 19000

    })
    var resizeMaps = {}
    resizeMaps['north'] = {position: 'top', size: 'height', ratio: -1, calcChange: 'top'}
    resizeMaps['south'] = {size: 'height', ratio: 1, calcChange: 'top'}
    resizeMaps['west'] = {position: 'left', size: 'width', ratio: -1, calcChange: 'left'}
    resizeMaps['east'] = {size: 'width', ratio: 1, calcChange: 'left'}

    avalon.bizui['window'] = function (element, data, vmodels) {
        var options = avalon.mix(true, {}, bizui.vmodels['window'], data.windowOptions)
        element.stopScan = true
        bizui.zIndex += 10
        options.zIndex = bizui.zIndex
        var $element = avalon(element)
        var parentNode = element.parentNode
        var vmodel = avalon.define(data.windowId, function (vm) {
            avalon.mix(vm, options)
            vm.close = function () {
                vm.hidden = true
            }
            vm.$watch('hidden', function (newValue, oldValue) {
                if (newValue === true && vm.modal === true) {
                    if (bizui.currentMask) {
                        bizui.currentMask.removeMask()
                    }
                }
            })
            vm.moveDragHandle = function (e) {
                var el = e.target
                while (el.nodeName != "BODY") {
                    if (avalon(el).hasClass('x-window-header-text-container')) {
                        return el
                    } else {
                        el = el.parentNode
                    }
                }
            }
            vm.moveDrag = function (e, data) {
                if (vm.dragging === false) {
                    var me = this
                    var $me = avalon(me)
                    $me.addClass('x-hide-offsets')
                }
                vm.dragging = true
            }
            vm.moveDragStop = function (e, data) {
                var me = this
                var $me = avalon(me)
                $me.removeClass('x-hide-offsets')
                vm.left = data.left
                vm.top = data.top
                vm.dragging = false
            }
            vm.resizeDrag = function (e, data) {
                var me = this
                var $me = avalon(me)
                if (vm.resizing === false) {
                    vm.resizing = true
                    vm.resizingLeft = vm.left
                    vm.resizingTop = vm.top
                    vm.resizingHeight = vm.height
                    vm.resizingWidth = vm.width
                }
                var datas = $me.data()
                var positions = datas.position
                positions.replace(/[^, ]+/g, function (position) {
                    var map = resizeMaps[position]
                    for (var type in map) {
                        var name = map[type]
                        if (typeof name == 'number') {
                            continue
                        }
                        var upperName = name.substring(0, 1).toUpperCase() + name.substring(1)
                        if (type == 'position') {
                            vm['resizing' + upperName] = data[name] + vm[name]
                        }
                        if (type == 'size') {
                            var calcName = map['calcChange']
                            var upperCalcName = calcName.substring(0, 1).toUpperCase() + calcName.substring(1)
                            vm['resizing' + upperName] = vm[name] + (data[calcName] - data['start' + upperCalcName]) * map['ratio']
                        }
                    }
                })
            }
            vm.resizeDragStop = function (e, data) {
                var me = this
                var $me = avalon(me)
                var datas = $me.data()
                var positions = datas.position
                positions.replace(/[^, ]+/g, function (position) {
                    var map = resizeMaps[position]
                    for (var type in map) {
                        var name = map[type]
                        if (typeof name == 'number') {
                            continue
                        }
                        var upperName = name.substring(0, 1).toUpperCase() + name.substring(1)
                        if (type == 'position') {
                            vm[name] = vm['resizing' + upperName]
                        }
                        if (type == 'size') {
                            vm[name] = vm['resizing' + upperName]
                        }
                    }
                })
                me.style.left = ''
                me.style.top = ''
                me.style.right = ''
                me.style.bottom = ''
                vm.resizing = false
            }

        })

        var shadowTemplate = '<div ms-visible="!hidden && !dragging" class="x-css-shadow" role="presentation"' +
            ' ms-css-z-index="zIndex" ms-css-left="left" ms-css-top="top+4" ms-css-width="width" ms-css-height="{{height<=4?\'\':height-4}}" style="box-shadow: rgb(136, 136, 136) 0px 0px 4px;"></div>'
        var shadowElement = avalon.parseHTML(shadowTemplate)
        document.body.appendChild(shadowElement)
        shadowElement = document.body.lastChild
        var windowTemplate = '<div class="x-window-header  x-docked x-window-header-default x-horizontal x-window-header-horizontal x-window-header-default-horizontal x-top x-window-header-top x-window-header-default-top x-docked-top x-window-header-docked-top x-window-header-default-docked-top x-unselectable"' +
            ' ms-class="x-window-header-draggable:draggable"' +
            ' ms-attr-style="left: -1px; top: -1px; width: {{width}}px;">' +
            '<div class="x-window-header-body x-window-header-body-default x-window-header-body-horizontal x-window-header-body-default-horizontal x-window-header-body-top x-window-header-body-default-top x-window-header-body-docked-top x-window-header-body-default-docked-top x-window-header-body-default-horizontal x-window-header-body-default-top x-window-header-body-default-docked-top x-box-layout-ct" ms-css-width="width-12">' +
            '<div class="x-box-inner " role="presentation" ms-css-width="width-12" style="height: 17px;">' +
            '<div style="position: absolute; left: 0px; top: 0px; height: 1px;" ms-css-width="width-12">' +
            '<div class="x-component x-window-header-text-container x-box-item x-component-default"' +
            ' style="text-align: left; left: 0px; top: 0px; margin: 0px;" ms-css-width="width-29">' +
            '<span class="x-window-header-text x-window-header-text-default">{{title}}</span></div>' +
            '<div   style="position:absolute !important;" ms-css-left="width-12-16"><div ms-bizui="tool" data-tool-handler="close" data-tool-type="close"></div></div></div></div></div></div>' +
            '<div class="x-window-body x-window-body-default x-closable x-window-body-closable x-window-body-default-closable x-layout-fit" ms-css-width="width-10" ms-css-height="{{height<=(headerHeight+9)?\'\':height-(headerHeight+9)}}" ms-css-overflow="{{autoScroll?\'auto\':\'\'}}" style="left: 0px; top: 20px;">' + element.innerHTML + '</div>' +
            '<div ms-if="resizable" data-position="north" ms-draggable="' + data.windowId + '" data-drag-drag="resizeDrag" data-drag-stop="resizeDragStop" data-drag-axis="y" class="x-resizable-handle x-window-handle x-resizable-handle-north x-unselectable"></div>' +
            '<div ms-if="resizable" data-position="south" ms-draggable="' + data.windowId + '" data-drag-drag="resizeDrag" data-drag-stop="resizeDragStop" data-drag-axis="y"  class="x-resizable-handle x-window-handle x-resizable-handle-south x-unselectable"></div>' +
            '<div ms-if="resizable" data-position="east" ms-draggable="' + data.windowId + '" data-drag-drag="resizeDrag" data-drag-stop="resizeDragStop" data-drag-axis="x" class="x-resizable-handle x-window-handle x-resizable-handle-east x-unselectable"></div>' +
            '<div ms-if="resizable" data-position="west" ms-draggable="' + data.windowId + '" data-drag-drag="resizeDrag" data-drag-stop="resizeDragStop" data-drag-axis="x"  class="x-resizable-handle x-window-handle x-resizable-handle-west x-unselectable"></div>' +
            '<div ms-if="resizable" data-position="north,east" ms-draggable="' + data.windowId + '" data-drag-drag="resizeDrag" data-drag-stop="resizeDragStop" class="x-resizable-handle x-window-handle x-resizable-handle-northeast x-unselectable"></div>' +
            '<div ms-if="resizable" data-position="north,west" ms-draggable="' + data.windowId + '" data-drag-drag="resizeDrag" data-drag-stop="resizeDragStop" class="x-resizable-handle x-window-handle x-resizable-handle-northwest x-unselectable"></div>' +
            '<div ms-if="resizable" data-position="south,east" ms-draggable="' + data.windowId + '" data-drag-drag="resizeDrag" data-drag-stop="resizeDragStop" class="x-resizable-handle x-window-handle x-resizable-handle-southeast x-unselectable"></div>' +
            '<div ms-if="resizable" data-position="south,west" ms-draggable="' + data.windowId + '" data-drag-drag="resizeDrag" data-drag-stop="resizeDragStop" class="x-resizable-handle x-window-handle x-resizable-handle-southwest x-unselectable"></div>'
        var maskTemplate = '<div ms-if="modal"  data-mask-z-index="' + (vmodel.zIndex - 3) + '" ms-bizui="mask"></div>'
        var maskElement = avalon.parseHTML(maskTemplate)
        document.body.appendChild(maskElement)
        maskElement = document.body.lastChild
        var resizeTemplate = '<div ms-if="resizable" ms-visible="resizing" class="x-resizable-proxy" ms-css-width="resizingWidth" ms-css-height="resizingHeight" ms-css-top="resizingTop" ms-css-left="resizingLeft"></div>'
        var resizeElement = avalon.parseHTML(resizeTemplate)
        document.body.appendChild(resizeElement)
        resizeElement = document.body.lastChild
        avalon.nextTick(function () {
            $element.addClass('x-window x-layer x-window-default')
            avalon.innerHTML(element, windowTemplate)
            $element.attr('ms-class', 'x-closable x-window-closable x-window-default-closable:closable')
            $element.attr('ms-css-width', '{{width<=0?\'\':width}}')
            $element.attr('ms-css-height', '{{height<=0?\'\':height}}')
            $element.attr('ms-css-left', 'left')
            $element.attr('ms-css-top', 'top')
            $element.attr('ms-css-z-index', 'zIndex+1')
            $element.attr('ms-hover', 'x-resizable-over')
            $element.attr('ms-visible', '!hidden')
            $element.attr('ms-draggable', data.windowId)
            $element.attr('data-drag-ghosting', 'true')
            $element.attr('data-drag-handle', 'moveDragHandle')
            $element.attr('data-drag-drag', 'moveDrag')
            $element.attr('data-drag-stop', 'moveDragStop')
            parentNode.removeChild(element)
            document.body.appendChild(element)
            element.stopScan = false
            avalon.scan(element, [vmodel].concat(vmodels))
            if (shadowElement) {
                avalon.scan(shadowElement, [vmodel].concat(vmodels))
            }
            if (maskElement) {
                avalon.scan(maskElement, [vmodel].concat(vmodels))
            }
            if (resizeElement) {
                avalon.scan(resizeElement, [vmodel].concat(vmodels))
            }
            avalon.nextTick(function () {
                if (vmodel.width <= 0) {
                    vmodel.width = $element.width()
                }
                if (vmodel.height <= 0) {
                    vmodel.height = $element.height() + vmodel.headerHeight
                }
            })
        })
        return vmodel
    }
    avalon.bizui['window'].defaults = {}
})