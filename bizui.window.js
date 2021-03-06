/**
 * Created by quan on 13-12-1.
 */
//TODO 增加自动居中
//Todo 目前在标题上只能有一个closeable的tool，以后考虑增加多个
define(['avalon', 'bizui.mask', 'bizui.tool', 'bizui.button', 'bizui.toolbar', 'avalon.draggable'], function (avalon) {
    bizui.vmodels['window'] = avalon.mix(true, {}, bizui.vmodels['panel'], {
        $bizuiType: 'window',
        closable: true,//可关闭的
        //closeAction:'hidden',//'destory'
        draggable: true,//是否可拖动
        headerHeight: 21,
        footerHeight: 0,
        ghost: false,//拖动的时候启用影子
        modal: true,
        resizable: true,//是否可改变大小
        resizing: false,
        resizingLeft: 0,
        resizingTop: 0,
        resizingWidth: 0,
        resizingHeight: 0,
        dragging: false,
        autoScroll: false,//内容区自动滚动条
        zIndex: 19000,
        baseCls: 'x-window',
        ui: 'default'

    })
    var resizeMaps = {}
    resizeMaps['north'] = {position: 'top', size: 'height', ratio: -1, calcChange: 'top'}
    resizeMaps['south'] = {size: 'height', ratio: 1, calcChange: 'top'}
    resizeMaps['west'] = {position: 'left', size: 'width', ratio: -1, calcChange: 'left'}
    resizeMaps['east'] = {size: 'width', ratio: 1, calcChange: 'left'}

    avalon.bizui['window'] = function (element, data, vmodels) {
        var options = avalon.mix(true, {}, bizui.vmodels['window'], data.windowOptions),
            $element = avalon(element),
            parentNode = element.parentNode,
            fbar
        element.stopScan = true
        bizui.zIndex += 10
        options.zIndex = bizui.zIndex
        var comps = bizui.processChildren(element, data.windowId, vmodels, null, null, true)
        for (var i = 0, il = comps.children.length; i < il; i++) {
            var child = comps.children[i]
            if (child.$bizuiId) {
                var $bizuiId = '$' + child.$bizuiId,
                    childOptions = comps.bizuiOptions[$bizuiId]
                if (child.$bizuiType === 'toolbar' && childOptions.ui === 'footer') {
                    fbar = childOptions.$element
                    element.removeChild(fbar)
                    options.footerHeight = 26
                    options.$fbarId = child.$bizuiId
                }
                delete childOptions.$element
            }
        }
        var vmodel = avalon.define(data.windowId, function (vm) {
            avalon.mix(vm, options)
            vm.close = function () {
                vm.hidden = true
            }
            vm.$watch('hidden', function (newValue, oldValue) {
                if (newValue === true && vm.modal === true) {
                    if (bizui.currentMask) {
                        bizui.currentMask.removeMask.apply(bizui.currentMask)
                    }
                }
            })
            vm.$watch('height', function (newValue, oldValue) {
                var fbarModel = avalon.vmodels[vmodel.$fbarId]
                var adjustHeight = bizui.isIE ? 6 : 8
                if (fbarModel) {
                    fbarModel.top = newValue - vmodel.footerHeight - adjustHeight

                }
            })
            vm.$watch('width', function (newValue, oldValue) {
                var fbarModel = avalon.vmodels[vmodel.$fbarId]
                if (fbarModel) {
                    fbarModel.width = newValue - 16

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
        var cls = 'x-css-shadow'
        if (bizui.isIE) {
            cls = 'x-ie-shadow'
        }
        var shadowTemplate = '<div ms-visible="!hidden && !dragging" class="' + cls + '" role="presentation"' +
            ' ms-css-z-index="zIndex" ms-css-left="left" ms-css-top="top+4" ms-css-width="width" ms-css-height="{{height<=4?\'\':height-4}}" style="box-shadow: rgb(136, 136, 136) 0px 0px 4px;"></div>'
        if (bizui.isIE8m) {
            shadowTemplate = '<div ms-visible="!hidden && !dragging" class="x-ie-shadow" role="presentation"  ms-css-z-index="zIndex" ms-css-left="left-5" ms-css-top="top-3" ms-css-width="width" ms-css-height="{{height<=4?\'\':height-4}}" style="right: auto; position: ; filter: progid:DXImageTransform.Microsoft.alpha(opacity=50) progid:DXImageTransform.Microsoft.Blur(pixelradius=4);"></div>'
        }
        var shadowElement = avalon.parseHTML(shadowTemplate)
        document.body.appendChild(shadowElement)
        shadowElement = document.body.lastChild

        var headerLeftTop = 'left: -1px; top: -1px;right:auto;'
        var headerhdWidthAdjust = '29'
        var headerIETpl, bodyIeTpl
        if (bizui.isIE8m) {
            headerLeftTop = 'right: auto; left: 0px; top: 0px'
            headerhdWidthAdjust = '33'
            headerIETpl = bizui.frameHelper.getFrameTpl({
                frameCls: 'x-frame',
                baseCls: options.baseCls + '-header',
                ui: options.ui,
                framingInfoCls:options.baseCls + '-header-' + options.ui + '-top' ,
                uiCls: ['horizontal', 'top', 'docked-top'],
                dynamic: false,
                idSuffix: '_header-frame',
                extraAttrs: ' ms-css-width="width-12"'
            })
            var bodyUiCls = []
            if (options.closable) {
                bodyUiCls.push('closeable')
            }
            if (options.resizable) {
                bodyUiCls.push('resizable')
            }
            bodyIeTpl = bizui.frameHelper.getFrameTpl({
                frameCls: 'x-frame',
                baseCls: options.baseCls,
                ui: options.ui,
                uiCls: bodyUiCls,
                framingInfoCls:options.baseCls + '-' + options.ui ,
                dynamic: false,
                idSuffix: '-frame',
                extraAttrs: 'ms-css-height="height-10" ms-css-width="width-10"'
            })
        }

        var headerTpl = [
            '<div ms-attr-id="{{bizuiId}}_header-body"', '' +
                ' ms-css-width="width-12" ms-class="x-header-body {{baseCls}}-header-body {{baseCls}}-header-body-{{ui}} {{baseCls}}-header-body-horizontal {{baseCls}}-header-body-{{ui}}-horizontal {{baseCls}}-header-body-top {{baseCls}}-header-body-{{ui}}-top {{baseCls}}-header-body-docked-top {{baseCls}}-header-body-{{ui}}-docked-top x-box-layout-ct {{baseCls}}-header-body-{{ui}}-horizontal {{baseCls}}-header-body-{{ui}}-top {{baseCls}}-header-body-{{ui}}-docked-top">',
            '  <div ms-attr-id="{{bizuiId}}_header-innerCt" class="x-box-inner" ms-css-width="width-12" style="height:16px;" role="presentation">',
            '    <div ms-attr-id="{{bizuiId}}_header-targetEl" ms-css-width="width-12">',
            '      <div ms-attr-id="{{bizuiId}}_header_hd" class="x-component x-header-text-container x-window-header-text-container x-window-header-text-container-default x-box-item x-component-default"',
            '         style="right:auto;left:0px;margin:0px;top:0px;" ms-css-width="width-' + headerhdWidthAdjust + '" unselectable="on">',
            '        <span ms-attr-id="{{bizuiId}}_header_hd-textEl" class="x-header-text x-window-header-text x-window-header-text-default" unselectable="on">{{title}}</span>',
            '      </div>',
            '      <div ms-if="closable" style="position:absolute !important;" ms-css-left="width-12-16">',
            '        <div ms-bizui="tool" data-tool-handler="close" data-tool-type="close"></div>',
            '      </div>',
            '    </div>',
            '  </div>',
            '</div>'
        ]
        var headerTemplate = headerTpl.join(' ')
        var bodyTpl = [
            '<div ms-attr-id="{{bizuiId}}-body" class="x-window-body x-window-body-default x-layout-fit"',
            '  ms-class-0="x-closable x-window-body-closable x-window-body-default-closable:closable"',
            '  ms-class-1="x-resizable x-window-body-resizable x-window-body-default-resizable:resizable"',
            '  style="left: 0px;' + (bizui.isIE8m ? 'position:relative;' : '') + '"',
            '  ms-css-width="width-10" ms-css-height="{{height<=(headerHeight + footerHeight+9)?\'\':height-(headerHeight + footerHeight+9)}}"',
            '  ms-css-top="headerHeight-1"',
            '  ms-css-overflow="{{autoScroll?\'auto\':\'\'}}">',
            element.innerHTML,
            '</div>'
        ]
        var bodyTemplate = bodyTpl.join(' ')
        if (bizui.isIE8m) {
            headerTemplate = headerIETpl.replace('{{frameContent}}', headerTemplate)
            bodyTemplate = bodyIeTpl.replace('{{frameContent}}', bodyTemplate)
        }
        var windowTemplate = '<div ms-attr-id="{{bizuiId}}_header" class="x-window-header x-header x-header-horizontal x-docked x-unselectable x-window-header-default x-horizontal x-window-header-horizontal x-window-header-default-horizontal x-top x-window-header-top x-window-header-default-top x-docked-top x-window-header-docked-top x-window-header-default-docked-top"' +
            ' ms-class="x-header-draggable:draggable"' +
            ' style="' + headerLeftTop + '" ms-css-width="width">' +
            headerTemplate +
            '</div>' +
            bodyTemplate +
            fbar.outerHTML +
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
        $element.addClass('x-window x-layer x-window-default')
            .attr('ms-class', 'x-closable x-window-closable x-window-default-closable:closable')
            .attr('ms-class-0', 'x-resizable x-window-resizable x-window-default-resizable:resizable')
            .attr('ms-css-width', '{{width<=0?\'\':width}}')
            .attr('ms-css-height', '{{height<=0?\'\':height}}')
            .attr('ms-css-left', 'left')
            .attr('ms-css-top', 'top')
            .attr('ms-css-z-index', 'zIndex+1')
            .attr('ms-hover', 'x-resizable-over:resizable')
            .attr('ms-visible', '!hidden')
            .attr('ms-draggable', data.windowId)
            .attr('data-drag-ghosting', 'true')
            .attr('data-drag-handle', 'moveDragHandle')
            .attr('data-drag-drag', 'moveDrag')
            .attr('data-drag-stop', 'moveDragStop')
            .attr('ms-attr-id', 'bizuiId')
        if (!bizui.isIE || bizui.isIE9p) {
            $element.addClass('x-border-box')
        }
        avalon.css(element, 'right', 'auto')
        avalon.nextTick(function () {
            avalon.innerHTML(element, windowTemplate)
            parentNode.removeChild(element)
            document.body.appendChild(element)
            element.stopScan = false
            avalon.scan(element, [vmodel].concat(vmodels))
            avalon.nextTick(function () {
                if (shadowElement) {
                    avalon.scan(shadowElement, [vmodel].concat(vmodels))
                }
                if (maskElement) {
                    avalon.scan(maskElement, [vmodel].concat(vmodels))
                }
                if (resizeElement) {
                    avalon.scan(resizeElement, [vmodel].concat(vmodels))
                }
            })
            avalon.nextTick(function () {
                var rect = element.getBoundingClientRect()
                if (vmodel.width <= 0) {
                    vmodel.width = rect.right - rect.left + 1
                }
                if (vmodel.height <= 0) {
                    vmodel.height = rect.bottom - rect.top + 1 + vmodel.headerHeight + vmodel.footerHeight
                }
            })
        })
        return vmodel
    }
    avalon.bizui['window'].defaults = {}
})