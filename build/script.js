const $ = (selector) => document.querySelector(selector);

// Preload the smile avatar image
const smileAvatar = new Image();
smileAvatar.src = "/img/avatar-smile.jpg";

// Store original avatar src
let originalAvatarSrc;

document.addEventListener("DOMContentLoaded", () => {
  const avatar = $("#avatar");
  const buyMeCoffee = $(".buymeacoffee");

  if (avatar && buyMeCoffee) {
    originalAvatarSrc = avatar.src;

    buyMeCoffee.addEventListener("mouseenter", () => {
      avatar.src = "/img/avatar-smile.jpg";
    });

    buyMeCoffee.addEventListener("mouseleave", () => {
      avatar.src = originalAvatarSrc;
    });
  }

  // Initialize syntax highlighting
  if (typeof hljs !== "undefined") {
    hljs.highlightAll();
  }
});
