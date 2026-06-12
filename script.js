document.addEventListener("DOMContentLoaded", function () {
  var cards = document.querySelectorAll(".vpn-card");
  var currentSlides = [];

  for (var i = 0; i < cards.length; i++) {
    currentSlides[i] = 0;
  }

  function updateDots(cardIndex, activeIndex) {
    var card = cards[cardIndex];

    if (!card) {
      return;
    }

    var dots = card.querySelectorAll(".dot-btn");

    for (var d = 0; d < dots.length; d++) {
      dots[d].classList.remove("active");
    }

    if (dots[activeIndex]) {
      dots[activeIndex].classList.add("active");
    }
  }

  function updateSlider(cardIndex, slideIndex) {
    var card = cards[cardIndex];

    if (!card) {
      return;
    }

    var images = card.querySelectorAll(".slides img");
    var totalImages = images.length;

    if (totalImages === 0) {
      return;
    }

    if (slideIndex >= totalImages) {
      slideIndex = 0;
    }

    if (slideIndex < 0) {
      slideIndex = totalImages - 1;
    }

    var prevIndex = slideIndex - 1;
    if (prevIndex < 0) {
      prevIndex = totalImages - 1;
    }

    var nextIndex = slideIndex + 1;
    if (nextIndex >= totalImages) {
      nextIndex = 0;
    }

    for (var i = 0; i < totalImages; i++) {
      images[i].classList.remove("active");
      images[i].classList.remove("prev");
      images[i].classList.remove("next");
      images[i].classList.remove("hide");

      images[i].classList.add("hide");
    }

    images[slideIndex].classList.remove("hide");
    images[slideIndex].classList.add("active");

    if (totalImages > 1) {
      images[prevIndex].classList.remove("hide");
      images[prevIndex].classList.add("prev");

      images[nextIndex].classList.remove("hide");
      images[nextIndex].classList.add("next");
    }

    currentSlides[cardIndex] = slideIndex;
    updateDots(cardIndex, slideIndex);
  }

  function autoSlide() {
    for (var i = 0; i < cards.length; i++) {
      var images = cards[i].querySelectorAll(".slides img");

      if (images.length > 1) {
        var nextSlide = currentSlides[i] + 1;

        if (nextSlide >= images.length) {
          nextSlide = 0;
        }

        updateSlider(i, nextSlide);
      }
    }
  }

  for (var c = 0; c < cards.length; c++) {
    updateSlider(c, 0);

    (function (cardIndex) {
      var dots = cards[cardIndex].querySelectorAll(".dot-btn");

      for (var j = 0; j < dots.length; j++) {
        (function (slideIndex) {
          dots[slideIndex].addEventListener("click", function () {
            updateSlider(cardIndex, slideIndex);
          });
        })(j);
      }
    })(c);
  }

  setInterval(autoSlide, 3000);

  document.addEventListener("click", function (event) {
    var target = event.target;

    if (target.classList.contains("download-btn")) {
      var downloadLink = target.getAttribute("data-link");

      if (downloadLink && downloadLink !== "#") {
        window.open(downloadLink, "_blank");
      } else {
        showToast("Download link not added yet!");
      }
    }

    if (target.classList.contains("copy-btn")) {
      var copyLink = target.getAttribute("data-link");

      if (copyLink && copyLink !== "#") {
        copyText(copyLink);
      } else {
        showToast("Copy link not added yet!");
      }
    }
  });

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () {
        showToast("Download link copied!");
      }).catch(function () {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    var input = document.createElement("input");
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);

    showToast("Download link copied!");
  }

  function showToast(message) {
    var oldToast = document.querySelector(".toast");

    if (oldToast) {
      oldToast.remove();
    }

    var toast = document.createElement("div");
    toast.className = "toast";
    toast.innerText = message;

    document.body.appendChild(toast);

    setTimeout(function () {
      toast.classList.add("show");
    }, 50);

    setTimeout(function () {
      toast.classList.remove("show");
    }, 2200);

    setTimeout(function () {
      if (toast) {
        toast.remove();
      }
    }, 2600);
  }

  var noticeBtn = document.getElementById("noticeBtn");
  var modalOverlay = document.getElementById("modalOverlay");
  var noticeModal = document.getElementById("noticeModal");
  var modalClose = document.getElementById("modalClose");

  function openNoticeModal() {
    if (modalOverlay) {
      modalOverlay.classList.add("show");
    }

    if (noticeModal) {
      noticeModal.classList.add("show");
    }

    document.body.style.overflow = "hidden";
  }

  function closeNoticeModal() {
    if (modalOverlay) {
      modalOverlay.classList.remove("show");
    }

    if (noticeModal) {
      noticeModal.classList.remove("show");
    }

    document.body.style.overflow = "";
  }

  if (noticeBtn) {
    noticeBtn.addEventListener("click", openNoticeModal);
  }

  if (modalClose) {
    modalClose.addEventListener("click", closeNoticeModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener("click", closeNoticeModal);
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeNoticeModal();
    }
  });
});