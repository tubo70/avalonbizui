/**
 * Created by weiwei on 13-12-14.
 */
/*

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
 })    */