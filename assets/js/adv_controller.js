const AD_LENGTH = 20;

const AD_FILES = [
  "assets/data/ads/a1.webm",
  "assets/data/ads/a2.webm",
  "assets/data/ads/a3.webm",
  "assets/data/ads/a4.webm",
];

class AdController {
  showingAd = false;

  /**
   * @type {number | null}
   */
  timerRef = null;

  timeRemaining = 0;

  constructor() {
    /**
     * @type {HTMLDialogElement}
     */
    this.adDialog = document.getElementById("adDialog");
    this.adCountdown = document.getElementById("adCountdown");

    /**
     * @type {HTMLVideoElement}
     */
    this.adVideo = document.getElementById("adVideo");

    this.adDialog.addEventListener("cancel", (event) => {
      event.preventDefault();
    });

    this.adDialog.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        event.preventDefault(); // Prevent the default ESC behavior
      }
    });
  }

  startAd() {
    this.showingAd = true;
    const randomVideo = AD_FILES[Math.floor(Math.random() * AD_FILES.length)];

    this.adVideo.src = randomVideo;
    this.adVideo.play();

    this.adDialog.showModal();
    this.timeRemaining = AD_LENGTH;
    this.timerRef = setInterval(this.#countdownTick.bind(this), 1000);
    this.#showTimeRemaining();
  }

  #countdownTick() {
    this.timeRemaining -= 1;

    this.#showTimeRemaining();

    if (this.timeRemaining <= 0) {
      this.#onEnd();
    }
  }

  #showTimeRemaining() {
    this.adCountdown.innerText = this.timeRemaining;
  }

  #onEnd() {
    if (this.timerRef) {
      clearInterval(this.timerRef);
    }

    this.adVideo.pause();
    this.adVideo.src = "";
    this.adDialog.close();

    window.dispatchEvent(new CustomEvent("adOver"));
  }
}

window.adController = new AdController();
