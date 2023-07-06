// AIzaSyCKU5ZC6HaBS3gy7d9qv0tPWDfCe-0Almc   AIzaSyA9ZWsce4gu_lZzeApYsPKF36-d4XLnRLc

let apiKey= "AIzaSyCKU5ZC6HaBS3gy7d9qv0tPWDfCe-0Almc";
let searchInput =document.getElementById("searchInput")
let content = document.getElementById("content");
let buttonContainer =document.getElementById("button-container");
let videoData=[];
async function loadCategories(){
    buttonContainer.innerHTML=""
    var categoryIds = '1,2,10,20,24,17,25,28,27,23,19,15,26';
    let url = `https://www.googleapis.com/youtube/v3/videoCategories?part=snippet&id=${categoryIds}&key=${apiKey}`
    let response = await fetch(url);
    let data = await response.json()
    console.log(data);
    let buttonContainerString ="";
    buttonContainerString += `<div class="chip all" data-id="1,2,10,20,24,17,25,28,27,23,19,15,26">All</div>`
    
    data.items.forEach((category)=>{
        buttonContainerString += ` <div class="chip" data-id=${category.id}>${category.snippet.title}</div>`
    })
    buttonContainer.innerHTML=buttonContainerString;
    getId()

}

loadCategories()
async function getChanelLogo(chanelId){
    let url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${chanelId}&key=${apiKey}`;
    let response = await fetch(url);
    let data = await response.json();
    console.log(data);
    return data.items[0].snippet.thumbnails.medium.url
}
async function getViewCount(videoId){
    let url =`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${apiKey}`
    let response = await fetch(url);
    let data = await response.json();
    console.log(data)
    return data.items[0].statistics.viewCount;
}
function getDays(publishTime){
    const pastDate = new Date(publishTime);
    const currentDate = new Date();
    const timeDiff = Math.abs(currentDate - pastDate);
    const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

    // console.log('Days difference:', daysDiff);
    return daysDiff;
}
// getDays('2023-06-11T05:40:12Z')
// let logo = getChanelLogo("UCq-Fj5jknLsUf-MWSy4_brA");
// getViewCount("_lRmEd9qasU")
// console.log(logo)
async function loadVideoCategoriesWise(id){
    let url=`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=2&q=&type=video&videoCategoryId=${id}&key=${apiKey}`;
    let response = await fetch(url);
    let data = await response.json()
    console.log(data);
    content.innerHTML="";
    let contentString="";
    let item = data.items;
    function f(){
            return new Promise((resolve,reject)=>{
                async function f2(){
                    for(let i=0;i<item.length;i++){
                        let videoId= item[i].id.videoId;
                        let thumbnil =item[i].snippet.thumbnails.medium.url;
                        let chanelTitle = item[i].snippet.channelTitle;
                        let title = item[i].snippet.title;
                        let publishTime= item[i].snippet.publishedAt;
                        let days = getDays(publishTime);
                        let chanelId= item[i].snippet.channelId
                        let chnaelLogo = await getChanelLogo(chanelId)
                        console.log(chnaelLogo)
                        let viewCount = Math.floor(await getViewCount(videoId)/1000)

                        content.innerHTML += `<div class="video-carddd" data-id="${videoId}">
                            <div class="thumbnil-container">
                                <img class="thumbnil" src="${thumbnil}" alt="">
                                <iframe class="iframe" src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playlist=${videoId}&loop=1&controls=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                            </div>
                            <div class="about-video">
                                    <img class="logo" src="${chnaelLogo}" alt="">
                                    <div class="title">
                                        <h3>${title}</h3>
                                        <div class="chanel-name">
                                            <div>${chanelTitle}</div>
                                            <div class="statisticssss">
                                                <div>${viewCount}K views</div>
                                                <div>${days} days ago</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>`
                    }
                    resolve();
                }
                f2()
            })
       
    }
    // console.log("name")
    // content.innerHTML=contentString;
    f()
    .then(selectVideoToPlay2)
}
loadVideoCategoriesWise(1,2,10,20,24,17,25,28,27,23,19,15,26)


function selectVideoToPlay2(){
    console.log("2")
    let videoCards = document.querySelectorAll(".video-carddd");
    for(let i=0;i<videoCards.length;i++){
        videoCards[i].addEventListener('click',(e)=>{
            e.preventDefault();
            let dataId = videoCards[i].getAttribute('data-id');

            localStorage.setItem("currentVideoId",JSON.stringify(dataId))
            let link = document.createElement("a");
            link.href='./play.html';
            link.target="_self";
            link.click();
            document.removeChild(link);
        })
        videoCards[i].addEventListener('mouseenter',()=>{
            let currentVideo = videoCards[i].children[0].children[1];
            let currentThubnil = videoCards[i].children[0].children[0];
            // console.log(currentVideo,currentThubnil)
            currentThubnil.style.display = "none";
            currentVideo.style.display = "block";
            // currentVideo.play()

        })
        videoCards[i].addEventListener('mouseleave',()=>{
            let currentVideo = videoCards[i].children[0].children[1];
            let currentThubnil = videoCards[i].children[0].children[0];
            // console.log(currentVideo,currentThubnil)
            currentThubnil.style.display = "block";
            currentVideo.style.display = "none";
            // currentVideo.click()

        })
    }
}

async function getId(){
let chips = document.querySelectorAll(".chip");
    chips[0].addEventListener('click',(e)=>{
        e.preventDefault();
        loadVideoCategoriesWise(1,2,10,20,24,17,25,28,27,23,19,15,26);
        chips[0].style.backgroundColor="black";
        chips[0].style.color = "white"
        for(let i=1;i<chips.length;i++){
            chips[i].style.backgroundColor="whitesmoke";
            chips[i].style.color = "black";
        }
    })
    console.log(chips)
    for(let i=1;i<chips.length;i++){
        chips[i].addEventListener('click',(e)=>{
            e.preventDefault();
            // console.log("name")
            let dataId = chips[i].getAttribute('data-id')
            console.log(dataId)
            for(let j=0;j<chips.length;j++){
                if(j!=i){
                    chips[j].style.backgroundColor="whitesmoke";
                    chips[j].style.color = "black";
                }else{
                    chips[j].style.backgroundColor="black";
                    chips[j].style.color = "white"
                }
            }
            loadVideoCategoriesWise(dataId)
            
        })
    }
    
}
async function loadVideoData(videoId){
    let part = "statistics,snippet"
    let id =videoId;

    let url= `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${id}&part=${part}`;
    let response=await fetch(url);
    let data=  await response.json();
    videoData.push(data)
}

document.getElementById("searchButton").addEventListener('click',(e)=>{
    e.preventDefault();

    loadDAta(searchInput.value)
})

async function loadDAta(searchString){
    let url = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${searchString}&type=video&maxResults=24`;
    let response = await fetch(url);
    let data = await response.json();
 
    let videoItems =data.items.map((video)=>{
        return video.id.videoId;
    })
    // console.log(videoItems)
    // localStorage.setItem("videoItems",JSON.stringify(videoItems))
  
    videoData=[]
    let promisesList = videoItems.map((videoId) => loadVideoData(videoId));


    let finalPromise = Promise.all(promisesList);
    finalPromise
    .then(renderData)
    .catch((error)=>alert("something went wrong"))
}


