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
        selectedIndex: -1,
        tableBaseCls: bizui.baseCSSPrefix + 'grid-table',
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
        viewBaseCls: bizui.baseCSSPrefix + 'grid-view',
        viewUi: 'default',
        viewLayout: 'tableview',
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
        cellRe: new RegExp(bizui.baseCSSPrefix + 'grid-cell-([^\\s]+) ', ''),
        ///src/grid/header/Container.js
        gridHeaderBaseCls: bizui.baseCSSPrefix + 'grid-header-ct',
        gridHeaderUi: 'default',
        gridHeaderDock: 'top',
        gridHeaderLayout: 'vbox',
        gridHeaderWidth: 0,
        headerOpenCls: bizui.baseCSSPrefix + 'column-header-open',
        menuSortAscCls: bizui.baseCSSPrefix + 'hmenu-sort-asc',
        menuSortDescCls: bizui.baseCSSPrefix + 'hmenu-sort-desc',
        menuColsIcon: bizui.baseCSSPrefix + 'cols-icon',
        ///src/grid/column/Column.js
        columnBaseCls: bizui.baseCSSPrefix + 'column-header',
        columUi: 'default',
        columnHoverCls: bizui.baseCSSPrefix + 'column-header-over',
        getViewTemplate: function (viewCls) {
            var me = this, layout = bizui.containerLayout[me.viewLayout],
                viewCls = (viewCls || '') + ' ' + bizui.baseCSSPrefix + 'unselectable'
            var template = [
                '<div class="' + me.viewBaseCls + ' ' + me.viewBaseCls + '-' + me.viewUi + ' ' + layout.targetCls + ' ' + viewCls,
                ' style="overflow: auto; margin: 0px;"',
                ' ms-css-width="width" ms-css-height="height-headerHeight - 2">',
                ' {{viewTemplate}}',
                '</div>'
            ]
            return template.join('')
        },
        getTableTemplate: function (tableCls, extraAttrs) {
            var me = this, extraAttrs = extraAttrs || '', tableCls = tableCls || ''
            var cls = [me.tableBaseCls]
            if (me.rowLines) {
                cls.push(me.rowLinesCls)
            } else {
                cls.push(me.noRowLinesCls)
            }
            var tableTemplate = '<table role="presentation" ' + extraAttrs + ' ms-attr-id="{{bizuiId}}-table"' +
                ' class="' + cls.join(' ') + ' ' + tableCls + '" border="0" cellspacing="0" cellpadding="0" ' +
                ' tabIndex="-1" ms-css-width="width">' +
                '  {{columnTemplate}}' +
                ' <tbody ms-attr-id="view{{bizuiId}}-body" ms-each-row="rows">' +
                ' {{rowsTemplate}}</tbody></table>'
            return tableTemplate
        },
        getRowTemplate: function (rowCls, extraAttrs) {
            var me = this, extraAttrs = extraAttrs || '', rowCls = rowCls || '',
                cls = [bizui.baseCSSPrefix + 'grid-row', bizui.baseCSSPrefix + 'grid-data-row']
            var rowsTemplate = [
                '<tr role="row" ms-data-recordid="row.id" ms-data-index="$index" class="' + cls.join(' ') + ' ' + rowCls + '"',
                '  ms-class-90="' + me.selectedItemCls + ':$index==selectedIndex"',
                '  ms-class-91="' + me.focusedItemCls + ':$index==selectedIndex"',
                '  ms-hover="' + me.overItemCls + '"',
                '  ms-class-92="' + me.beforeSelectedItemCls + ':($index+1) == selectedIndex"',
                //'  ms-class-93="' + me.beforeOverItemCls + ':?????"',
                '  ms-class-94="' + me.beforeFocusedItemCls + ':($index+1) == selectedIndex"',
                extraAttrs + '>',
                '{{cellTemplate}}',
                '</tr>'

            ]
            return rowsTemplate.join('')
        },
        getGridHeaderTemplate: function (headerCls, size, locked) {
            var me = this, uiCls = [me.gridHeaderDock, 'docked-' + me.gridHeaderDock],
                layout = bizui.containerLayout[me.gridHeaderLayout],
                cls = [me.gridHeaderBaseCls, me.gridHeaderBaseCls + '-' + me.gridHeaderUi,
                    bizui.baseCSSPrefix + 'docked'],
                styleTop = '', widthExp = 'ms-css-width="width"', topExp = 'ms-css-top="headerHeight-1"'
            headerCls = headerCls || ''
            size = size || {computedWidth: 'gridHeaderWidth', height: 22}
            uiCls = bizui.clsHelper.addUICls(me.gridHeaderBaseCls, me.gridHeaderUi, uiCls)
            cls = cls.join(' ') + ' ' + headerCls + ' ' + uiCls + ' ' + layout.targetCls
            if (locked === false) {
                widthExp = 'ms-css-width="unlockedWidth"'
                styleTop = 'top:0px;'
                topExp=''
            }
            if (locked === true) {
                widthExp = 'ms-css-width="lockedWidth"'
                styleTop = 'top:0px;'
                topExp=''
            }
            var template = '<div class="' + cls + '" style="border-width:1px;right:auto;left:0px;'+styleTop+'"' +
                '  ' + widthExp + ' '+topExp+'>' +
                layout.getTemplate(me, size) +
                '</div>'
            return template
        },
        getGridHeaderColumnTemplate: function (colsName, hasLocked) {
            var me = this, template = [], idSuffix = hasLocked ? '-locked' : ''
            colsName = colsName || 'unlockedCols'
            if (!hasLocked) {
                var cls = [me.columnBaseCls, me.columnBaseCls + '-' + me.columUi,
                    bizui.baseCSSPrefix + 'box-item', bizui.baseCSSPrefix + 'unselectable']
                template = [
                    '<div ms-repeat-col="' + colsName + '" ms-attr-id="column{{$outer.bizuiId}}-{{$index}}' + idSuffix + '"',
                    '  class="' + cls.join(' ') + '"',
                    '  ms-class-90="' + me.columnBaseCls + '-first:$first"',
                    '  ms-class-91="' + me.columnBaseCls + '-last:$last"',
                    '  ms-class-92="' + me.columnBaseCls + '-align-{{col.align}}"',
                    '  ms-css-width="col.width" ms-css-left="col.left"',
                    '  style="border-top-width: 1px; border-bottom-width: 1px; border-left-width: 1px; right: auto; top: 0px; margin: 0px;">',
                    '  <div ms-attr-id="column{{$outer.bizuiId}}-{{$index}}-titleEl" class="' + me.columnBaseCls + '-inner"',
                    '    ms-hover="' + me.columnHoverCls + '">',
                    '    <span ms-attr-id="column{{$outer.bizuiId}}-{{$index}}-textEl" class="' + me.columnBaseCls + '-text">',
                    '      {{text}}',
                    '    </span>',
                    '    <div ms-attr-id="column{{$outer.bizuiId}}-{{$index}}-triggerEl" class="' + me.columnBaseCls + '-trigger">',
                    '    </div>',
                    '  </div>',
                    '</div>'
                ]
                return template.join('')
            }
            var lockedTemplate = [], unlockedTemplate = [],
                noborderCls = [bizui.baseCSSPrefix + 'docked-noborder-top',
                    bizui.baseCSSPrefix + 'docked-noborder-right',
                    bizui.baseCSSPrefix + 'docked-noborder-left']
            var panelCls = [me.baseCls, me.baseCls + '-' + me.ui,
                    me.extraBaseCls, bizui.baseCSSPrefix + 'box-item'],
                lockedCls = me.baseCls + '-inner-locked'

            if (me.rowLines) {
                panelCls.push(me.rowLinesCls)
            } else {
                panelCls.push(me.noRowLinesCls)
            }
            lockedTemplate = [
                '<div ms-attr-id="{{bizuiId}}-locked" class="' + panelCls.join(' ') + ' ' + lockedCls + '"',
                '  ms-css-width="lockedWidth" ms-css-height="height-headerHeight+1"',
                '  style="right: auto; left: 0px; top: 0px; margin: 0px;">',
                '  {{headerTemplate}}',
                '  {{bodyTemplate}}',
                '</div>'
            ]
            var gridHeaderTemplate = me.getGridHeaderTemplate(noborderCls.join(' '),
                {computedWidth: 'lockedWidth', height: 22},true)
            var bodyTemplate = me.getBodyTemplate([me.extraBodyCls].concat(noborderCls),join(' '))//Todo 继续，layout
            unlockedTemplate = [
                '<div ms-attr-id="{{bizuiId}}-normal" class="' + panelCls.join(' ') + '"',
                '  ms-css-width="unlockedWidth" ms-css-height="height-headerHeight+1" ms-css-left="lockedWidth"',
                '  style="right: auto; top: 0px; margin: 0px;">',
                '  {{headerTemplate}}',
                '  {{bodyTemplate}}',
                '</div>'
            ]
        }
    })
    avalon.bizui['grid'] = function (element, data, vmodels) {
        element.stopScan = true
        var $element = avalon(element)
        avalon.clearChild(element)
        var options = avalon.mix(true, {}, bizui.vmodels['grid'], data.girdOptions)
        var panelCls = [options.baseCls, options.baseCls + '-' + options.ui,
            options.extraBaseCls, bizui.baseCSSPrefix + 'border-box']

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
        var columnOptions = {
            align: 'left',
            dataIndex: '',
            editor: '',
            emptyCellText: '&#160;',
            groupable: false,
            hideable: true,
            lockable: null,
            locked: false,
            menuDisabled: false,
            menuText: '',
            renderer: avalon.noop,
            scope: null,
            resizable: true,
            sortable: true,
            tdCls: '',
            text: '&#160;',
            tooltip: '',
            width: 100,
            ui: 'default'
        }
        var lockedCols = [], unlockedCols = []
        for (var i = 0, il = options.columns.length; i < il; i++) {
            var col = options.columns[i]
            avalon.mixIf(col, columnOptions)
            if (col.locked) {
                lockedCols.push(col)
                if (col.lockable !== false) {
                    col.lockable = true
                }
            } else {
                unlockedCols.push(col)
            }
        }
        var gridHeaderTemplate = ''
        var hasLocked = false
        if (lockedCols.length) {
            options.layout = 'hbox'
            hasLocked = true
            for (var i = 0, il = unlockedCols.length; i < il; i++) {
                var col = unlockedCols[i]
                if (col.lockable !== false) {
                    col.lockable = true
                }
            }
        } else {
            gridHeaderTemplate = options.getGridHeaderTemplate()
        }
        var panelBodyTemplate = options.getBodyTemplate(options.extraBodyCls)
        var headerColumnTemplate = options.getGridHeaderColumnTemplate()
        var viewTemplate = options.getViewTemplate()
        var tableTemplate = options.getTableTemplate()

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
    avalon.bizui['grid'].defaults = {}
    return avalon
})
