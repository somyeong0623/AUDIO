const socket = io();

const myFace = document.getElementById("myFace");
const muteBtn = document.getElementById("mute");
const cameraBtn = document.getElementById("camera");
const camerasSelect = document.getElementById("cameras");
const call = document.getElementById("call");
call.hidden = true;

let myStream;
let muted = false;
let cameraOff = false;
let roomName;
let myPeerConnection;
let senders = [];

async function getCameras(){
    try{
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === "videoinput");
        const currentCamera = myStream.getVideoTracks()[0];
        cameras.forEach((camera) => {
            const option = document.createElement("option");
            option.value = camera.deviceId;
            option.innerText = camera.label;
            if(currentCamera.label == camera.label){
                option.selected = true;
            }
            camerasSelect.appendChild(option);
        })
    }catch(e){
        console.log(e);
    }
}

async function getMedia(deviceId){
    const initialConstraints = {
        audio: true,
        video: { facingMode: "user"},
    };
    const cameraConstraints = {
        audio: true,
        video: { deviceId: { exact: deviceId} },
    }
    try{
        myStream = await navigator.mediaDevices.getUserMedia(
            deviceId ? cameraConstraints : initialConstraints
        );
        
        myFace.srcObject = myStream;
        if(!deviceId){
            await getCameras();
        }        
    } catch(err){
        console.log(err);
    }
}

function handleMuteClick(){
    myStream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
    if(!muted){
        muteBtn.innerText = "Unmute";
        muted = true;
    } else{
        muteBtn.innerText = "Mute";
        muted = false;
    }
}

function handleCameraClick(){
    myStream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
    if(cameraOff){
        cameraBtn.innerText = "Turn Camera Off";
        cameraOff = false;
    } else{
        cameraBtn.innerText = "Turn Camera On";
        cameraOff = true;
    }
}

async function handleCameraChange(){
    await getMedia(camerasSelect.value);
    if(myPeerConnection){
        const videoTrack = myStream.getVideoTracks()[0];
        const videoSender = myPeerConnection
        .getSenders()
        .find((sender) => sender.track.kind === "video");
        videoSender.replaceTrack(videoTrack);
    }
}

muteBtn.addEventListener("click", handleMuteClick);
cameraBtn.addEventListener("click", handleCameraClick);
camerasSelect.addEventListener("input", handleCameraChange);

const roomList = document.getElementById("roomlist");
const roomBtn = roomList.querySelectorAll("button");
const quitBtn = document.getElementById("quit");

async function handleRoomClick(event){
    event.preventDefault();
    await initCall();
    const roomNum = event.target.innerText;
    socket.emit("join_room", roomNum);
    roomName = roomNum;
}

function handleLeaveClick(event){
    event.preventDefault();
    socket.emit("leave", roomName);
    roomList.hidden = false;
    call.hidden = true;
    const option = camerasSelect.querySelector("option");
    camerasSelect.removeChild(option);
    senders.forEach((sender) => {
        myPeerConnection.removeTrack(sender);
    });
    senders = [];
    myPeerConnection.close();
}

function setRoomBtnEvent(){
    roomBtn.forEach((b) => {
        b.addEventListener("click", handleRoomClick)
    });
}

setRoomBtnEvent();
quitBtn.addEventListener("click", handleLeaveClick);

async function initCall(){
    roomList.hidden = true;
    call.hidden = false;
    await getMedia();
    makeConnection();
}

//Socket Code

socket.on("welcome", async () => {
    const offer = await myPeerConnection.createOffer();
    myPeerConnection.setLocalDescription(offer);
    console.log("sent the offer");
    socket.emit("offer", offer, roomName);
});

socket.on("offer", async (offer) => {
    console.log("received the offer");
    myPeerConnection.setRemoteDescription(offer);
    const answer = await myPeerConnection.createAnswer();
    myPeerConnection.setLocalDescription(answer);
    socket.emit("answer", answer, roomName);
})

socket.on("answer", (answer) => {
    console.log("received the answer");
    myPeerConnection.setRemoteDescription(answer);
})

socket.on("ice", (ice) => {
    console.log("received candidate");
    myPeerConnection.addIceCandidate(ice);
})

// RTC Code

function makeConnection(){
    myPeerConnection = new RTCPeerConnection({
        iceServers: [
            {
                urls: [
                    "stun:stun.l.google.com:19302",
                    "stun:stun1.l.google.com:19302",
                    "stun:stun2.l.google.com:19302",
                    "stun:stun3.l.google.com:19302",
                    "stun:stun4.l.google.com:19302",
                ],
            },
        ]
    });
    myPeerConnection.addEventListener("icecandidate", handleIce);
    myPeerConnection.addEventListener("addstream", handleAddStream);
    myStream
    .getTracks()
    .forEach((track) => {
        senders.push(myPeerConnection.addTrack(track, myStream));
    });
}

function handleIce(data){
    console.log("send canditate");
    socket.emit("ice", data.candidate, roomName);
}

function handleAddStream(data){
    const peersFace = document.getElementById("peersFace");
    peersFace.srcObject= data.stream;
}