function renderData(){
    let videos="";
    let videoItems=[]
    content.innerHTML=""
    console.log(videoData)
    videoData.forEach((video)=>{
        videos +=`<div class="video-card" id="${video.items[0].id}">
        <div class="thumbnil-container">
            <img class="thumbnil" src="${video.items[0].snippet.thumbnails.medium.url}" alt="">
            <iframe class="iframe" src="https://www.youtube.com/embed/${video.items[0].id}?autoplay=1&mute=1&playlist=${video.items[0].id}&loop=1&controls=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
        <h3>${video.items[0].snippet.title}</h3>
        <div>${video.items[0].snippet.channelTitle}</div>
        <div class="statistics">
            <div>likes: ${Math.floor(video.items[0].statistics.likeCount/1000)}K</div>
            <div>Comments: ${video.items[0].statistics.commentCount}</div>
            <div>${Math.floor(video.items[0].statistics.viewCount)}K Views</div>
        </div>
      </div>`
      videoItems.push(video.items[0].id)
    })
    content.innerHTML=videos
    console.log(videoItems)
    localStorage.setItem("videoItems",JSON.stringify(videoItems))
    selectVideoToPlay()
}

function selectVideoToPlay(){
    let videoCard = document.querySelectorAll(".video-card");
    for(let i=0;i<videoCard.length;i++){
        videoCard[i].addEventListener('click',(e)=>{
            e.preventDefault();
            let videoItems = JSON.parse(localStorage.getItem("videoItems"));
            console.log(videoItems)
            console.log(videoItems[i])
            localStorage.setItem("currentVideoId",JSON.stringify(videoCard[i].id))
            videoItems.splice(i,1)
            localStorage.setItem("updatedVideoItems",JSON.stringify(videoItems));

            let link = document.createElement("a");
            link.href='./play.html';
            link.target="_self";
            link.click();
            document.removeChild(link);
        })
        videoCard[i].addEventListener('mouseenter',()=>{
            let currentVideo = videoCard[i].children[0].children[1];
            let currentThubnil = videoCard[i].children[0].children[0];
            // console.log(currentVideo,currentThubnil)
            currentThubnil.style.display = "none";
            currentVideo.style.display = "block";
            // currentVideo.play()

        })
        videoCard[i].addEventListener('mouseleave',()=>{
            let currentVideo = videoCard[i].children[0].children[1];
            let currentThubnil = videoCard[i].children[0].children[0];
            // console.log(currentVideo,currentThubnil)
            currentThubnil.style.display = "block";
            currentVideo.style.display = "none";
            // currentVideo.click()

        })
    }
}


