const $ = (selector) => document.querySelector(selector);

// Preload the smile avatar image
const smileAvatar = new Image();
smileAvatar.src = "/static/avatar-smile.jpg";

// Store original avatar src
let originalAvatarSrc;
let smallAvatarOriginalSrc;

document.addEventListener("DOMContentLoaded", () => {
  const avatar = $("#avatar");
  const smallAvatar = $(".small-avatar");

  const buyMeCoffee = $(".buymeacoffee");

  if ((avatar || smallAvatar) && buyMeCoffee) {
    originalAvatarSrc = avatar.src;
    smallAvatarOriginalSrc = smallAvatar.src;

    buyMeCoffee.addEventListener("mouseenter", () => {
      if (avatar) avatar.src = "/static/avatar-smile.jpg";
      if (smallAvatar) smallAvatar.src = "/static/avatar-smile.jpg";
    });

    buyMeCoffee.addEventListener("mouseleave", () => {
      if (avatar) avatar.src = originalAvatarSrc;
      if (smallAvatar) smallAvatar.src = smallAvatarOriginalSrc;
    });
  }

  // Initialize syntax highlighting
  if (typeof hljs !== "undefined") {
    hljs.highlightAll();
  }
});
