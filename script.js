
document.querySelectorAll(".custom-track").forEach((player) => {

    const audio = player.querySelector("audio");
    const playBtn = player.querySelector(".play-btn");
    const progress = player.querySelector(".progress");
    const currentTime = player.querySelector(".current-time");
    const duration = player.querySelector(".duration");

    function formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60)
            .toString()
            .padStart(2, "0");

        return `${min}:${sec}`;
    }

    audio.addEventListener("loadedmetadata", () => {
        duration.textContent = formatTime(audio.duration);
    });

    playBtn.addEventListener("click", () => {

        if (audio.paused) {

            document.querySelectorAll("audio").forEach((otherAudio) => {
                if (otherAudio !== audio) {
                    otherAudio.pause();
                }
            });

            audio.play();
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
    });

});
const previewAudio = document.getElementById("preview-audio");
const previewBtn = document.getElementById("preview-btn");

if (previewAudio && previewBtn) {

    previewBtn.addEventListener("click", async () => {

        if (previewAudio.paused) {

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
