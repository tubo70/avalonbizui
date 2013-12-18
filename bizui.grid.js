/**
 * Created by quan on 13-12-17.
 */
define(['avalon', 'bizui.panel'], function (avalon) {
    bizui.vmodels['grid'] = avalon.mix(true, {}, bizui.vmodels['panel'], {
        $bizuiType: 'grid',
        //lines: true,
        rowLines: true,
        //useArrows: false,
        baseCls: bizui.baseCSSPrefix + 'panel',
        ui: 'default',
        uiCls: '',
        //Ext.panel.Table
        extraBaseCls: bizui.baseCSSPrefix + 'grid',
        extraBodyCls: bizui.baseCSSPrefix + 'grid-body',
        colLinesCls: bizui.baseCSSPrefix + 'grid-with-col-lines',
        rowLinesCls: bizui.baseCSSPrefix + 'grid-with-row-lines',
        noRowLinesCls: bizui.baseCSSPrefix + 'grid-no-row-lines',
        hiddenHeaderCtCls: bizui.baseCSSPrefix + 'grid-header-ct-hidden',
        hiddenHeaderCls: bizui.baseCSSPrefix + 'grid-header-hidden',
        resizeMarkerCls: bizui.baseCSSPrefix + 'grid-resize-marker',
        emptyCls: bizui.baseCSSPrefix + 'grid-empty',
        //Ext.panel.Tree
        //treeCls: bizui.baseCSSPrefix + 'tree-panel',
        //arrowCls: bizui.baseCSSPrefix + 'tree-arrows',
        //linesCls: bizui.baseCSSPrefix + 'tree-lines',
        //noLinesCls: bizui.baseCSSPrefix + 'tree-no-lines',
        //autoWidthCls: bizui.baseCSSPrefix + 'autowidth-table',

       // iconCls: bizui.baseCSSPrefix + 'tree-icon',
        //checkboxCls: bizui.baseCSSPrefix + 'tree-checkbox',
        //elbowCls: bizui.baseCSSPrefix + 'tree-elbow',
        //expanderCls: bizui.baseCSSPrefix + 'tree-expander',
        //textCls: bizui.baseCSSPrefix + 'tree-node-text',
        //innerCls: bizui.baseCSSPrefix + 'grid-cell-inner-treecolumn',

        viewBaseCls:bizui.baseCSSPrefix + 'grid-view',
        viewLayout:'tableview',
///src/view/Table.js
        firstCls: bizui.baseCSSPrefix + 'grid-cell-first',
        lastCls: bizui.baseCSSPrefix + 'grid-cell-last',
        selectedItemCls: bizui.baseCSSPrefix + 'grid-row-selected',
        beforeSelectedItemCls: bizui.baseCSSPrefix + 'grid-row-before-selected',
        selectedCellCls: bizui.baseCSSPrefix + 'grid-cell-selected',
        focusedItemCls: bizui.baseCSSPrefix + 'grid-row-focused',
        beforeFocusedItemCls: bizui.baseCSSPrefix + 'grid-row-before-focused',
        tableFocusedFirstCls: bizui.baseCSSPrefix + 'grid-table-focused-first',
        tableSelectedFirstCls: bizui.baseCSSPrefix + 'grid-table-selected-first',
        tableOverFirstCls: bizui.baseCSSPrefix + 'grid-table-over-first',
        overItemCls: bizui.baseCSSPrefix + 'grid-row-over',
        beforeOverItemCls: bizui.baseCSSPrefix + 'grid-row-before-over',
        altRowCls: bizui.baseCSSPrefix + 'grid-row-alt',
        dirtyCls: bizui.baseCSSPrefix + 'grid-dirty-cell',
        rowClsRe: new RegExp('(?:^|\\s*)' + bizui.baseCSSPrefix + 'grid-row-(first|last|alt)(?:\\s+|$)', 'g'),
        cellRe: new RegExp(bizui.baseCSSPrefix + 'grid-cell-([^\\s]+) ', '')//,
///src/tree/View.js
        //loadingCls: bizui.baseCSSPrefix + 'grid-tree-loading',
        //expandedCls: bizui.baseCSSPrefix + 'grid-tree-node-expanded',
        //leafCls: bizui.baseCSSPrefix + 'grid-tree-node-leaf',

        //expanderSelector: '.' + Ext.baseCSSPrefix + 'tree-expander',
        //checkboxSelector: '.' + Ext.baseCSSPrefix + 'tree-checkbox',
        //expanderIconOverCls: bizui.baseCSSPrefix + 'tree-expander-over'
    })
    avalon.bizui['grid'] = function (element, data, vmodels) {
        element.stopScan = true
        var $element = avalon(element)
        avalon.clearChild(element)
        var options = avalon.mix(true, {}, bizui.vmodels['grid'], data.girdOptions)
        var panelCls = [options.baseCls, options.baseCls + '-' + options.ui,
            options.extraBaseCls, 'x-border-box']

        if (options.rowLines) {
            panelCls.push(options.rowLinesCls)
        } else {
            panelCls.push(options.noRowLinesCls)
        }
        panelCls = panelCls.join(' ')
        $element.addClass(panelCls)
            .attr('ms-css-width', 'width')
            .attr('ms-css-height', 'height')
        var toolsTemplate = options.getHeaderToolTemplate()
        var headerCls = options.getHeaderCls()
        headerCls.push('x-unselectable')
        headerCls = headerCls.join(' ')
        var headerUiCls = options.getHeaderUiCls()
        var uiCls = bizui.clsHelper.addUICls(options.headerBaseCls, options.headerUi, headerUiCls)
        headerCls += ' ' + uiCls.join(' ')
        var headerBodyCls = bizui.clsHelper.addUICls(options.headerBaseCls + '-body', options.headerUi, headerUiCls, true)
        headerBodyCls.push('x-box-layout-ct')
        var headerTemplate = options.getHeaderTemplate(headerCls, headerBodyCls.join(' '), toolsTemplate)
        var panelBodyCls = 'x-panel-body x-grid-body x-panel-body-default x-layout-fit'
        var panelBodyTemplate = [
            '<div class="' + panelBodyCls + '" style="left: 0px; top: 25px;"',
            '  ms-css-width="width" ms-css-height="height-25">',
            '  <div class="x-tree-view x-fit-item x-tree-view-default x-unselectable" style="overflow: auto; margin: 0px;"',
            '    ms-css-width="width-2" ms-css-height="height-27">',
            '    {{treeTemplate}}',
            '  </div>',
            '</div>']
        var tableCls = [bizui.baseCSSPrefix + 'grid-table']
        if (options.rowLines) {
            tableCls.push(options.rowLinesCls)
        } else {
            tableCls.push(options.noRowLinesCls)
        }
        var tableTemplate = '<table role="presentation" ms-on-dblclick="nodeDblClick" ms-click="nodeClick" ms-attr-id="{{bizuiId}}-table"' +
            ' class="' + tableCls.join(' ') + '" border="0" cellspacing="0" cellpadding="0" ' +
            ' tabIndex="-1" style="width: 10000px;">' +
            '<colgroup><col style="width: 10000px;"></colgroup>' +
            ' <tbody ms-each-row="rows">' +
            ' {{rowsTemplate}}</tbody></table>'
        var rowCls = [bizui.baseCSSPrefix + 'grid-row', bizui.baseCSSPrefix + 'grid-data-row']
        var rowsTemplate = [
            '<tr role="row" ms-data-recordid="row.id" ms-data-index="$index" class="' + rowCls.join(' ') + '"',
            '  ms-class-0="' + options.selectedItemCls + ':$index==selectedIndex"',
            '  ms-class-1="' + options.focusedItemCls + ':$index==selectedIndex"',
            '  ms-hover="' + options.overItemCls + '"',
            '  ms-class-2="' + options.beforeSelectedItemCls + ':($index+1) == selectedIndex"',
            //'  ms-class-3="' + options.beforeOverItemCls + ':?????"',
            '  ms-class-4="' + options.beforeFocusedItemCls + ':($index+1) == selectedIndex"',
            '  ms-class-5="' + options.expandedCls + ':row.expanded">',
            '  {{cellTemplate}}',
            '</tr>'

        ]
        var cellTemplate = ['<td role="gridcell" class="x-grid-cell x-grid-td  x-grid-cell-treecolumn x-grid-cell-first x-grid-cell-last x-unselectable x-grid-cell-treecolumn">',
            '<div unselectable="on" class="x-grid-cell-inner x-grid-cell-inner-treecolumn" style="text-align:left;">',
            '<img ms-repeat-line="row.lines" src="' + bizui.BLANK_IMAGE_URL + '" class="' + options.elbowCls + '-img"',
            '  ms-class-0="' + options.elbowCls + '-line:line" ms-class-1="' + options.elbowCls + '-empty:!line"/>',
            '<img src="' + bizui.BLANK_IMAGE_URL + '" class="' + options.elbowCls + '-img"',
            '  ms-class-0="' + options.elbowCls + ':!row.isLast && !row.expandable"',
            '  ms-class-1="' + options.elbowCls + '-end:row.isLast && !row.expandable"',
            '  ms-class-2="' + options.elbowCls + '-plus:row.expandable && !row.isLast"',
            '  ms-class-3="' + options.elbowCls + '-end-plus:row.expandable && row.isLast"',
            '  ms-class-4="' + options.expanderCls + ':row.expandable"/>',
            '<input ms-if="row.checked!==null" class="' + options.checkboxCls + '" type="button" role="checkbox"',
            '  ms-attr-aria-checked="{{row.checked?\'true\':\'\'}}"',
            '  ms-class-0="' + options.checkboxCls + '-checked:row.checked" />',
            '<img src="' + bizui.BLANK_IMAGE_URL + '" class="' + options.iconCls + '"',
            '  ms-class-0="' + options.iconCls + '-leaf:row.leaf"',
            '  ms-class-1="' + options.iconCls + '-parent:!row.leaf"',
            '  ms-class-2="row.iconCls:row.iconCls"',
            '  ms-css-background-image="{{row.icon?\'url(\'+row.icon+\')\':\'\'}}"/>',
            '<a ms-if="row.href" ms-href="row.href" ms-attr-target="row.hrefTarget" class="{textCls} {childCls}">{{row.text}}</a>',
            '<span ms-if="!row.href" class="' + options.textCls + '">{{row.text}}</span></div></td>',
        ]
        rowsTemplate = rowsTemplate.join(' ').replace('{{cellTemplate}}', cellTemplate.join(''))
        tableTemplate = tableTemplate.replace('{{rowsTemplate}}', rowsTemplate)
        panelBodyTemplate = panelBodyTemplate.join(' ').replace('{{treeTemplate}}', tableTemplate)
        var rows = []
        var oneRow = {parentId: null,
            index: 0,
            depth: 0,
            expanded: false,
            expandable: true,
            checked: null,
            leaf: false,
            cls: '',
            iconCls: '',
            icon: '',
            root: false,
            isLast: false,
            isFirst: false,
            allowDrop: true,
            allowDrag: true,
            loaded: false,
            loading: false,
            href: '',
            hrefTarget: '_blank',
            qtip: '',
            qtitle: '',
            qshowDelay: 0,
            children: null,
            $skipArray: ['childern']
        }

        function processNode(parent, node, out, depth, skips) {
            skips = skips || -1
            if (node.children) {
                node.children[node.children.length - 1].isLast = true
            }
            else {
                node.expandable = false
                node.expanded = false
            }
            if (out.length == 0) {
                node.root = true
                node.isFirst = true
            }
            if (node.index >= skips) {
                skips = -1
                node.index = out.length
                node.$parentNode = parent
                node.parentId = parent ? parent.id : null
                node.depth = depth
                node.lines = []
                var parentNode = parent
                while (parentNode) {
                    node.lines[ parentNode.depth] = parentNode.isLast ? 0 : 1;
                    parentNode = parentNode.$parentNode;
                }
                out.push(node)
            }
            if (node.index == skips - 1) {
                skips = -1
            }
            if (node.children) {
                for (var i = 0, il = node.children.length; i < il; i++) {
                    avalon.mixIf(node.children[i], oneRow, {id: 'tree' + setTimeout('1'), $parentNode: node})
                    if (node.expanded === true) {
                        processNode(node, node.children[i], out, depth + 1, skips)
                    }
                }
            }
            node.$skipArray = ['children']
        }

        if (options.root) {
            options.root.isLast = true
            avalon.mixIf(options.root, oneRow, {id: 'tree' + setTimeout('1')})
            processNode(null, options.root, rows, 0)
        }
        var vmodel = avalon.define(data.gridId, function (vm) {
            vm.$skipArray = ['root', 'listeners',
                'extraBaseCls',
                'extraBodyCls',
                'colLinesCls',
                'rowLinesCls',
                'noRowLinesCls',
                'hiddenHeaderCtCls',
                'hiddenHeaderCls',
                'resizeMarkerCls',
                'emptyCls',
                'treeCls',
                'arrowCls',
                'linesCls',
                'noLinesCls',
                'autoWidthCls',
                'iconCls',
                'checkboxCls',
                'elbowCls',
                'expanderCls',
                'textCls',
                'innerCls',
                'firstCls',
                'lastCls',
                'selectedItemCls',
                'beforeSelectedItemCls',
                'selectedCellCls',
                'focusedItemCls',
                'beforeFocusedItemCls',
                'tableFocusedFirstCls',
                'tableSelectedFirstCls',
                'tableOverFirstCls',
                'overItemCls',
                'beforeOverItemCls',
                'altRowCls',
                'dirtyCls',
                'rowClsRe',
                'cellRe',
                'loadingCls',
                'expandedCls',
                'leafCls',
                'expanderIconOverCls']
            avalon.mix(vm, options)
            vm.rows = rows
            vm.selectedIndex = -1
            if (options.listeners) {
                for (var name in options.listeners) {
                    vm.$watch(name, options.listeners[name])
                }
            }
            vm.nodeClick = function (e) {
                var me = this.$vmodel,
                    target = e.target,
                    $target = avalon(target),
                    expandAction = false
                if ($target.hasClass(me.expanderCls)) {
                    expandAction = true
                }

                while (target.tagName != 'TR') {
                    target = target.parentNode
                }
                var index = avalon(target).data('index')
                var node = me.rows[index]
                if ($target.hasClass(me.checkboxCls)) {
                    node.checked = !node.checked
                }
                if (expandAction) {
                    node.expanded = !node.expanded
                    me.rows.splice(index + 1, me.rows.length - index - 1)
                    processNode(null, me.root, me.rows, 0, index + 1)
                    if (node.expanded) {
                        me.$fire.apply(me, ['itemexpand', node.$model])
                    } else {
                        me.$fire.apply(me, ['itemcollapse', node.$model])
                    }

                } else {
                    me.selectedIndex = index
                    me.$fire.apply(me, ['itemclick', node.$model, target, index, e])
                }
            }
            vm.nodeDblClick = function (e) {
                var me = this.$vmodel,
                    target = e.target
                if (avalon(target).hasClass(options.expanderCls)) {
                    return
                }
                while (target.tagName != 'TR') {
                    target = target.parentNode
                }
                var index = avalon(target).data('index')
                var node = me.rows[index]
                if (node.children) {
                    node.expanded = !node.expanded
                    me.rows.splice(index + 1, me.rows.length - index - 1)
                    processNode(null, me.root, me.rows, 0, index + 1)
                }
            }
        })
        avalon.nextTick(function () {
            avalon.innerHTML(element, headerTemplate + panelBodyTemplate)
            element.stopScan = false
            avalon.scan(element, [vmodel].concat(vmodels))
        })
        return vmodel
    }
    avalon.bizui['tree'].defaults = {}
    return avalon
})
