/**
 * Created by quan on 13-11-19.
 */


define(["avalon", "avalon.draggable"], function (avalon) {
    var collapseRegionMaps = {}
    collapseRegionMaps['expand-left'] = 'east'
    collapseRegionMaps['expand-right'] = 'west'
    collapseRegionMaps['expand-top'] = 'south'
    collapseRegionMaps['expand-bottom'] = 'north'
    avalon.bizui['viewport'] = function (element, data, vmodels) {
        element.stopScan = true
        var options = avalon.mix(true, {}, bizui.vmodels['viewport'], data.viewportOptions)
        var index = 0, regionOrders = {}
        var comps = bizui.getChildren(element, data.viewportId, vmodels)
        for (var i = 0, il = comps.children.length; i < il; i++) {
            var child = comps.children[i]
            if (child.$bizuiId) {
                var $bizuiId = '$' + child.$bizuiId
                child.$region = comps.bizuiOptions[$bizuiId].region
                child.$split = comps.bizuiOptions[$bizuiId].split
                child.$collapsible = comps.bizuiOptions[$bizuiId].collapsible
                child.$collapsed = comps.bizuiOptions[$bizuiId].collapsed
            }
            if (child.$region) {
                regionOrders[child.$region] = index
                index++
            }
        }
        var parentNode = element.parentNode
        var vmodel = avalon.define(data.viewportId, function (vm) {
            vm.$skipArray = ['left', 'top', 'width', 'height']
            avalon.mix(vm, options)
            for (var opts in comps.bizuiOptions) {
                vm[opts] = {}
                avalon.mix(true, vm[opts], comps.bizuiOptions[opts])
            }
            avalon.mix(true, vm.$regionOrders, regionOrders)
            vm.$regions = [].concat(comps.children)
            vm.resizeRegion = function (region, widthChanged, heightChanged) {
                var me = this
                if (region) {
                    var child = me.$regions[me.$regionOrders[region]]
                    if (child) {
                        var ratio = -1
                        if (region == 'west' || region == 'north') {
                            ratio = 1
                        }
                        if (region == 'west' || region == 'east') {
                            child.$width += (widthChanged * ratio)
                        }
                        if (region == 'south' || region == 'north') {
                            child.$height += (heightChanged * ratio)
                        }
                        me.setSize()
                    }
                }
            }
            vm.resizeRegions = function () {
                var me = this
                var regions = me.$regions,
                    width = me.width,
                    height = me.height,
                    north = regions[me.$regionOrders['north']],
                    south = regions[me.$regionOrders['south']],
                    east = regions[me.$regionOrders['east']],
                    west = regions[me.$regionOrders['west']],
                    center = regions[me.$regionOrders['center']],
                    centerTop = 0,
                    centerLeft = 0,
                    centerWidth = width,
                    centerHeight = height
                if (north) {
                    north.$top = 0
                    north.$left = 0
                    north.$width = width
                    centerHeight = centerHeight - north.$height
                    centerTop = north.$height
                    if (north.$split === true) {
                        centerHeight -= 5
                        centerTop += 5
                    }
                }
                if (south) {
                    south.$top = height - south.$height
                    south.$left = 0
                    south.$width = width
                    centerHeight = centerHeight - south.$height
                    if (south.$split === true) {
                        centerHeight -= 5
                    }
                }
                if (west) {
                    west.$top = centerTop
                    west.$left = 0
                    west.$height = centerHeight
                    centerWidth = centerWidth - west.$width
                    centerLeft = west.$width
                    if (west.$split === true) {
                        centerWidth -= 5
                        centerLeft += 5
                    }
                }
                if (east) {
                    east.$top = centerTop
                    east.$left = width - east.$width
                    east.$height = centerHeight
                    centerWidth = centerWidth - east.$width
                    if (east.$split === true) {
                        centerWidth -= 5
                    }
                }
                if (center) {
                    center.$top = centerTop
                    center.$left = centerLeft
                    center.$height = centerHeight
                    center.$width = centerWidth
                }
            }
            vm.setSize = function (width, height) {
                var me = this
                if (width && typeof width == 'object') {
                    height = width.height
                    width = width.width
                }
                if (typeof width == 'number') {
                    me.width = width
                }
                if (typeof height == 'number') {
                    me.height = height
                }
                me.resizeRegions()
                for (var i = 0, il = me.$regions.length; i < il; i++) {
                    var region = me.$regions[i]
                    var child = avalon.vmodels[region.$bizuiId]
                    if (child) {
                        child.setLeft(region.$left)
                        child.setTop(region.$top)
                        child.setSize(region.$width, region.$height)
                    }
                }
            }
            vm.onContainerSizeChanged = function (size) {
                this.setSize(size)
            }

            vm.$callback = function (child) {
                var me = this
                child.$containerId = me.bizuiId
                me.$childIds.push(child.bizuiId)
                if (child.region) {
                    me.$addedRegionAmount++
                    if (me.$addedRegionAmount == me.$regions.length) {
                        me.setSize()
                    }
                }
            }
            vm.onCollapseClick = function (e) {
                var region = collapseRegionMaps[this.$vmodel.type]
                if (region) {
                    vm.collapse(region)
                }
            }
            vm.collapse = function (region) {
                var me = this
                var child = me.$regions[me.$regionOrders[region]]
                if (child) {
                    var childModel = avalon.vmodels[child.$bizuiId]
                    if (childModel && childModel.collapsible === true && childModel.collapse) {
                        var collapsed = childModel.collapse()
                        child.$width = childModel.$collapseWidth
                        child.$height = childModel.$collapseHeight
                        if (region in bizui.eastWestRegion) {
                            if (collapsed === true) {
                                child.$width = 26
                            }
                        }
                        if (region in bizui.southNorthRegion) {
                            if (collapsed === true) {
                                child.$height = 26
                            }
                        }
                        me.setSize()
                    }
                }
            }
        })

        if (parentNode.tagName == 'BODY') {
            vmodel.setSize(avalon(window).width(), avalon(window).height())
            avalon.bind(window, 'resize', function () {
                vmodel.setSize(avalon(window).width(), avalon(window).height())
            })
        }
        var $parentNode = avalon(parentNode)
        if (parentNode.tagName == 'BODY') {
            $parentNode.addClass('x-body x-gecko x-nlg x-reset x-border-layout-ct x-container')
        }
        else {
            if (!$parentNode.hasClass('x-panel-body')) {
                $parentNode.addClass('x-panel-body x-panel-body-default x-border-layout-ct')
            }
            if (!$parentNode.hasClass('x-border-layout-ct')) {
                $parentNode.addClass('x-border-layout-ct')
            }
        }
        avalon.nextTick(function () {
            element.stopScan = false
            avalon.scan(element, [vmodel].concat(vmodels))
        })
        return vmodel
    }
    avalon.bizui['viewport'].defaults = {}
})