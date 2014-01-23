/**
 * Created by quan on 13-11-26.
 */
define(["avalon"], function (avalon) {
    bizui.vmodels['tool'] = avalon.mix(true, {}, bizui.component, {
        $bizuiType: 'tool',
        type: 'close',
        box: true,
        disabled: false,
        handler: avalon.noop,
        targetConfig: {
            baseCls: bizui.baseCSSPrefix + 'tool',
            ui: 'default',
            style: 'width:15px;height:15px;',
            computedAttributes: {
                'class': [
                    bizui.baseCSSPrefix + 'box-item:box',
                    bizui.baseCSSPrefix + 'tool-disabled ' + bizui.baseCSSPrefix + 'masked ' + bizui.baseCSSPrefix + 'masked-relative:disabled'
                ],
                hover: bizui.baseCSSPrefix + 'tool-over:!disabled',
                visible: '!hidden',
                'css-left': 'left',
                'css-top': 'top'
            }
        }
    })
    avalon.bizui['tool'] = function (element, data, vmodels) {
        var options = avalon.mix(true, {}, bizui.vmodels['tool'], data.toolOptions)
        //var $element = avalon(element)
        element.stopScan = true
        options.setAttributes(element)
        var handler = 'handler'
        if (typeof options.handler != 'function') {
            handler = options.handler
            delete options.handler
        }
        var template = '<img ms-click="' + handler + '" src="'+bizui.BLANK_IMAGE_URL+'" ms-class-0="x-tool-img x-tool-{{type}}" role="presentation">' +
            '<div ms-if="disabled" class="x-mask" ></div>'
        //定义vmodel
        var vmodel = avalon.define(data.toolId, function (vm) {
            avalon.mix(vm, options)
        })

        avalon.nextTick(function () {
            avalon.innerHTML(element, template)
            avalon.log(element.outerHTML)
            element.stopScan = false
            avalon.scan(element, [vmodel].concat(vmodels))
        })
        return vmodel
    }
    avalon.bizui['tool'].defaults = {}
    return avalon
})