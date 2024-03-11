console.log("lets write javascript")
let currentsong=new Audio()
let songs
let curr_folder
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getsongs(folder)
{
    curr_folder=folder
    let a=await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response= await a.text();
    console.log(response)
    let div=document.createElement("div")
    div.innerHTML=response;
    let as=div.getElementsByTagName("a")
    console.log(as)
    let songs= [ ]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if(element.href.endsWith(".mp3"))
        {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    let songul=document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML=" "
    for (const song  of songs) {
       songul.innerHTML=songul.innerHTML+
       `<li>
       <img class="invert" src="music.svg" alt=""><img>
       <div class="info">
       <div>${song.replaceAll("%20"," ")}</div>
       <div >Arijit Singh</div>
       </div>
       <span><img src="play.png" alt=""></span>
        </li>`
    }
    
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>
       {
           e.addEventListener("click",elements=>{
               playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
           })
       })
    return songs
}
const playmusic=(track)=>
{
    currentsong.src=`/${curr_folder}/`+ track
    playing.src="pause.svg"
    currentsong.play()
    document.querySelector(".songinfo").innerHTML=  track
    document.querySelector(".songtime").innerHTML=""
}

async function main()
{
 songs=await getsongs("songs/hits")
 console.log(songs)
 var audio=new Audio(songs[0])
 // audio.play()//
 
    playing.addEventListener("click",()=>
    {
        if(currentsong.paused)
        {
            currentsong.play()
            playing.src="pause.svg"
        }
        else{
            currentsong.pause()
            playing.src="play.png"
        }
    }) 
     //time update event//
     currentsong.addEventListener("timeupdate",()=>
     {
        console.log(currentsong.currentTime,currentsong.duration)
        document.querySelector(".songtime").innerHTML=`${formatTime(currentsong.currentTime)}/
        ${formatTime(currentsong.duration)}` 
        document.querySelector(".circle").style.left=(currentsong.currentTime/currentsong.duration)*100+"%"
     })
     // add ana event listener to seekbar
     document.querySelector(".seekbar").addEventListener("click",(e)=>
     {
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left=percent + "%"
        currentsong.currentTime=((currentsong.duration)*percent)/100
     })
     // add an event listener for hamburger//
     document.querySelector(".hamburger").addEventListener("click",()=>
     {
        document.querySelector(".left").style.left=0
     })
     // add event listener for close button//
     document.querySelector(".close").addEventListener("click",()=>
     {
        document.querySelector(".left").style.left=-120+"%"
     })
     // add an event listener to previois//
     previous.addEventListener("click",()=>
     {
        console.log("nextclicked")
        let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if(index-1>=0)
        {
            playmusic(songs[index-1].replaceAll("%20"," "))
        }

     })
     next.addEventListener("click",()=>
     {
        console.log("nextclicked")
        let index=songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if(index+1>length)
        {
            playmusic(songs[index+1].replaceAll("%20"," "))
        }

     })
     // add an event to volume button//
     document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>
     {
         console.log(e.target.value)
         currentsong.volume=parseInt(e.target.value)/100
     })
     // load playlist when card is clicked//
     Array.from(document.getElementsByClassName("card")).forEach(e=>
        {
               e.addEventListener("click",async items=>
               {
                   songs= await getsongs(`songs/${items.currentTarget.dataset.folder}`)
               })
        })
    }
    // mute and unmute the songs//
    document.querySelector(".volume>img").addEventListener("click",e=>
    {
        if(e.target.src.includes("volume.svg"))
        {
            e.target.src=e.target.src.replace("volume.svg","mute.svg")
            currentsong.volume=0
            document.querySelector(".range").getElementsByTagName("input")[0].value=0
        }
        else{
            e.target.src=e.target.src.replace("mute.svg","volume.svg")
            currentsong.volume=.10
            document.querySelector(".range").getElementsByTagName("input")[0].value=10
        }
    })
main()