/*
    Response of all Categoty by a string of ids 
{
    "kind": "youtube#videoCategoryListResponse",
    "etag": "ueYeg4YFwMBo0vJ8NJ03r-enP18",
    "items": [
        {
            "kind": "youtube#videoCategory",
            "etag": "grPOPYEUUZN3ltuDUGEWlrTR90U",
            "id": "1",
            "snippet": {
                "title": "Film & Animation",
                "assignable": true,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "Q0xgUf8BFM8rW3W0R9wNq809xyA",
            "id": "2",
            "snippet": {
                "title": "Autos & Vehicles",
                "assignable": true,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "qnpwjh5QlWM5hrnZCvHisquztC4",
            "id": "10",
            "snippet": {
                "title": "Music",
                "assignable": true,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "HyFIixS5BZaoBdkQdLzPdoXWipg",
            "id": "15",
            "snippet": {
                "title": "Pets & Animals",
                "assignable": true,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "PNU8SwXhjsF90fmkilVohofOi4I",
            "id": "17",
            "snippet": {
                "title": "Sports",
                "assignable": true,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "ANnLQyzEA_9m3bMyJXMhKTCOiyg",
            "id": "19",
            "snippet": {
                "title": "Travel & Events",
                "assignable": true,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "0Hh6gbZ9zWjnV3sfdZjKB5LQr6E",
            "id": "20",
            "snippet": {
                "title": "Gaming",
                "assignable": true,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "3Uz364xBbKY50a2s0XQlv-gXJds",
            "id": "23",
            "snippet": {
                "title": "Comedy",
                "assignable": true,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "0srcLUqQzO7-NGLF7QnhdVzJQmY",
            "id": "24",
            "snippet": {
                "title": "Entertainment",
                "assignable": true,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "bQlQMjmYX7DyFkX4w3kT0osJyIc",
            "id": "25",
            "snippet": {
                "title": "News & Politics",
                "assignable": true,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "Y06N41HP_WlZmeREZvkGF0HW5pg",
            "id": "26",
            "snippet": {
                "title": "Howto & Style",
                "assignable": true,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "yBaNkLx4sX9NcDmFgAmxQcV4Y30",
            "id": "27",
            "snippet": {
                "title": "Education",
                "assignable": true,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        },
        {
            "kind": "youtube#videoCategory",
            "etag": "Mxy3A-SkmnR7MhJDZRS4DuAIbQA",
            "id": "28",
            "snippet": {
                "title": "Science & Technology",
                "assignable": true,
                "channelId": "UCBR8-60-B28hp2BmDPdntcQ"
            }
        }
    ]
}
 */


