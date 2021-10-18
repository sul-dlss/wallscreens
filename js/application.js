window.addEventListener('load', function() {
  document.querySelectorAll('[data-qr]').forEach(function(e) {
    QRCode.toDataURL(e.getAttribute('href'), { color: { light: '#0000' }, width: 60 }, function (err, url) {
      var img = document.createElement('img');
      img.setAttribute('class', 'qrcode');
      img.src = url;
      e.prepend(img);
    })
  });

  // More Info Modal
  var more_info_modal = document.querySelector('.more-info-modal');
  var close_button = document.querySelector('button.close');
  document.querySelector('button.more-info').onclick = function(e) { more_info_modal.classList.remove('d-none') }
  close_button.onclick = function(e) { more_info_modal.classList.add('d-none') }
});
