/**
 * Created by quan on 13-11-26.
 */
define(["avalon"], function (avalon) {
    bizui.vmodels['tool'] = avalon.mix(true, {}, bizui.baseVModel, {
        $bizuiType: 'tool',
        type: 'close',
        box: true,
        disabled: false,
        handler: avalon.noop
    })
    avalon.bizui['tool'] = function (element, data, vmodels) {
        var options = avalon.mix(true, {}, bizui.vmodels['tool'], data.toolOptions)
        var $element = avalon(element)
        element.stopScan = true

        //定义vmodel
        var vmodel = avalon.define(data.toolId, function (vm) {
            avalon.mix(vm, options)
        })

        var handler = 'handler'
        if (typeof vmodel.handler != 'function') {
            handler = vmodel.handler
        }
        var template = '<img ms-click="' + handler + '" src="data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" ms-class-0="x-tool-img x-tool-{{type}}" role="presentation">' +
            '<div ms-if="disabled" class="x-mask" ></div>'
        $element.addClass('x-tool x-tool-default')
        $element.attr('ms-visible', '!hidden')
        $element.attr('ms-class-0', 'x-box-item:box')
        $element.attr('ms-class-1', 'x-tool-disabled x-masked-relative x-masked:disabled')
        $element.attr('ms-hover', 'x-tool-over:!disabled')
        $element.attr('style', 'width:15px;height:15px;')
        $element.attr('ms-css-left', 'left')
        $element.attr('ms-css-top', 'top')
        avalon.innerHTML(element, template)
        avalon.nextTick(function () {
            element.stopScan = false
            avalon.scan(element, [vmodel].concat(vmodels))
        })
        return vmodel
    }
    avalon.bizui['tool'].defaults = {}
})