/*

{
    "kind": "youtube#searchListResponse",
    "etag": "T9ANdF4Qj_XcD8wPN22zUJJkk-s",
    "nextPageToken": "CAIQAA",
    "regionCode": "IN",
    "pageInfo": {
        "totalResults": 1000000,
        "resultsPerPage": 2
    },
    "items": [
        {
            "kind": "youtube#searchResult",
            "etag": "QFQwxMxVbjbrO1e-7L4UHOO37hk",
            "id": {
                "kind": "youtube#video",
                "videoId": "EywX_uxreYA"
            },
            "snippet": {       
                "publishedAt": "2023-06-11T05:40:12Z",
                "channelId": "UCq-Fj5jknLsUf-MWSy4_brA",
                "title": "ANIMAL Pre-Teaser | Ranbir Kapoor | Sandeep Reddy Vanga | Bhushan Kumar | 11th August 2023",
                "description": "Presenting the Pre-Teaser of ANIMAL Worldwide Release on 11th August 2023 In Cinemas in Hindi, Telugu, Tamil, Kannada ...",
                "thumbnails": {
                    "default": {
                        "url": "https://i.ytimg.com/vi/EywX_uxreYA/default.jpg",
                        "width": 120,
                        "height": 90
                    },
                    "medium": {
                        "url": "https://i.ytimg.com/vi/EywX_uxreYA/mqdefault.jpg",
                        "width": 320,
                        "height": 180
                    },
                    "high": {
                        "url": "https://i.ytimg.com/vi/EywX_uxreYA/hqdefault.jpg",
                        "width": 480,
                        "height": 360
                    }
                },
                "channelTitle": "T-Series",
                "liveBroadcastContent": "none",
                "publishTime": "2023-06-11T05:40:12Z"
            }
        },
        {
            "kind": "youtube#searchResult",
            "etag": "5UjApyLTWZddXzNSUfgoyJIudGU",
            "id": {
                "kind": "youtube#video",
                "videoId": "_lRmEd9qasU"
            },
            "snippet": {
                "publishedAt": "2023-06-15T22:00:09Z",
                "channelId": "UCqFhfan_P2AmGVB1X2B-3Aw",
                "title": "Farruko - Pasa_je_ro (Official Music Video)",
                "description": "Farruko - Pasa_je_ro (Official Music Video) Disponible en todas las plataformas digitales! https://Farruko.lnk.to/pasa_je_ro For ...",
                "thumbnails": {
                    "default": {
                        "url": "https://i.ytimg.com/vi/_lRmEd9qasU/default.jpg",
                        "width": 120,
                        "height": 90
                    },
                    "medium": {
                        "url": "https://i.ytimg.com/vi/_lRmEd9qasU/mqdefault.jpg",
                        "width": 320,
                        "height": 180
                    },
                    "high": {
                        "url": "https://i.ytimg.com/vi/_lRmEd9qasU/hqdefault.jpg",
                        "width": 480,
                        "height": 360
                    }
                },
                "channelTitle": "Farruko",
                "liveBroadcastContent": "none",
                "publishTime": "2023-06-15T22:00:09Z"
            }
        }
    ]
}

*/

