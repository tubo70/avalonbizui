/**
 * Created by quan on 13-12-4.
 */
define(['avalon', 'bizui.menu'], function (avalon) {
    bizui.vmodels['button'] = avalon.mix(true, {}, bizui.baseVModel, {
        $bizuiType:'button',
        scale: 'small',
        text: '',
        icon: '',
        height: 22,
        buttonHeight: 16,
        iconAlign: 'left',
        enableToggle: false,
        toggled: false,
        handler: avalon.noop,
        arrowAlign: 'right'
    })
    avalon.bizui['button'] = function (element, data, vmodels) {
        var options = avalon.mix(true, {}, bizui.vmodels['button'], data.buttonOptions)
        var $element = avalon(element), menu, menuOptions
        element.stopScan = true
        var comps = bizui.getChildren(element, data.buttonId, vmodels, 'menu')
        options.hasMenu = false
        if (comps.children.length > 0) {
            options.hasMenu = true
            options.enableToggle = true
            menu = element.firstChild
            menuOptions = comps.bizuiOptions['$' + comps.children[0].$bizuiId]
            menuOptions.$containerId = options.bizuiId
            menuOptions.hidden = true
            menuOptions.isSubMenu = true
            options.$menuId = menuOptions.bizuiId
            while (element.firstChild) {
                var el = element.firstChild
                element.removeChild(el)
            }
        }
        if (options.scale == 'medium') {
            options.buttonHeight = 24
        }
        if (options.scale == 'large') {
            options.buttonHeight = 36
        }
        if (options.icon != '' && (options.iconAlign == 'top' || options.iconAlign == 'bottom')) {
            options.buttonHeight += 18
        }
        options.height = options.buttonHeight + 8
        if (options.ui) {
            options.ui = 'x-btn-default-' + options.ui
        }
        else        {
            options.ui='x-btn-default'
        }
        var vmodel = avalon.define(data.buttonId, function (vm) {
            avalon.mix(vm, options)
            vm.toggleClick = function () {
                if (vmodel.enableToggle) {
                    vmodel.toggled = !vmodel.toggled
                }
            }
            if (menuOptions) {
                vm['$' + menuOptions.bizuiId] = {}
                avalon.mix(true, vm['$' + menuOptions.bizuiId], menuOptions)

            }
            vm.showMenu = function (e) {
                if (vmodel.hasMenu) {
                    var menuModel = avalon.vmodels[vmodel.$menuId]
                    if (menuModel) {
                        menuModel.left = e.pageX - e.offsetX
                        menuModel.top = e.pageY + vmodel.height - e.offsetY - {small: 3, medium: 4, large: 6}[vmodel.scale]
                        menuModel.hidden = !menuModel.hidden
                        menuModel.$watch('hidden', function (newValue) {
                            if (newValue === true) {
                                vmodel.toggled = false
                            }
                        })
                    }
                }
            }
        })

        var handler = 'handler'
        if (typeof vmodel.handler != 'function') {
            handler = vmodel.handler
        }
        var template = '<em ms-class="x-btn-arrow x-btn-arrow-{{arrowAlign}}:hasMenu"><button type="button" ms-click="' + handler + '" class="x-btn-center" hidefocus="true" role="button" autocomplete="off" ms-css-height="buttonHeight">' +
            '<span class="x-btn-inner">{{text}}</span>' +
            '<span class="x-btn-icon " ms-css-background-image="{{icon!=\'\'?\'url(\'+icon+\')\':\'\'}}"></span>' +
            '</button></em>'
        if (menu) {
            document.body.appendChild(menu)
            menu = document.body.lastChild
        }
        avalon.nextTick(function () {
            $element.addClass('x-btn')
            if (options.enableToggle) {
                $element.attr('ms-click-0', 'toggleClick')
            }
            if (options.hasMenu) {
                $element.attr('ms-click-1', 'showMenu')
            }
            $element.attr('ms-class-0', 'x-noicon x-btn-noicon {{ui}}-{{scale}}-noicon:!icon')
                .attr('ms-class-1', '{{ui}}-{{scale}}')
                .attr('ms-class-2', 'x-icon-text-{{iconAlign}} x-btn-icon-text-{{iconAlign}} {{ui}}-{{scale}}-icon-text-{{iconAlign}}:icon')
                .attr('ms-class-3', 'x-pressed x-btn-pressed {{ui}}-{{scale}}-pressed:toggled')
                .attr('ms-class-4', 'x-item-disabled x-disabled x-btn-disabled {{ui}}-{{scale}}-disabled:disabled')
                .attr('style', 'border-width:1px 1px 1px 1px;')
                .attr('ms-hover', 'over x-over x-btn-over {{ui}}-{{scale}}-over')
                .attr('ms-active', 'x-pressed x-btn-pressed {{ui}}-{{scale}}-pressed:!enableToggle')
            avalon.innerHTML(element, template)
            element.stopScan = false
            avalon.scan(element, [vmodel].concat(vmodels))
            if (menu) {
                avalon.scan(menu, [vmodel].concat(vmodels))
            }
            avalon.nextTick(function () {
                vmodel.height = $element.height()
                vmodel.width = $element.width()
            })
        })
        return vmodel
    }
    avalon.bizui['button'].defaults = {}

})