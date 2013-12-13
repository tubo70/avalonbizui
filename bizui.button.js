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
        closable: false,
        toggled: false,
        handler: avalon.noop,
        split: false,
        arrowAlign: 'right',
        baseCls: 'x-btn',
        ui: 'default',
        uiCls: [],
        icon: '',
        iconAlign: 'left',
        iconCls: ''
    })
    avalon.bizui['button'] = function (element, data, vmodels) {
        element.stopScan = true
        var options = avalon.mix(true, {}, bizui.vmodels['button'], data.buttonOptions)
        var $element = avalon(element), menu, menuOptions,
            baseCls, ui, iconAlign, uiCls, conditionalCls = [],
            comps = bizui.getChildren(element, data.buttonId, vmodels, 'menu')
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
        if (options.scale) {
            options.ui = options.ui + '-' + options.scale
        }
        if (options.position) {
            options.uiCls.push(options.position)
        }
        if (options.closable) {
            options.uiCls.push('closable')
        }
        baseCls = options.baseCls
        ui = options.ui
        iconAlign = options.iconAlign
        uiCls = options.uiCls
        if (options.conditionalUiCls) {
            conditionalCls = options.conditionalUiCls
            delete options.conditionalUiCls
        }
        var vmodel = avalon.define(data.buttonId, function (vm) {
            vm.skipArray = ['baseCls', 'ui']
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
            //var uiCls = options.uiCls || []
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
                conditionalUiCls: conditionalCls,
                framingInfoCls: baseCls + '-' + ui + (options.position ? '-' + options.position : ''),
                dynamic: false,
                idSuffix: '-frame',
                extraAttrs: ''

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
            '<span ms-if="closable" ms-attr-id="{{bizuiId}}-closeEl" ms-hover="' + options.closeElOverCls + '" class="' + options.baseCls + '-close-btn" ms-attr-title="{{text}}" tabIndex="0"></span>'
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
        if (options.enableToggle) {
            $element.attr('ms-click-0', 'toggleClick')
        }
        if (options.split) {
            $element.attr('ms-click-1', 'showMenu')
        }
        var elementUiCls = bizui.clsHelper.addUICls(baseCls, ui, uiCls)
        elementUiCls.push(baseCls)
        elementUiCls.push(baseCls + '-' + ui)
        elementUiCls.push('x-unselectable')
        conditionalCls = bizui.clsHelper.getConditionalClass(conditionalCls, baseCls, ui)
        for (var i = 0, il = conditionalCls.length; i < il; i++) {
            $element.attr('ms-class-' + (90 + i), conditionalCls[i])
        }
        var overCls = 'over x-over ' + baseCls + '-over ' + baseCls + '-' + ui + '-over'
        if (options.position) {
            overCls += 'x-' + options.position + '-over ' + baseCls + '-' + options.position + '-over ' + baseCls + '-' + ui + '-' + options.position + '-over'
        }
        $element
            .attr('ms-click', handler)
            .addClass(elementUiCls.join(' '))
            .attr('ms-class-0', 'x-noicon ' + baseCls + '-noicon ' + baseCls + '-' + ui + '-noicon:!icon')
            .attr('ms-class-2', 'x-icon-text-' + iconAlign + ' ' + baseCls + '-icon-text-' + iconAlign + ' ' + baseCls + '-' + ui + '-icon-text-' + iconAlign + ':icon')
            .attr('ms-class-3', 'x-pressed ' + baseCls + '-pressed ' + baseCls + '-' + ui + '-pressed:toggled')
            .attr('ms-class-4', 'x-item-disabled x-disabled ' + baseCls + '-disabled ' + baseCls + '-' + ui + '-disabled:disabled')
            .attr('ms-class-5', 'x-box-item:box')
            //.attr('ms-class-6', 'x-{{uiCls}} {{baseCls}}-{{uiCls}} {{baseCls}}-{{ui}}-{{uiCls}}:uiCls')
            .attr('style', 'border-width:1px 1px 1px 1px;')
            .attr('ms-hover', overCls)
            .attr('ms-active', 'x-pressed ' + baseCls + '-pressed ' + baseCls + '-' + ui + '-pressed:!enableToggle')
            .attr('ms-css-left', 'left')//'{{left>0?left:\'\'}}')
            .attr('ms-css-top', '{{top>0?top:\'\'}}')
        avalon.nextTick(function () {
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