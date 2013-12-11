/**
 * Created by quan on 13-12-11.
 */
define(['avalon'], function (avalon) {
    bizui.vmodels['tab'] = avalon.mix(true, {}, bizui.vmodels['panel'], {
        $bizuiType: 'tab',
        deferredRender: true,
        itemCls: 'x-tabpanel-child',//The class added to each child item of this TabPanel.
        plain: false,//True to not show the full background on the TabBar.
        removePanelHeader: true,//True to instruct each Panel added to the TabContainer to not render its header element. This is to ensure that the title of the panel does not appear twice.
        tabPosition: 'top',
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
            comps = bizui.getChildren(element, data.tabId, null, true, true),
            tabTemplates = [], tabPanelTemplates = []

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
                    closable: panelOptions.closable
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

        avalon.nextTick(function () {
            element.stopScan = false
            avalon.scan(element, [vmodel].concat(vmodels))
        })
        return vmodel
    }
    avalon.bizui['tab'].defaults = {}

    return avalon
})