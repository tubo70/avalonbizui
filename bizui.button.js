/**
 * Created by quan on 13-12-4.
 */
define(['avalon', 'bizui.menu'], function (avalon) {
    bizui.vmodels['button'] = avalon.mix(true, {}, bizui.baseVModel, {
        $bizuiType: 'button',
        scale: 'small',
        box: false,
        text: '',
        textAlign: 'center',
        height: 22,
        buttonHeight: 16,
        enableToggle: false,
        toggled: false,
        handler: avalon.noop,
        split: false,
        arrowAlign: 'right',
        baseCls: 'x-btn',
        ui: 'default',
        uiCls: '',
        icon: '',
        iconAlign: 'left',
        iconCls: ''
    })
    avalon.bizui['button'] = function (element, data, vmodels) {
        var options = avalon.mix(true, {}, bizui.vmodels['button'], data.buttonOptions)
        var $element = avalon(element), menu, menuOptions
        element.stopScan = true
        var comps = bizui.getChildren(element, data.buttonId, vmodels, 'menu')
        options.split = false
        if (comps.children.length > 0) {
            options.split = true
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
            options.ui = 'default-' + options.scale
        }
        else {
            options.ui = 'default'
        }
        var vmodel = avalon.define(data.buttonId, function (vm) {
            avalon.mix(vm, options)
            vm.toggleClick = function () {
                if (vmodel.enableToggle) {
                    vmodel.toggled = !vmodel.toggled
                }
            }
            vm.$watch('scale', function (newValue) {
                var uis = vmodel.ui.split('-')
                uis.pop()
                uis.push(newValue)
                vmodel.ui = uis.join('-')
            })
            if (menuOptions) {
                vm['$' + menuOptions.bizuiId] = {}
                avalon.mix(true, vm['$' + menuOptions.bizuiId], menuOptions)

            }
            vm.showMenu = function (e) {
                if (vmodel.split) {
                    var menuModel = avalon.vmodels[vmodel.$menuId]
                    if (menuModel) {
                        menuModel.left = e.pageX - e.offsetX
                        menuModel.top = e.pageY + vmodel.height - e.offsetY - {small: 3, medium: 4, large: 5}[vmodel.scale]
                        menuModel.hidden = !menuModel.hidden
                        menuModel.$watch('hidden', function (newValue) {
                            if (newValue === true) {
                                vmodel.toggled = false
                            }
                        })
                        if (menuModel.hidden === false) {
                            return false
                        }
                    }

                }
            }
        })
        var frameTableTpl
        if (bizui.isIE8m) {
            var uiCls = []
            if (options.icon) {
                uiCls.push('icon-text-' + options.iconAlign)
            } else {
                uiCls.push('noicon')
            }
            frameTableTpl = bizui.frameHelper.getFrameTpl({
                frameCls: 'x-frame',
                baseCls: options.baseCls,
                ui: options.ui,
                uiCls: uiCls,
                dynamic: false,
                idSuffix: '-frame',
                top: true,
                left: true,
                right: true,
                bottom: true,
                extraAttrs: '',
                table: true
            })
        }
        var renderTpl = [
            '<span  ms-class="{{baseCls}}-wrap" ms-class-0="{{baseCls}}-arrow {{baseCls}}-arrow-{{arrowAlign}}:split" unselectable="on">',
            '  <span ms-class="{{baseCls}}-button">',
            '    <span ms-class="{{baseCls}}-inner {innerCls}"  unselectable="on">',
            '      {{text}}',
            '    </span>',
            '    <span role="img" ms-class="{{baseCls}}-icon-el {{iconCls}}" unselectable="on" ms-css-background-image="{{icon!=\'\'?\'url(\'+icon+\')\':\'\'}}">',
            '    </span>',
            '  </span>',
            '</span>',
            // if "closable" (tab) add a close element icon
            //'<tpl if="closable">',
            //'<span id="{id}-closeEl" class="{baseCls}-close-btn" title="{closeText}" tabIndex="0"></span>',
            //'</tpl>'
        ]
        var handler = 'handler'
        if (typeof vmodel.handler != 'function') {
            handler = vmodel.handler
        }
        var template = renderTpl.join('')
        if (bizui.isIE8m) {
            template = frameTableTpl.replace('{{frameContent}}', template)
        }
        if (menu) {
            document.body.appendChild(menu)
            menu = document.body.lastChild
        }
        avalon.nextTick(function () {
            if (options.enableToggle) {
                $element.attr('ms-click-0', 'toggleClick')
            }
            if (options.split) {
                $element.attr('ms-click-1', 'showMenu')
            }
            $element
                .attr('ms-click', handler)
                .attr('ms-class', '{{baseCls}}')
                .attr('ms-class-0', 'x-noicon {{baseCls}}-noicon {{baseCls}}-{{ui}}-noicon:!icon')
                .attr('ms-class-1', '{{baseCls}}-{{ui}}')
                .attr('ms-class-2', 'x-icon-text-{{iconAlign}} {{baseCls}}-icon-text-{{iconAlign}} {{baseCls}}-{{ui}}-icon-text-{{iconAlign}}:icon')
                .attr('ms-class-3', 'x-pressed x-btn-pressed {{baseCls}}-{{ui}}-pressed:toggled')
                .attr('ms-class-4', 'x-item-disabled x-disabled {{baseCls}}-disabled {{baseCls}}-{{ui}}-disabled:disabled')
                .attr('ms-class-5', 'x-box-item:box')
                .attr('ms-class-6', 'x-{{uiCls}} {{baseCls}}-{{uiCls}} {{baseCls}}-{{ui}}-{{uiCls}}:uiCls')
                .attr('style', 'border-width:1px 1px 1px 1px;')
                .attr('ms-hover', 'over x-over x-btn-over {{baseCls}}-{{ui}}-over')
                .attr('ms-active', 'x-pressed x-btn-pressed {{baseCls}}-{{ui}}-pressed:!enableToggle')
                .attr('ms-css-left', 'left')//'{{left>0?left:\'\'}}')
                .attr('ms-css-top', '{{top>0?top:\'\'}}')
            avalon.innerHTML(element, template)
            element.stopScan = false
            avalon.scan(element, [vmodel].concat(vmodels))
            if (menu) {
                avalon.scan(menu, [vmodel].concat(vmodels))
            }
            avalon.nextTick(function () {
                var rect = element.getBoundingClientRect()
                vmodel.width = rect.right - rect.left + 1
                vmodel.height = rect.bottom - rect.top + 1
            })
        })
        return vmodel
    }
    avalon.bizui['button'].defaults = {}

})