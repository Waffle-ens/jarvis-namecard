(() => {
  const shareButton = document.querySelector('#share-button');
  const dialog = document.querySelector('#share-dialog');
  const urlInput = document.querySelector('#share-url');
  const copyButton = document.querySelector('#copy-button');
  const copyHelp = document.querySelector('#copy-help');
  const toast = document.querySelector('#toast');
  let toastTimer;

  function notify(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('is-visible');
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3200);
  }

  function openShareDialog() {
    urlInput.value = document.querySelector('link[rel="canonical"]')?.href || new URL('./', location.href).href;
    copyHelp.textContent = '';
    dialog.showModal();
  }

  shareButton.hidden = false;
  shareButton.addEventListener('click', async () => {
    const url = document.querySelector('link[rel="canonical"]')?.href || new URL('./', location.href).href;
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: 'JARVIS · YOONBO SIM', text: '웹·소프트웨어 개발 · 유지보수 · 시스템 개발 및 자문', url });
        return;
      } catch (error) {
        if (error.name === 'AbortError') return;
      }
    }
    openShareDialog();
  });

  copyButton.addEventListener('click', async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(urlInput.value);
      dialog.close();
      notify('명함 링크를 복사했어요. 카카오톡에 붙여넣어 주세요.');
    } catch {
      urlInput.focus();
      urlInput.select();
      urlInput.setSelectionRange(0, urlInput.value.length);
      copyHelp.textContent = '주소를 길게 누르거나 Ctrl+C / ⌘C로 복사해 주세요.';
    }
  });
})();
