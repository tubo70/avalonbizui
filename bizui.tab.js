/**
 * Created by quan on 13-12-11.
 */
define(['avalon', 'bizui.panel', 'bizui.button'], function (avalon) {
    bizui.vmodels['tab'] = avalon.mix(true, {}, bizui.vmodels['panel'], {
        $bizuiType: 'tab',
        deferredRender: true,
        itemCls: 'x-tabpanel-child',//The class added to each child item of this TabPanel.
        plain: false,//True to not show the full background on the TabBar.
        removePanelHeader: true,//True to instruct each Panel added to the TabContainer to not render its header element. This is to ensure that the title of the panel does not appear twice.
        tabPosition: 'top',
        activeTab: 0,
        scroller: false,
        disabledScroller: 'left',//left,right,top,bottom
        scrollerSize: 0,
        //maxTabWidth :undefined,
        baseCls: 'x-panel',
        ui: 'default',
        uiCls: '',
        icon: '',
        iconAlign: 'left',
        iconCls: ''
    })
    avalon.bizui['tab'] = function (element, data, vmodels) {
        element.stopScan = true
        var options = avalon.mix(true, {}, bizui.vmodels['tab'], data.tabOptions),
            comps = bizui.getChildren(element, data.tabId, vmodels, null, true, true),
            tabTemplates = [], tabPanelTemplates = [],
            $element = avalon(element)
        options.$tabIds = {}
        options.$tabOrder = []
        for (var i = 0, il = comps.children.length; i < il; i++) {
            var child = comps.children[i]
            if (child.$bizuiId) {
                var $panelId = '$' + child.$bizuiId,
                    panelOptions = comps.bizuiOptions[$panelId],
                    buttonId = 'button' + setTimeout('1'),
                    $buttonId = '$' + buttonId
                tabTemplates.push('<a ms-bizui="button,' + buttonId + ',' + $buttonId + '"></a>')
                options.$tabIds[buttonId] = panelOptions.bizuiId
                options.$tabOrder.push(buttonId)
                comps.bizuiOptions[$buttonId] = {
                    text: panelOptions.title,
                    closable: panelOptions.closable,
                    active: options.activeTab == i,
                    baseCls: 'x-tab',
                    box: true,
                    scale: false,
                    handler: 'tabClick',
                    closeElOverCls: 'x-tab-close-btn-over',
                    position: options.tabPosition,
                    //uiCls: [options.tabPosition],
                    conditionalUiCls: [
                        {condition: 'active', uiCls: ['active', options.tabPosition + '-active']}
                    ]
                }
                panelOptions.width = panelOptions.width || options.width
                panelOptions.height = panelOptions.height || options.height - 25
                panelOptions.hidden = options.activeTab != i
                if (options.removePanelHeader === true) {
                    delete panelOptions.title
                    if (avalon(panelOptions.$element).attr('data-panel-title')) {
                        panelOptions.$element.removeAttribute('data-panel-title')
                    }
                }
                tabPanelTemplates.push(panelOptions.$element.outerHTML)
                delete panelOptions.$element
            }
        }
        avalon.clearChild(element)
        var vmodel = avalon.define(data.tabId, function (vm) {
            avalon.mix(vm, options)
            for (var opts in comps.bizuiOptions) {
                vm[opts] = {}
                avalon.mix(true, vm[opts], comps.bizuiOptions[opts])
            }
            vm.$callback = function (child) {
                var me = this
                child.$containerId = me.bizuiId
                me.$childIds.push(child.bizuiId)
                if (child.bizuiId in me.$tabIds) {
                    child.$watch('width', me.adjustPosition)
                }
            }
            vm.tabClick = function () {
                var me = avalon.vmodels[this.$vmodel.$containerId],
                    newButtonId = this.$vmodel.bizuiId,
                    oldButtonId = me.$tabOrder[me.activeTab],
                    oldButtonId = oldButtonId || me.activeTab,
                    newPanel = avalon.vmodels[me.$tabIds[newButtonId]],
                    oldPanel = avalon.vmodels[me.$tabIds[oldButtonId]],
                    oldBtn = avalon.vmodels[oldButtonId],
                    newBtn = avalon.vmodels[newButtonId]
                if (newPanel) {
                    oldPanel.hidden = true
                    newPanel.hidden = false
                    oldBtn.active=false
                    newBtn.active=true
                    me.activeTab = newButtonId
                }

            }
            vm.adjustPosition = function () {
                var me = avalon.vmodels[this.$containerId]
                if (!me) {
                    return
                }
                var left = 2
                for (var i = 0, il = me.$childIds.length; i < il; i++) {
                    var child = avalon.vmodels[me.$childIds[i]]
                    if (child && child.bizuiId in me.$tabIds) {
                        child.left = left
                        left += child.width + 3
                        if (left > me.width - 4) {
                            me.scroller = true
                            me.scrollerSize = 36
                        }
                    }
                }
            }
            vm.scrollerLeftClick = function () {
                var me = this.$vmodel
                var innerCt = document.getElementById(me.bizuiId + '-innerCt')
                if (innerCt) {
                    innerCt.scrollLeft -= 18
                    if (innerCt.scrollLeft <= 0) {
                        innerCt.scrollLeft = 0
                        me.disabledScroller = 'left'
                    }
                    else {
                        me.disabledScroller = ''
                    }
                }
            }
            vm.scrollerRightClick = function () {
                var me = this.$vmodel
                var innerCt = document.getElementById(me.bizuiId + '-innerCt')
                if (innerCt) {
                    var oldLeft = innerCt.scrollLeft
                    innerCt.scrollLeft += 18
                    if (oldLeft == innerCt.scrollLeft) {
                        me.disabledScroller = 'right'
                    }
                    else {
                        me.disabledScroller = ''
                    }

                }
            }
        })
        var orientation = (options.tabPosition == 'top' || options.tabPosition == 'bottom') ? 'horizontal' : 'vertical'
        var headerBaseCls = 'x-tab-bar'
        var tabPosition = options.tabPosition
        var barCls = bizui.clsHelper.addUICls(headerBaseCls, 'default', [orientation, tabPosition, orientation + '-noborder', 'docked-' + tabPosition])
        barCls.push(headerBaseCls)
        barCls.push(headerBaseCls + '-default')
        barCls.push('x-header')
        barCls.push('x-header-' + orientation)
        barCls.push('x-docked')
        barCls.push('x-unselectable')
        var barScrollerCls = bizui.clsHelper.addUICls(headerBaseCls, 'default', ['scroller'])
        var barBodyCls = bizui.clsHelper.addUICls(headerBaseCls + '-body', 'default', [orientation, tabPosition, orientation + '-noborder', 'docked-' + tabPosition], true)
        barBodyCls.push(headerBaseCls + '-body')
        barBodyCls.push(headerBaseCls + '-body-default')
        barBodyCls.push('x-box-layout-ct')
        var barStripCls = bizui.clsHelper.addUICls(headerBaseCls + '-strip', 'default', [orientation, tabPosition, orientation + '-noborder', 'docked-' + tabPosition], true)
        barStripCls.push(headerBaseCls + '-strip')
        barStripCls.push(headerBaseCls + '-strip-default')
        var barTemplate = [
            '<div class="' + barCls.join(' ') + '"',
            '  ms-class-0="' + barScrollerCls.join(' ') + ':scroller"',
            '  style="right: auto; left: 0px; top: 0px;" ms-css-width="width">',
            '  <div class="' + barBodyCls.join(' ') + '" ms-css-width="width-2">',
            '    <div class="x-box-inner x-box-scroller-left">',
            '      <div ms-visible="scroller" ms-click="scrollerLeftClick" ms-attr-id="{{bizuiId}}-before-scroller"',
            '        ms-class="x-box-scroller-disabled x-tabbar-scroll-left-disabled:disabledScroller==\'left\'" class="x-unselectable x-box-scroller x-tabbar-scroll-left" style="display:none"></div>',
            '    </div>',
            '    <div ms-attr-id="{{bizuiId}}-innerCt" class="x-box-inner x-' + orientation + '-box-overflow-body" role="presentation"',
            '      ms-css-width="width-scrollerSize - 2" style="height:21px;">',
            '      <div class="x-box-target" ms-css-width="width-scrollerSize - 2">',
            '        {{barButtons}}',
            '      </div>',
            '    </div>',
            '    <div class="x-box-inner x-box-scroller-right">',
            '      <div ms-visible="scroller"  ms-click="scrollerRightClick"  ms-attr-id="{{bizuiId}}-after-scroller"',
            '       ms-class="x-box-scroller-disabled x-tabbar-scroll-right-disabled:disabledScroller==\'right\'" class="x-unselectable x-box-scroller x-tabbar-scroll-right"></div>',
            '    </div>',
            '  </div>',
            '  <div class="' + barStripCls.join(' ') + '"></div>',
            '</div>'
        ]
        barTemplate = barTemplate.join(' ').replace('{{barButtons}}', tabTemplates.join(' '))
        var bodyTemplate = [
            '<div class="x-panel-body x-panel-body-default x-layout-fit" ms-css-width="width" ms-css-height="height-25" style="left: 0px; top: 25px;">',
            '  {{tabpanels}}',
            '</div'
        ]
        bodyTemplate = bodyTemplate.join(' ').replace('{{tabpanels}}', tabPanelTemplates.join(' '))
        $element.addClass('x-panel x-panel-default')
            .attr('ms-css-width', 'width')
            .attr('ms-css-height', 'height')
        avalon.nextTick(function () {
            avalon.innerHTML(element, barTemplate + bodyTemplate)
            element.stopScan = false
            avalon.scan(element, [vmodel].concat(vmodels))
        })
        return vmodel
    }
    avalon.bizui['tab'].defaults = {}

    return avalon
})