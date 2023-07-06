let apiKey= "AIzaSyA9ZWsce4gu_lZzeApYsPKF36-d4XLnRLc";
let playingVideo = document.querySelector(".playing-video");
let sugestionVideo = document.querySelector(".sugestion-video");

let currentVideoId = JSON.parse(localStorage.getItem("currentVideoId"));
let videoData=[]
function playVideo(videoId){
    if(videoId!=undefined){
        currentVideoId =videoId
    }
    playingVideo.innerHTML=""
    let play=''
    console.log(currentVideoId)
    play =`<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${currentVideoId}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    playingVideo.innerHTML=play;
}

playVideo()

let videoItems = JSON.parse(localStorage.getItem("videoItems"))

async function loadVideoData(videoId){
    let part = "statistics,snippet"
    let id =videoId;

    let url= `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${id}&part=${part}`;
    let response=await fetch(url);
    let data=  await response.json();
    videoData.push(data)
}

function loadSuggestionVideo(){
    // let promisesList= [];
    videoData=[]
    let promisesList = videoItems.map((videoId) => loadVideoData(videoId));

    let finalPromise = Promise.all(promisesList);
    finalPromise
    .then(renderData)
    .catch((error)=>alert("something went wrong"))
}

function renderData(){
    let renderString ="";
    let videoItems=[]
    sugestionVideo.innerHTML=""
    videoData.forEach((video)=>{
        renderString += `<div class="video-card">
        <img src=${video.items[0].snippet.thumbnails.medium.url} alt="">
        <div class="title">
            <div>${video.items[0].snippet.title}</div>
            <div class="statistics">
                <div>likes: ${video.items[0].statistics.likeCount}</div>
                <div>Comments: ${video.items[0].statistics.commentCount}</div>
                <div>Views: ${video.items[0].statistics.viewCount}</div>
            </div>
        </div>
        </div>`
       
        videoItems.push(video.items[0].id)
        
    })
    localStorage.setItem("videoItems",JSON.stringify(videoItems))
    sugestionVideo.innerHTML=renderString;
    selectVideoToPlay()
}


function selectVideoToPlay() {
    let videoItems = JSON.parse(localStorage.getItem("videoItems"));
    let video = document.querySelectorAll(".video-card");
    for (let i = 0; i < video.length; i++) {
      (function (index) {
        video[index].addEventListener('click', (e) => {
          e.preventDefault();
          playVideo(videoItems[index]);
        });
      })(i);
    }
}
  
selectVideoToPlay()
loadSuggestionVideo()
