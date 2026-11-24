(function() {
  function $(id) {
    return document.getElementById(id);
  }

  var galleryImages = ['./ebru-gallery-1.jpg?v=2', './ebru-gallery-2.jpg?v=2'];
  var gallery = $('present-gallery');
  var galleryImage = $('gallery-image');
  var galleryCount = $('gallery-count');
  var galleryPrev = $('gallery-prev');
  var galleryNext = $('gallery-next');
  var galleryFrame = $('gallery-frame');
  var fullscreenToggleBtn = $('gallery-fullscreen-toggle');
  var fullscreenBarBtn = $('gallery-fullscreen-bar-btn');
  var fullscreenControlBtn = $('gallery-fullscreen-btn');
  var fullscreenExitTop = $('gallery-fullscreen-exit-top');
  var tab0 = $('tab-0');
  var tab1 = $('tab-1');
  var giftOpenBtn = $('gift-open');
  var galleryIndex = 0;
  var touchStartX = null;
  var touchMoved = false;
  var isTransitioning = false;

  function toggleFullscreen(forceState) {
    if (!gallery) return;
    var shouldBeFs = typeof forceState === 'boolean' ? forceState : !gallery.classList.contains('is-fullscreen');
    if (shouldBeFs) {
      gallery.classList.add('is-fullscreen');
      if (fullscreenControlBtn) {
        fullscreenControlBtn.innerHTML = '✕ Exit';
      }
      var hint = gallery.querySelector('.fullscreen-exit-hint');
      if (hint) {
        hint.style.animation = 'none';
        void hint.offsetHeight;
        hint.style.animation = '';
      }
      var rfs = gallery.requestFullscreen || gallery.webkitRequestFullscreen || gallery.msRequestFullscreen;
      if (rfs && !document.fullscreenElement && !document.webkitFullscreenElement) {
        try {
          var p = rfs.call(gallery);
          if (p && p.catch) p.catch(function() {});
        } catch (e) {}
      }
    } else {
      gallery.classList.remove('is-fullscreen');
      if (fullscreenControlBtn) {
        fullscreenControlBtn.innerHTML = '⛶ Full Screen';
      }
      var efs = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
      if ((document.fullscreenElement || document.webkitFullscreenElement) && efs) {
        try {
          var ep = efs.call(document);
          if (ep && ep.catch) ep.catch(function() {});
        } catch (e) {}
      }
    }
  }

  document.addEventListener('fullscreenchange', function() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement && gallery) {
      gallery.classList.remove('is-fullscreen');
      if (fullscreenControlBtn) {
        fullscreenControlBtn.innerHTML = '⛶ Full Screen';
      }
    }
  });
  document.addEventListener('webkitfullscreenchange', function() {
    if (!document.fullscreenElement && !document.webkitFullscreenElement && gallery) {
      gallery.classList.remove('is-fullscreen');
      if (fullscreenControlBtn) {
        fullscreenControlBtn.innerHTML = '⛶ Full Screen';
      }
    }
  });

  function updateTabs(idx) {
    if (tab0 && tab1) {
      if (idx === 0) {
        tab0.classList.add('is-active');
        tab0.setAttribute('aria-selected', 'true');
        tab1.classList.remove('is-active');
        tab1.setAttribute('aria-selected', 'false');
      } else {
        tab1.classList.add('is-active');
        tab1.setAttribute('aria-selected', 'true');
        tab0.classList.remove('is-active');
        tab0.setAttribute('aria-selected', 'false');
      }
    }
  }

  function showGalleryImage(index) {
    if (isTransitioning) return;
    var targetIndex = Math.max(0, Math.min(galleryImages.length - 1, index));
    if (targetIndex === galleryIndex && galleryImage.getAttribute('src') === galleryImages[targetIndex]) {
      return;
    }

    galleryIndex = targetIndex;
    updateTabs(galleryIndex);

    // Smooth subtle transition
    isTransitioning = true;
    galleryImage.style.opacity = '0';
    galleryImage.style.transform = 'scale(0.97)';

    setTimeout(function() {
      galleryImage.src = galleryImages[galleryIndex];
      galleryImage.alt = 'Birthday surprise for Ebru, card ' + (galleryIndex + 1);
      galleryCount.textContent = (galleryIndex + 1) + ' / ' + galleryImages.length;
      galleryPrev.disabled = galleryIndex === 0;
      galleryNext.disabled = galleryIndex === galleryImages.length - 1;

      galleryImage.onload = function() {
        galleryImage.style.opacity = '1';
        galleryImage.style.transform = 'scale(1)';
        isTransitioning = false;
      };
      // Fallback in case image is already cached
      setTimeout(function() {
        galleryImage.style.opacity = '1';
        galleryImage.style.transform = 'scale(1)';
        isTransitioning = false;
      }, 50);
    }, 140);
  }

  function openGallery() {
    if (giftOpenBtn) {
      giftOpenBtn.classList.add('is-opening');
    }
    setTimeout(function() {
      showGalleryImage(0);
      gallery.classList.add('is-open');
      gallery.setAttribute('aria-hidden', 'false');
      if (giftOpenBtn) {
        giftOpenBtn.classList.remove('is-opening');
      }
    }, 220);
  }

  function closeGallery() {
    toggleFullscreen(false);
    gallery.classList.remove('is-open');
    gallery.setAttribute('aria-hidden', 'true');
    if (giftOpenBtn) {
      giftOpenBtn.classList.remove('is-opening');
    }
  }

  if (giftOpenBtn) {
    giftOpenBtn.addEventListener('click', openGallery);
  }

  if (galleryNext) {
    galleryNext.addEventListener('click', function(e) {
      e.stopPropagation();
      if (galleryIndex < galleryImages.length - 1) {
        showGalleryImage(galleryIndex + 1);
      }
    });
  }

  if (galleryPrev) {
    galleryPrev.addEventListener('click', function(e) {
      e.stopPropagation();
      if (galleryIndex > 0) {
        showGalleryImage(galleryIndex - 1);
      }
    });
  }

  if (tab0) {
    tab0.addEventListener('click', function() {
      showGalleryImage(0);
    });
  }

  if (tab1) {
    tab1.addEventListener('click', function() {
      showGalleryImage(1);
    });
  }

  if (fullscreenToggleBtn) {
    fullscreenToggleBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleFullscreen(true);
    });
  }

  if (fullscreenBarBtn) {
    fullscreenBarBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleFullscreen(true);
    });
  }

  if (fullscreenControlBtn) {
    fullscreenControlBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleFullscreen();
    });
  }

  if (fullscreenExitTop) {
    fullscreenExitTop.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleFullscreen(false);
    });
  }

  // Clicking or tapping the artwork
  if (galleryImage) {
    galleryImage.addEventListener('click', function(event) {
      if (touchMoved) {
        touchMoved = false;
        return;
      }
      var rect = galleryImage.getBoundingClientRect();
      var relY = (event.clientY - rect.top) / rect.height;
      var relX = (event.clientX - rect.left) / rect.width;

      // In Card 1: "Press to close ♡" is in the bottom right corner (relY > 0.82, relX > 0.7)
      // In Card 2: "Close Card" is bottom center (relY > 0.82, 0.35 < relX < 0.65) or top right "X" (relY < 0.16, relX > 0.88)
      var hitArtworkClose = (relY > 0.82 && (relX > 0.35 || galleryIndex === 0)) || (relY < 0.16 && relX > 0.88);
      if (hitArtworkClose) {
        if (gallery.classList.contains('is-fullscreen')) {
          toggleFullscreen(false);
        } else {
          closeGallery();
        }
        return;
      }

      // Tap image to toggle fullscreen mode!
      toggleFullscreen();
    });
  }

  gallery.addEventListener('click', function(event) {
    if (event.target.hasAttribute('data-gallery-close') || event.target === gallery || event.target.classList.contains('gallery-backdrop')) {
      if (gallery.classList.contains('is-fullscreen')) {
        toggleFullscreen(false);
      } else {
        closeGallery();
      }
    }
  });

  if (galleryFrame) {
    galleryFrame.addEventListener('touchstart', function(event) {
      touchStartX = event.changedTouches[0].screenX;
      touchMoved = false;
    }, { passive: true });

    galleryFrame.addEventListener('touchmove', function(event) {
      if (touchStartX !== null && Math.abs(event.changedTouches[0].screenX - touchStartX) > 28) {
        touchMoved = true;
      }
    }, { passive: true });

    galleryFrame.addEventListener('touchend', function(event) {
      if (touchStartX === null) return;
      var delta = event.changedTouches[0].screenX - touchStartX;
      if (Math.abs(delta) > 40) {
        if (delta < 0 && galleryIndex < galleryImages.length - 1) {
          showGalleryImage(galleryIndex + 1);
        } else if (delta > 0 && galleryIndex > 0) {
          showGalleryImage(galleryIndex - 1);
        }
      }
      touchStartX = null;
    }, { passive: true });
  }

  document.addEventListener('keydown', function(event) {
    if (!gallery.classList.contains('is-open')) return;
    if (event.key === 'Escape') {
      if (gallery.classList.contains('is-fullscreen')) {
        toggleFullscreen(false);
      } else {
        closeGallery();
      }
      return;
    }
    if (event.key === 'ArrowRight' && galleryIndex < galleryImages.length - 1) showGalleryImage(galleryIndex + 1);
    if (event.key === 'ArrowLeft' && galleryIndex > 0) showGalleryImage(galleryIndex - 1);
  });

  // Card open & close buttons and responsive scaling
  var card = $('card'),
      openB = $('open'),
      closeB = $('close'),
      btnShowPresent = $('btn-show-present'),
      btnShowSnapshot = $('btn-show-snapshot'),
      mobileCardClose = $('mobile-card-close'),
      timer = null;

  // Viewport-aware responsive scaling for desktop, tablet, and mobile landscape
  function updateCardScale() {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    var isMobilePortrait = vw <= 680 && vh >= vw;
    if (!isMobilePortrait) {
      var scaleW = (vw - 32) / 980;
      var scaleH = (vh - 32) / 600;
      var scale = Math.min(1.15, Math.min(scaleW, scaleH));
      document.documentElement.style.setProperty('--card-scale', scale.toFixed(3));
    } else {
      document.documentElement.style.setProperty('--card-scale', '1');
    }
  }

  window.addEventListener('resize', updateCardScale, { passive: true });
  window.addEventListener('orientationchange', updateCardScale, { passive: true });
  updateCardScale();

  function setMobileInsidePage(page) {
    if (!card) return;
    if (page === 'snapshot') {
      card.classList.add('mobile-show-snapshot');
      if (btnShowSnapshot) btnShowSnapshot.classList.add('is-active');
      if (btnShowPresent) btnShowPresent.classList.remove('is-active');
    } else {
      card.classList.remove('mobile-show-snapshot');
      if (btnShowPresent) btnShowPresent.classList.add('is-active');
      if (btnShowSnapshot) btnShowSnapshot.classList.remove('is-active');
    }
  }

  if (btnShowPresent) {
    btnShowPresent.addEventListener('click', function(e) {
      e.stopPropagation();
      setMobileInsidePage('present');
    });
  }

  if (btnShowSnapshot) {
    btnShowSnapshot.addEventListener('click', function(e) {
      e.stopPropagation();
      setMobileInsidePage('snapshot');
    });
  }

  if (mobileCardClose) {
    mobileCardClose.addEventListener('click', function(e) {
      e.stopPropagation();
      closeCard();
    });
  }

  function openCard() {
    card.setAttribute('class', 'open-half');
    if (timer) clearTimeout(timer);
    timer = setTimeout(function() {
      card.setAttribute('class', 'open-fully');
      setMobileInsidePage('present');
      timer = null;
    }, 1000);
  }

  function closeCard() {
    card.setAttribute('class', 'close-half');
    if (timer) clearTimeout(timer);
    timer = setTimeout(function() {
      card.setAttribute('class', '');
      setMobileInsidePage('present');
      timer = null;
    }, 1000);
  }

  if (openB) openB.addEventListener('click', openCard);
  if (closeB) closeB.addEventListener('click', closeCard);

  // Mobile swipe inside open card
  var cardTouchStartX = null;
  if (card) {
    card.addEventListener('touchstart', function(e) {
      cardTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    card.addEventListener('touchend', function(e) {
      if (cardTouchStartX === null || !card.classList.contains('open-fully')) return;
      if (window.innerWidth > 680 || window.innerHeight < window.innerWidth) return;
      var deltaX = e.changedTouches[0].screenX - cardTouchStartX;
      if (Math.abs(deltaX) > 40) {
        if (deltaX < 0) {
          setMobileInsidePage('present');
        } else {
          setMobileInsidePage('snapshot');
        }
      }
      cardTouchStartX = null;
    }, { passive: true });
  }
}());