/*
 for Getting Logo of Chanel
{
    "kind": "youtube#channelListResponse",
    "etag": "TlYsWCPmZ_A_6JXUsAD66jS8SUo",
    "pageInfo": {
        "totalResults": 1,
        "resultsPerPage": 5
    },
    "items": [
        {
            "kind": "youtube#channel",
            "etag": "9UsXD0DUmPE-RF04ULaxYDsq1Xo",
            "id": "UCq-Fj5jknLsUf-MWSy4_brA",
            "snippet": {
                "title": "T-Series", items[0].snippet.thumbnails.medium.url
                "description": "\"Music can change the world\". T-Series is India's largest Music Label & Movie Studio, believes in bringing world close together through its music.\nT-Series is associated with music industry from past three decades, having ample catalogue of music comprising plenty of languages that covers the length & breadth of India. We believe after silence, nearest to expressing the inexpressible is Music. So, all the music lovers who believe in magic of music come join us and live the magic of music with T-Series.",
                "customUrl": "@tseries",
                "publishedAt": "2006-03-13T14:27:05Z",
                "thumbnails": {
                    "default": {
                        "url": "https://yt3.ggpht.com/y1F4EOGuP19nZcBlzcyCtnHiYhkAOPQiRxwKeaGrOjXarUZZjcx_heiDiC06_Qj6ERea_qWK9A=s88-c-k-c0x00ffffff-no-rj",
                        "width": 88,
                        "height": 88
                    },
                    "medium": {
                        "url": "https://yt3.ggpht.com/y1F4EOGuP19nZcBlzcyCtnHiYhkAOPQiRxwKeaGrOjXarUZZjcx_heiDiC06_Qj6ERea_qWK9A=s240-c-k-c0x00ffffff-no-rj",
                        "width": 240,
                        "height": 240
                    },
                    "high": {
                        "url": "https://yt3.ggpht.com/y1F4EOGuP19nZcBlzcyCtnHiYhkAOPQiRxwKeaGrOjXarUZZjcx_heiDiC06_Qj6ERea_qWK9A=s800-c-k-c0x00ffffff-no-rj",
                        "width": 800,
                        "height": 800
                    }
                },
                "localized": {
                    "title": "T-Series",
                    "description": "\"Music can change the world\". T-Series is India's largest Music Label & Movie Studio, believes in bringing world close together through its music.\nT-Series is associated with music industry from past three decades, having ample catalogue of music comprising plenty of languages that covers the length & breadth of India. We believe after silence, nearest to expressing the inexpressible is Music. So, all the music lovers who believe in magic of music come join us and live the magic of music with T-Series."
                },
                "country": "IN"
            }
        }
    ]
}


 */

/*
for getting viewCount,
{
    "kind": "youtube#videoListResponse",
    "etag": "DNSCnrnbIgzuS8zUM-K_c1r29dA",
    "items": [    items[0].statistics.viewCount
        {
            "kind": "youtube#video",
            "etag": "T5hLKHTMhaEnElmzrHw8hZTqCuM",
            "id": "_lRmEd9qasU",
            "statistics": {
                "viewCount": "1042767",
                "likeCount": "26462",
                "favoriteCount": "0",
                "commentCount": "1370"
            }
        }
    ],
    "pageInfo": {
        "totalResults": 1,
        "resultsPerPage": 1
    }
}
*/

/*
data.items.forEach(async (video)=>{
            let videoId= video.id.videoId;
            let thumbnil = video.snippet.thumbnails.medium.url;
            let chanelTitle = video.snippet.channelTitle;
            let title = video.snippet.title;
            let publishTime= video.snippet.publishedAt;
            let days = getDays(publishTime);
            let chanelId= video.snippet.channelId
            let chnaelLogo = await getChanelLogo(chanelId)
            console.log(chnaelLogo)
            let viewCount = Math.floor(await getViewCount(videoId)/1000)
    
            content.innerHTML += `<div class="video-carddd" data-id="${videoId}">
            <img class="thumbnil" src="${thumbnil}" alt="">
            <div class="about-video">
                    <img class="logo" src="${chnaelLogo}" alt="">
                    <div class="title">
                        <h3>${title}</h3>
                        <div class="chanel-name">
                            <div>${chanelTitle}</div>
                            <div class="statisticssss">
                                <div>${viewCount}K views</div>
                                <div>${days} days ago</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`
        })

*/