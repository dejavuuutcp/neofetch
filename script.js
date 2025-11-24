(() => {
  "use strict";

  const canvas = document.getElementById("c");
  const ctx = canvas.getContext("2d");
  const favicon = document.getElementById("fav");
  const icons = ["1.ico", "2.ico", "3.ico"];

  const info = [
    "User:               dejavu@nixos",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "Operating System:   NixOS 24.11 Vicuña (x86_64)",
    "Installed Packages: 127 (system), 83 (user profile)",
    "Screen Resolution:  800x600",
    "Kernel Version:     6.6.54",
    "Processes:          87",
    "RAM Usage:          896MiB / 1024MiB",
    "GMod dir:           /home/dejavu/.steam/steam/steamapps/common/GarrysMod",
    "Config:             /etc/nixos/configuration.nix",
    "Uptime:             2 days, 16 hours",
    "Shell:              bash 5.2",
    "IPv4:               104.28.13.67",
    "CPU:                Intel Core 2 Duo E4300 @ 1.8GHz",
    "GPU:                Intel GMA 3100"
  ];

  let cmd = null;
  let lastDraw = 0;
  let animationFrame = null;

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resizeCanvas();

  const drawError = () => {
    ctx.fillStyle = "#f00";
    ctx.font = "18px 'Courier New', monospace";
    ctx.fillText("kernel panic - not syncing: Attempted to kill init!", 40, canvas.height - 370);
    ctx.fillText("enjoy!", 40, canvas.height - 350);
  };

  function typeCommand(text, callback) {
    const prefix = "dejavu@nixos:~$ ";
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
        callback?.();
      }
    }, 150);
  }

  const img = new Image();
  img.src = "z.jpg";

  function draw() {
    const now = performance.now();
    if (now - lastDraw < 16) return;
    lastDraw = now;

    const x = 40;
    const y = 65;
    const size = 500;

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
    info.forEach((line, i) => {
      ctx.fillText(line, x + size + 30, y + i * 22);
    });
    drawError();
  }

  img.onload = () => {
    typeCommand("fastfetch", () => {
      draw();
    });
  };

  let iconIdx = 0;
  setInterval(() => {
    if (favicon) {
      favicon.href = icons[iconIdx];
      iconIdx = (iconIdx + 1) % icons.length;
    }
  }, 1000);

  let resizeTimeout;
  window.addEventListener("resize", () => {
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

      if (this.audio) this.init();
    }

    init() {
      this.audio.volume = 0.2;
      this.updateUI();

      this.btn?.addEventListener("click", () => this.toggle());
      this.vol?.addEventListener("input", () => this.changeVolume());
      
      this.audio.addEventListener("ended", () => this.updateBtn());
      this.audio.addEventListener("play", () => this.updateBtn());
      this.audio.addEventListener("pause", () => this.updateBtn());
      this.audio.addEventListener("error", () => this.handleError());

      this.audio.play().catch(() => {
        document.body.addEventListener("click", () => this.audio.play(), { once: true });
      });
    }

    toggle() {
      if (this.audio.paused) {
        this.audio.play().catch(console.error);
      } else {
        this.audio.pause();
      }
    }

    changeVolume() {
      this.audio.volume = parseFloat(this.vol.value);
      this.updateUI();
    }

    updateBtn() {
      if (this.btn) {
        this.btn.textContent = this.audio.paused ? "Play" : "Pause";
      }
    }

    updateUI() {
      if (this.pct) {
        this.pct.textContent = `${Math.round(this.audio.volume * 100)}%`;
      }
    }

    adjust(delta) {
      const newVol = Math.max(0, Math.min(1, this.audio.volume + delta));
      this.audio.volume = newVol;
      if (this.vol) this.vol.value = newVol;
      this.updateUI();
    }

    handleError() {
      if (this.btn) {
        this.btn.disabled = true;
        this.btn.textContent = "Error";
      }
    }
  }

  const player = new MusicPlayer();

  let lastKey = 0;
  document.addEventListener("keydown", (e) => {
    const now = performance.now();
    if (now - lastKey < 50) return;
    lastKey = now;

    switch (e.code) {
      case "Space":
        e.preventDefault();
        player?.toggle();
        break;
      case "ArrowUp":
        e.preventDefault();
        player?.adjust(0.05);
        break;
      case "ArrowDown":
        e.preventDefault();
        player?.adjust(-0.05);
        break;
    }
  });

  console.log("Hello World");
})();


