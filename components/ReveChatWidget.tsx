'use client';

import { useEffect } from 'react';

export default function ReveChatWidget() {
  useEffect(() => {
    // Load REVE Chat script
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = `window.$_REVECHAT_API || (function(d, w) { var r = $_REVECHAT_API = function(c) {r._.push(c);};w.__revechat_account='5941148';w.__revechat_version=2;r._= []; var rc = d.createElement('script'); rc.type = 'text/javascript'; rc.async = true; rc.setAttribute('charset', 'utf-8');rc.src = ('https:' == document.location.protocol ? 'https://' : 'http://')+'static.revechat.com'+'/widget/scripts/new-livechat.js?'+new Date().getTime();var s = d.getElementsByTagName('script')[0]; s.parentNode.insertBefore(rc, s);})(document, window);`;
    document.body.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, []);

  return null;
}
