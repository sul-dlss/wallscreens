window.addEventListener('load', () => {
  document.querySelectorAll('[data-qr]').forEach((e) => {
    QRCode.toDataURL(e.getAttribute('href'), { color: { light: '#0000' }, width: 120, margin: 0 }, (err, url) => {
      const img = document.createElement('img');
      img.setAttribute('class', 'qrcode');
      img.src = url;
      e.prepend(img);
    });
  });
});
