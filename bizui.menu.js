/**
 * Created by weiwei on 13-12-4.
 */
define(['avalon'], function (avalon) {
    bizui.subMenuIds = []
    if (bizui.isIE8m) {
        window.onclick = function () {
            if (bizui.subMenuIds.length != 0) {
                var menuId
                while (menuId = bizui.subMenuIds.pop()) {
                    var menuModel = avalon.vmodels[menuId]
                    if (menuModel) {
                        menuModel.hidden = true
                    }
                }
            }
        }
    } else {
        avalon(window).bind('click', function () {
            if (bizui.subMenuIds.length != 0) {
                var menuId
                while (menuId = bizui.subMenuIds.pop()) {
                    var menuModel = avalon.vmodels[menuId]
                    if (menuModel) {
                        menuModel.hidden = true
                    }
                }
            }
        })
    }
    bizui.vmodels['menu'] = avalon.mix(true, {}, bizui.containerVModel, {
        $bizuiType: 'menu',
        hidden: false,
        ignoreParentClicks: false, //True to ignore clicks on any item in this menu that is a parent item (displays a submenu) so that the submenu is not dismissed when clicking the parent item.
        plain: false,//True to remove the incised line down the left side of the menu and to not indent general Component items.
        showSeparator: true, //True to show the icon separator.
        isSubMenu: false,
        zIndex: -1
    })
    bizui.vmodels['menuitem'] = avalon.mix(true, {}, bizui.baseVModel, {
        $bizuiType: 'menuitem',
        $subMenuId: '',
        type: 'textitem',
        text: '',
        plain: false,
        handler: avalon.noop,
        href: '#',
        hrefTarget: '',
        menuAlign: 'tl-tr?',
        baseCls: 'x',
        ui: '',
        uiCls: '',
        icon: '',
        iconCls: ''
    })
    avalon.bizui['menu'] = function (element, data, vmodels) {
        var options = avalon.mix(true, {}, bizui.vmodels['menu'], data.menuOptions)
        var $element = avalon(element)
        element.stopScan = true
        var comps = bizui.getChildren(element, data.menuId, vmodels, 'menuitem')
        var childOptions = comps.bizuiOptions, index = 0, itemHeight = 24
        var height = 0
        var innerHeight = 0
        for (var id in childOptions) {
            var child = childOptions[id]
            child.width = options.width - 6
            child.top = height
            if (child.type == 'separator') {
                height += 4
                innerHeight += 4
            }
            else {
                height += itemHeight + 3
                innerHeight += itemHeight + 3
            }

            index++
        }
        height += 5
        if (options.height > height) {
            options.height = height
        }
        options.hasScroller = false
        options.innerHeight = options.height
        options.scrollerHeight = 0
        if (options.height < height) {
            options.hasScroller = true
            options.scrollerHeight = 20
            options.height += options.scrollerHeight
            options.innerHeight = innerHeight
        }
        if (options.isSubMenu) {
            bizui.zIndex += 10
            options.zIndex = bizui.zIndex
            options.hidden = true
        }
        var vmodel = avalon.define(data.menuId, function (vm) {
            avalon.mix(vm, options)
            for (var opts in childOptions) {
                vm[opts] = {}
                avalon.mix(true, vm[opts], childOptions[opts])
            }
            vm.scrollTop = function () {
                var innerCt = document.getElementById(vm.bizuiId + '-innerCt')
                if (innerCt) {
                    innerCt.scrollTop += itemHeight
                }
                return false
            }
            vm.scrollDown = function () {
                var innerCt = document.getElementById(vm.bizuiId + '-innerCt')
                if (innerCt) {
                    innerCt.scrollTop -= itemHeight
                    if (innerCt.scrollTop < 0) {
                        innerCt.scrollTop = 0
                    }
                }
                return false
            }
            vm.$watch('hidden', function (newValue) {
                if (newValue === false) {
                    bizui.subMenuIds.push(vmodel.bizuiId)
                }
            })
            vm.enterSubMenu = function () {
                if (vmodel.isSubMenu) {
                    vmodel.hidden = false
                }
            }
        })

        var template = '<div class="x-panel-body x-menu-body x-panel-body-default x-panel-body-default x-box-layout-ct"' +
            ' ms-css-width="width" ms-css-height="height" style="left: 0px; top: 0px;"' +
            ' ms-class-0="x-scroller x-panel-body-scroller x-panel-body-default-scroller:hasScroller">' +
            '<div class="x-box-inner x-box-scroller-top">' +
            '<div ms-visible="hasScroller" class="x-box-scroller x-menu-scroll-top" ms-click-0="scrollTop"></div>' +
            '</div>' +
            '<div id="' + options.bizuiId + '-innerCt" class="x-box-inner x-vertical-box-overflow-body" role="presentation"' +
            ' ms-css-height="height-8-scrollerHeight" ms-css-width="width-6">' +
            '<div ms-visible="showSeparator" class="x-menu-icon-separator" ms-css-height="innerHeight">&nbsp;</div>' +
            '<div ms-css-width="width-6" style="position: absolute; left: 0px; top: 0px; height: 1px;">' +
            element.innerHTML +
            '</div>' +
            '</div>' +
            '<div class="x-box-inner x-box-scroller-bottom">' +
            '<div ms-visible="hasScroller" class="x-box-scroller x-menu-scroll-bottom" ms-click="scrollDown"></div>' +
            '</div>' +
            '</div>'
        var shadowElement
        if (options.isSubMenu) {
            var cls = 'x-css-shadow'
            if (bizui.isIE) {
                cls = 'x-ie-shadow'
            }
            var shadowTemplate = '<div ms-if="isSubMenu" ms-visible="!hidden" class="' + cls + '" role="presentation" ms-css-z-index="zIndex" style="right: auto; box-shadow: rgb(136, 136, 136) 0px 0px 6px;" ms-css-left="left" ms-css-top="top+4" ms-css-width="width" ms-css-height="height-4"></div>'
            if (bizui.isIE8m) {
                shadowTemplate = '<div ms-if="isSubMenu" ms-visible="!hidden" class="x-ie-shadow" role="presentation" style="right: auto; position: ; filter: progid:DXImageTransform.Microsoft.alpha(opacity=50) progid:DXImageTransform.Microsoft.Blur(pixelradius=4);"  ms-css-z-index="zIndex" ms-css-left="left-5" ms-css-top="top-3" ms-css-width="width-1" ms-css-height="height+1"></div>'
            }
            shadowElement = avalon.parseHTML(shadowTemplate)
            shadowElement.stopScan = true
            document.body.appendChild(shadowElement)
            shadowElement = document.body.lastChild
        }
        if (!bizui.isIE || bizui.isIE8p) {
            $element.addClass('x-border-box')
        }

        $element.addClass('x-panel x-panel-default x-menu')
            .attr('style', 'margin: 0px 0px 10px;')
            .attr('ms-css-width', 'width')
            .attr('ms-css-height', 'height')
            .attr('ms-css-left', '{{isSubMenu?left:\'\'}}')
            .attr('ms-css-top', '{{isSubMenu?top:\'\'}}')
            .attr('ms-css-z-index', '{{isSubMenu?zIndex+1:\'\'}}')
            .attr('ms-mouseenter', 'enterSubMenu')
            .attr('ms-visible', '!hidden')
            .attr('ms-class-0', 'x-item-disabled x-masked-relative x-masked:disabled')
            .attr('ms-class-1', 'x-scroller x-panel-scroller x-panel-default-scroller:hasScroller')
            .attr('ms-class-2', 'x-layer:isSubMenu')
        avalon.nextTick(function () {
            element.stopScan = false
            avalon.innerHTML(element, template)
            avalon.scan(element, [vmodel].concat(vmodels))
            if (shadowElement && options.isSubMenu) {
                avalon.nextTick(function () {
                    shadowElement.stopScan = false
                    avalon.scan(shadowElement, [vmodel].concat(vmodels))
                })
            }
        })
        return vmodel
    }
    avalon.bizui['menu'].defaults = {}

    avalon.bizui['menuitem'] = function (element, data, vmodels) {
        var options = avalon.mix(true, {}, bizui.vmodels['menuitem'], data.menuitemOptions)
        var $element = avalon(element), subMenu, subMenuOptions
        element.stopScan = true
        options.hasSubMenu = false
        var comps = bizui.getChildren(element, data.menuId, vmodels, 'menu')
        if (comps.children.length > 0) {
            options.hasSubMenu = true
            subMenu = element.firstChild
            subMenuOptions = comps.bizuiOptions['$' + comps.children[0].$bizuiId]
            subMenuOptions.$containerId = options.bizuiId
            subMenuOptions.hidden = true
            subMenuOptions.isSubMenu = true
            options.$subMenuId = subMenuOptions.bizuiId
            while (element.firstChild) {
                var el = element.firstChild

                element.removeChild(el)
            }
        }
        var vmodel = avalon.define(data.menuitemId, function (vm) {
            avalon.mix(vm, options)
            if (subMenuOptions) {
                vm['$' + subMenuOptions.bizuiId] = {}
                avalon.mix(true, vm['$' + subMenuOptions.bizuiId], subMenuOptions)

            }
            vm.showSubMenu = function (e) {
                if (vm.hasSubMenu === true) {
                    var subMenuModel = avalon.vmodels[vm.$subMenuId]
                    if (subMenuModel) {
                        subMenuModel.left = e.pageX + vm.width - e.offsetX - 15
                        subMenuModel.top = e.pageY - e.offsetY + 13
                        subMenuModel.hidden = false
                    }
                }
            }
            vm.hideSubMenu = function (e) {
                if (vm.hasSubMenu === true) {
                    var subMenuModel = avalon.vmodels[vm.$subMenuId]
                    if (subMenuModel) {
                        subMenuModel.hidden = true
                    }
                }
            }
        })
        //copy from ext-js
        var renderTpl = [

            '<a ms-attr-id="{{bizuiId}}-itemEl"',
            ' class="x-menu-item-link"',
            ' ms-href="href"',
            ' ms-attr-target="hrefTarget"',
            ' hidefocus="true"',
            // For most browsers the text is already unselectable but Opera needs an explicit unselectable="on".
            ' unselectable="on"',
            //'<tpl if="tabIndex">',
            //' tabIndex="{tabIndex}"',
            //'</tpl>',
            '>',
            '<div role="img" ms-attr-id="{{bizuiId}}-iconEl" ms-class="x-menu-item-icon {{iconCls}}',
            //'{childElCls} {glyphCls}" style="<tpl if="icon">background-image:url({icon});</tpl>',
            '  ms-css-background-image="{{icon!=\'\'?\'url(\' + icon+\');\':\'\'}}">',
            //'<tpl if="glyph && glyphFontFamily">font-family:{glyphFontFamily};</tpl>">',
            //'<tpl if="glyph">&#{glyph};</tpl>',
            '</div>',
            '<span ms-attr-id="{{bizuiId}}-textEl" class="x-menu-item-text" unselectable="on">{{text}}</span>',
            '<img ms-attr-id="{{bizuiId}}-arrowEl" src="data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" ms-class="x-menu-item-arrow:hasSubMenu"/>',
            '</a>'

        ]
        /*var template = '<a class="x-menu-item-link" ms-href="href" ms-attr-target="hrefTarget" hidefocus="true" unselectable="on">' +
         '<img src="data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="' +
         ' ms-class="x-menu-item-icon {{iconCls}}">' +
         '<span class="x-menu-item-text">{{text}}</span>' +
         '<img src="data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" ms-class="x-menu-item-arrow:hasSubMenu">' +
         '</a>'*/
        var template = renderTpl.join('')
        if (options.type == 'separator') {
            template = ''
        }
        if (options.plain === true) {
            template = '{{text}}'
        }
        if (subMenu) {
            document.body.appendChild(subMenu)
            subMenu = document.body.lastChild
        }
        var handler = 'handler'
        if (typeof vmodel.handler != 'function') {
            handler = vmodel.handler
        }
        if (options.type == 'separator') {
            $element.addClass('x-component x-box-item x-component-default x-menu-item-separator x-menu-item x-menu-item-plain')
                .attr('style', 'left: 0px; margin: 0px;')
                .attr('ms-css-width', 'width')
                .attr('ms-css-top', 'top')
        }
        else {
            $element.addClass('x-component x-box-item x-component-default x-menu-item')
                .attr('style', 'left: 0px; margin: 0px;')
                .attr('ms-css-width', 'width')
                .attr('ms-css-top', 'top')
                .attr('ms-click-0', handler)
                .attr('ms-mouseenter', 'showSubMenu')
                .attr('ms-mouseleave', 'hideSubMenu')
                .attr('ms-hover', 'x-menu-item-active:!disabled')
        }
        avalon.nextTick(function () {
            avalon.innerHTML(element, template)
            element.stopScan = false
            avalon.scan(element, [vmodel].concat(vmodels))
            if (subMenu) {
                avalon.nextTick(function () {
                    subMenu.stopScan = false
                    avalon.scan(subMenu, [vmodel].concat(vmodels))
                })
            }
        })
        return vmodel
    }
    avalon.bizui['menuitem'].defaults = {}
})