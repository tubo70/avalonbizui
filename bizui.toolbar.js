/**
 * Created by quan on 13-12-6.
 */
define(['avalon'], function (avalon) {
    bizui.vmodels['toolbar'] = avalon.mix(true, {}, bizui.vmodels['panel'], {
        enableOverflow: false,//Todo Configure true to make the toolbar provide a button which activates a dropdown Menu to show items which overflow the Toolbar's width.
        menuTriggerCls: 'toolbar-more-icon',//Todo Configure the icon class of the overflow button.
        height: 28,
        dock: ''
    })
    avalon.bizui['toolbar'] = function (element, data, vmodels) {
        var options = avalon.mix(true, {}, bizui.vmodels['toolbar'], data.toolbarOptions)
        var $element = avalon(element)
        element.stopScan = true
        var comps = bizui.getChildren(element, data.toolbarId, vmodels, null, true)
        if (options.ui !== 'footer') {
            for (var id in comps.bizuiOptions) {
                var bizuiOption = comps.bizuiOptions[id]
                bizuiOption.ui = 'toolbar'
            }
        }

        for (var i = 0, il = element.childNodes.length; i < il; i++) {
            var el = element.childNodes[i],
                $el = avalon(el),
                arg = $el.attr('ms-bizui')
            if (arg) {
                var args = arg.split(',')
                if (arg[0] === 'button') {

                }
            }

        }

        if (options.ui === 'footer') {
            options.dock = 'bottom'
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
        })

        var template = '<div class="x-box-inner " role="presentation" ms-css-width="width-4" ms-css-height="height-6">' +
            '<div style="position: absolute;left: 0px; top: 0px;height: 1px;" ms-css-width="width-4">' +
            element.innerHTML +
            '</div></div>'
        $element.attr('ms-class-0', 'x-toolbar {{ui}} x-box-layout-ct')
            .attr('ms-class-1', 'x-docked x-docked-{{dock}} x-toolbar-docked-{{dock}} {{ui}}-docked-{{dock}}:dock')
            .attr('ms-visible', '!hidden')
            .attr('ms-css-width', 'width')
        avalon.innerHTML(element, template)
        avalon.nextTick(function () {
            console.log(element.outerHTML)
            element.stopScan = false
            avalon.scan(element, [vmodel].concat(vmodels))
        })
        return vmodel
    }
    avalon.bizui['toolbar'].defaults = {}
})