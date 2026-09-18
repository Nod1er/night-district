document.querySelectorAll(".custom-track").forEach((player) => {

    const audio = player.querySelector("audio");
    const playBtn = player.querySelector(".play-btn");
    const progress = player.querySelector(".progress");
    const currentTime = player.querySelector(".current-time");
    const duration = player.querySelector(".duration");

    function formatTime(seconds) {
        if (!isFinite(seconds)) return "0:00";

        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60)
            .toString()
            .padStart(2, "0");

        return `${min}:${sec}`;
    }

    audio.addEventListener("loadedmetadata", () => {
        duration.textContent = formatTime(audio.duration);
    });

    playBtn.addEventListener("click", async () => {

        if (audio.paused) {

            document.querySelectorAll(".custom-track").forEach((otherPlayer) => {
                const otherAudio = otherPlayer.querySelector("audio");
                const otherBtn = otherPlayer.querySelector(".play-btn");

                if (otherAudio !== audio) {
                    otherAudio.pause();
                    otherBtn.textContent = "▶";
                }
            });

            if (previewAudio && !previewAudio.paused) {
                previewAudio.pause();
                previewBtn.textContent = "▶ Preview";
            }

            await audio.play();
            playBtn.textContent = "❚❚";

        } else {

            audio.pause();
            playBtn.textContent = "▶";

        }

    });

    audio.addEventListener("timeupdate", () => {

        if (!audio.duration) return;

        progress.value =
            (audio.currentTime / audio.duration) * 100;

        currentTime.textContent =
            formatTime(audio.currentTime);

    });

    progress.addEventListener("input", () => {

        if (!audio.duration) return;

        audio.currentTime =
            (progress.value / 100) * audio.duration;

    });

    audio.addEventListener("ended", () => {
        playBtn.textContent = "▶";
        progress.value = 0;
        currentTime.textContent = "0:00";
    });

});


const previewAudio = document.getElementById("preview-audio");
const previewBtn = document.getElementById("preview-btn");

if (previewAudio && previewBtn) {

    previewBtn.addEventListener("click", async () => {

        if (previewAudio.paused) {

            document.querySelectorAll(".custom-track").forEach((player) => {
                const audio = player.querySelector("audio");
                const button = player.querySelector(".play-btn");

                audio.pause();
                button.textContent = "▶";
            });

            await previewAudio.play();
            previewBtn.textContent = "❚❚ Pause";

        } else {

            previewAudio.pause();
            previewBtn.textContent = "▶ Preview";

        }

    });

    previewAudio.addEventListener("ended", () => {
        previewBtn.textContent = "▶ Preview";
    });

}


// ===== Автоматические релизы с YouTube =====
const YOUTUBE_API_KEY = "AIzaSyC9knv7OqsclQv-nLR158uup8hzcGwFojw";
const YOUTUBE_HANDLE = "@night-district";
const VIDEOS_COUNT = 6;

async function loadYouTubeVideos() {
  const container = document.getElementById("youtube-videos");

  if (!container) return;

  try {
    // Находим канал и список его загрузок
    const channelUrl =
      "https://www.googleapis.com/youtube/v3/channels" +
      "?part=contentDetails" +
      "&forHandle=" + encodeURIComponent(YOUTUBE_HANDLE) +
      "&key=" + YOUTUBE_API_KEY;

    const channelResponse = await fetch(channelUrl);
    const channelData = await channelResponse.json();

    const uploadsPlaylistId =
      channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsPlaylistId) {
      throw new Error("Канал Night District не найден");
    }

    // Загружаем последние опубликованные видео
    const videosUrl =
      "https://www.googleapis.com/youtube/v3/playlistItems" +
      "?part=snippet,contentDetails" +
      "&playlistId=" + uploadsPlaylistId +
      "&maxResults=" + VIDEOS_COUNT +
      "&key=" + YOUTUBE_API_KEY;

    const videosResponse = await fetch(videosUrl);
    const videosData = await videosResponse.json();

    const videos = videosData.items || [];

    if (!videos.length) {
      container.innerHTML = "<p>На канале пока нет опубликованных видео.</p>";
      return;
    }

    container.innerHTML = videos
      .map((item) => {
        const videoId = item.contentDetails.videoId;
        const title = item.snippet.title;
        const image =
          item.snippet.thumbnails?.high?.url ||
          item.snippet.thumbnails?.medium?.url;

        return `
          <article class="youtube-card">
            <a
              href="https://www.youtube.com/watch?v=${videoId}"
              target="_blank"
              rel="noopener"
            >
              <img src="${image}" alt="${title}">
              <div class="youtube-card-content">
                <span>▶ YouTube</span>
                <h3>${title}</h3>
              </div>
            </a>
          </article>
        `;
      })
      .join("");
  } catch (error) {
    console.error("YouTube error:", error);
    container.innerHTML =
      "<p>Не удалось загрузить релизы. Попробуй позже.</p>";
  }
}

loadYouTubeVideos();
