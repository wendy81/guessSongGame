//playlists
//获取应用实例
const app = getApp();
const config = require('../../config.js');
const host = config.host;
const imagesWh = require('../../utils/imagesWh.js');
Page({
    data: {
        playlist: null,
        tracks: null,
        imageWinWindth: null,
        imageWinHeight: null,
        trackHref: null,
        token:null
    },
    onLoad: function(option) {
        let href = option.href;
        let token = option.token;
        this.setData({
            token:token
        })
        wx.request({
            url: href,
            header: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + this.data.token
            },
            success: (res) => {
                console.log(res.data)
                let data = res.data;
                //获得playlist的封面相关信息
                let playListArry = [];
                let obj = {}
                obj.url = data.images[0].url;
                obj.description = data.description;
                obj.name = data.name;
                playListArry.push(obj);
                //获取tracks的相关信息
                let track = data.tracks;
                let itmes = track.items;
                let itmesFilter = itmes.filter(function(val) {
                    let preview_url = val.track.preview_url;
                    let name = val.track.name
                    return preview_url && name;
                });
                console.log(itmesFilter)
                this.setData({
                    playlist: playListArry,
                    tracks: itmesFilter
                })
                console.log(this.data.tracks)
            }
        })

    },
    imagebindload: function(e) {
        /*
         * 获得数据中第一个图片的宽,高  赋值给 {imageWidth: ,imageheight}
         */
        let imagesData = this.data.playlist;
        let imagesZero = imagesData[0];
        if (imagesZero) {
            this.setData(imagesWh.imagesWh(e));
        }
    },
    imageError: function(e) {
        console.log(e);
    }
    // playTrackEvent: function(e) {
    //     let index = e.target.dataset.index;
    //     let tracks = this.data.tracks;
    //     let currentHref = tracks[index].track.href;
    //     wx.request({
    //         url: currentHref,
    //         header: {
    //             'content-type': 'application/json',
    //             'Authorization': 'Bearer ' + this.data.token
    //         },
    //         success: (res) => {
    //            console.log(res)
    //         }
    //     })
    // }
})