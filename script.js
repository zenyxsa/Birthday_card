(function() {
  function $(id) {
    return document.getElementById(id);
  }

  var galleryImages = ['./ebru-gallery-1.png', './ebru-gallery-2.png'];
  var gallery = $('present-gallery'), galleryImage = $('gallery-image');
  var galleryCount = $('gallery-count'), galleryPrev = $('gallery-prev'), galleryNext = $('gallery-next');
  var galleryFrame = $('gallery-frame'), galleryIndex = 0, touchStartX = null;
  function showGalleryImage(index) {
    galleryIndex = Math.max(0, Math.min(galleryImages.length - 1, index));
    galleryImage.src = galleryImages[galleryIndex];
    galleryImage.alt = 'Birthday surprise for Ebru, page ' + (galleryIndex + 1);
    galleryCount.textContent = (galleryIndex + 1) + ' / ' + galleryImages.length;
    galleryPrev.disabled = galleryIndex === 0;
    galleryNext.disabled = galleryIndex === galleryImages.length - 1;
  }
  function openGallery() {
    showGalleryImage(0); gallery.classList.add('is-open');
    gallery.setAttribute('aria-hidden', 'false');
  }
  function closeGallery() {
    gallery.classList.remove('is-open'); gallery.setAttribute('aria-hidden', 'true');
  }
  $('gift-open').addEventListener('click', openGallery);
  galleryNext.addEventListener('click', function(){showGalleryImage(galleryIndex + 1);});
  galleryPrev.addEventListener('click', function(){showGalleryImage(galleryIndex - 1);});
  gallery.addEventListener('click', function(event){if(event.target.hasAttribute('data-gallery-close')) closeGallery();});
  galleryFrame.addEventListener('touchstart', function(event){touchStartX=event.changedTouches[0].screenX;},{passive:true});
  galleryFrame.addEventListener('touchend', function(event){
    if(touchStartX===null)return;var delta=event.changedTouches[0].screenX-touchStartX;
    if(Math.abs(delta)>45)showGalleryImage(galleryIndex+(delta<0?1:-1));touchStartX=null;
  },{passive:true});
  document.addEventListener('keydown',function(event){
    if(!gallery.classList.contains('is-open'))return;
    if(event.key==='Escape')closeGallery();
    if(event.key==='ArrowRight')showGalleryImage(galleryIndex+1);
    if(event.key==='ArrowLeft')showGalleryImage(galleryIndex-1);
  });
  var card = $('card'),
      openB = $('open'),
      closeB = $('close'),
      timer = null;
  openB.addEventListener('click', function () {
    card.setAttribute('class', 'open-half');
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () {
      card.setAttribute('class', 'open-fully');
      timer = null;
    }, 1000);
  });

  closeB.addEventListener('click', function () {
    card.setAttribute('class', 'close-half');
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () {
      card.setAttribute('class', '');
      timer = null;
    }, 1000);
  });
  
  

}());