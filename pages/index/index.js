//playlists
//获取应用实例
const app = getApp();
const config = require('../../config.js');
const host = config.host;
const imagesWh = require('../../utils/imagesWh.js');


Page({
  data: {
    datas: null,
    userInfo: {},
    imageWidth: null,
    imageheight: null,
    token: null
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    // var that = this
    // //调用应用实例的方法获取全局数据
    // app.getUserInfo(function(userInfo){
    //   //更新数据
    //   that.setData({
    //     userInfo:userInfo
    //   })
    // })
    wx.request({
      url: host + '/',
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        let token = res.data;
        this.setData({
          token: token
        })
        if (this.data.token) {
          console.log(this.data.token)
          wx.request({
            url: 'https://api.spotify.com/v1/browse/featured-playlists',
            header: {
              'content-type': 'application/json',
              'Authorization': 'Bearer ' + this.data.token
            },
            success: (res) => {
              let data = res.data.playlists.items;
              console.log(data)
              this.setData({
                datas: data
              })
            }
          })
        }
      }
    })
  },
  imagebindload: function(e) {
    /*
     * 获得数据中第一个图片的宽,高  赋值给 {imageWidth: ,imageheight}
     */
    let imagesData = this.data.datas;
    let imagesZero = imagesData[0];
    if (imagesZero) {
      this.setData(imagesWh.imagesWh(e));
    }
  },
  imageError: function(e) {
    console.log(e);
  },
  clickPlay: function(e) {
    let currentHref = e.currentTarget.dataset.href;
    wx.navigateTo({
        url: '/pages/playlistinfo/playlistinfo?href=' + currentHref + '&token=' + this.data.token
      })
      // wx.request({
      //     url: currentHref,
      //     header: {
      //         'content-type': 'application/json',
      //         'Authorization': 'Bearer ' + this.data.token
      //     },
      //     success: (res) => {
      //         // let data = res.data.playlists.items;
      //         console.log(res)
      //         // this.setData({
      //         //     datas: data
      //         // })
      //     }
      // })
  }
})