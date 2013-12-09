/**
 * Created by quan on 13-12-2.
 */
define(['avalon'], function (avalon) {
    bizui.vmodels['mask'] = avalon.mix(true, {}, bizui.baseVModel, {
        $bizuiType: 'mask',
        zIndex: 18997,
        $layout: 'fit',
        $maskQueue: []
    })

    avalon.bizui['mask'] = function (element, data, vmodels) {
        var options = avalon.mix(true, {}, bizui.vmodels['mask'], data.maskOptions)
        var maskId = 'onlyOneMask'
        var maskModel = avalon.vmodels[maskId]
        var model = vmodels[0]
        var mask = {
            parentModelId: model ? model.$containerId : null,
            left: 0,//options.left,
            top: 0,// options.top,
            width: avalon(window).width(),//options.width,
            height: avalon(window).height(),// options.height,
            zIndex: options.zIndex
        }
        if (maskModel) {
            maskModel.newMask.apply(maskModel,[mask])
            element.parentNode.removeChild(element)
            return maskModel
        }
        var $element = avalon(element)
        var vmodel = avalon.define(maskId, function (vm) {
            avalon.mix(vm, options)
            vm.zIndex = options.zIndex
            vm.windowResize = function () {
                vm.left = 0
                vm.top = 0
                vm.width = avalon(window).width()
                vm.height = avalon(window).height()
            }
            vm.vmodelResize = function (newSize, oldSize) {
                vm.left = newSize.left
                vm.top = newSize.top
                vm.width = newSize.width
                vm.height = newSize.height
            }
            vm.newMask = function (config) {
                var me = this
                var oldMask
                if (me.$maskQueue.length > 0) {
                    oldMask = me.$maskQueue.slice(me.$maskQueue.length - 1)[0]
                }

                me.$maskQueue.push({
                    $parentModelId: config.parentModelId,
                    $left: config.left,
                    $top: config.top,
                    $width: config.width,
                    $height: config.height,
                    $zIndex: config.zIndex//,
                    //$currentMask:[me.$maskQueue.length]
                })
                me.zIndex = config.zIndex

                if (!oldMask) {
                    avalon.bind(window, 'resize', me.windowResize)
                }
                /*
                 if (oldMask) {
                 if (!oldMask.$parentModelId) {
                 return
                 }
                 }
                 else {

                 }
                 if (config.parentModelId) {
                 var parentModel = avalon.vmodels[config.parentModelId]
                 if (parentModel) {
                 parentModel.$watch('onresize', vmodelResize)
                 }
                 }
                 else {
                 avalon.bind(window, 'resize', windowResize)
                 }*/
            }
            vm.removeMask = function () {
                var me = this, currentMask = me.$maskQueue.pop()
                if (me.$maskQueue.length > 0) {
                    currentMask = me.$maskQueue.slice(me.$maskQueue.length - 1)[0]
                    me.zIndex = currentMask.$zIndex
                    return
                }
                me.hidden = true
                avalon.unbind(window, 'resize', me.windowResize)
            }
        })
        vmodel.newMask.apply(vmodel,[mask])
        bizui.currentMask = vmodel
        avalon.nextTick(function () {
            vmodel.width = avalon(window).width()
            vmodel.height=avalon(window).height()
            $element.attr('id', maskId)
            $element.addClass('x-mask')
            $element.attr('ms-css-left', 'left')
            $element.attr('ms-css-top', 'top')
            $element.attr('ms-css-width', 'width')
            $element.attr('ms-css-height', 'height')
            $element.attr('ms-visible', '!hidden')
            $element.attr('ms-css-z-index', 'zIndex')
            avalon.scan(element, [vmodel].concat(vmodels))
        })
        return vmodel
    }
})