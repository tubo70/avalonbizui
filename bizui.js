/**
 * Created by quan on 13-11-19.
 */
(function () {
    avalon.mix = avalon.fn.mix = function () {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false,
            lastArg = arguments[length - 1], mixIf = false

        // 如果第一个参数为布尔,判定是否深拷贝
        if (typeof target === "boolean") {
            deep = target
            target = arguments[1] || {}
            i++
        }
        // 如果最后一个参数为布尔，判定是否是mixIf调用
        if (typeof lastArg === "boolean") {
            mixIf = lastArg
            length--
        }
        //确保接受方为一个复杂的数据类型
        if (typeof target !== "object" && getType(target) !== "function") {
            target = {}
        }

        //如果只有一个参数，那么新成员添加于mix所在的对象上
        if (i === length) {
            target = this
            i--
        }

        for (; i < length; i++) {
            //只处理非空参数
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name]
                    copy = options[name]

                    // 防止环引用
                    if (target === copy) {
                        continue
                    }
                    if (deep && copy && (avalon.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {

                        if (copyIsArray) {
                            copyIsArray = false
                            clone = src && Array.isArray(src) ? src : []

                        } else {
                            clone = src && avalon.isPlainObject(src) ? src : {}
                        }

                        target[name] = avalon.mix(deep, clone, copy, mixIf)
                    } else if (copy !== void 0 && (!mixIf || src === void 0)) {
                        target[name] = copy
                    }
                }
            }
        }
        return target
    }
    avalon.mixIf = avalon.fn.mixIf = function () {
        arguments[arguments.length++] = true
        return avalon.mix.apply(avalon, arguments)
    }
    avalon.fn.mix({
        attrs: function (attrs) {
            var el = this[0],
                attr, index, attrName, attrValue
            for (var i = 0, il = attrs.length; i < il; i++) {
                attr = attrs[i]
                if (attr) {
                    index = attr.indexOf('=')
                    if (index >= 1) {
                        attrName = attr.substring(0, index)
                        attrValue = attr.substring(index + 2, attr.length - 1)
                        el.setAttribute(attrName, attrValue)
                    }
                }
            }

        }
    })
    var userAgent = navigator.userAgent.toLowerCase(),
        check = function (regex) {
            return regex.test(userAgent);
        },
        isStrict = document.compatMode == "CSS1Compat",
        version = function (is, regex) {
            var m;
            return (is && (m = regex.exec(userAgent))) ? parseFloat(m[1]) : 0;
        },
        docMode = document.documentMode,
        isOpera = check(/opera/),
        isOpera10_5 = isOpera && check(/version\/10\.5/),
        isChrome = check(/\bchrome\b/),
        isWebKit = check(/webkit/),
        isSafari = !isChrome && check(/safari/),
        isSafari2 = isSafari && check(/applewebkit\/4/), // unique to Safari 2
        isSafari3 = isSafari && check(/version\/3/),
        isSafari4 = isSafari && check(/version\/4/),
        isSafari5_0 = isSafari && check(/version\/5\.0/),
        isSafari5 = isSafari && check(/version\/5/),
        isIE = !isOpera && check(/msie/),
        isIE7 = isIE && ((check(/msie 7/) && docMode != 8 && docMode != 9 && docMode != 10) || docMode == 7),
        isIE8 = isIE && ((check(/msie 8/) && docMode != 7 && docMode != 9 && docMode != 10) || docMode == 8),
        isIE9 = isIE && ((check(/msie 9/) && docMode != 7 && docMode != 8 && docMode != 10) || docMode == 9),
        isIE10 = isIE && ((check(/msie 10/) && docMode != 7 && docMode != 8 && docMode != 9) || docMode == 10),
        isIE6 = isIE && check(/msie 6/),
        isGecko = !isWebKit && check(/gecko/),
        isGecko3 = isGecko && check(/rv:1\.9/),
        isGecko4 = isGecko && check(/rv:2\.0/),
        isGecko5 = isGecko && check(/rv:5\./),
        isGecko10 = isGecko && check(/rv:10\./),
        isFF3_0 = isGecko3 && check(/rv:1\.9\.0/),
        isFF3_5 = isGecko3 && check(/rv:1\.9\.1/),
        isFF3_6 = isGecko3 && check(/rv:1\.9\.2/),
        isWindows = check(/windows|win32/),
        isMac = check(/macintosh|mac os x/),
        isLinux = check(/linux/),
    //scrollbarSize = null,
        chromeVersion = version(true, /\bchrome\/(\d+\.\d+)/),
        firefoxVersion = version(true, /\bfirefox\/(\d+\.\d+)/),
        ieVersion = version(isIE, /msie (\d+\.\d+)/),
        operaVersion = version(isOpera, /version\/(\d+\.\d+)/),
        safariVersion = version(isSafari, /version\/(\d+\.\d+)/),
        webKitVersion = version(isWebKit, /webkit\/(\d+\.\d+)/),
        isSecure = /^https/i.test(window.location.protocol)
    avalon.bizui = avalon.bizui || {}
    bizui = avalon.bizui;
    avalon.mix(bizui, {
        baseCSSPrefix: 'x-',
        isStrict: isStrict,
        isIEQuirks: isIE && (!isStrict && (isIE6 || isIE7 || isIE8 || isIE9)),
        isOpera: isOpera,
        isOpera10_5: isOpera10_5,
        isWebKit: isWebKit,
        isChrome: isChrome,
        isSafari: isSafari,
        isSafari3: isSafari3,
        isSafari4: isSafari4,
        isSafari5: isSafari5,
        isSafari5_0: isSafari5_0,
        isSafari2: isSafari2,
        isIE: isIE,
        isIE6: isIE6,
        isIE7: isIE7,
        isIE7m: isIE6 || isIE7,
        isIE7p: isIE && !isIE6,
        isIE8: isIE8,
        isIE8m: isIE6 || isIE7 || isIE8,
        isIE8p: isIE && !(isIE6 || isIE7),
        isIE9: isIE9,
        isIE9m: isIE6 || isIE7 || isIE8 || isIE9,
        isIE9p: isIE && !(isIE6 || isIE7 || isIE8),
        isIE10: isIE10,
        isIE10m: isIE6 || isIE7 || isIE8 || isIE9 || isIE10,
        isIE10p: isIE && !(isIE6 || isIE7 || isIE8 || isIE9),
        isGecko: isGecko,
        isGecko3: isGecko3,
        isGecko4: isGecko4,
        isGecko5: isGecko5,
        isGecko10: isGecko10,
        isFF3_0: isFF3_0,
        isFF3_5: isFF3_5,
        isFF3_6: isFF3_6,
        isFF4: 4 <= firefoxVersion && firefoxVersion < 5,
        isFF5: 5 <= firefoxVersion && firefoxVersion < 6,
        isFF10: 10 <= firefoxVersion && firefoxVersion < 11,
        isLinux: isLinux,
        isWindows: isWindows,
        isMac: isMac,
        chromeVersion: chromeVersion,
        firefoxVersion: firefoxVersion,
        ieVersion: ieVersion,
        operaVersion: operaVersion,
        safariVersion: safariVersion,
        webKitVersion: webKitVersion,
        isSecure: isSecure,
        eastWestRegion: {east: 1, west: 1},
        southNorthRegion: {south: 1, north: 1},
        zIndex: 19000,
        vmodels: {},
        BLANK_IMAGE_URL: (isIE6 || isIE7) ? '/' + '/www.sencha.com/s.gif' : 'data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='
    })
    bizui.filterData = function (obj, prefix) {
        var result = {}
        for (var i in obj) {
            if (i.indexOf(prefix) === 0) {
                result[  i.replace(prefix, "").replace(/\w/, function (a) {
                    return a.toLowerCase()
                }) ] = obj[i]
            }
        }
        return result
    }
    bizui.idObjGen = function (prefix) {
        var id = prefix + setTimeout('1')
        return {bizuiId: id}
    }
    bizui.processChildren = function (element, vmodelId, vmodels, childName, onlyBizui, attachChild) {
        var comps = [], children = [], bizuiOptions = {}, el, deletes = []

        for (var i = 0, il = element.childNodes.length; i < il; i++) {
            el = element.childNodes[i]
            if (el.tagName) {
                var $el = avalon(el)
                var arg = $el.attr('ms-bizui')
                if (arg) {
                    var args = arg.split(',')
                    if (args[0] && childName && args[0] != childName) {
                        deletes.push(el)
                        continue
                    }
                    var vmodel = vmodels[0]
                    var bizuiId = args.length >= 2 ? args[1] : '$'

                    var childOptions = bizui.filterData(avalon(el).data(), args[0])
                    var vmOptsName = args.length == 3 ? args[2] : args[0]
                    var vmOptions = vmodel && vmOptsName && typeof vmodel[vmOptsName] == "object" ? vmodel[vmOptsName] : {}
                    if (vmOptions.$model) {
                        vmOptions = vmOptions.$model
                    }
                    childOptions = avalon.mix(true, {}, bizui.vmodels[args[0]], childOptions, vmOptions)
                    if (bizuiId == '$') {
                        bizuiId = childOptions.$bizuiType + setTimeout('1')
                    }
                    childOptions.bizuiId = bizuiId
                    $el.attr('ms-bizui', childOptions.$bizuiType + ',' + bizuiId + ',$' + bizuiId)
                    if (attachChild === true) {
                        childOptions.$element = el
                    }
                    el.stopScan = true
                    comps.push(childOptions)
                }
            }
            else {
                if (childName || onlyBizui === true) {
                    deletes.push(el)
                }
            }
        }
        for (var i = 0, il = deletes.length; i < il; i++) {
            element.removeChild(deletes[i])
        }
        for (var i = 0, il = comps.length; i < il; i++) {
            var comp = comps[i]
            var $bizuiId = '$' + comp.bizuiId
            children.push({
                $region: comp.region,
                $bizuiId: comp.bizuiId,
                $bizuiType: comp.$bizuiType,
                $left: comp.left,
                $top: comp.top,
                $height: comp.height,
                $width: comp.width
            })
            bizuiOptions[$bizuiId] = comp
        }
        return {children: children, bizuiOptions: bizuiOptions}
    }
    bizui.template = {}
    avalon.mix(bizui.template, {
            config: {
                baseCls: '',
                ui: 'default',
                itemCls: [],
                uiCls: [],
                autoEl: {
                    tag: 'div',
                    role: '',
                    hidefocus: 'on',
                    unselectable: 'on'
                },
                computedAttributes: [
                    {click: ['onClick']},
                    {name: 'class', values: []},
                    {css: {
                        width: 'width',
                        height: 'height'
                    }},
                    {name: 'if', values: []},
                    {name: 'class', values: ['', '']},
                    {name: 'css', values: [
                        {name: 'width', value: ''}
                    ]},
                    {name: 'click', values: []},
                    {name: 'on-keydown', values: []}
                ],
                style: '',
                attributes: [],
                layout: {
                    type: 'auto',
                    size: null
                },
                componentLayout: {
                    type: 'autocomponet',
                    size: null
                },
                contentTemplate: '[[content]]'
            },
            render: function (config, returnAttributes) {
                var autoEl = config.autoEl,
                    tag = autoEl && autoEl.tag || 'div',
                    role = autoEl && autoEl.role || '',
                    hidefocus = autoEl && autoEl.hidefocus || '',
                    unselectable = autoEl && autoEl.unselectable || '',
                    template = [], index = 80,
                    layout = config.layout || config.componentLayout,
                    layoutName = layout && layout.name,
                    layoutSize = layout && layout.size,
                    attributes = [],
                    contentTemplate = config.contentTemplate
                contentTemplate = contentTemplate == null || contentTemplate == undefined ? '[[content]]' : contentTemplate
                layout = bizui.containerLayout[layoutName]
                var targetCls = layout && layout.targetCls || ''
                var processValues = function (result, msName, values, start) {
                    if (typeof values === 'string') {
                        result.push('ms-' + msName + '="' + values + '"')
                        return
                    } else if (!Array.isArray(values)) {
                        values = [values]
                    }
                    for (var j = 0, jl = values.length; j < jl; j++) {
                        var value = values[j],
                            name = values[j].name
                        if (typeof value === 'string') {
                            name = start + j
                            result.push('ms-' + msName + '-' + name + '="' + value + '"')
                            continue
                        }
                        if (name) {
                            result.push('ms-' + msName + '-' + name + '="' + values[j].value + '"')
                            continue
                        }
                        for (name in value) {
                            result.push('ms-' + msName + '-' + name + '="' + value[name] + '"')
                        }

                    }

                }
                var getComputedAttributes = function (computedAttributes, start) {
                    var result = []
                    if (computedAttributes) {
                        if (!Array.isArray(computedAttributes)) {
                            computedAttributes = [computedAttributes]
                        }
                        for (var i = 0, il = computedAttributes.length; i < il; i++) {
                            var msName = computedAttributes[i].name, values = computedAttributes[i].values
                            if (!msName || !values) {
                                for (var name in computedAttributes[i]) {
                                    msName = name
                                    values = computedAttributes[i][name]
                                    processValues(result, msName, values, start)
                                }
                            }
                            processValues(result, msName, values, start)
                            /*
                             if (typeof values === 'string') {
                             result.push('ms-' + msName + '="' + values + '"')
                             } else {
                             for (var j = 0, jl = values.length; j < jl; j++) {
                             var name = values[j].name, value = values[j].value
                             name = name || (start + j)
                             value = value || values[j]
                             if (typeof value === 'string') {
                             result.push('ms-' + msName + '-' + name + '="' + value + '"')
                             }
                             }
                             }*/

                        }
                    }

                    return result//.join(' ')
                }
                var uiCls = bizui.clsHelper.addUICls(config.baseCls, config.ui, config.uiCls),
                    classes = [config.baseCls, config.ui ? config.baseCls + '-' + config.ui : '', targetCls],
                    itemCls = config.itemCls
                itemCls = itemCls || ''
                if (Array.isArray(itemCls)) {
                    itemCls = itemCls.join(' ')
                }
                classes = classes.join(' ') + ' ' + uiCls.join(' ') + ' ' + itemCls
                template.push('<' + tag + ' ')
                attributes.push('class="' + classes + '"')
                attributes.push(role ? 'role="' + role + '" ' : '')
                attributes.push(unselectable ? 'unselectable="' + unselectable + '" ' : '')
                attributes.push(hidefocus ? 'hidefocus="' + hidefocus + '" ' : '')
                attributes = attributes.concat(getComputedAttributes(config.computedAttributes, index))
                if (config.style) {
                    attributes.push('style="' + config.style + '"')
                }
                if (config.attributes) {
                    attributes = attributes.concat(config.attributes)
                }
                template.push(attributes.join(' '))
                template.push('>')
                var tags = avalon.oneObject('area,br,col,embed,hr,img,input,link,meta,param')
                if (!(tag in tags)) {
                    if (config.children) {
                        var childTemplate = ''
                        for (var name in config.children) {
                            childTemplate += bizui.template.render(config.children[name])
                        }
                        contentTemplate = childTemplate
                    }
                    if (layout) {
                        template.push(layout.getTemplate(config, layoutSize, contentTemplate))
                    } else {
                        template.push(contentTemplate)
                    }
                    template.push('</' + tag + '>')
                }
                if (returnAttributes) {
                    return attributes//.join(' ')
                }
                return template.join('')
            }

        }
    )
    bizui.classes = {}
    bizui.classes['component'] = {
        baseCls: bizui.baseCSSPrefix + 'component',
        ui: 'default',
        uiCls: [],
        disabledCls: bizui.baseCSSPrefix + 'item-disabled'
    }
    bizui.classes['container'] = avalon.mix(true, {}, bizui.classes['component'])
    bizui.component = {
        bizuiId: '',
        $bizuiType: 'component',
        layout: 'auto',
        $containerId: '',
        $callback: avalon.noop,
        hidden: false,
        disabled: false,
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        tooltip: '',
        listeners: {},

        contentConfig: {},
        getContentTemplate: function (config) {
            var me = this,
                finallyConfig = avalon.mix(true, {}, me.contentConfig, config)
            return bizui.template.render(finallyConfig)
        },
        targetConfig: {},
        getTargetTemplate: function (config) {
            var me = this,
                finallyConfig = avalon.mix(true, {}, me.targetConfig, config)
            return bizui.template.render(finallyConfig)
        },
        setAttributes: function (element, config) {
            var me = this,
                finallyConfig = avalon.mix(true, {}, me.targetConfig, config)
            var attributes = bizui.template.render(finallyConfig, true)
            avalon(element).attrs(attributes)
        },
        setLeft: function (left) {
            if (typeof left == 'number') {
                this.left = left
            }
            return this
        },
        setTop: function (top) {
            if (typeof top == 'number') {
                this.top = top
            }
            return this
        },
        setSize: function (width, height) {
            var me = this
            if (width && typeof width == 'object') {
                width = width.width
                height = width.height
            }
            if (typeof width == 'number') {
                me.width = width
            }
            if (typeof height == 'number') {
                me.height = height
            }
            return me
        },
        getContentSize: function () {
            return {
                width: this.width,
                height: this.height
            }
        },
        getSize: function () {
            var me = this
            return {
                width: me.width,
                height: me.height
            }
        },
        onContainerSizeChanged: avalon.noop
    }
    bizui.baseVModel = bizui.component
    bizui.container = avalon.mix(true, {}, bizui.component, {
        $bizuiType: 'container',
        $childIds: [],
        $onChildAdded: function (vm) {
            var me = this
            vm.$containerId = me.bizuiId
            me.$childIds.push(vm.bizuiId)
        },
        add: function (comp) {

        },
        setLeft: function (left) {
            if (typeof left == 'number') {
                this.left = left
            }
        },
        setTop: function (top) {
            if (typeof top == 'number') {
                this.top = top
            }
        },
        setSize: function (width, height) {
            var me = this
            if (width && typeof width == 'object') {
                width = width.width
                height = width.height
            }
            if (typeof width == 'number') {
                me.width = width
            }
            if (typeof height == 'number') {
                me.height = height
            }
            for (var i = 0, il = me.$childIds.length; i < il; i++) {
                var child = avalon.vmodels[me.$childIds[i]]
                if (child && child.onContainerSizeChanged) {
                    child.onContainerSizeChanged(me.getContentSize())
                }
            }
        }
    })
    bizui.containerVModel = bizui.container
    bizui.containerLayout = {}
    avalon.mix(bizui.containerLayout, {
        container: {
            targetCls: '',
            getTemplate: function (comp, size, contentTemplate) {
                return contentTemplate
            }
        },
        auto: {
            targetCls: '',
            getTemplate: function (comp, size, contentTemplate) {
                var template = []
                contentTemplate = contentTemplate || '[[content]]'
                if (!bizui.isIE7m) {
                    template = [
                        '<span ms-attr-id="{{bizuiId}}-outerCt" style="display:table;table-layout: fixed; height: 100%;">',
                        '  <div ms-attr-id="{{bizuiId}}-innerCt" style="display:table-cell;height:100%;vertical-align:top;">',
                        contentTemplate,
                        '  </div>',
                        '</span>'
                    ]
                }
                else {
                    template = [
                        '<div ms-attr-id="{{bizuiId}}-outerCt" style="height: 100%; zoom: 1;">',
                        '  <div ms-attr-id="{{bizuiId}}-innerCt" style="height: 100%;zoom: 1;">',
                        contentTemplate,
                        '    <div ms-attr-id="{{bizuiId}}-clearEl" class="' + bizui.baseCSSPrefix + 'clear"></div>',
                        '  </div>',
                        '</div>'
                    ]
                }
                return template.join('')
            }
        },
        anchor: {
            targetCls: '',
            getTemplate: function (comp, size, contentTemplate) {
                return bizui.containerLayout['auto'].getTemplate(comp, size, contentTemplate)
            }
        },
        border: {
            targetCls: bizui.baseCSSPrefix + 'border-layout-ct',
            getTemplate: function (comp, size, contentTemplate) {
                return contentTemplate
            }
        },
        column: {
            targetCls: bizui.baseCSSPrefix + 'column-layout-ct',
            getTemplate: function (comp, size, contentTemplate) {
                return bizui.containerLayout['auto'].getTemplate(comp, size, contentTemplate)
            }
        },
        fit: {
            targetCls: bizui.baseCSSPrefix + 'layout-fit',
            getTemplate: function (comp, size, contentTemplate) {
                return bizui.containerLayout['border'].getTemplate(comp, size, contentTemplate)
            }
        },
        form: {
            targetCls: '',
            getTemplate: function (comp, size, contentTemplate) {
                return '<table ms-attr-id="{{bizuiId}}-formTable" class="x-form-layout-table" style="width:100%" cellpadding="0">' +
                    contentTemplate +
                    '</table>'
            }
        },
        hbox: {
            targetCls: bizui.baseCSSPrefix + 'box-layout-ct',
            getTemplate: function (comp, size, contentTemplate) {
                var widthStyle = 'width:0px;', heightStyle = '',
                    computedWidth = '' , computedHeight = ''
                contentTemplate = contentTemplate || '[[content]]'
                if (size) {
                    if (size.computedWidth) {
                        computedWidth = 'ms-css-width="' + size.computedWidth + '"'
                        widthStyle = ''
                        //delete  size.width
                    }
                    if (size.computedHeight) {
                        computedHeight = 'ms-css-height="' + size.computedHeight + '"'
                        //delete size.height
                    }
                    if (size.width && !computedWidth) {
                        widthStyle = 'width:' + size.width + 'px;'
                    }
                    if (size.height && !computedHeight) {
                        heightStyle = 'height:' + size.height + 'px;'
                    }
                }
                var idSuffix = comp.idSuffix ? '-' + comp.idSuffix : ''
                var template = [
                    '<div ms-attr-id="{{bizuiId}}-innerCt' + idSuffix + '" class="x-box-inner " role="presentation" ',
                    computedWidth + ' ' + computedHeight,
                    ' style="' + widthStyle + ' ' + heightStyle + '">',
                    '  <div ms-attr-id="{{bizuiId}}-targetEl' + idSuffix + '" class="x-box-target" ',
                    computedWidth,
                    ' style="' + widthStyle + '">',
                    contentTemplate,
                    '  </div>',
                    '</div>'
                ]
                return template.join('')
            }
        },
        vbox: {
            targetCls: bizui.baseCSSPrefix + 'box-layout-ct',
            getTemplate: function (comp, size, contentTemplate) {
                return bizui.containerLayout['hbox'].getTemplate(comp, size, contentTemplate)
            }
        },
        table: {
            targetCls: bizui.baseCSSPrefix + 'table-layout-ct',
            getTemplate: function (comp, size, contentTemplate) {
                return '<table role="presentation" class="x-table-layout" cellspacing="0" cellpadding="0"><tbody>' +
                    contentTemplate +
                    '</tbody></table>'
            }
        },
        tableview: {
            targetCls: bizui.baseCSSPrefix + 'fit-item',
            getTemplate: function (comp, size, contentTemplate) {
                return contentTemplate
            }
        },
        gridcell: {
            targetCls: '',
            getTemplate: function (comp, size, contentTemplate) {
                return '<div unselectable="on" class="' + bizui.baseCSSPrefix + 'grid-cell-inner " ms-css-text-align="col.align">' + contentTemplate + '</div>'
            }
        }
    })
    avalon.bindingHandlers['bizui'] = function (data, vmodels) {
        var args = data.value.match(avalon.rword),
            element = data.element,
            widget = args[0],
            vmOptions = {},
            ret = 0
        if (args[1] === "$") {
            args[1] = void 0
        }
        element.stopScan = true
        var constructor = avalon.bizui[widget]
        if (typeof constructor === "function") {//ms-widget="tabs,tabsAAA,optname"
            for (var i = 0, v; v = vmodels[i++];) {
                if (avalon.vmodels[v.$id]) {//取得离它最近由用户定义的VM
                    var nearestVM = v
                    break
                }
            }
            var optName = args[2] || widget //尝试获得配置项的名字，没有则取widget的名字
            if (nearestVM && typeof nearestVM[optName] === "object") {
                vmOptions = nearestVM[optName]
                vmOptions = vmOptions.$model || vmOptions
                var id = vmOptions[widget + "Id"]
                if (typeof id === "string") {
                    args[1] = id
                }
            }
            //var vmodel = vmodels[0], opts = args[2] || widget //options在最近的一个VM中的名字
            // vmOptions = vmodel && opts && typeof vmodel[opts] == "object" ? vmodel[opts] : {}
            if (!args[1]) {
                if (vmOptions.bizuiId) {
                    args[1] = vmOptions.bizuiId
                } else {
                    args[1] = widget + setTimeout('1')
                    vmOptions.bizuiId = args[1]
                }
            } else {
                vmOptions.bizuiId = args[1]
            }
            data.value = args.join(",")
            var elemData = bizui.filterData(avalon(element).data(), args[0])
            data[ widget + "Id"] = args[1]
            data[ widget + "Options"] = avalon.mix({}, constructor.defaults, vmOptions, elemData)
            //element.stopScan = false
            var newModel = constructor(element, data, vmodels)
            if (nearestVM && nearestVM.$onChildAdded && newModel) {
                nearestVM.$onChildAdded.apply(nearestVM, [newModel])
            }
            data.evaluator = avalon.noop
        } //如果碰到此组件还没有加载的情况，将停止扫描它的内部
        return true
    }
    var initExtCss = function () {
        // find the body element
        var bd = bizui.body,
            prefix = bizui.baseCSSPrefix,
            cls = [prefix + 'body'],
            htmlCls = [],
        //supportsLG = bizui.supports.CSS3LinearGradient,
        //supportsBR = bizui.supports.CSS3BorderRadius,
            html;

        if (!bd) {
            return false;
        }

        html = bd.parentNode;

        function add(c) {
            cls.push(prefix + c);
        }

        //Let's keep this human readable!
        if (bizui.isIE && bizui.isIE9m) {
            add('ie');

            // very often CSS needs to do checks like "IE7+" or "IE6 or 7". To help
            // reduce the clutter (since CSS/SCSS cannot do these tests), we add some
            // additional classes:
            //
            //      x-ie7p      : IE7+      :  7 <= ieVer
            //      x-ie7m      : IE7-      :  ieVer <= 7
            //      x-ie8p      : IE8+      :  8 <= ieVer
            //      x-ie8m      : IE8-      :  ieVer <= 8
            //      x-ie9p      : IE9+      :  9 <= ieVer
            //      x-ie78      : IE7 or 8  :  7 <= ieVer <= 8
            //
            if (bizui.isIE6) {
                add('ie6');
            } else { // ignore pre-IE6 :)
                add('ie7p');

                if (bizui.isIE7) {
                    add('ie7');
                } else {
                    add('ie8p');

                    if (bizui.isIE8) {
                        add('ie8');
                    } else {
                        add('ie9p');

                        if (bizui.isIE9) {
                            add('ie9');
                        }
                    }
                }
            }

            if (bizui.isIE7m) {
                add('ie7m');
            }
            if (bizui.isIE8m) {
                add('ie8m');
                add('nbr');
                add('nlg');
            }
            if (bizui.isIE9m) {
                add('ie9m');
                add('nlg');
            }
            if (bizui.isIE7 || bizui.isIE8) {
                add('ie78');
            }
        }

        if (bizui.isIE10) {
            add('ie10');
            add('nlg');
        }

        if (bizui.isGecko) {
            add('gecko');
            if (bizui.isGecko3) {
                add('gecko3');
            }
            if (bizui.isGecko4) {
                add('gecko4');
            }
            if (bizui.isGecko5) {
                add('gecko5');
            }
        }
        if (bizui.isOpera) {
            add('opera');
        }
        if (bizui.isWebKit) {
            add('webkit');
        }
        if (bizui.isSafari) {
            add('safari');
            if (bizui.isSafari2) {
                add('safari2');
            }
            if (bizui.isSafari3) {
                add('safari3');
            }
            if (bizui.isSafari4) {
                add('safari4');
            }
            if (bizui.isSafari5) {
                add('safari5');
            }
            if (bizui.isSafari5_0) {
                add('safari5_0')
            }
        }
        if (bizui.isChrome) {
            add('chrome');
        }
        if (bizui.isMac) {
            add('mac');
        }
        if (bizui.isLinux) {
            add('linux');
        }
        //if (!supportsBR) {
        //    add('nbr');
        // }
        //if (!supportsLG) {
        //   add('nlg');
        //}

        // add to the parent to allow for selectors x-strict x-border-box, also set the isBorderBox property correctly
        if (html) {
            if (bizui.isStrict && (bizui.isIE6 || bizui.isIE7)) {
                bizui.isBorderBox = false;
            }
            else {
                bizui.isBorderBox = true;
            }

            if (!bizui.isBorderBox) {
                htmlCls.push(prefix + 'content-box');
            }
            if (bizui.isStrict) {
                htmlCls.push(prefix + 'strict');
            } else {
                htmlCls.push(prefix + 'quirks');
            }
            avalon(html).addClass(htmlCls.join(' '));
        }

        avalon(bd).addClass(cls.join(' '));
        return true;
    };
    bizui.clsHelper = {}
    avalon.mix(bizui.clsHelper, {
        addUICls: function (baseCls, ui, uiCls, skipSelf) {
            var clsArray = [],
                i = 0,
                length,
                cls
            if (!uiCls) {
                return clsArray
            }
            if (typeof uiCls === "string") {
                uiCls = (uiCls.indexOf(' ') < 0) ? [uiCls] : uiCls.split(' ')
            }
            length = uiCls.length

            for (; i < length; i++) {
                cls = uiCls[i];
                if (cls) {
                    if (skipSelf !== true) {
                        clsArray.push('x-' + cls)
                    }
                    clsArray.push(baseCls + '-' + cls)
                    clsArray.push(baseCls + '-' + ui + '-' + cls)
                }
            }
            return clsArray
        },
        getConditionalClass: function (conditionalUiCls, baseCls, ui, suffix) {
            var cls = [], suffix = suffix ? '-' + suffix : ''
            if (conditionalUiCls && conditionalUiCls.length > 0) {

                for (var i = 0, il = conditionalUiCls.length; i < il; i++) {
                    var condition = conditionalUiCls[i].condition,
                        uicls = conditionalUiCls[i].uiCls,
                        conditionCls = this.addUICls(baseCls, ui, uicls)
                    if (conditionCls.length > 0) {
                        conditionCls[conditionCls.length] = ':' + condition
                        cls.push(conditionCls.join(' '))
                    }
                }
            }
            return cls
        }
    })
    //frameHelper
    bizui.frameHelper = {}
    avalon.mix(bizui.frameHelper, {
        frameInfoCache: {},
        styleProxyEl: null,
        getFrameTpl: function (config) {
            var tpl = [], dynamic = config.dynamic, cls,
                idSuffix = config.idSuffix,
                frameCls = config.frameCls, baseCls = config.baseCls, conditionalUiCls = config.conditionalUiCls,
                ui = config.ui, uiCls = config.uiCls,
                top, left, bottom, right, table,
                extraAttrs = config.extraAttrs,
                tdCloseTags = ['', '</td>'], divCloseTage = ['</div>', ''],
                trOpenTags = ['', '<tr>'], trCloseTags = ['', '</tr>'],
                frameInfoCls = config.framingInfoCls + '-frameInfo',
                me = this, frameInfo = me.frameInfoCache[frameCls]
            if (frameInfo == null) {
                if (me.styleProxyEl == null) {
                    bizui.body.appendChild(avalon.parseHTML('<div style="position: absolute;top:-10000px;"></div>'))
                    me.styleProxyEl = bizui.body.lastChild
                }
                me.styleProxyEl.className = frameInfoCls
                var info = avalon(me.styleProxyEl).css('font-family')
                if (info) {
                    info = info.split('-')
                    var max = Math.max,
                        frameTop, frameRight, frameBottom, frameLeft,
                        borderWidthT, borderWidthR, borderWidthB, borderWidthL,
                        paddingT, paddingR, paddingB, paddingL,
                        borderRadiusTL, borderRadiusTR, borderRadiusBR, borderRadiusBL

                    borderRadiusTL = parseInt(info[1], 10);
                    borderRadiusTR = parseInt(info[2], 10);
                    borderRadiusBR = parseInt(info[3], 10);
                    borderRadiusBL = parseInt(info[4], 10);
                    borderWidthT = parseInt(info[5], 10);
                    borderWidthR = parseInt(info[6], 10);
                    borderWidthB = parseInt(info[7], 10);
                    borderWidthL = parseInt(info[8], 10);
                    paddingT = parseInt(info[9], 10);
                    paddingR = parseInt(info[10], 10);
                    paddingB = parseInt(info[11], 10);
                    paddingL = parseInt(info[12], 10);

                    // This calculation should follow ext-theme-base/etc/mixins/frame.css
                    // with respect to the CSS3 equivalent formulation:
                    frameTop = max(borderWidthT, max(borderRadiusTL, borderRadiusTR));
                    frameRight = max(borderWidthR, max(borderRadiusTR, borderRadiusBR));
                    frameBottom = max(borderWidthB, max(borderRadiusBL, borderRadiusBR));
                    frameLeft = max(borderWidthL, max(borderRadiusTL, borderRadiusBL));
                    frameInfo = {
                        table: info[0].charAt(0) === 't' ? 1 : 0,
                        vertical: info[0].charAt(1) === 'v',

                        top: frameTop,
                        right: frameRight,
                        bottom: frameBottom,
                        left: frameLeft
                    }
                    me.frameInfoCache[frameCls] = frameInfo
                }
            }
            top = frameInfo.top
            left = frameInfo.left
            bottom = frameInfo.bottom
            right = frameInfo.right
            table = frameInfo.table
            function getClass(suffix) {
                var cls = []
                if (dynamic === true) {
                    cls[cls.length] = frameCls + '-' + suffix
                    cls[cls.length] = '{{baseCls}}-' + suffix
                    cls[cls.length] = '{{baseCls}}-{{ui}}-' + suffix
                    if (uiCls) {
                        for (var i = 0, il = uiCls.length; i < il; i++) {
                            cls[cls.length] = '{{baseCls}}-{{ui}}-' + uiCls[i] + '-' + suffix
                        }
                    }
                } else {
                    cls[cls.length] = frameCls + '-' + suffix
                    cls[cls.length] = baseCls + '-' + suffix
                    cls[cls.length] = baseCls + '-' + ui + '-' + suffix
                    if (uiCls) {
                        for (var i = 0, il = uiCls.length; i < il; i++) {
                            cls[cls.length] = baseCls + '-' + ui + '-' + uiCls[i] + '-' + suffix
                        }
                    }
                }
                return cls.join(' ')
            }

            function getConditionalClass(suffix) {
                var cls = []
                if (conditionalUiCls && conditionalUiCls.length > 0) {

                    for (var i = 0, il = conditionalUiCls.length; i < il; i++) {
                        var condition = conditionalUiCls[i].condition,
                            uicls = conditionalUiCls[i].uiCls,
                            conditionCls = []
                        for (var j = 0, jl = uicls.length; j < jl; j++) {
                            conditionCls[conditionCls.length] = baseCls + '-' + ui + '-' + uicls[j] + '-' + suffix
                        }
                        if (conditionCls.length > 0) {
                            conditionCls[conditionCls.length] = ':' + condition
                            cls.push(conditionCls.join(' '))
                        }
                    }
                }
                return cls
            }

            function getOneSide(side, addExtraAttrs) {
                var cls = getClass(side.toLowerCase()),
                    conditionalCls = getConditionalClass(side.toLowerCase()),
                    index = 99,
                    tag = table ? 'td' : 'div'
                tpl[tpl.length] = '<' + tag + ' ms-attr-id="{{bizuiId}}' + idSuffix + side + '" '
                if (dynamic === true) {
                    tpl[tpl.length] = 'ms-class="' + cls + '"'
                } else {
                    tpl[tpl.length] = 'class="' + cls + '"'
                }
                if (addExtraAttrs) {
                    tpl[tpl.length] = extraAttrs
                }
                if (conditionalCls && conditionalCls.length > 0) {
                    for (var i = 0, il = conditionalCls.length; i < il; i++) {
                        tpl[tpl.length] = 'ms-class-' + index + '="' + conditionalCls + '"'
                        index -= 1
                    }
                }
                tpl[tpl.length] = 'role = "presentation">'
                //skip frameElCls
            }

            function oneLine(position, attrs) {

                tpl[tpl.length] = trOpenTags[table]
                if (left) {
                    //me.getOneSide(tpl, frameCls, baseCls, ui, uiCls, position + 'L', idSuffix, dynamic, '', table)
                    getOneSide(position + 'L', attrs)
                    tpl[tpl.length] = tdCloseTags[table]
                }
                if (right && table === 0) {
                    //me.getOneSide(tpl, frameCls, baseCls, ui, uiCls, position + 'R', idSuffix, dynamic, '', table)
                    getOneSide(position + 'R', attrs)
                }
                //me.getOneSide(tpl, frameCls, baseCls, ui, uiCls, position + 'C', idSuffix, dynamic, attrs, table)
                getOneSide(position + 'C', attrs)
                if (position === 'M') {
                    tpl[tpl.length] = '{{frameContent}}'
                }
                tpl[tpl.length] = tdCloseTags[table]
                tpl[tpl.length] = divCloseTage[table]
                if (right && table === 1) {
                    //me.getOneSide(tpl, frameCls, baseCls, ui, uiCls, position + 'R', idSuffix, dynamic, '', table)
                    getOneSide(position + 'R', attrs)
                    tpl[tpl.length] = tdCloseTags[table]
                }
                tpl[tpl.length] = trCloseTags[table]
                if (right) {
                    tpl[tpl.length] = divCloseTage[table]
                }
                if (left) {
                    tpl[tpl.length] = divCloseTage[table]
                }
            }

            if (table) {
                tpl[tpl.length] = '<table class="x-table-plain" cellpadding="0"><tbody>'
            }
            if (top) {
                oneLine('T')
            }
            oneLine('M', true)
            if (bottom) {
                oneLine('B')
            }
            if (table) {
                tpl[tpl.length] = '</tbody></table>'
            }
            return tpl.join(' ')
        }
    })
    avalon.ready(function () {
        bizui.body = document.body || document.getElementsByTagName('body')[0]
        initExtCss()
    })
}())