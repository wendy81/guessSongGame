/*
 * 函数节流
 */
function throttleFunc(method, that) {
    clearTimeout(method.tId);
    method.tId = setTimeout(function() {
        //设置一个定时器,一段时间后执行函数,如果中间有函数执行,则先清除该定时器
        method.call(that, that);
    }, 1000);
}

/*
 * 点击音乐行,播放当前行音乐
 */
function musicPlay(that) {
    that.audioCtx.play();
}

/*
 *  播放音乐,手动选择或者自动播放
 */
function clickOrAutoPlayMusic(index, that) {
    let tracks = that.data.tracks;
    let audiosrc = tracks[index].track.preview_url;
    let albumImg = tracks[index].track.album.images[2].url;
    tracks.map((v, i) => {
            if (i === index) {
                v.track.active = 'musicActive'
            } else {
                v.track.active = ''
            }
        })
        /*
         * 点击音乐行,改变当前行的样式和当前audio的播放地址
         */
    that.setData({
            tracks: tracks,
            playBtnCss: 'fa-pause',
            audiosrc: audiosrc,
            musicName: tracks[index].musicName,
            musicArtist: tracks[index].track.album.artists[0].name,
            albumImg: albumImg,
            playBtnEvent: 'pauseClickEvent',
            isClickMusic: true,
            curMusicIndex: index
        })
        /*
         * 当数据设置渲染后,过1000后再播放渲染后的音乐（如果不设置函数节流时,就会出现数据request把play()函数给阻断的情况下）
         */
    throttleFunc(musicPlay, that);
}

/*
 * 动画播放 
 */
function animate(that, animation) {
    let rotateAng = that.data.rotateAng;
    animation.rotate(rotateAng).step({
        duration: 39000,
        timingFunction: 'linear'
    })
    that.setData({
        animationData: animation.export()
    })
}
/*
 * 动画复位
 */
function animateReset(that, animation) {
    animation.rotate(0).step({
        duration: 0,
        transformOrigin: "50%,50%",
        timingFunction: 'linear'
    })
    that.setData({
        animationData: animation.export()
    })
}
/*
 * 得到音乐标题,判断标题是否有-或(),内容分开显示
 */
// function audioNameFun(that) {
//     let audioName = that.data.audioName;
//     if (audioName) {
//         let hasLine = audioName.indexOf('-');
//         let hasBrackets = audioName.indexOf('(');
//         let audioNameFront, audioNameBack;
//         if (hasLine !== -1) {
//             audioNameFront = audioName.substring(0, hasLine);
//             // audioNameBack = audioName.substring(hasLine + 1);
//         }
//         if (hasBrackets !== -1) {
//             audioNameFront = audioName.substring(0, hasBrackets);
//             // audioNameBack = audioName.substring(hasBrackets+1, audioName.length -1 );
//         } 
//         if( hasLine === -1 && hasBrackets === -1) {
//             audioNameFront = audioName;
//             // audioNameBack = '';            
//         }
//         that.setData({
//             audioNameFront: audioNameFront
//             // audioNameBack: audioNameBack
//         })
//     }
// }

/*
 * 得到音乐标题,判断标题是否有-或(),只显示符号前面的内容
 */
function audioMusicName(audioName) {
    let hasLine = audioName.indexOf('-');
    let hasBrackets = audioName.indexOf('(');
    let audioNameFront;
    if (hasLine !== -1) {
        audioNameFront = audioName.substring(0, hasLine);
    }
    if (hasBrackets !== -1) {
        audioNameFront = audioName.substring(0, hasBrackets);
    } 
    if( hasLine === -1 && hasBrackets === -1) {
        audioNameFront = audioName;
    }
    return audioNameFront;
}


export {
    throttleFunc,
    musicPlay,
    clickOrAutoPlayMusic,
    animate,
    animateReset,
    audioMusicName
};