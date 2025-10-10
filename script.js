(() => {
  "use strict"; // 1

  const canvas = document.getElementById("c");
  const ctx = canvas.getContext("2d");
  const favicon = document.getElementById("fav");
  const icons = ["1.ico", "2.ico", "3.ico"];

  const info = [
    "User:               dejavu@crunchbang",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "Operating System:   CrunchBang 11 Waldorf (Debian-based i686)",
    "Installed Packages: 1874",
    "Screen Resolution:  800x600",
    "Kernel Version:     6.9.7",
    "Processes:          17 (0 user, 1 undefined)",
    "RAM Usage:          128MiB / 512MiB",
    "GMod dir:           /home/deja/.steam/steam/steamapps/common/GarrysMod",
    "Uptime:             3 days, 4 hours",
    "Shell:              bash 5.2",
    "MOTD:               Uptime lies. You died long ago.",
    "IPv4:               203.0.113.42",
    "CPU:                Intel Atom N270 @ 1.6GHz",
    "GPU:                Intel GMA 950"
  ];

  let cmd = null;
  let lastDraw = 0;

  const resizeCanvas = () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  };
  resizeCanvas();

  const drawError = () => {
    ctx.fillStyle = "#f00";
    ctx.font = "18px 'Courier New', monospace";
    ctx.fillText("kernel panic - not syncing: Attempted to kill init!", 40, canvas.height - 370);
    ctx.fillText("enjoy!", 40, canvas.height - 350);
  };

  function typeCommand(text, cb) {
    const prefix = "dejavu@crunchbang:~$ ";
    let idx = 0;
    let blink = true;

    const interval = setInterval(() => {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, 60);

      ctx.fillStyle = "#fff";
      ctx.font = "20px 'Courier New', monospace";
      ctx.fillText(prefix + text.slice(0, idx) + (blink ? "_" : ""), 40, 40);
      blink = !blink;

      if (idx++ > text.length) {
        clearInterval(interval);
        cmd = prefix + text;
        cb?.();
      }
    }, 150);
  }

  const img = new Image();
  img.src = "z.jpg";

  function draw() {
    const now = performance.now();
    if (now - lastDraw < 16) return;
    lastDraw = now;

    const x = 40, y = 65, size = 500;

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (cmd) {
      ctx.fillStyle = "#fff";
      ctx.font = "20px 'Courier New', monospace";
      ctx.fillText(cmd, x, 40);
    }

    if (img.complete && img.naturalWidth) {
      ctx.drawImage(img, x, y, size, size);
    }

    ctx.fillStyle = "#fff";
    ctx.font = "18px 'Courier New', monospace";
    info.forEach((line, i) => ctx.fillText(line, x + size + 30, y + i * 22));

  }

  img.onload = () => typeCommand("neofetch", () => {
    draw();
    drawError();
  });

  let iconIdx = 0;
  setInterval(() => {
    if (!favicon) return;
    favicon.href = icons[iconIdx];
    iconIdx = (iconIdx + 1) % icons.length;
  }, 1000);

  let resizeTimeout;
  addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resizeCanvas();
      if (cmd) draw();
    }, 100);
  });

  class MusicPlayer {
    constructor() {
      this.audio = document.getElementById("music");
      this.btn = document.getElementById("btn");
      this.vol = document.getElementById("vol");
      this.pct = document.getElementById("pct");

      if (!this.audio) return;
      this.init();
    }

    init() {
      this.audio.volume = 0.2;
      this.updateUI();

      this.btn?.addEventListener("click", () => this.toggle());
      this.vol?.addEventListener("input", () => this.changeVolume());
      this.audio.addEventListener("ended", () => this.updateBtn());
      this.audio.addEventListener("play", () => this.updateBtn());
      this.audio.addEventListener("pause", () => this.updateBtn());

      this.audio.addEventListener("error", () => {
        if (this.btn) {
          this.btn.disabled = true;
          this.btn.textContent = "holyshit111";
        }
      });

      this.audio.play().catch(() => {
        document.body.addEventListener("click", () => {
          this.audio.play();
        }, { once: true });
      });
    }

    toggle() {
      if (this.audio.paused) this.audio.play().catch(() => {});
      else this.audio.pause();
    }

    changeVolume() {
      this.audio.volume = parseFloat(this.vol.value);
      this.updateUI();
    }

    updateBtn() {
      if (this.btn) this.btn.textContent = this.audio.paused ? "Play" : "Pause";
    }

    updateUI() {
      if (this.pct) this.pct.textContent = Math.round(this.audio.volume * 100) + "%";
    }

    adjust(delta) {
      const vol = Math.max(0, Math.min(1, this.audio.volume + delta));
      this.audio.volume = vol;
      if (this.vol) this.vol.value = vol;
      this.updateUI();
    }
  }

  const player = new MusicPlayer();

  let lastKey = 0;
  document.addEventListener("keydown", e => {
    const now = performance.now();
    if (now - lastKey < 50) return;
    lastKey = now;

    switch (e.code) {
      case "Space":
        e.preventDefault();
        player?.toggle();
        break;
      case "ArrowUp":
        player?.adjust(0.05);
        break;
      case "ArrowDown":
        player?.adjust(-0.05);
        break;
    }
  });

})();
console.log("helloworld?");
