// set up basic variables for app

const record = document.querySelector(".record");
const stop = document.querySelector(".stop");
const soundClips = document.querySelector(".sound-clips");
const canvas = document.querySelector(".visualizer");
const mainSection = document.querySelector(".main-controls");
// const blob2 = new Blob( [],{ 'type' : 'audio/wav' });

// disable stop button while not recording

stop.disabled = true;

// visualiser setup - create web audio api context and canvas

let audioCtx;
const canvasCtx = canvas.getContext("2d");

//main block for doing the audio recording

if (navigator.mediaDevices.getUserMedia) {
  console.log("getUserMedia supported.");

  const constraints = { audio: true };
  let chunks = [];

  let onSuccess = function (stream) {
    const mediaRecorder = new MediaRecorder(stream);

    visualize(stream);

    record.onclick = function () {
      mediaRecorder.start();
      console.log(mediaRecorder.state);
      console.log("recorder started");
      record.style.background = "red";

      stop.disabled = false;
      record.disabled = true;
    };

    stop.onclick = function () {
      mediaRecorder.stop();
      console.log(mediaRecorder.state);
      console.log("recorder stopped");
      record.style.background = "";
      record.style.color = "";
      // mediaRecorder.requestData();

      stop.disabled = true;
      record.disabled = true;
    };
    //여기가 record stop지점
    mediaRecorder.onstop = function (e) {
      console.log("data available after MediaRecorder.stop() called.");

      // const clipName = prompt('Enter a name for your sound clip?','My unnamed clip');

      const clipContainer = document.createElement("article");
      const clipLabel = document.createElement("p");
      const audio = document.createElement("audio");
      const deleteButton = document.createElement("button");

      // clipContainer.classList.add('clip');
      audio.setAttribute("controls", "");
      deleteButton.textContent = "Delete";
      deleteButton.className = "delete";

      clipContainer.appendChild(audio);
      // clipContainer.appendChild(deleteButton);
      soundClips.appendChild(clipContainer);
      console.log("chunks: ", chunks);
      audio.controls = true;
      const blob = new Blob(chunks, { type: "audio/wav" });
      // blob2= blob.slice();
      // blob2=new Blob([blob],{ 'type' : 'audio/wav' });

      chunks = [];
      const audioURL = window.URL.createObjectURL(blob);
      audio.src = audioURL;
      console.log("recorder stopped");
      console.log("audioURL : ", audioURL);
      console.log("blob.text() : ", blob.text());
      console.log("blob : ", blob);

      var fd = new FormData();
      // fd.enctype = "multipart/form-data";
      fd.append("fname", "test.wav");
      fd.append("data", blob);
      fd.append("sentence", sentence);
      // fd.append("sentence", sentence);
      console.log("fname: ", fd.get("fname"));

      console.log("sentence : ", sentence);
      console.log("fd : ", fd);

      console.log("-----------------");
      for (var pair of fd.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }

      $.ajax({
        type: "POST",
        enctype: "multipart/form-data",
        url: `/api/test`,
        data: fd,
        processData: false,
        contentType: false,
        success: function (data) {
          console.log("성공!");
          score = data["score"];
          sentence = data["sentence"];
          console.log("score: ", score);
          console.log("sentence: ", sentence);

          localStorage.setItem("score", score);
          localStorage.setItem("sentence", sentence);
          console.log(
            "localStroage.getItem('score'): ",
            localStorage.getItem("score")
          );
          // alert(data);
        },
        error: function (request, status, error) {
          console.log("실패!");
          alert(this.responseText);
        },
      }).done(function (data) {
        console.log(data);
      });

      clipLabel.onclick = function () {
        const existingName = clipLabel.textContent;
        // const newClipName = prompt('냐냐냐냐냐 Enter a new name for your sound clip?');
        if (newClipName === null) {
          clipLabel.textContent = existingName;
        } else {
          clipLabel.textContent = newClipName;
        }
      };
    };

    mediaRecorder.ondataavailable = function (e) {
      chunks.push(e.data);
    };
  };

  let onError = function (err) {
    console.log("The following error occured: " + err);
  };

  navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
} else {
  console.log("getUserMedia not supported on your browser!");
}

function visualize(stream) {
  console.log("visualize 실행~!");
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }

  const source = audioCtx.createMediaStreamSource(stream);

  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  source.connect(analyser);
  //analyser.connect(audioCtx.destination);

  draw();

  function draw() {
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = "rgb(200, 200, 200)";
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = "rgb(0, 0, 0)";

    canvasCtx.beginPath();

    let sliceWidth = (WIDTH * 1.0) / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      let v = dataArray[i] / 128.0;
      let y = (v * HEIGHT) / 2;

      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();
  }
}

window.onresize = function () {
  canvas.width = mainSection.offsetWidth;
};

window.onresize();

// function see_result(){
// //   var fd = new FormData();
// // fd.append('fname', 'test.wav');
// // fd.append('data', blob2);
// // fd.append('sentence',sentence);
// //   console.log("see_result 함수 실행!");
// //   console.log("sentence : ",sentence);

// //   $.ajax({
// //     type: "POST",
// //     url: `/api/test`,
// //     data: fd,
// //     success: function (response) {
// //         alert("성공하였습니다!");
// //         // window.location.href = "/html/voca.html"
// //     }
// // });
//   window.location.href = '/html/result.html';
// }
