
  //frontend
const socket=io('/')
//rendering our video
const videoGrid = document.getElementById('video-grid')
const myPeer= new Peer(undefined,{
    host:'/',
    port:'3001'
})
const myVideo = document.createElement('video')
myVideo.muted = true;//mutes us
const peers={}
//to connect our video
navigator.mediaDevices.getUserMedia({ //allow us to get video and audio output from chrome

    video:true,
    audio:true//getusermedia is a promise ,promise is event in future either resloved or rejected,if we call it get resolved or else rejected
}).then(stream => {
addVideoStream(myVideo,stream)
//we need to listen when someone calls on mypeer object
myPeer.on('call',call => {
    call.answer(stream)//we answer their cal and send our stream
    const video=document.createElement('video')
    call.on('stream',userVideoStream => {
    addVideoStream(video,userVideoStream)
    })
})
//allowing ourselves to be connected to by other users
socket.on('user-connected',userId=> {
   connectToNewUser(userId, stream)
})
let text=$('input')

  $('html').keydown((e) => {
   if(e.which==13 && text.val().length !== 0){
     
       socket.emit('message',text.val());
       text.val('')
   }
  })
  socket.on('createMessage',message =>{
      console.log("Create message",message)
     $('.messages').append(`<li class="message"><b>user</b><br/>${message}</li>`)
  })
})//stream is our video and audio
socket.on('user-disconnected',userId =>{
   if (peers[userId]) peers[userId].close()
})

myPeer.on('open',id => {
    socket.emit('join-room',ROOM_ID, id)
})
function connectToNewUser(userId, stream){
   const call = myPeer.call(userId, stream);
  
    const video= document.createElement('video')
    call.on('stream',userVideoStream => {
 
    addVideoStream(video, userVideoStream);

    })
    call.on('close',() => {
        video.remove()
    })
    peers[userId]= call
}



//now we want to tell our object video to use that stream from promise
function addVideoStream(video,stream){
    video.srcObject = stream;//allow us to play our video
    video.addEventListener('loadedmetadata',() => {
            video.play();
        })
   videoGrid.append(video);
  }
