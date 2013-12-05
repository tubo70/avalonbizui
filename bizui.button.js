/**
 * Created by quan on 13-12-4.
 */
define(["avalon"], function (avalon) {
    bizui.vmodels['button'] = avalon.mix(true, {}, bizui.baseVModel, {
        scale: 'small',
        text: '',
        icon: '',
        height: 16,
        iconAlign: 'left',
        enableToggle: false,
        toggled: false,
        handler: avalon.noop
    })
    avalon.bizui['button'] = function (element, data, vmodels) {
        var options = avalon.mix(true, {}, bizui.vmodels['button'], data.buttonOptions)
        var $element = avalon(element)
        if (options.scale == 'medium') {
            options.height = 24
        }
        if (options.scale == 'large') {
            options.height = 36
        }
        if (options.icon != '' && (options.iconAlign == 'top' || options.iconAlign == 'bottom')) {
            options.height += options.height
        }
        var vmodel = avalon.define(data.buttonId, function (vm) {
            avalon.mix(vm, options)
            vm.toggleClick = function () {
                if (vmodel.enableToggle) {
                    vmodel.toggled = !vmodel.toggled
                }
            }
        })

        var handler = 'handler'
        if (typeof vmodel.handler != 'function') {
            handler = vmodel.handler
        }
        var template = '<em><button type="button" ms-click="' + handler + '" class="x-btn-center" hidefocus="true" role="button" autocomplete="off" ms-css-height="height">' +
            '<span class="x-btn-inner">{{text}}</span>' +
            '<span class="x-btn-icon " ms-css-background-image="{{icon!=\'\'?\'url(\'+icon+\')\':\'\'}}"></span>' +
            '</button></em>'
        avalon.nextTick(function () {
            $element.addClass('x-btn')
            $element.attr('ms-click-0', 'toggleClick')
            $element.attr('ms-class-0', '{{icon==\'\'?\'x-noicon x-btn-noicon x-btn-default-\'+ scale + \'-noicon\':\'\'}}')
            $element.attr('ms-class-1', 'x-btn-default-{{scale}}')
            $element.attr('ms-class-2', '{{icon!=\'\'?\'x-icon-text-\'+iconAlign + \' x-btn-icon-text-\'+iconAlign+\' x-btn-default-\'+scale+\'-icon-text-\'+iconAlign:\'\'}}')
            $element.attr('ms-class-3', 'x-pressed x-btn-pressed x-btn-default-{{scale}}-pressed:toggled')
            $element.attr('ms-class-4','x-item-disabled x-disabled x-btn-disabled x-btn-default-{{scale}}-disabled:disabled')
            $element.attr('style', 'border-width:1px 1px 1px 1px;')
            $element.attr('ms-hover', 'over x-over x-btn-over x-btn-default-{{scale}}-over')
            $element.attr('ms-active', 'x-pressed x-btn-pressed x-btn-default-{{scale}}-pressed:!enableToggle')
            avalon.innerHTML(element, template)
            avalon.scan(element, [vmodel].concat(vmodels))
        })
        return vmodel
    }
    avalon.bizui['button'].defaults = {}

})