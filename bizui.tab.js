/**
 * Created by quan on 13-12-11.
 */
define(['avalon','bizui.panel','bizui.button'], function (avalon) {
    bizui.vmodels['tab'] = avalon.mix(true, {}, bizui.vmodels['panel'], {
        $bizuiType: 'tab',
        deferredRender: true,
        itemCls: 'x-tabpanel-child',//The class added to each child item of this TabPanel.
        plain: false,//True to not show the full background on the TabBar.
        removePanelHeader: true,//True to instruct each Panel added to the TabContainer to not render its header element. This is to ensure that the title of the panel does not appear twice.
        tabPosition: 'top',
        activeTab: 0,
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
            comps = bizui.getChildren(element, data.tabId,vmodels, null, true, true),
            tabTemplates = [], tabPanelTemplates = [],
            $element = avalon(element)

        for (var i = 0, il = comps.children.length; i < il; i++) {
            var child = comps.children[i]
            if (child.$bizuiId) {
                var $panelId = '$' + child.$bizuiId,
                    panelOptions = comps.bizuiOptions[$panelId],
                    buttonId = 'button' + setTimeout('1'),
                    $buttonId = '$' + buttonId
                tabTemplates.push('<a ms-bizui="button,' + buttonId + ',' + $buttonId + '"></a>')
                comps.bizuiOptions[$buttonId] = {
                    text: panelOptions.title,
                    closable: panelOptions.closable,
                    active: options.activeTab == i,
                    baseCls: 'x-tab',
                    box:true,
                    scale: false,
                    closeElOverCls: 'x-tab-close-btn-over',
                    position: options.tabPosition,
                    uiCls: [options.tabPosition],
                    conditionalUiCls: [
                        {condition: 'active', uiCls: ['active', options.tabPosition + '-active']}
                    ]
                }
                if (options.removePanelHeader === true) {
                    delete panelOptions.title
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
        })
        var orientation = (options.tabPosition == 'top' || options.tabPosition == 'bottom') ? 'horizontal' : 'vertical'
        var headerBaseCls = 'x-tab-bar'
        var tabPosition = options.tabPosition
        var barCls = bizui.clsHelper.addUICls(headerBaseCls, 'default', [orientation, tabPosition, orientation + '-noborder', 'docked-' + tabPosition])
        barCls.push(headerBaseCls)
        barCls.push('x-header')
        barCls.push('x-header-', orientation)
        var barBodyCls = bizui.clsHelper.addUICls(headerBaseCls + '-body', 'default', [orientation, tabPosition, orientation + '-noborder', 'docked-' + tabPosition], true)
        barBodyCls.push(headerBaseCls + '-body')
        barBodyCls.push('x-box-layout-ct')
        var barStripCls = bizui.clsHelper.addUICls(headerBaseCls +'-strip','default',[orientation, tabPosition, orientation + '-noborder', 'docked-' + tabPosition], true)
        var barTemplate = [
            '<div class="' + barCls.join(' ') + '"',
            '  style="right: auto; left: 0px; top: 0px;" ms-css-width="width">',
            '  <div class="' + barBodyCls.join(' ') + '" ms-css-width="width-2">',
            '    <div class="x-box-inner x-box-scroller-left">',
            '      <div ms-attr-id="{{bizuiId}}-before-scroller" class="x-box-scroller x-tabbar-scroll-left" style="display:none"></div>',
            '    </div>',
            '    <div class="x-box-inner x-' + orientation + '-box-overflow-body" role="presentation"',
            '      ms-css-width="width-2" style="height:21px;">',
            '      <div class="x-box-target" ms-css-width="width-2">',
            '        {{barButtons}}',
            '      </div>',
            '    </div>',
            '    <div class="x-box-inner x-box-scroller-right">',
            '      <div ms-attr-id="{{bizuiId}}-after-scroller" class="x-box-scroller x-tabbar-scroll-right" style="display:none"></div>',
            '    </div>',
            '  </div>',
            '  <div class="'+barStripCls.join(' ')+'"></div>',
            '</div>'
        ]
        barTemplate = barTemplate.join(' ').replace('{{barButtons}}', tabTemplates.join(' '))
        var bodyTemplate=[
            '<div class="x-panel-body x-panel-body-default x-layout-fit" ms-css-width="width" ms-css-height="height-25" style="left: 0px; top: 25px;">',
            '  {{tabpanels}}',
            '</div'
        ]
        bodyTemplate = bodyTemplate.join(' ').replace('{{tabpanels}}', tabPanelTemplates.join(' '))
        $element.addClass('x-panel x-panel-default')
            .attr('ms-css-width', 'width')
            .attr('ms-css-height', 'height')
        avalon.nextTick(function () {
            avalon.innerHTML(element,barTemplate+bodyTemplate)
            console.log(tabTemplates)
            element.stopScan = false
            avalon.scan(element, [vmodel].concat(vmodels))
        })
        return vmodel
    }
    avalon.bizui['tab'].defaults = {}

    return avalon
})