//playlists
//获取应用实例
const app = getApp();
const config = require('../../config.js');
const host = config.host;
const imagesWh = require('../../utils/imagesWh.js');

//函数放到外部文件
const fun = require('../../utils/playlistinfo-fun.js');
const throttleFunc = fun.throttleFunc;
const musicPlay = fun.musicPlay;
const clickOrAutoPlayMusic = fun.clickOrAutoPlayMusic;
const animate = fun.animate;
const animateReset = fun.animateReset;
const audioMusicName = fun.audioMusicName;

Page({
    data: {
        playlist: null,
        tracks: null,
        imageWinWindth: null,
        imageWinHeight: null,
        winWidth: null,
        winHeight: null,
        trackHref: null,
        token: null,
        playBtnCss: 'fa-play',
        audiosrc: null,
        musicName: null,
        musicArtist: null,
        albumImg: null,
        playBtnEvent: 'playClickEvent',
        musicActive: '',
        isClickMusic: false,
        curMusicIndex: 0,
        scrollTop: 0,
        animationData: {},
        rotateAng: 1000
    },
    onReady: function(e) {
        // 使用 wx.createAudioContext 获取 audio 上下文 context
        this.audioCtx = wx.createAudioContext('myAudio');
        this.backgroundAudioManager = wx.getBackgroundAudioManager();
    },
    onShow: function(e) {
        let that = this;
        var animation = wx.createAnimation({
            duration: 30000,
            timingFunction: 'linear',
            transformOrigin: "50% 50% 0"
        })
        this.animation = animation;
        animate(that, animation)
    },
    onLoad: function(option) {
        let href = option.href;
        let token = option.token;
        this.setData({
            token: token
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
                let that = this;
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
                itmesFilter.map((v, i) => {
                        v.musicName = audioMusicName(v.track.name);
                        if (i === 0) {
                            v.track.active = 'musicActive';
                        } else {
                            v.track.active = '';
                        }
                    })
                    /*
                     * 点击playlist进入后,自动播放第一行音乐
                     */
                this.setData({
                    playlist: playListArry,
                    tracks: itmesFilter,
                    playBtnCss: 'fa-pause',
                    audiosrc: itmesFilter[0].track.preview_url,
                    musicName: itmesFilter[0].musicName,
                    musicArtist: itmesFilter[0].track.album.artists[0].name,
                    albumImg: itmesFilter[0].track.album.images[2].url,
                    playBtnEvent: 'pauseClickEvent',
                })
                throttleFunc(musicPlay, that);
            }
        })
    },
    imagebindload: function(e) {
        /*
         * 获得数据中第一个图片的宽,高  赋值给 {imageWidth: ,imageheight}
         */
        let imagesData = this.data.playlist;
        if (imagesData !== null) {
            let imagesZero = imagesData[0];
            if (imagesZero) {
                this.setData(imagesWh.imagesWh(e));
            }
        }
    },
    imageError: function(e) {
        console.log(e);
    },
    playClickEvent: function(e) {
        let tracks = this.data.tracks;
        let isClickMusic = this.data.isClickMusic;
        let that = this;
        //取得当前动画,设置播放动画       
        let animation = that.animation;
        animate(that, animation);
        /*
         * 如果点击音乐行,则显示当前行的音乐,如果没有点击,则初始播放第一行音乐，isClickMusic表示是否点击音乐行状态
         */
        if (!isClickMusic) {
            this.setData({
                playBtnCss: 'fa-pause',
                audiosrc: tracks[0].track.preview_url,
                musicName: itmesFilter[0].musicName,
                musicArtist: itmesFilter[0].track.album.artists[0].name,
                playBtnEvent: 'pauseClickEvent',
            })
            throttleFunc(musicPlay, that);
        } else {
            let curMusicIndex = this.data.curMusicIndex;
            this.setData({
                playBtnCss: 'fa-pause',
                audiosrc: tracks[curMusicIndex].track.preview_url,
                musicName: itmesFilter[curMusicIndex].musicName,
                musicArtist: itmesFilter[curMusicIndex].track.album.artists[0].name,
                playBtnEvent: 'pauseClickEvent',
            })
            throttleFunc(musicPlay, that);
        }
    },
    pauseClickEvent: function(e) {
        let that = this;
        let animation = that.animation;
        that.audioCtx.pause();
        that.setData({
                playBtnCss: 'fa-play',
                playBtnEvent: 'playClickEvent'
            })
            //点击pause时,旋转角度停在当前的角度,起作用的是step-end
            //动画一直保持开始状态，最后一帧跳到结束状态
        animation.rotate(0).step({
            timingFunction: 'step-end'
        });
        that.setData({
            animationData: animation.export()
        })
    },
    audioEndedEvent: function(e) {
        //音乐播放完后,自动播放下一首音乐
        let that = this;
        let curMusicIndex = that.data.curMusicIndex;
        let index = curMusicIndex + 1;
        let data = that.data.tracks;
        let dataLength = data.length;
        //取得当前动画,设置播放动画
        let animation = that.animation;
        //先复位到0度,再重执行动画
        animateReset(that, animation)
        animate(that, animation);
        //如果音乐播放到最后,则重新开始播放index=0
        if (index < dataLength) {
            clickOrAutoPlayMusic(index, that);
        } else {
            let index = 0;
            clickOrAutoPlayMusic(index, that);
            this.setData({
                scrollTop: 0
            })
        }
    },
    musicClickEvent: function(e) {
        let that = this;
        //取得当前动画,设置播放动画       
        let animation = that.animation;
        let index = e.currentTarget.dataset.index;
        //复位animation对象到0度
        animateReset(that, animation)
        animate(that, animation);
        //点击自动播放音乐
        clickOrAutoPlayMusic(index, that);
    }
})