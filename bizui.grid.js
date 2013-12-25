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
        columnHoverCls: bizui.baseCSSPrefix + 'column-header-over'
    })
    bizui.vmodels['grid'] = avalon.mix(true, {}, bizui.vmodels['panel'], {
        $bizuiType: 'grid',
        rowLines: true,
        selectedIndex: -1,
        viewLayout: 'tableview',
        gridHeaderDock: 'top',
        gridHeaderHeight: 23,
        getViewTemplate: function (config, isLocked) {
            var me = this,
                gridClasses = bizui.classes[me.$bizuiType],
                widthExp = isLocked ? 'lockedWidth' : 'width-lockedWidth',
                idSuffix = isLocked ? 'locked' : 'normal',
                $default = {
                    baseCls: gridClasses.viewBaseCls,
                    ui: gridClasses.viewUi,
                    itemCls: [bizui.baseCSSPrefix + 'unselectable', bizui.baseCSSPrefix + 'fit-item'],
                    style: 'overflow: auto;',
                    computedAttributes: [
                        {name: 'css', values: [
                            {name: 'width', value: widthExp},
                            {name: 'height', value: 'height-headerHeight-gridHeaderHeight'},
                            {name: 'border-bottom-width', value: isLocked ? '(unlockedWidth>(width-lockedWidth))&&hasLocked?\'17\':\'\'' : ''},
                            {name: 'border-bottom-style', value: isLocked ? '(unlockedWidth>(width-lockedWidth))&&hasLocked?\'solid\':\'\'' : ''},
                            {name: 'border-bottom-color', value: isLocked ? '(unlockedWidth>(width-lockedWidth))&&hasLocked?\'rgb(246, 246, 246)\':\'\'' : ''}
                        ]},
                        {name: 'on-scroll', values: 'viewScroll'},
                        {name: 'attr-id', values: '{{bizuiId}}-view-' + idSuffix}
                    ]
                },
                finallyConfig = avalon.mix(true, {}, $default, config),
                template = bizui.template.render(finallyConfig)
            delete finallyConfig
            return template//.join('')
        },
        getTableTemplate: function (config, isLocked) {
            var me = this,
                gridClass = bizui.classes[me.$bizuiType],
                itemCls = [],
                widthExp = isLocked ? 'lockedWidth' : 'unlockedWidth'
            if (me.rowLines) {
                itemCls.push(gridClass.rowLinesCls)
            } else {
                itemCls.push(gridClass.noRowLinesCls)
            }
            var $default = {
                baseCls: gridClass.tableBaseCls,
                ui: '',
                autoEl: {
                    tag: 'table',
                    role: 'presentation'
                },
                itemCls: itemCls,
                attributes: ['border="0"', 'cellspacing="0"', 'cellpadding="0"', 'tabIndex="-1"'],
                computedAttributes: [
                    {name: 'class', values: [
                        gridClass.tableBaseCls + '-selected-first ' + gridClass.tableBaseCls + '-focused-first:selectedIndex===0'
                    ]},
                    //{name:'hover',values:gridClass.tableBaseCls + '-selected-first '},
                    {name: 'css', values: [
                        {name: 'width', value: widthExp}
                    ]},
                    {name: 'attr-id', values: '{{bizuiId}}-table'}
                ]
            }
            var finallyConfig = avalon.mix(true, {}, $default, config)
            var tableTemplate = bizui.template.render(finallyConfig)
            delete finallyConfig
            var colGroupTemplate = me.getColGroupTemplate(isLocked ? 'lockedCols' : 'unlockedCols')
            var rowsTemplate = me.getRowTemplate(null, isLocked)
            tableTemplate = tableTemplate.replace('[[content]]',
                colGroupTemplate +
                    '<tbody ms-attr-id="view{{bizuiId}}-body" ms-each-row="rows" data-each-rendered="rowsRendered" >' +
                    rowsTemplate +
                    '</tbody>'
            )
            return tableTemplate
        },
        getColGroupTemplate: function (colsName) {
            var template
            colsName = colsName || 'unlockedCols'
            template = [
                '<colgroup ms-repeat-col="' + colsName + '">',
                '  <col ms-css-width="col.width">',
                '</colgroup>'
            ]
            return template.join('')
        },
        getRowTemplate: function (config, isLocked) {
            var me = this,
                colsName = isLocked ? 'lockedCols' : 'unlockedCols',
                gridClass = bizui.classes[me.$bizuiType],
                $default = {
                    baseCls: '',
                    ui: '',
                    itemCls: [bizui.baseCSSPrefix + 'grid-row', bizui.baseCSSPrefix + 'grid-data-row'],
                    autoEl: {
                        tag: 'tr',
                        role: 'row'
                    },
                    computedAttributes: [
                        {name: 'class', values: [
                            gridClass.selectedItemCls + ':$index==selectedIndex',
                            gridClass.focusedItemCls + ':$index==selectedIndex',
                            gridClass.beforeSelectedItemCls + ':($index+1) == selectedIndex',
                            //gridClass.beforeOverItemCls + ':?????"',
                            gridClass.beforeFocusedItemCls + ':($index+1) == selectedIndex'
                        ]},
                        {name: 'hover', values: gridClass.overItemCls},
                        //{name: 'data-recordid', values: 'row.id'},
                        {name: 'data-index', values: '$index'},
                        {name: 'each-col', values: colsName}
                    ]
                },
                finallyConfig = avalon.mix(true, {}, $default, config),
                rowsTemplate = bizui.template.render(finallyConfig),
                cellTemplate = me.getCellTemplate()
            rowsTemplate = rowsTemplate.replace('[[content]]',
                cellTemplate
            )
            delete finallyConfig
            return rowsTemplate//.join('')
        },
        getCellTemplate: function (config) {
            var me = this, gridClass = bizui.classes[me.$bizuiType],
                $default = {
                    baseCls: '',
                    ui: '',
                    itemCls: [gridClass.extraBaseCls + '-cell',
                        gridClass.extraBaseCls + '-td',
                        bizui.baseCSSPrefix + 'unselectable'],
                    autoEl: {
                        tag: 'td',
                        role: 'gridcell'
                    },
                    computedAttributes: [
                        {name: 'class', values: [
                            gridClass.extraBaseCls + '-cell-first:$first',
                            gridClass.extraBaseCls + '-cell-last:$last'
                        ]}
                    ],
                    children: {
                        cellInner: {
                            baseCls: '',
                            ui: '',
                            itemCls: [gridClass.extraBaseCls + '-cell-inner'],
                            autoEl: {
                                unselectable: 'on'
                            },
                            computedAttributes: [
                                {name: 'css', values: [
                                    {name: 'text-align', value: 'col.align'}
                                ]}
                            ],
                            contentTemplate: '{{row[col.dataIndex]}}'
                        }
                    }
                },
                finallyConfig = avalon.mix(true, {}, $default, config),
                cellTemplate = bizui.template.render(finallyConfig)
            //cellTemplate = cellTemplate.replace('[[content]]',
            //  '<div unselectable="on" class="' + gridClass.extraBaseCls + '-cell-inner" ms-css-text-align="col.align">{{rows[$outer.$index][col.dataIndex]}}</div>')
            delete finallyConfig
            return cellTemplate
        },
        getGridHeaderTemplate: function (config, locked) {
            var me = this,
                gridClasses = bizui.classes[me.$bizuiType],
                widthExp = 'width+17', topExp = 'headerHeight',
                style = 'border-width:1px;right:auto;left:0px;',
                idSuffix = 'normal'
            if (locked === false) {
                widthExp = 'unlockedWidth+17'
                style += 'top:0px;'
                topExp = null
            }
            if (locked === true) {
                widthExp = 'lockedWidth+17'
                style += 'top:0px;'
                topExp = null
                idSuffix = 'locked'
            }
            var $default = {
                baseCls: gridClasses.gridHeaderBaseCls,
                ui: gridClasses.gridHeaderUi,
                uiCls: ['docked-' + me.gridHeaderDock],
                itemCls: [bizui.baseCSSPrefix + 'docked'],
                computedAttributes: [
                    {name: 'css', values: [
                        {name: 'width', value: 'width-lockedWidth'},
                        {name: 'top', value: topExp}
                    ]},
                    {name: 'attr-id', values: '{{bizuiId}}-headercontainer-' + idSuffix}
                ],
                style: style,
                layout: {
                    name: gridClasses.gridHeaderLayout,
                    size: {computedWidth: widthExp, height: 22}
                },
                idSuffix: idSuffix
            }

            var finallyConfig = avalon.mix(true, {}, $default, config)

            var template = bizui.template.render(finallyConfig)
            avalon.log(template)
            delete finallyConfig
            return template
        },
        getGridHeaderColumnTemplate: function (colsName, hasLocked) {
            var me = this, template = [], idSuffix = hasLocked ? '-locked' : '',
                gridClasses = bizui.classes[me.$bizuiType]
            colsName = colsName || 'unlockedCols'
            if (true) {
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
                            gridClasses.columnBaseCls + '-align-{{col.align}}'
                        ]},
                        {name: 'on-mousemove', values: 'columnHeaderMouseMove($event,$index,\'' + colsName + '\')'},
                        {name: 'css', values: [
                            {name: 'width', value: 'col.width'},
                            {name: 'left', value: 'col.left'},
                            {name: 'cursor', value: '$index==resizeColumnIndex?\'col-resize\':\'\''}
                        ]}
                    ],
                    style: 'border-top-width: 1px; border-bottom-width: 1px; border-left-width: 1px; right: auto; top: 0px; margin: 0px;',
                    contentTemplate: [
                        '  <div ms-attr-id="column{{$outer.bizuiId}}-{{$index}}-titleEl' + idSuffix + '" class="' + gridClasses.columnBaseCls + '-inner"',
                        '    ms-hover="' + gridClasses.columnHoverCls + '">',
                        '    <span ms-attr-id="column{{$outer.bizuiId}}-{{$index}}-textEl' + idSuffix + '" class="' + gridClasses.columnBaseCls + '-text">',
                        '      {{text}}',
                        '    </span>',
                        '    <div ms-attr-id="column{{$outer.bizuiId}}-{{$index}}-triggerEl' + idSuffix + '" class="' + gridClasses.columnBaseCls + '-trigger"',
                        '       ms-css-cursor="$index==resizeColumnIndex?\'col-resize\':\'\'">',
                        '    </div>',
                        '  </div>'
                    ].join(' ')
                }
                template = bizui.template.render(config)
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
        },
        getHasLockedBodyTemplate: function (config) {
            var me = this, gridClasses = bizui.classes[me.$bizuiType],
                itemCls = []
            if (me.rowLines) {
                itemCls.push(gridClasses.rowLinesCls)
            } else {
                itemCls.push(gridClasses.noRowLinesCls)
            }
            itemCls.push(bizui.baseCSSPrefix + 'box-item')
            itemCls.push(gridClasses.extraBaseCls)
            var $default = {
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
                    },
                    children: {
                        locked: {
                            baseCls: gridClasses.baseCls,
                            ui: gridClasses.ui,
                            itemCls: itemCls.concat([gridClasses.extraBaseCls + '-inner-locked']),
                            computedAttributes: [
                                {name: 'css', values: [
                                    {name: 'width', value: 'lockedWidth'},
                                    {name: 'height', value: 'height-headerHeight+1'}
                                ]}
                            ],
                            style: 'right: auto; left: 0px; top: 0px; margin: 0px;',
                            contentTemplate: '[[lockedBody]]'
                        },
                        unlocked: {
                            baseCls: gridClasses.baseCls,
                            ui: gridClasses.ui,
                            itemCls: itemCls,
                            computedAttributes: [
                                {name: 'css', values: [
                                    {name: 'width', value: 'width-lockedWidth'},
                                    {name: 'height', value: 'height-headerHeight+1'},
                                    {name: 'left', value: 'lockedWidth'}
                                ]}
                            ],
                            style: 'right: auto; top: 0px; margin: 0px;',
                            contentTemplate: '[[unlockedBody]]'
                        }
                    }
                },
                finallyConfig = avalon.mix(true, {}, $default, config),
                template = bizui.template.render(finallyConfig)
            delete finallyConfig
            return template
        },
        processColumns: function () {
            var me = this,
                columnOptions = {
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
            var lockedCols = [], unlockedCols = [], lockedLeft = 0, unlockedLeft = 0, rows = []
            me.lockedWidth = 0
            me.unlockedWidth = 0
            for (var i = 0, il = me.columns.length; i < il; i++) {
                var col = me.columns[i]
                avalon.mixIf(col, columnOptions)
                if (col.locked) {
                    lockedCols.push(col)
                    col.left = lockedLeft
                    lockedLeft += col.width
                    me.lockedWidth += col.width
                    if (col.lockable !== false) {
                        col.lockable = true
                    }
                } else {
                    unlockedCols.push(col)
                    col.left = unlockedLeft
                    unlockedLeft += col.width
                    me.unlockedWidth += col.width
                }
            }
            me.lockedCols = lockedCols
            me.unlockedCols = unlockedCols
            me.hasLocked = false
            if (lockedCols.length) {
                me.layout = 'hbox'
                me.hasLocked = true
                for (var i = 0, il = unlockedCols.length; i < il; i++) {
                    var col = unlockedCols[i]
                    if (col.lockable !== false) {
                        col.lockable = true
                    }
                }
            }
        }
    })
    avalon.bizui['grid'] = function (element, data, vmodels) {
        element.stopScan = true
        var $element = avalon(element), template = '',
            gridClass = bizui.classes['grid']
        avalon.clearChild(element)
        var options = avalon.mix(true, {}, bizui.vmodels['grid'], data.gridOptions)
        var itemCls = [gridClass.extraBaseCls, bizui.baseCSSPrefix + 'border-box']

        if (options.rowLines) {
            itemCls.push(options.rowLinesCls)
        } else {
            itemCls.push(options.noRowLinesCls)
        }
        options.setElementAttributes({
            baseCls: gridClass.baseCls,
            ui: gridClass.ui,
            itemCls: itemCls
        }, element)
        var headerTemplate = options.getHeaderTemplate()
        var gridHeaderTemplate = '', bodyTemplate
        options.processColumns()
        if (options.hasLocked) {
            itemCls = []
            if (options.rowLines) {
                itemCls.push(options.rowLinesCls)
            } else {
                itemCls.push(options.noRowLinesCls)
            }
            var lockedHeaderColumnTemplate = options.getGridHeaderColumnTemplate('lockedCols')
            var lockedGridHeaderTemplate = options.getGridHeaderTemplate({
                contentTemplate: lockedHeaderColumnTemplate
            }, true)
            var lockedTableTemplate = options.getTableTemplate(null, true)
            var lockedViewTemplate = options.getViewTemplate({
                contentTemplate: lockedTableTemplate,
                style: ''
            }, true)
            var lockedBodyTemplate = options.getBodyTemplate({
                layout: {
                    name: 'fit'
                },
                computedAttributes: [
                    {name: 'css', values: [
                        {name: 'top', value: 'gridHeaderHeight'},
                        {name: 'height', value: 'height-headerHeight-gridHeaderHeight'},
                        {name: 'width', value: 'lockedWidth'}
                    ]}
                ],
                contentTemplate: lockedViewTemplate
            })
            var unlockedHeaderColumnTemplate = options.getGridHeaderColumnTemplate()
            var unlockedGridHeaderTemplate = options.getGridHeaderTemplate({
                contentTemplate: unlockedHeaderColumnTemplate
            }, false)
            var unlockedTableTemplate = options.getTableTemplate()
            var unlockedViewTemplate = options.getViewTemplate({
                contentTemplate: unlockedTableTemplate
            }, false)
            var unlockedBodyTemplate = options.getBodyTemplate({
                layout: {
                    name: 'fit'
                },
                computedAttributes: [
                    {name: 'css', values: [
                        {name: 'top', value: 'gridHeaderHeight'},
                        {name: 'height', value: 'height-headerHeight-gridHeaderHeight'},
                        {name: 'width', value: 'width-lockedWidth'}
                    ]}
                ],
                contentTemplate: unlockedViewTemplate
            })
            bodyTemplate = options.getHasLockedBodyTemplate({
                itemCls: [bizui.baseCSSPrefix + 'grid-body']
            })
                .replace('[[lockedBody]]', lockedGridHeaderTemplate + lockedBodyTemplate)
                .replace('[[unlockedBody]]', unlockedGridHeaderTemplate + unlockedBodyTemplate)
        }
        else {
            var headerColumnTemplate = options.getGridHeaderColumnTemplate()
            gridHeaderTemplate = options.getGridHeaderTemplate({
                layout: {
                    size: {computedWidth: 'unlockedWidth', height: 22}
                },
                contentTemplate: headerColumnTemplate
            })
            var tableTemplate = options.getTableTemplate()
            var viewTemplate = options.getViewTemplate({
                contentTemplate: tableTemplate
            })
            bodyTemplate = options.getBodyTemplate({
                layout: {
                    name: 'fit'
                },
                itemCls: [bizui.baseCSSPrefix + 'grid-body'],
                computedAttributes: [
                    {name: 'css', values: [
                        {name: 'top', value: 'headerHeight+gridHeaderHeight'},
                        {name: 'height', value: 'height-headerHeight-gridHeaderHeight'}
                    ]}
                ],
                contentTemplate: viewTemplate
            })
        }
        var listeners = options.listeners
        delete options.listeners
        var vmodel = avalon.define(data.gridId, function (vm) {
            vm.$skipArray = ['root', 'listeners', 'data']
            avalon.mix(vm, options)
            vm.selectedIndex = -1
            if (listeners) {
                for (var name in listeners) {
                    vm.$watch(name, listeners[name])
                }
            }
            vm.resizeColumnIndex = -1
            vm.columnHeaderMouseMove = function (e, index, colsName) {
                var cols = vm[colsName]
                if (cols) {
                    if ((avalon(e.target).hasClass(bizui.baseCSSPrefix + 'column-header-inner') && e.offsetX < 4)
                        || (avalon(e.target).hasClass(bizui.baseCSSPrefix + 'column-header-trigger') && (e.offsetX > 10))) {
                        vm.resizeColumnIndex = index
                    }
                    else {
                        vm.resizeColumnIndex = -1
                    }
                }
            }
            vm.rowsRendered = function () {
                avalon.log(new Date().getTime())
            }
            vm.viewScroll = function (e) {
                var me = this.$vmodel
                var headerId = me.bizuiId + '-headercontainer-normal',
                    header = document.getElementById(headerId),
                    lockedId = me.bizuiId + '-view-locked',
                    lockedView = document.getElementById(lockedId)

                if (header) {
                    //avalon.log(el)
                    header.scrollLeft = e.target.scrollLeft
                }
                if (lockedView) {
                    lockedView.scrollTop = e.target.scrollTop
                }

            }
        })
        avalon.nextTick(function () {
            avalon.innerHTML(element, headerTemplate + gridHeaderTemplate + bodyTemplate)
            element.stopScan = false
            avalon.log(new Date().getTime())
            avalon.scan(element, [vmodel].concat(vmodels))
        })
        return vmodel
    }
    avalon.bizui['grid'].defaults = {}
    return avalon
})
