const AD_LENGTH = 20;

const AD_FILES = [
  "assets/data/ads/a1.webm",
  "assets/data/ads/a2.webm",
  "assets/data/ads/a3.webm",
  "assets/data/ads/a4.webm",
  "assets/data/ads/a5.webm",
  "assets/data/ads/a6.webm",
];

class AdController {
  showingAd = false;

  /**
   * @type {number | null}
   */
  timerRef = null;

  timeRemaining = 0;

  /**
   * @type {number | null}
   */
  lastAd = null;

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

    const randomAd = this.#getNextAd();

    this.lastAd = randomAd;
    this.adVideo.src = randomAd;
    this.adVideo.play();

    this.adDialog.showModal();
    this.timeRemaining = AD_LENGTH;
    this.timerRef = setInterval(this.#countdownTick.bind(this), 1000);
    this.#showTimeRemaining();
  }

  #countdownTick() {
    if (!this.showingAd) return;

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
    this.showingAd = false;
    if (this.timerRef) {
      clearInterval(this.timerRef);
    }

    this.adVideo.pause();
    this.adVideo.src = "";
    this.adDialog.close();

    window.dispatchEvent(new CustomEvent("adOver"));
  }

  #getNextAd() {
    const randomAd = AD_FILES[Math.floor(Math.random() * AD_FILES.length)];

    // Ensure the random ad is different from the last ad
    while (randomAd === this.lastAd) {
      randomAd = AD_FILES[Math.floor(Math.random() * AD_FILES.length)];
    }

    return randomAd;
  }
}

window.adController = new AdController();
