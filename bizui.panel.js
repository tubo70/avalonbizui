/**
 * Created by quan on 13-11-21.
 */
define(["avalon", "bizui.tool"], function (avalon) {
    bizui.panel = {}
    bizui.panel.toolTypeMaps = {}
    bizui.panel.toolTypeMaps['north'] = 'collapse-top'
    bizui.panel.toolTypeMaps['south'] = 'collapse-bottom'
    bizui.panel.toolTypeMaps['east'] = 'collapse-right'
    bizui.panel.toolTypeMaps['west'] = 'collapse-left'

    var dragRegionMaps = {}
    dragRegionMaps['north'] = 'top'
    dragRegionMaps['south'] = 'top'
    dragRegionMaps['east'] = 'left'
    dragRegionMaps['west'] = 'left'

    var splitterStyleMaps = {}
    splitterStyleMaps['south'] = 'width: {{width}}px; height: 5px; left: 0px; top: {{top-5}}px;'
    splitterStyleMaps['east'] = 'width: 5px; height: {{height}}px; left: {{left - 5}}px; top: {{top}}px;'
    splitterStyleMaps['north'] = 'width: {{width}}px; height: 5px; left: 0px; top: {{top+height}}px;'
    splitterStyleMaps['west'] = 'width: 5px; height: {{height}}px; left: {{left + width}}px; top: {{top}}px;'
    bizui.vmodels['panel'] = avalon.mix(true, {}, bizui.containerVModel, {
        $bizuiType: 'panel',
        region: 'none',
        border: true,
        split: false,
        hidden: false,
        title: '',
        baseCls: bizui.baseCSSPrefix + 'panel',
        ui: 'default',
        headerHeight: 25,
        headerToolAmount: 0,
        headerOrientation: 'horizontal',
        headerDock: 'top',
        collapsible: false,
        collapsed: false,
        getContentSize: function () {
            return {
                width: this.width,
                height: this.height - this.headerHeight
            }
        },
        //Ext.panel.Header
        headerBaseCls: bizui.baseCSSPrefix + 'panel-header',
        headerUi: 'default',
        headerCls: bizui.baseCSSPrefix + 'header',
        getHeaderCls: function () {
            var me = this
            var cls = [me.headerBaseCls, me.headerBaseCls + '-' + me.headerUi,
                me.headerCls, me.headerCls + '-' + me.headerOrientation, bizui.baseCSSPrefix + 'docked']
            return cls
        },
        getHeaderUiCls: function () {
            var me = this, uiCls = [me.headerDock, 'docked-' + me.headerDock, me.headerOrientation]
            return uiCls
        },
        getHeaderTemplate:function(headerCls, headerBodyCls, toolsTemplate){
            var headerTemplate = '<div ms-if="headerHeight!=0" class="' + headerCls + '"' +
                ' style="left: 0px; top: 0px;" ms-css-width="width">' +
                '<div class="' + headerBodyCls + '" ' +
                ' ms-css-width="width">' +
                '<div class="x-box-inner " role="presentation"' +
                ' ms-css-width="width-12" ms-css-height="headerHeight-8">' +
                '<div style="position: absolute; left: 0px; top: 0px; height: 1px;" ms-css-width="width-12">' +
                '<div class="x-component x-panel-header-text-container x-box-item x-component-default"' +
                ' style="text-align: left; left: 0px; top: 0px; margin: 0px;" ms-css-width="width-12-headerToolAmount*16">' +
                '<span class="x-panel-header-text x-panel-header-text-default">{{title}}</span>' +
                '</div>' +
                toolsTemplate +
                '</div></div></div></div>'
            return headerTemplate
        },
        getHeaderToolTemplate: function () {
            var me = this, headerTools = [], toolsTemplate = ''
            me.$titleHeight = me.headerHeight
            if (!me.title) {
                me.headerHeight = 0
            }
            if (me.tools) {
                var tools = me.tools.split(',')
                for (var i = 0, il = tools.length; i < il; i++) {
                    var toolOpts = tools[i].split('|')
                    headerTools.push({
                        type: toolOpts[0],
                        handler: toolOpts[1] || ''
                    })
                }
            }

            delete me.tools
            if (me.region && headerTools.length == 0 && me.collapsible === true) {
                var toolType = bizui.panel.toolTypeMaps[me.region]
                headerTools.push({
                    type: toolType,
                    handler: 'onCollapseClick'
                })
            }
            if (headerTools.length > 0) {
                me.headerHeight = me.$titleHeight
            }
            me.headerToolAmount = headerTools.length
            for (var i = 0, il = headerTools.length; i < il; i++) {
                var tool = headerTools[i]
                if (i == 0) {
                    toolsTemplate += '<div  style="position:absolute !important;" ms-css-left="width-12-headerToolAmount*16">'
                }
                toolsTemplate += '<div ms-bizui="tool" data-tool-type="' + tool.type + '"' + 'data-tool-left="' + 16 * i + '"'
                if (tool.handler) {
                    toolsTemplate += 'data-tool-handler="' + tool.handler + '"'
                }
                toolsTemplate += '></div>'
            }

            if (toolsTemplate) {
                toolsTemplate += '</div>'
            }
            return toolsTemplate
        }
    })
    avalon.bizui['panel'] = function (element, data, vmodels) {
        var options = avalon.mix(true, {}, bizui.vmodels['panel'], data.panelOptions)
        var $element = avalon(element)
        element.stopScan = true
        var comps = bizui.getChildren(element, data.panelId, vmodels)
        var toolsTemplate = options.getHeaderToolTemplate()
        var headerCls = options.getHeaderCls()
        headerCls.push('x-unselectable')
        headerCls = headerCls.join(' ')
        var headerUiCls = options.getHeaderUiCls()
        var UiCls = bizui.clsHelper.addUICls(options.headerBaseCls, options.headerUi, headerUiCls)
        headerCls += ' ' + UiCls.join(' ')
        var headerBodyCls = bizui.clsHelper.addUICls(options.headerBaseCls + '-body', options.headerUi, headerUiCls, true)
        headerBodyCls.push('x-box-layout-ct')
        var headerTemplate = options.getHeaderTemplate(headerCls, headerBodyCls.join(' '), toolsTemplate)
        var parentNode = element.parentNode

        //定义vmodel
        var vmodel = avalon.define(data.panelId, function (vm) {
            avalon.mix(vm, options)
            vm.children = comps.children
            for (var opts in comps.bizuiOptions) {
                vm[opts] = comps.bizuiOptions[opts]
            }
            vm.rendered = function () {

            }
            vm.$collapseWidth = vm.width
            vm.$collapseHeight = vm.height
            vm.collapse = function (flag) {
                var me = this
                if (me.collapsible) {
                    if (me.collapsed === false) {
                        me.$collapseWidth = me.width
                        me.$collapseHeight = me.height
                    }
                    if (typeof flag === 'undefined') {
                        flag = !me.collapsed
                    }
                    me.collapsed = flag
                }
                return me.collapsed
            }
            vm.onCollapseClick = function () {
                if (vm.$containerId) {
                    var container = avalon.vmodels[vm.$containerId]
                    if (container && container.collapse) {
                        container.collapse.apply(container, [vm.region])
                    }
                }
            }
            vm.splitDrag = function (e, data) {
                var me = this
                var $me = avalon(me)
                var datas = $me.data()
                $me.addClass('x-splitter-active')
                var leftOrTop = dragRegionMaps[datas.region]
                if (leftOrTop) {
                    me.style[leftOrTop] = data[leftOrTop] + 'px'
                }
            }
            vm.splitDragStop = function (e, data) {
                var me = this
                var $me = avalon(me)
                var datas = $me.data()
                $me.removeClass(bizui.baseCSSPrefix + 'splitter-active')
                var heightChanged = data.top - data.startTop
                var widthChanged = data.left - data.startLeft
                var region = datas.region
                var viewport = avalon.vmodels[vm.$containerId]
                if (region && viewport) {
                    viewport.resizeRegion.apply(viewport, [region, widthChanged, heightChanged])
                }
            }
            vm.getSplitterWidth = function () {
                if (vm.region in bizui.southNorthRegion) {
                    return vm.width
                }
                return 5
            }
            vm.getSplitterHeight = function () {
                if (vm.region in bizui.eastWestRegion) {
                    return vm.height
                }
                return 5
            }
            vm.getSplitterTop = function () {
                if (vm.region in bizui.eastWestRegion) {
                    return vm.top
                }
                if (vm.region == 'south') {
                    return vm.top - 5
                }
                return vm.top + vm.height
            }
            vm.getSplitterLeft = function () {
                if (vm.region in bizui.southNorthRegion) {
                    return 0
                }
                if (vm.region == 'east') {
                    return vm.left - 5
                }
                return vm.left + vm.width

            }
        })

        if (options.layout === 'fit' && parentNode.tagName === 'BODY') {
            vmodel.setSize.apply(vmodel, [avalon(window).width(), avalon(window).height()])
            avalon.bind(window, 'resize', function () {
                vmodel.setSize.apply(vmodel, [avalon(window).width(), avalon(window).height()])
            })
        }

        var template = ' <div class="x-panel-body x-panel-body-default"' +
            ' ms-class-0="x-docked-noborder-top:!border"' +
            ' ms-class-1="x-docked-noborder-left:!border"' +
            ' ms-class-2="x-docked-noborder-right:!border"' +
            ' ms-class-3="x-docked-noborder-bottom:!border"' +
            ' ms-css-top="headerHeight" ms-css-width="width" ms-css-height="height-headerHeight">' + element.innerHTML +
            '<div class="x-clear" role="presentation"></div>' +
            '</div>'

        function getCollapseElement(region, containerNode) {
            var collapseTemplate = ''
            if (options.region in bizui.eastWestRegion) {
                collapseTemplate = '<div ms-if="collapsible" ms-visible="collapsed"  ms-class="x-panel-header x-region-collapsed-placeholder x-region-collapsed-{{region==\'west\' ? \'left\':\'right\'}}-placeholder collapsed x-border-item x-box-item x-panel-header-default x-vertical x-panel-header-vertical x-panel-header-default-vertical x-left x-panel-header-left x-panel-header-default-left x-collapsed x-panel-header-collapsed x-panel-header-default-collapsed x-collapsed-left x-panel-header-collapsed-left x-panel-header-default-collapsed-left x-collapsed-border-left x-panel-header-collapsed-border-left x-panel-header-default-collapsed-border-left x-unselectable"' +
                    ' style="margin: 0px;" ms-css-left="region == \'west\' ? 0: left+width-26"' +
                    ' ms-css-top="top" ms-css-height="height">' +
                    '<div class="x-panel-header-body x-panel-header-body-default x-panel-header-body-vertical x-panel-header-body-default-vertical x-panel-header-body-left x-panel-header-body-default-left x-panel-header-body-collapsed x-panel-header-body-default-collapsed x-panel-header-body-collapsed-left x-panel-header-body-default-collapsed-left x-panel-header-body-collapsed-border-left x-panel-header-body-default-collapsed-border-left x-panel-header-body-default-vertical x-panel-header-body-default-left x-panel-header-body-default-collapsed x-panel-header-body-default-collapsed-left x-panel-header-body-default-collapsed-border-left x-box-layout-ct"' +
                    ' ms-css-height="height-12">' +
                    '<div class="x-box-inner " role="presentation" style="width:16px;" ms-css-height="height-12">' +
                    '<div style="position: absolute; width: 16px; left: 0px; top: 0px; height: 1px;">' +
                    '<div  ms-bizui="tool" data-tool-handler="onCollapseClick" ms-attr-data-tool-type="{{region==\'west\'?\'expand-right\':\'expand-left\'}}"></div>' +
                    '<div class="x-surface x-box-item x-surface-default" style="width: 16px; left: 0px; top: 19px; margin: 0px;" ms-css-height="height-31" >' +
                    '<span class="x-panel-header-text x-panel-header-text-default" ms-attr-style="text-align:{{region==\'west\'?\'right\':\'left\'}};height:16px;width:{{height-31}}px;display:block;transform:rotate({{region==\'west\'?\'-90\':\'90\'}}deg);transform-origin: {{(height-31)/2}}px {{(height-31)/2 + \'px\'}}; -webkit-transform: rotate({{region==\'west\'?\'-90\':\'90\'}}deg); -moz-transform: rotate(90deg); -webkit-transform-origin: {{region==\'west\' ? (height-31)/2:8}}px {{region==\'west\' ? (height-31)/2 + \'px\':\'\'}}; -moz-transform-origin: 0% 0%; filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=1);">{{title}}</span>' +
                    '</div></div></div></div></div>'
            }
            if (options.region in bizui.southNorthRegion) {
                collapseTemplate = '<div ms-if="collapsible" ms-visible="collapsed" class="x-panel-header x-region-collapsed-placeholder x-region-collapsed-{{region==\'north\'?\'top\':\'bottom\'}}-placeholder collapsed x-border-item x-box-item x-panel-header-default x-horizontal x-panel-header-horizontal x-panel-header-default-horizontal x-top x-panel-header-top x-panel-header-default-top x-collapsed x-panel-header-collapsed x-panel-header-default-collapsed x-collapsed-top x-panel-header-collapsed-top x-panel-header-default-collapsed-top x-collapsed-border-top x-panel-header-collapsed-border-top x-panel-header-default-collapsed-border-top x-unselectable" tabindex="-1"' +
                    ' style="left: 0px; margin: 0px;" ms-css-top="top" ms-css-width="width">' +
                    '<div class="x-panel-header-body x-panel-header-body-default x-panel-header-body-horizontal x-panel-header-body-default-horizontal x-panel-header-body-top x-panel-header-body-default-top x-panel-header-body-collapsed x-panel-header-body-default-collapsed x-panel-header-body-collapsed-top x-panel-header-body-default-collapsed-top x-panel-header-body-collapsed-border-top x-panel-header-body-default-collapsed-border-top x-panel-header-body-default-horizontal x-panel-header-body-default-top x-panel-header-body-default-collapsed x-panel-header-body-default-collapsed-top x-panel-header-body-default-collapsed-border-top x-box-layout-ct"' +
                    ' ms-css-width="width-12">' +
                    '<div class="x-box-inner " role="presentation" style="height: 17px;" ms-css-width="width-12">' +
                    '<div style="position: absolute; left: 0px; top: 0px; height: 1px;" ms-css-width="width-12">' +
                    '<div class="x-component x-panel-header-text-container x-box-item x-component-default" style="text-align: left; left: 0px; top: 0px; margin: 0px;" ms-css-width="width-29">' +
                    '<span class="x-panel-header-text x-panel-header-text-default">{{title}}</span></div>' +
                    '<div   style="position:absolute !important;" ms-css-left="width-12-16"><div ms-bizui="tool" data-tool-handler="onCollapseClick" ms-attr-data-tool-type="{{region==\'north\'?\'expand-bottom\':\'expand-top\'}}"></div></div>' +
                    '</div></div></div></div>'
            }
            var el
            if (collapseTemplate) {
                el = avalon.parseHTML(collapseTemplate)
                containerNode.appendChild(el)
                el = containerNode.lastChild
            }
            return el
        }

        function getSplitElement(region, containerNode) {
            var axis = 'y', direction = 'horizontal'

            if (region == 'east' || region == 'west') {
                axis = 'x'
                direction = 'vertical'
            }
            var style = splitterStyleMaps[region]
            var splitTemplate = ''
            if (style) {
                splitTemplate = ' <div ms-if="split" ms-visible="!collapsed"' +
                    ' ms-draggable="' + data.panelId + '" data-drag-axis="' + axis + '" data-drag-stop="splitDragStop" data-drag-drag="splitDrag" data-region="' + region + '" data-drag-containment="window"' +
                    ' class="x-splitter x-border-item x-box-item x-splitter-default x-splitter-' + direction + ' x-unselectable"' +
                    ' style="margin:0px;" ms-css-height="getSplitterHeight()" ms-css-width="getSplitterWidth()" ms-css-left="getSplitterLeft()"  ms-css-top="getSplitterTop()" ></div>'
            }
            var el
            if (splitTemplate) {
                el = avalon.parseHTML(splitTemplate)
                containerNode.appendChild(el)
                el = containerNode.lastChild
            }
            return el
        }

        var collapseEl = getCollapseElement(options.region, parentNode)
        var splitEl = getSplitElement(options.region, parentNode)


        //console.log(el.outerHTML)
        $element.addClass('x-panel x-border-item x-box-item x-panel-default')
            .attr('ms-visible', '!collapsed && !hidden')
            .attr('style', 'margin: 0px;')
            .attr('ms-css-left', 'left')
            .attr('ms-css-top', 'top')
            .attr('ms-css-width', 'width')
            .attr('ms-css-height', 'height')
        if (bizui.isie8m) {
            avalon.css($element, 'position', 'absolute')
        }
        avalon.nextTick(function () {
            //avalon(element).attr('ms-visible', '!collapsed')
            avalon.innerHTML(element, headerTemplate + template)
            element.stopScan = false
            avalon.scan(element, [vmodel].concat(vmodels))
            if (collapseEl) {
                collapseEl.stopScan = false
                avalon.scan(collapseEl, [vmodel].concat(vmodels))
            }
            if (splitEl) {
                splitEl.stopScan = false
                avalon.scan(splitEl, [vmodel].concat(vmodels))
            }
        })
        return vmodel
    }
    avalon.bizui['panel'].defaults = {}
})

