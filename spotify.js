console.log("Let's write JavaScript");
let currentSong = new Audio();
let currentSongIndex = 0;
let songs = [];
const play = document.getElementById("play");
const next = document.getElementById("next");
const previous = document.getElementById("previous");
const seekbar = document.getElementById("seekbar");

function formatTime(seconds) {
  seconds = Math.floor(seconds);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

async function getSongs() {
  let a = await fetch("./songss");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songss = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songss.push(element.href);
    }
  }
  return songss;
}

const playMusic = (track) => {
  currentSong.src = track;
  currentSong.play();
  play.src = "SVG/pause.svg";
  document.querySelector(".songinfo").innerHTML = track;
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
  seekbar.value = 0; // Reset seekbar when a new song starts
};

const playNextSong = () => {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  playMusic(songs[currentSongIndex]);
};

const playPreviousSong = () => {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  playMusic(songs[currentSongIndex]);
};

async function main() {
  songs = await getSongs();
  console.log(songs);

  let songUL = document.querySelector(".lists ul");
  for (const song of songs) {
    songUL.innerHTML += `
      <li>
        <img src="SVG/music.svg" class="invert">
        <div class="info">
          <div>${song.replaceAll("%20", " ")}</div>
          <div>Artist Name</div>
        </div>
        <div class="playnow flex">
          Play Now
          <img src="SVG/play.svg" class="invert">
        </div>
      </li>`;
  }

  Array.from(document.querySelectorAll(".lists li")).forEach((e, index) => {
    e.addEventListener("click", () => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      currentSongIndex = index;
      playMusic(songs[currentSongIndex]);
    });
  });

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "SVG/pause.svg";
    } else {
      currentSong.pause();
      play.src = "SVG/play.svg";
    }
  });

  next.addEventListener("click", playNextSong);
  previous.addEventListener("click", playPreviousSong);

  currentSong.addEventListener("timeupdate", () => {
    const currentTime = currentSong.currentTime;
    const duration = currentSong.duration;
    document.querySelector(".songtime").innerHTML = `${formatTime(
      currentTime
    )} / ${formatTime(duration)}`;
    
    const progressPercent = (currentTime / duration) * 100;
    seekbar.value = progressPercent; // Update seekbar as song plays
  });

  seekbar.addEventListener("input", () => {
    const seekTo = (seekbar.value / 100) * currentSong.duration;
    currentSong.currentTime = seekTo; // Seek to the selected time
  });
}

main();
