/**
 * Created by quan on 13-12-17.
 */
define(['avalon', 'bizui.panel'], function (avalon) {
    bizui.classes['grid'] = avalon.mix(true, {}, bizui.classes['panel'], {
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
        columnUi: 'default',
        columnHoverCls: bizui.baseCSSPrefix + 'column-header-over',
    })
    bizui.vmodels['grid'] = avalon.mix(true, {}, bizui.vmodels['panel'], {
        $bizuiType: 'grid',
        rowLines: true,
        selectedIndex: -1,
        viewLayout: 'tableview',
        gridHeaderDock: 'top',
        getViewTemplate: function (viewCls) {
            var me = this, layout = bizui.containerLayout[me.viewLayout],
                viewCls = (viewCls || '') + ' ' + bizui.baseCSSPrefix + 'unselectable',
                gridClasses = bizui.classes[me.$bizuiType]
            var template = [
                '<div class="' + gridClasses.viewBaseCls + ' ' + gridClasses.viewBaseCls + '-' + gridClasses.viewUi + ' ' + layout.targetCls + ' ' + viewCls,
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
        getGridHeaderTemplate: function (config, locked) {
            var me = this,
                gridClasses = bizui.classes[me.$bizuiType],
                widthExp = 'width', topExp = 'headerHeight',
                style = 'border-width:1px;right:auto;left:0px;'
            if (locked === false) {
                widthExp = 'unlockedWidth'
                style += 'top:0px;'
                topExp = null
            }
            if (locked === true) {
                widthExp = 'lockedWidth'
                style += 'top:0px;'
                topExp = null
            }
            var $default = {
                baseCls: gridClasses.gridHeaderBaseCls,
                ui: gridClasses.gridHeaderUi,
                uiCls: ['docked-' + me.gridHeaderDock],
                itemCls: [bizui.baseCSSPrefix + 'docked'],
                computedAttributes: [
                    {name: 'css', values: [
                        {name: 'width', value: widthExp},
                        {name: 'top', value: topExp}
                    ]},
                ],
                style: style,
                layout: {
                    name: gridClasses.gridHeaderLayout,
                    size: {computedWidth: 'width', height: 22}
                }
            }

             var finallyConfig =   avalon.mix(true,{},$default, config)

            var template = bizui.template.render(finallyConfig)
            delete finallyConfig

            /*
             uiCls = [me.gridHeaderDock, 'docked-' + me.gridHeaderDock],
             layout = bizui.containerLayout[me.gridHeaderLayout],
             cls = [me.gridHeaderBaseCls, me.gridHeaderBaseCls + '-' + me.gridHeaderUi,
             bizui.baseCSSPrefix + 'docked'],
             styleTop = ''
             headerCls = headerCls || ''
             size = size || {computedWidth: 'gridHeaderWidth', height: 22}
             uiCls = bizui.clsHelper.addUICls(me.gridHeaderBaseCls, me.gridHeaderUi, uiCls)
             cls = cls.join(' ') + ' ' + headerCls + ' ' + uiCls + ' ' + layout.targetCls
             if (locked === false) {
             widthExp = 'ms-css-width="unlockedWidth"'
             styleTop = 'top:0px;'
             topExp = ''
             }
             if (locked === true) {
             widthExp = 'ms-css-width="lockedWidth"'
             styleTop = 'top:0px;'
             topExp = ''
             }
             var template = '<div class="' + cls + '" style="border-width:1px;right:auto;left:0px;' + styleTop + '"' +
             '  ' + widthExp + ' ' + topExp + '>' +
             layout.getTemplate(me, size) +
             '</div>'*/
            return template
        },
        getGridHeaderColumnTemplate: function (colsName, hasLocked) {
            var me = this, template = [], idSuffix = hasLocked ? '-locked' : '',
                gridClasses = bizui.classes[me.$bizuiType]
            colsName = colsName || 'unlockedCols'
            if (!hasLocked) {
                var config = {
                    baseCls: gridClasses.columnBaseCls,
                    ui: gridClasses.columnUi,
                    itemCls: [bizui.baseCSSPrefix + 'box-item', bizui.baseCSSPrefix + 'unselectable'],
                    computedAttributes: [
                        {name: 'repeat-col', values: colsName},
                        {name: 'attr-id', values: 'column{{$outer.bizuiId}}-{{$index}}' + idSuffix},
                        {name: 'class', values: [
                            gridClasses.columnBaseCls + '-first:$first',
                            gridClasses.columnBaseCls + '-last:$last',
                            gridClasses.columnBaseCls + '-align-{{col.align}}',
                        ]},
                        {name: 'css', values: [
                            {name: 'width', value: 'col.width'},
                            {name: 'left', value: 'col.left'}
                        ]}
                    ],
                    style: 'border-top-width: 1px; border-bottom-width: 1px; border-left-width: 1px; right: auto; top: 0px; margin: 0px;'
                }
                template = bizui.template.render(config)
                template = template.replace('[[content]]', [
                    '  <div ms-attr-id="column{{$outer.bizuiId}}-{{$index}}-titleEl' + idSuffix + '" class="' + gridClasses.columnBaseCls + '-inner"',
                    '    ms-hover="' + gridClasses.columnHoverCls + '">',
                    '    <span ms-attr-id="column{{$outer.bizuiId}}-{{$index}}-textEl' + idSuffix + '" class="' + gridClasses.columnBaseCls + '-text">',
                    '      {{text}}',
                    '    </span>',
                    '    <div ms-attr-id="column{{$outer.bizuiId}}-{{$index}}-triggerEl' + idSuffix + '" class="' + gridClasses.columnBaseCls + '-trigger">',
                    '    </div>',
                    '  </div>'
                ].join(' '))
                return template//.join('')
            }
            var bodyConfig = {
                baseCls: gridClasses.baseCls + '-body',
                ui: gridClasses.ui,
                computedAttributes: [
                    {name: 'css', values: [
                        {name: 'width', value: 'width'},
                        {name: 'top', value: 'headerHeight'},
                        {name: 'height', value: 'width-headerHeight'}
                    ]}
                ],
                style: 'left:0px;',
                layout: {
                    name: 'hbox',
                    size: {
                        computedWidth: 'width-2',
                        computedHeight: 'height-headerHeight-2'
                    }
                }
            }
            var bodyTemplate = bizui.template.render(bodyConfig)
            var itemCls = []
            if (me.rowLines) {
                itemCls.push(me.rowLinesCls)
            } else {
                itemCls.push(me.noRowLinesCls)
            }
            itemCls.push(bizui.baseCSSPrefix + 'box-item')
            itemCls.push(gridClasses.extraBaseCls)
            var lockedConfig = {
                    baseCls: gridClasses.baseCls,
                    ui: gridClasses.ui,
                    itemCls: itemCls.concat([gridClasses.extraBaseCls + '-inner-locked']),
                    computedAttributes: [
                        {name: 'css', values: [
                            {name: 'width', value: 'lockedWidth'},
                            {name: 'height', value: 'height-headerHeight+1'}
                        ]}
                    ],
                    style: 'right: auto; left: 0px; top: 0px; margin: 0px;'

                },
                lockedTemplate = bizui.template.render(lockedConfig),
                unlockedConfig = {
                    baseCls: gridClasses.baseCls,
                    ui: gridClasses.ui,
                    itemCls: itemCls,
                    computedAttributes: [
                        {name: 'css', values: [
                            {name: 'width', value: 'unlockedWidth'},
                            {name: 'height', value: 'height-headerHeight+1'},
                            {name: 'left', value: 'lockedWidth'}
                        ]}
                    ],
                    style: 'right: auto; top: 0px; margin: 0px;'
                },
                unlockedTemplate = bizui.template.render(unlockedConfig),

                noborderCls = [bizui.baseCSSPrefix + 'docked-noborder-top',
                    bizui.baseCSSPrefix + 'docked-noborder-right',
                    bizui.baseCSSPrefix + 'docked-noborder-left'],
            /*
             lockedTemplate = [
             '<div ms-attr-id="{{bizuiId}}-locked" class="' + panelCls.join(' ') + ' ' + lockedCls + '"',
             '  ms-css-width="lockedWidth" ms-css-height="height-headerHeight+1"',
             '  style="right: auto; left: 0px; top: 0px; margin: 0px;">',
             '  {{headerTemplate}}',
             '  {{bodyTemplate}}',
             '</div>'
             ]*/
                lockedGridHeaderTemplate = me.getGridHeaderTemplate({
                    itemCls: noborderCls,
                    layout: {
                        name: 'hbox',
                        size: {computedWidth: 'lockedWidth', height: 22}
                    }
                }, true),
                unlockedGridHeaderTemplate = me.getGridHeaderTemplate({
                    itemCls: noborderCls,
                    layout: {
                        name: 'hbox',
                        size: {computedWidth: 'unlockedWidth', height: 22}
                    }
                }, false),
                lockedGridHeaderColumnTemplate = me.getGridHeaderColumnTemplate('lockedCols', false),
                unlockedGridHeaderColumnTemplate = me.getGridHeaderColumnTemplate('unlockedCols', false)
            bodyTemplate = bodyTemplate.replace('[[content]]',
                lockedTemplate.replace('[[content]]',
                    lockedGridHeaderTemplate + lockedGridHeaderColumnTemplate + '[[lockedBody]]') +
                    unlockedTemplate.replace('[[content]]',
                        unlockedGridHeaderTemplate + unlockedGridHeaderColumnTemplate + '[[unlockedBody]]'))
            avalon.log(lockedGridHeaderTemplate)
            return bodyTemplate
        }
    })
    avalon.bizui['grid'] = function (element, data, vmodels) {
        element.stopScan = true
        var $element = avalon(element), template = '',
            gridClass = bizui.classes['grid']
        avalon.clearChild(element)
        var options = avalon.mix(true, {}, bizui.vmodels['grid'], data.gridOptions)
        var panelCls = [gridClass.baseCls, gridClass.baseCls + '-' + gridClass.ui,
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
        var headerTemplate = options.getHeaderTemplate(toolsTemplate)
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
        var lockedCols = [], unlockedCols = [],lockedLeft=0, unlockedLeft=0
        options.lockedWidth=0
        options.unlockedWidth=0
        for (var i = 0, il = options.columns.length; i < il; i++) {
            var col = options.columns[i]
            avalon.mixIf(col, columnOptions)
            if (col.locked) {
                lockedCols.push(col)
                col.left=lockedLeft
                lockedLeft+=col.width
                options.lockedWidth +=col.width
                if (col.lockable !== false) {
                    col.lockable = true
                }
            } else {
                unlockedCols.push(col)
                col.left=unlockedLeft
                unlockedLeft+=col.width
                options.unlockedWidth +=col.width
            }
        }
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
            template = options.getGridHeaderColumnTemplate('',true)
        } else {
            var gridHeaderTemplate = options.getGridHeaderTemplate({
                layout:{
                    size:{computedWidth:'unlockedWidth',height:22}
                }
            })
            var panelBodyTemplate = options.getBodyTemplate({
                computedAttributes: [
                    {name: 'css', values: [
                        {name: 'top', value: 'headerHeight+23'},
                        {name: 'height', value: 'height-headerHeight-23'}
                    ]}
                ]

            })
            var headerColumnTemplate = options.getGridHeaderColumnTemplate()
            var viewTemplate = options.getViewTemplate()
            var tableTemplate = options.getTableTemplate()
            template = gridHeaderTemplate.replace('[[content]]', headerColumnTemplate) +
                panelBodyTemplate.replace('[[content]]',
                    viewTemplate.replace('[[content]]', tableTemplate))


        }


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
        //rowsTemplate = rowsTemplate.join(' ').replace('{{cellTemplate}}', cellTemplate.join(''))
        //tableTemplate = tableTemplate.replace('{{rowsTemplate}}', rowsTemplate)
        //panelBodyTemplate = panelBodyTemplate.join(' ').replace('{{treeTemplate}}', tableTemplate)

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
            vm.selectedIndex = -1
            vm.lockedCols = lockedCols
            vm.unlockedCols = unlockedCols
            vm.lockedWidth = 100
            vm.unlockedWidth = 300
            if (options.listeners) {
                for (var name in options.listeners) {
                    vm.$watch(name, options.listeners[name])
                }
            }

        })
        avalon.nextTick(function () {
            avalon.innerHTML(element, headerTemplate + template)
            element.stopScan = false
            avalon.scan(element, [vmodel].concat(vmodels))
        })
        return vmodel
    }
    avalon.bizui['grid'].defaults = {}
    return avalon
})
