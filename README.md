# <sub><img src="public/favicon.png" width="30" ></sub> [vidsync](https://vidsync.netlify.app) 
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/stravo1/vidsync) ![GitHub commit activity](https://img.shields.io/github/commit-activity/m/stravo1/vidsync) ![GitHub last commit](https://img.shields.io/github/last-commit/stravo1/vidsync) ![Website](https://img.shields.io/website?down_message=offline&up_message=online&url=https%3A%2F%2Fvidsync.netlify.app%2F) 
  
watch videos together, in sync ;)  
create a room, invite a friend with the room-id, and that's it!  
enjoy a buffer-free watch-together session, completely in sync.  

_so what's the catch?_    
this app provides you with a synchronised video player. that's it!  
this means both the peers need to have the video files locally available[^1]. it is NOT screen sharing or streaming the video in anyway. both peers will play the video locally[^2] but the videos will be kept in sync via vidsync. 
  


#### highlights:
- a synchronised video player
- support for subtitles (for you weebs and k-drama fans)
- a chatbox to share live reactions
- voice calls (if chatbox wasn't enough) 
- cute illustrations while you wait for your friend to join

#### dependencies:
- svelte: the main compiler
- vite: the build tool
- firebase: webRTC signalling server using firestore

[^1]: you can download a large file when you have wifi and then watch it together on mobile data on the go. no more exhausting daily data limits :) 
[^2]: playing videos locally means there's no buffering, no streaming issues, no hiccups.
