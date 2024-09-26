import React, { useEffect } from 'react';

const GoogleAd = () => {
  useEffect(() => {
    // Load AdSense script after component renders
    if (window) {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  }, []);

  return (
    <div>
      <ins className="adsbygoogle"
         style={{display: 'block'}}
         data-ad-client="ca-pub-7733342387004681"
         data-ad-slot="5667685338"
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
    </div>
  );
};

export default GoogleAd;
