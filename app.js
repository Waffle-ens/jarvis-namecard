(() => {
  const shareButton = document.querySelector('#share-button');
  const dialog = document.querySelector('#share-dialog');
  const urlInput = document.querySelector('#share-url');
  const copyButton = document.querySelector('#copy-button');
  const copyHelp = document.querySelector('#copy-help');
  const manualCopy = document.querySelector('#manual-copy');
  const nativeShareButton = document.querySelector('#native-share-button');
  const kakaoButton = document.querySelector('#kakao-share-button');
  const kakaoHelp = document.querySelector('#kakao-help');
  const toast = document.querySelector('#toast');
  const pageUrl = document.querySelector('link[rel="canonical"]')?.href || new URL('./', location.href).href;
  const kakaoKey = window.JARVIS_CONFIG?.kakaoJavaScriptKey?.trim() || '';
  const hasKakaoKey = /^[a-f0-9]{32}$/i.test(kakaoKey);
  let kakaoReady = false;
  let sdkPromise;
  let toastTimer;

  function notify(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('is-visible');
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3200);
  }

  function loadKakaoSdk() {
    if (window.Kakao) return Promise.resolve(window.Kakao);
    if (sdkPromise) return sdkPromise;
    sdkPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      let finished = false;
      const timer = setTimeout(() => finish(new Error('Kakao SDK timed out')), 12000);
      function finish(error) {
        if (finished) return;
        finished = true;
        clearTimeout(timer);
        script.onload = null;
        script.onerror = null;
        if (error) {
          script.remove();
          reject(error);
        } else {
          resolve(window.Kakao);
        }
      }
      script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.8.3/kakao.min.js';
      script.integrity = 'sha384-oroumrnFVE0xtgqyDZJARgERibXg2C28380uaUZz2kHDS5CR7tu20eGiOU6GkTpy';
      script.crossOrigin = 'anonymous';
      script.async = true;
      script.onload = () => finish(window.Kakao ? null : new Error('Kakao SDK unavailable'));
      script.onerror = () => finish(new Error('Kakao SDK failed to load'));
      document.head.append(script);
    }).catch(error => {
      sdkPromise = undefined;
      throw error;
    });
    return sdkPromise;
  }

  async function prepareKakao() {
    kakaoButton.disabled = true;
    kakaoButton.textContent = '카카오톡 준비 중…';
    kakaoHelp.hidden = true;
    try {
      const kakao = await loadKakaoSdk();
      if (!kakao.isInitialized()) kakao.init(kakaoKey);
      kakaoReady = true;
      kakaoButton.textContent = '카카오톡으로 명함 보내기';
    } catch {
      kakaoReady = false;
      kakaoButton.textContent = '카카오톡 다시 연결';
      kakaoHelp.textContent = '카카오톡 연결을 불러오지 못했어요. 다시 시도하거나 링크를 복사해 주세요.';
      kakaoHelp.hidden = false;
    } finally {
      kakaoButton.disabled = false;
    }
  }

  shareButton.hidden = false;
  nativeShareButton.hidden = typeof navigator.share !== 'function';
  if (hasKakaoKey) {
    kakaoButton.hidden = false;
    document.querySelector('#preview-cta').hidden = false;
    document.querySelector('#share-description').textContent = '카카오톡에서 받는 분을 선택해 명함 카드로 전해 주세요.';
  }

  shareButton.addEventListener('click', () => {
    urlInput.value = pageUrl;
    copyHelp.textContent = '';
    manualCopy.hidden = true;
    dialog.showModal();
    if (hasKakaoKey && !kakaoReady) void prepareKakao();
  });

  kakaoButton.addEventListener('click', () => {
    if (!hasKakaoKey) return;
    if (!kakaoReady) {
      void prepareKakao();
      return;
    }
    const link = { mobileWebUrl: pageUrl, webUrl: pageUrl };
    try {
      // Keep the picker launch inside this click; sendDefault does not confirm delivery.
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: 'JARVIS · YOONBO SIM',
          description: '웹·소프트웨어 개발 · 유지보수\n시스템 개발 및 자문',
          imageUrl: new URL('share-card.png', pageUrl).href,
          imageWidth: 1774,
          imageHeight: 887,
          link,
        },
        buttons: [{ title: '명함 보기', link }],
      });
      kakaoHelp.textContent = '선택 화면이 열리지 않으면 브라우저의 팝업 차단 설정을 확인해 주세요.';
      kakaoHelp.hidden = false;
    } catch {
      kakaoHelp.textContent = '카카오톡 공유를 열지 못했어요. 잠시 후 다시 시도하거나 링크를 복사해 주세요.';
      kakaoHelp.hidden = false;
    }
  });

  nativeShareButton.addEventListener('click', async () => {
    try {
      await navigator.share({ title: 'JARVIS · YOONBO SIM', text: '웹·소프트웨어 개발 · 유지보수 · 시스템 개발 및 자문', url: pageUrl });
    } catch (error) {
      if (error.name !== 'AbortError') copyHelp.textContent = '기본 공유 메뉴를 열지 못했어요. 링크 복사를 이용해 주세요.';
    }
  });

  copyButton.addEventListener('click', async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(pageUrl);
      dialog.close();
      notify('명함 링크를 복사했어요.');
    } catch {
      manualCopy.hidden = false;
      urlInput.focus();
      urlInput.select();
      urlInput.setSelectionRange(0, urlInput.value.length);
      copyHelp.textContent = '주소를 길게 누르거나 Ctrl+C / ⌘C로 복사해 주세요.';
    }
  });
})();
