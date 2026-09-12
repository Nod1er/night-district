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
