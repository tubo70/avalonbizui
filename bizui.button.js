/**
 * Created by quan on 13-12-4.
 */
define(['avalon', 'bizui.menu'], function (avalon) {
    bizui.vmodels['button'] = avalon.mix(true, {}, bizui.baseVModel, {
        $bizuiType: 'button',
        scale: 'small',
        box: false,
        text: '',
        icon: '',
        iconCls: '',
        height: 22,
        buttonHeight: 16,
        iconAlign: 'left',
        enableToggle: false,
        toggled: false,
        handler: avalon.noop,
        split:false,
        arrowAlign: 'right',
        baseCls: 'x-btn',
        ui: 'default',
        uiCls: ''
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

        var frameTableTpl = [
                '<table class="x-table-plain" cellpadding="0"><tbody>',
                '  <tr>',//x-frame-tl x-btn-tl x-btn-default-small-tl x-btn-default-small-uicls-tl x-btn-default-small-icon-text-left-tl
                '    <td class="x-frame-tl" ms-class="{{baseCls}}-tl {{baseCls}}-{{ui}}-tl" ms-class-1="{{baseCls}}-{{ui}}-{{uiCls}}-tl:uiCls" role="presentation"></td>',
                '    <td class="x-frame-tc" ms-class="{{baseCls}}-tc {{baseCls}}-{{ui}}-tc" ms-class-1="{{baseCls}}-{{ui}}-{{uiCls}}-tc:uiCls" role="presentation"></td>',
                '    <td class="x-frame-tr" ms-class="{{baseCls}}-tr {{baseCls}}-{{ui}}-tr" ms-class-1="{{baseCls}}-{{ui}}-{{uiCls}}-tr:uiCls" role="presentation"></td>',
                '  </tr>',
                '  <tr>',
                '    <td class="x-frame-ml" ms-class="{{baseCls}}-ml {{baseCls}}-{{ui}}-ml" ms-class-1="{{baseCls}}-{{ui}}-{{uiCls}}-ml:uiCls" role="presentation"></td>',
                '    <td class="x-frame-mc" ms-class="{{baseCls}}-mc {{baseCls}}-{{ui}}-mc" ms-class-1="{{baseCls}}-{{ui}}-{{uiCls}}-mc:uiCls" role="presentation">',
                '{${$contentTemplate$}$}</td>',
                '    </td>',
                '    <td class="x-frame-mr" ms-class="{{baseCls}}-mr {{baseCls}}-{{ui}}-mr" ms-class-1="{{baseCls}}-{{ui}}-{{uiCls}}-mr:uiCls" role="presentation"></td>',
                '  </tr>',
                '  <tr>',
                '    <td class="x-frame-bl" ms-class="{{baseCls}}-bl {{baseCls}}-{{ui}}-bl" ms-class-1="{{baseCls}}-{{ui}}-{{uiCls}}-bl:uiCls" role="presentation"></td>',
                '    <td class="x-frame-bc" ms-class="{{baseCls}}-bc {{baseCls}}-{{ui}}-bc" ms-class-1="{{baseCls}}-{{ui}}-{{uiCls}}-bc:uiCls" role="presentation"></td>',
                '    <td class="x-frame-br" ms-class="{{baseCls}}-br {{baseCls}}-{{ui}}-br" ms-class-1="{{baseCls}}-{{ui}}-{{uiCls}}-br:uiCls" role="presentation"></td>',
                '  </tr>',
                '</tbody></table>'
            ],
            renderTpl = [
                '<span  ms-class="{{baseCls}}-wrap" ms-class-0="{{baseCls}}-arrow {{baseCls}}-arrow-{{arrowAlign}}:split" unselectable="on">',
                '  <span ms-class="{{baseCls}}-button">',
                '    <span ms-class="{{baseCls}}-inner {innerCls}"  unselectable="on">',
                '      {{text}}',
                '    </span>',
                '    <span role="img" ms-class="{{baseCls}}-icon-el {{iconCls}}" unselectable="on" ms-css-background-image="{{icon!=\'\'?\'url(\'+icon+\')\':\'\'}}">',
                //'<tpl if="glyph">&#{glyph};</tpl><tpl if="iconCls || iconUrl">&#160;</tpl>',
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
        var template = '<em ms-class="{{baseCls}}-arrow {{baseCls}}-arrow-{{arrowAlign}}:split"><button type="button" ms-click="' + handler + '" ms-class-0="{{baseCls}}-center" hidefocus="true" role="button" autocomplete="off" ms-css-height="buttonHeight">' +
            '<span ms-class="{{baseCls}}-inner">{{text}}</span>' +
            '<span ms-class="{{baseCls}}-icon " ms-css-background-image="{{icon!=\'\'?\'url(\'+icon+\')\':\'\'}}"></span>' +
            '</button></em>'
        template = renderTpl.join('')
        if (bizui.isIE7m) {
            template = frameTableTpl.join('').replace('{${$contentTemplate$}$}', renderTpl.join(''))
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
                vmodel.height = $element.height()
                vmodel.width = $element.width()
            })
        })
        return vmodel
    }
    avalon.bizui['button'].defaults = {}

})