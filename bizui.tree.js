/**
 * Created by weiwei on 13-12-14.
 */
define(['avalon', 'bizui.panel'], function (avalon) {
    bizui.vmodels['tree'] = avalon.mix(true, {}, bizui.vmodels['panel'], {
        $bizuiType: 'tree',
        lines: true,
        rowLines: false,
        useArrows: false,
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
        treeCls: bizui.baseCSSPrefix + 'tree-panel',
        arrowCls: bizui.baseCSSPrefix + 'tree-arrows',
        linesCls: bizui.baseCSSPrefix + 'tree-lines',
        noLinesCls: bizui.baseCSSPrefix + 'tree-no-lines',
        autoWidthCls: bizui.baseCSSPrefix + 'autowidth-table',

        iconCls: bizui.baseCSSPrefix + 'tree-icon',
        checkboxCls: bizui.baseCSSPrefix + 'tree-checkbox',
        elbowCls: bizui.baseCSSPrefix + 'tree-elbow',
        expanderCls: bizui.baseCSSPrefix + 'tree-expander',
        textCls: bizui.baseCSSPrefix + 'tree-node-text',
        innerCls: bizui.baseCSSPrefix + 'grid-cell-inner-treecolumn',
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
///src/tree/View.js
        loadingCls: bizui.baseCSSPrefix + 'grid-tree-loading',
        expandedCls: bizui.baseCSSPrefix + 'grid-tree-node-expanded',
        leafCls: bizui.baseCSSPrefix + 'grid-tree-node-leaf',

        //expanderSelector: '.' + Ext.baseCSSPrefix + 'tree-expander',
        //checkboxSelector: '.' + Ext.baseCSSPrefix + 'tree-checkbox',
        expanderIconOverCls: bizui.baseCSSPrefix + 'tree-expander-over'
    })
    avalon.bizui['tree'] = function (element, data, vmodels) {
        element.stopScan = true
        var $element = avalon(element)
        avalon.clearChild(element)
        var options = avalon.mix(true, {}, bizui.vmodels['tree'], data.treeOptions)
        var panelCls = [options.baseCls, options.baseCls + '-' + options.ui, options.treeCls,
            options.extraBaseCls, options.extraBodyCls, options.hiddenHeaderCls, 'x-autowidth-table']
        if (options.useArrows) {
            panelCls.push(options.arrowCls)
            options.lines = false
        }

        if (options.lines) {
            panelCls.push(options.linesCls)
        } else if (!options.useArrows) {
            panelCls.push(options.noLinesCls)
        }
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
        var headerTemplate = '<div ms-if="headerHeight!=0" class="' + headerCls + '"' +
            ' style="left: 0px; top: 0px;" ms-css-width="width">' +
            '<div class="' + headerBodyCls.join(' ') + '" ' +
            ' ms-css-width="width">' +
            '<div class="x-box-inner " role="presentation"' +
            ' ms-css-width="width-12" ms-css-height="headerHeight-8">' +
            '<div style="position: absolute; left: 0px; top: 0px; height: 1px;" ms-css-width="width-12">' +
            '<div class="x-component x-panel-header-text-container x-box-item x-component-default"' +
            ' style="text-align: left; left: 0px; top: 0px; margin: 0px;" ms-css-width="width-12-headerToolAmount*16">' +
            '<span class="x-panel-header-text x-panel-header-text-default">{{title}}</span>' +
            '</div>' +
            toolsTemplate +
            '</div></div></div></div>'
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
        var tableTemplate = '<table role="presentation" ms-ondbclick="nodeDbClick" ms-click="nodeClick" ms-attr-id="{{bizuiId}}-table"' +
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
        avalon.log(tableTemplate)
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
            children: null
        }

        function processNode(parent, node, out, depth) {
            if (node.children) {
                node.children[node.children.length - 1].isLast = true
            }
            else {
                node.expandable = false
                node.expanded = false
            }
            var node = avalon.mix({}, oneRow, {id: 'tree' + setTimeout('1')}, node)

            if (out.length == 0) {
                node.root = true
                node.isFirst = true
            }
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
            if (node.children && node.expanded === true) {
                for (var i = 0, il = node.children.length; i < il; i++) {
                    processNode(node, node.children[i], out, depth + 1)
                }
            }
            if (node.children) {
                delete  node.children
            }
        }

        if (options.root) {
            options.root.isLast = true
            processNode(null, options.root, rows, 0)
        }
        var vmodel = avalon.define(data.treeId, function (vm) {
            vm.$skipArray = ['root']
            avalon.mix(vm, options)
            vm.rows = rows
            vm.selectedIndex = -1
            vm.nodeClick = function (e) {
                var me = this.$vmodel
                var target = e.target
                while (target.tagName != 'TR') {
                    target = target.parentNode
                }
                var index = avalon(target).data('index')
                me.selectedIndex = index
            }
            vm.nodeDbClick=function(e){
                var me = this.$vmodel
                var target = e.target
                while (target.tagName != 'TR') {
                    target = target.parentNode
                }
                var index = avalon(target).data('index')
                me.selectedIndex = index
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
/*

 tableTpl: [
 '{%',
 // Add the row/column line classes to the table element.
 'var view=values.view,tableCls=["' + Ext.baseCSSPrefix + '" + view.id + "-table ' + Ext.baseCSSPrefix + 'grid-table"];',
 'if (view.columnLines) tableCls[tableCls.length]=view.ownerCt.colLinesCls;',
 'if (view.rowLines) tableCls[tableCls.length]=view.ownerCt.rowLinesCls;',
 '%}',
 '<table role="presentation" id="{view.id}-table" class="{[tableCls.join(" ")]}" border="0" cellspacing="0" cellpadding="0" style="{tableStyle}" tabIndex="-1">',
 '{[view.renderColumnSizer(out)]}',
 '{[view.renderTHead(values, out)]}',
 '{[view.renderTFoot(values, out)]}',
 '<tbody id="{view.id}-body">',
 '{%',
 'view.renderRows(values.rows, values.viewStartIndex, out);',
 '%}',
 '</tbody>',
 '</table>',
 {
 priority: 0
 }
 ],

 rowTpl: [
 '{%',
 'var dataRowCls = values.recordIndex === -1 ? "" : " ' + Ext.baseCSSPrefix + 'grid-data-row";',
 '%}',
 '<tr role="row" {[values.rowId ? ("id=\\"" + values.rowId + "\\"") : ""]} ',
 'data-boundView="{view.id}" ',
 'data-recordId="{record.internalId}" ',
 'data-recordIndex="{recordIndex}" ',
 'class="{[values.itemClasses.join(" ")]} {[values.rowClasses.join(" ")]}{[dataRowCls]}" ',
 '{rowAttr:attributes} tabIndex="-1">',
 '<tpl for="columns">' +
 '{%',
 'parent.view.renderCell(values, parent.record, parent.recordIndex, xindex - 1, out, parent)',
 '%}',
 '</tpl>',
 '</tr>',
 {
 priority: 0
 }
 ],


 //\ext-4.2.1.883\src\tree\Column.js
 cellTpl: [
 '<tpl for="lines">',
 '<img src="{parent.blankUrl}" class="{parent.childCls} {parent.elbowCls}-img ',
 '{parent.elbowCls}-<tpl if=".">line<tpl else>empty</tpl>"/>',
 '</tpl>',
 '<img src="{blankUrl}" class="{childCls} {elbowCls}-img {elbowCls}',
 '<tpl if="isLast">-end</tpl><tpl if="expandable">-plus {expanderCls}</tpl>"/>',
 '<tpl if="checked !== null">',
 '<input type="button" role="checkbox" <tpl if="checked">aria-checked="true" </tpl>',
 'class="{childCls} {checkboxCls}<tpl if="checked"> {checkboxCls}-checked</tpl>"/>',
 '</tpl>',
 '<img src="{blankUrl}" class="{childCls} {baseIconCls} ',
 '{baseIconCls}-<tpl if="leaf">leaf<tpl else>parent</tpl> {iconCls}"',
 '<tpl if="icon">style="background-image:url({icon})"</tpl>/>',
 '<tpl if="href">',
 '<a href="{href}" target="{hrefTarget}" class="{textCls} {childCls}">{value}</a>',
 '<tpl else>',
 '<span class="{textCls} {childCls}">{value}</span>',
 '</tpl>'
 ]
 treeRenderer: function(value, metaData, record, rowIdx, colIdx, store, view){
 var me = this,
 cls = record.get('cls'),
 renderer = me.origRenderer,
 data = record.data,
 parent = record.parentNode,
 rootVisible = view.rootVisible,
 lines = [],
 parentData;

 if (cls) {
 metaData.tdCls += ' ' + cls;
 }

 while (parent && (rootVisible || parent.data.depth > 0)) {
 parentData = parent.data;
 lines[rootVisible ? parentData.depth : parentData.depth - 1] =
 parentData.isLast ? 0 : 1;
 parent = parent.parentNode;
 }

 return me.getTpl('cellTpl').apply({
 record: record,
 baseIconCls: me.iconCls,
 iconCls: data.iconCls,
 icon: data.icon,
 checkboxCls: me.checkboxCls,
 checked: data.checked,
 elbowCls: me.elbowCls,
 expanderCls: me.expanderCls,
 textCls: me.textCls,
 leaf: data.leaf,
 expandable: record.isExpandable(),
 isLast: data.isLast,
 blankUrl: Ext.BLANK_IMAGE_URL,
 href: data.href,
 hrefTarget: data.hrefTarget,
 lines: lines,
 metaData: metaData,
 // subclasses or overrides can implement a getChildCls() method, which can
 // return an extra class to add to all of the cell's child elements (icon,
 // expander, elbow, checkbox).  This is used by the rtl override to add the
 // "x-rtl" class to these elements.
 childCls: me.getChildCls ? me.getChildCls() + ' ' : '',
 value: renderer ? renderer.apply(me.origScope, arguments) : value
 });
 }

 //ext-4.2.1.883\src\data\NodeInterface.js
 this.applyFields(modelClass, [
 { name : 'parentId',   type : idType,    defaultValue : null,  useNull : idField.useNull },
 { name : 'index',      type : 'int',     defaultValue : 0,     persist : false          , convert: null },
 { name : 'depth',      type : 'int',     defaultValue : 0,     persist : false          , convert: null },
 { name : 'expanded',   type : 'bool',    defaultValue : false, persist : false          , convert: null },
 { name : 'expandable', type : 'bool',    defaultValue : true,  persist : false          , convert: null },
 { name : 'checked',    type : 'auto',    defaultValue : null,  persist : false          , convert: null },
 { name : 'leaf',       type : 'bool',    defaultValue : false                            },
 { name : 'cls',        type : 'string',  defaultValue : '',    persist : false          , convert: null },
 { name : 'iconCls',    type : 'string',  defaultValue : '',    persist : false          , convert: null },
 { name : 'icon',       type : 'string',  defaultValue : '',    persist : false          , convert: null },
 { name : 'root',       type : 'boolean', defaultValue : false, persist : false          , convert: null },
 { name : 'isLast',     type : 'boolean', defaultValue : false, persist : false          , convert: null },
 { name : 'isFirst',    type : 'boolean', defaultValue : false, persist : false          , convert: null },
 { name : 'allowDrop',  type : 'boolean', defaultValue : true,  persist : false          , convert: null },
 { name : 'allowDrag',  type : 'boolean', defaultValue : true,  persist : false          , convert: null },
 { name : 'loaded',     type : 'boolean', defaultValue : false, persist : false          , convert: null },
 { name : 'loading',    type : 'boolean', defaultValue : false, persist : false          , convert: null },
 { name : 'href',       type : 'string',  defaultValue : '',    persist : false          , convert: null },
 { name : 'hrefTarget', type : 'string',  defaultValue : '',    persist : false          , convert: null },
 { name : 'qtip',       type : 'string',  defaultValue : '',    persist : false          , convert: null },
 { name : 'qtitle',     type : 'string',  defaultValue : '',    persist : false          , convert: null },
 { name : 'qshowDelay', type : 'int',     defaultValue : 0,     persist : false          , convert: null },
 { name : 'children',   type : 'auto',    defaultValue : null,  persist : false          , convert: null }
 ]);


 ///src/view/Table.js
 renderCell: function(column, record, recordIndex, columnIndex, out) {
 var me = this,
 selModel = me.selModel,
 cellValues = me.cellValues,
 classes = cellValues.classes,
 fieldValue = record.data[column.dataIndex],
 cellTpl = me.cellTpl,
 value, clsInsertPoint;

 cellValues.record = record;
 cellValues.column = column;
 cellValues.recordIndex = recordIndex;
 cellValues.columnIndex = columnIndex;
 cellValues.cellIndex = columnIndex;
 cellValues.align = column.align;
 cellValues.tdCls = column.tdCls;
 cellValues.innerCls = column.innerCls;
 cellValues.style = cellValues.tdAttr = "";
 cellValues.unselectableAttr = me.enableTextSelection ? '' : 'unselectable="on"';

 if (column.renderer && column.renderer.call) {
 value = column.renderer.call(column.scope || me.ownerCt, fieldValue, cellValues, record, recordIndex, columnIndex, me.dataSource, me);
 if (cellValues.css) {
 // This warning attribute is used by the compat layer
 // TODO: remove when compat layer becomes deprecated
 record.cssWarning = true;
 cellValues.tdCls += ' ' + cellValues.css;
 delete cellValues.css;
 }
 } else {
 value = fieldValue;
 }
 cellValues.value = (value == null || value === '') ? '&#160;' : value;

 // Calculate classes to add to cell
 classes[1] = Ext.baseCSSPrefix + 'grid-cell-' + column.getItemId();

 // On IE8, array[len] = 'foo' is twice as fast as array.push('foo')
 // So keep an insertion point and use assignment to help IE!
 clsInsertPoint = 2;

 if (column.tdCls) {
 classes[clsInsertPoint++] = column.tdCls;
 }
 if (me.markDirty && record.isModified(column.dataIndex)) {
 classes[clsInsertPoint++] = me.dirtyCls;
 }
 if (column.isFirstVisible) {
 classes[clsInsertPoint++] = me.firstCls;
 }
 if (column.isLastVisible) {
 classes[clsInsertPoint++] = me.lastCls;
 }
 if (!me.enableTextSelection) {
 classes[clsInsertPoint++] = Ext.baseCSSPrefix + 'unselectable';
 }

 classes[clsInsertPoint++] = cellValues.tdCls;
 if (selModel && selModel.isCellSelected && selModel.isCellSelected(me, recordIndex, columnIndex)) {
 classes[clsInsertPoint++] = (me.selectedCellCls);
 }

 // Chop back array to only what we've set
 classes.length = clsInsertPoint;

 cellValues.tdCls = classes.join(' ');

 cellTpl.applyOut(cellValues, out);

 // Dereference objects since cellValues is a persistent var in the XTemplate's scope chain
 cellValues.column = null;
 }





 ///src/view/Table.js

 renderRows: function(rows, viewStartIndex, out) {
 var rowValues = this.rowValues,
 rowCount = rows.length,
 i;

 rowValues.view = this;
 rowValues.columns = this.ownerCt.columnManager.getColumns();

 for (i = 0; i < rowCount; i++, viewStartIndex++) {
 rowValues.itemClasses.length = rowValues.rowClasses.length = 0;
 this.renderRow(rows[i], viewStartIndex, out);
 }

 // Dereference objects since rowValues is a persistent on our prototype
 rowValues.view = rowValues.columns = rowValues.record = null;
 }

 renderRow: function(record, rowIdx, out) {
 var me = this,
 isMetadataRecord = rowIdx === -1,
 selModel = me.selModel,
 rowValues = me.rowValues,
 itemClasses = rowValues.itemClasses,
 rowClasses = rowValues.rowClasses,
 cls,
 rowTpl = me.rowTpl;

 // Set up mandatory properties on rowValues
 rowValues.record = record;
 rowValues.recordId = record.internalId;
 rowValues.recordIndex = rowIdx;
 rowValues.rowId = me.getRowId(record);
 rowValues.itemCls = rowValues.rowCls = '';
 if (!rowValues.columns) {
 rowValues.columns = me.ownerCt.columnManager.getColumns();
 }

 itemClasses.length = rowClasses.length = 0;

 // If it's a metadata record such as a summary record.
 // So do not decorate it with the regular CSS.
 // The Feature which renders it must know how to decorate it.
 if (!isMetadataRecord) {
 itemClasses[0] = Ext.baseCSSPrefix + "grid-row";
 if (selModel && selModel.isRowSelected) {
 if (selModel.isRowSelected(rowIdx + 1)) {
 itemClasses.push(me.beforeSelectedItemCls);
 }
 if (selModel.isRowSelected(record)) {
 itemClasses.push(me.selectedItemCls);
 }
 }

 if (me.stripeRows && rowIdx % 2 !== 0) {
 rowClasses.push(me.altRowCls);
 }

 if (me.getRowClass) {
 cls = me.getRowClass(record, rowIdx, null, me.dataSource);
 if (cls) {
 rowClasses.push(cls);
 }
 }
 }

 if (out) {
 rowTpl.applyOut(rowValues, out);
 } else {
 return rowTpl.apply(rowValues);
 }
 },
 (function(Ext) {
 var fm=Ext.util.Format,ts=Object.prototype.toString;
 return function (out,values,parent,xindex,xcount,xkey) {
 var c0=values, a0=Array.isArray(c0), p0=parent, n0=xcount, i0=xindex, k0, v;
 var dataRowCls = values.recordIndex === -1 ? "" : " x-grid-data-row";
 out.push('<tr role="row" ')
 if ((v=values.rowId ? ("id=\"" + values.rowId + "\"") : "") != null) out.push(v+'')
 out.push(' data-boundView="')
 if ((v=values.view.id) != null) out.push(v+'')
 out.push('" data-recordId="')
 if ((v=values.record.internalId) != null) out.push(v+'')
 out.push('" data-recordIndex="')
 if ((v=values['recordIndex']) != null) out.push(v+'')
 out.push('" class="')
 if ((v=values.itemClasses.join(" ")) != null) out.push(v+'')
 out.push(' ')
 if ((v=values.rowClasses.join(" ")) != null) out.push(v+'')
 if ((v=dataRowCls) != null) out.push(v+'')
 out.push('" ')
 if ((v=fm.attributes(values['rowAttr'])) != null) out.push(v+'')
 out.push(' tabIndex="-1">')
 var i1=0,n1=0,c1=values['columns'],a1=Array.isArray(c1),r1=values,p1,k1;
 p1=parent=a0?c0[i0]:c0
 if (c1){if(a1){n1=c1.length;}else if (c1.isMixedCollection){c1=c1.items;n1=c1.length;}else if(c1.isStore){c1=c1.data.items;n1=c1.length;}else{c1=[c1];n1=1;}}
 for (xcount=n1;i1<n1;++i1){
 values=c1[i1]
 xindex=i1+1
 parent.view.renderCell(values, parent.record, parent.recordIndex, xindex - 1, out, parent)
 }
 parent=p0;values=r1;xcount=n0;xindex=i0+1;xkey=k0;
 out.push('</tr>')

 }
 })
 ///src/data/NodeStore.js
 onNodeExpand: function(parent, records, suppressEvent) {
 var me = this,
 insertIndex = me.indexOf(parent) + 1,
 toAdd = [];

 // Used by the TreeView to bracket recursive expand & collapse ops
 // and refresh the size. This is most effective when folder nodes are loaded,
 // and this method is able to recurse.
 if (!suppressEvent) {
 me.fireEvent('beforeexpand', parent, records, insertIndex);
 }

 me.handleNodeExpand(parent, records, toAdd);

 // The add event from this insertion is handled by TreeView.onAdd.
 // That implementation calls parent and then ensures the previous sibling's joining lines are correct.
 // The datachanged event is relayed by the TreeStore. Internally, that's not used.
 me.insert(insertIndex, toAdd);

 // Triggers the TreeView's onExpand method which calls refreshSize,
 // and fires its afteritemexpand event
 if (!suppressEvent) {
 me.fireEvent('expand', parent, records);
 }
 },

 // Collects child nodes to remove into the passed toRemove array.
 // When available, all descendant nodes are pushed into that array using recursion.
 handleNodeExpand: function(parent, records, toAdd) {
 var me = this,
 ln = records ? records.length : 0,
 i, record;

 // recursive is hardcoded to true in TreeView.
 if (!me.recursive && parent !== me.node) {
 return;
 }

 if (parent !== this.node && !me.isVisible(parent)) {
 return;
 }

 if (ln) {
 // The view items corresponding to these are rendered.
 // Loop through and expand any of the non-leaf nodes which are expanded
 for (i = 0; i < ln; i++) {
 record = records[i];

 // Add to array being collected by recursion when child nodes are loaded.
 // Must be done here in loop so that child nodes are inserted into the stream in place
 // in recursive calls.
 toAdd.push(record);

 if (record.isExpanded()) {
 if (record.isLoaded()) {
 // Take a shortcut - appends to toAdd array
 me.handleNodeExpand(record, record.childNodes, toAdd);
 }
 else {
 // Might be asynchronous if child nodes are not immediately available
 record.set('expanded', false);
 record.expand();
 }
 }
 }
 }
 },*/