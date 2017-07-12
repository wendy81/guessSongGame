/*
* 计算图片的宽高与显示窗口宽高对比
* params originalWidth,originalHeight  图片的原始宽度,高度
* params windowWidth,windowHeight  窗口宽度,高度
* params autoWidth,autoHeight  自动计算宽度,高度
* params autoWidth,autoHeight  自动计算宽度,高度
*/

function imagesWh(e){
    //获取图片的原始长宽
    var originalWidth = e.detail.width;
    var originalHeight = e.detail.height;
    var windowWidth = 0,windowHeight = 0;
    var autoWidth = 0,autoHeight = 0;
    var results= {};
    wx.getSystemInfo({
      success: function(res) {
      	// 窗口的宽高
        windowWidth = res.windowWidth;
        windowHeight = res.windowHeight;
        //判断按照那种方式进行缩放
        // if(originalWidth > windowWidth){//在图片width大于手机屏幕width时候
        //   autoWidth = windowWidth;
        //   autoHeight = (autoWidth*originalHeight)/originalWidth;
        //   results.imageWidth = autoWidth/2 -20;
        //   results.imageheight = autoHeight;
        // }else{//否则展示原来的数据
        //   autoHeight = (windowWidth*originalHeight)/originalWidth;
        //   results.imageWidth = autoWidth/2 -20;
        //   results.imageheight = autoHeight;
        // }
        results.imageWinHeight = (windowWidth*originalHeight)/originalWidth;         
        results.imageWidth = windowWidth/2 - 15;
        results.imageheight = ((windowWidth/2 -20)*originalHeight)/originalWidth;        
        results.winHeight = windowHeight;
        results.winWidth = windowWidth;
      }
    })
    return results;
}

exports.imagesWh = imagesWh;