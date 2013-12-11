/**
 * Created by quan on 13-12-6.
 */
define(['avalon', 'bizui.panel'], function (avalon) {
        bizui.vmodels['toolbar'] = avalon.mix(true, {}, bizui.vmodels['panel'], {
            $bizuiType: 'toolbar',
            enableOverflow: false,//Todo Configure true to make the toolbar provide a button which activates a dropdown Menu to show items which overflow the Toolbar's width.
            menuTriggerCls: 'toolbar-more-icon',//Todo Configure the icon class of the overflow button.
            height: 28,
            dock: ''
        })
        bizui.vmodels['toolbaritem'] = avalon.mix(true, {}, bizui.baseVModel, {
            $bizuiType: 'toolbaritem',
            type: 'text',
            text: ''

        })
        avalon.bizui['toolbar'] = function (element, data, vmodels) {
            var options = avalon.mix(true, {}, bizui.vmodels['toolbar'], data.toolbarOptions)
            var $element = avalon(element)
            element.stopScan = true
            var comps = bizui.getChildren(element, data.toolbarId, vmodels, null, true)
            for (var id in comps.bizuiOptions) {
                var bizuiOption = comps.bizuiOptions[id]
                bizuiOption.box = true
                if (options.ui !== 'footer') {
                    bizuiOption.ui = 'toolbar'
                }
            }
            if (options.ui === 'footer') {
                options.dock = 'bottom'
                options.$itemAlign = 'right'
            }
            if (options.ui) {
                options.ui = 'x-toolbar-' + options.ui
            }
            else {
                options.ui = 'x-toolbar-default'
            }
            //定义vmodel
            var vmodel = avalon.define(data.toolbarId, function (vm) {
                    avalon.mix(vm, options)
                    for (var opts in comps.bizuiOptions) {
                        vm[opts] = {}
                        avalon.mix(true, vm[opts], comps.bizuiOptions[opts])
                    }
                    vm.$callback = function (child) {
                        var me = this
                        child.$containerId = me.bizuiId
                        me.$childIds.push(child.bizuiId)
                        child.$watch('width', me.adjustPosition)
                    }
                    vm.$watch('width', function () {
                        vmodel.adjustPosition()
                    })
                    vm.adjustPosition = function () {
                        var left = 0
                        if (vmodel.$itemAlign !== 'right') {
                            for (var i = 0, il = vmodel.$childIds.length; i < il; i++) {
                                var child = avalon.vmodels[vmodel.$childIds[i]]
                                if (child) {
                                    child.left = left
                                    left += child.width + 3
                                }
                            }
                        }
                        else {
                            left = vmodel.width - 6
                            for (var i = vmodel.$childIds.length - 1; i >= 0; i--) {
                                var child = avalon.vmodels[vmodel.$childIds[i]]
                                if (child) {
                                    child.left = left - child.width
                                    left -= (child.width + 3)
                                }
                            }
                        }
                    }
                }
            )

            var template = '<div class="x-box-inner " role="presentation" ms-css-width="width-4" ms-css-height="height-6">' +
                '<div style="position: absolute;left: 0px; top: 0px;height: 1px;" ms-css-width="width-4">' +
                element.innerHTML +
                '</div></div>'
            $element.attr('ms-class-0', 'x-toolbar {{ui}} x-box-layout-ct')
                .attr('ms-class-1', 'x-docked x-docked-{{dock}} x-toolbar-docked-{{dock}} {{ui}}-docked-{{dock}}:dock')
                .attr('ms-visible', '!hidden')
                .attr('ms-css-width', 'width')
                .attr('ms-css-left', '{{left>0?left:\'\'}}')
                .attr('ms-css-top', '{{top>0?top:\'\'}}')
            avalon.innerHTML(element, template)
            avalon.nextTick(function () {
                element.stopScan = false
                avalon.scan(element, [vmodel].concat(vmodels))
            })
            return vmodel
        }
        avalon.bizui['toolbar'].defaults = {}
        avalon.bizui['toolbaritem'] = function (element, data, vmodels) {
            var options = avalon.mix(true, {}, bizui.vmodels['toolbaritem'], data.toolbaritemOptions),
                $element = avalon(element)
            element.stopScan = true
            var template = ''
            if (options.type === 'text') {
                options.top = 3
                $element.addClass('x-toolbar-text x-box-item x-toolbar-item x-toolbar-text-default')
                    .attr('style', 'margin: 0px;')
                    .attr('ms-css-left', 'left')
                    .attr('ms-css-top', 'top')
                template = '{{text}}'
            }
            if (options.type === 'separator') {
                options.width = 2
                options.top = 4
                $element.addClass('x-toolbar-separator x-box-item x-toolbar-item x-toolbar-separator-horizontal')
                    .attr('style', 'border-width: 1px; margin: 0px;')
                    .attr('ms-css-left', 'left')
                    .attr('ms-css-top', 'top')
            }
            if (options.type === 'spacer') {
                if (options.width <= 0) {
                    options.width = 2
                }
                options.top = 16
                $element.addClass('x-toolbar-spacer x-box-item x-toolbar-item x-toolbar-spacer-default')
                    .attr('style', 'margin: 0px;')
                    .attr('ms-css-width', 'width')
                    .attr('ms-css-left', 'left')
                    .attr('ms-css-top', 'top')
            }
            var vmodel = avalon.define(data.toolbaritemId, function (vm) {
                avalon.mix(vm, options)
            })


            avalon.nextTick(function () {
                avalon.innerHTML(element, template)//+'<div style="clear:both;font: 0px/0 Arial;height: 0;visibility: hidden;"></div>')
                element.stopScan = false
                avalon.scan(element, [vmodel].concat(vmodels))
                if (options.type === 'text') {
                    avalon.nextTick(function () {
                        var rect = element.getBoundingClientRect()
                        vmodel.width = rect.right - rect.left + 1
                    })
                }
            })
            return vmodel
        }
        avalon.bizui['toolbaritem'].defaults = {}
    }
)