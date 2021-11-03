window.addEventListener('load', function() {
  document.querySelectorAll('[data-qr]').forEach(function(e) {
    QRCode.toDataURL(e.getAttribute('href'), { color: { light: '#0000' }, width: 120, margin: 0 }, function (err, url) {
      var img = document.createElement('img');
      img.setAttribute('class', 'qrcode');
      img.src = url;
      e.prepend(img);
    })
  });
});
