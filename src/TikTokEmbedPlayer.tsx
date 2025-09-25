
import { View } from 'react-native'
import { useRef, forwardRef, useImperativeHandle } from 'react'
import WebView from 'react-native-webview'

export type TikTokEmbedRef = {
    play: () => void;
    pause: () => void;
    seekTo: (seconds: number) => void;
    mute: () => void;
    unMute: () => void;
    navigateTo: (index: number) => void;
    onPlayerReady?: () => void;
    onStateChange?: (state: number) => void;
    onCurrentTime?: (currentTime: number, duration: number) => void;
    onMute?: (muted: boolean) => void;
    onVolumeChange?: (volume: number) => void;
    onError?: (code: number) => void;
    onImageChange?: (index: number) => void;
};

type Props = {
    postId: string;
    height?: number;
    width?: number;
    autoplay?: boolean;
    loop?: boolean;
    showMusicInfo?: boolean;
    showDescription?: boolean;
    controls?: boolean;
    progressBar?: boolean;
    playButton?: boolean;
    volumeControl?: boolean;
    fullscreenButton?: boolean;
    timestamp?: boolean;
    rel?: boolean;
    nativeContextMenu?: boolean;
    closedCaption?: boolean;
    onPlayerReady?: () => void;
    onStateChange?: (state: number) => void;
    onCurrentTime?: (currentTime: number, duration: number) => void;
    onMute?: (muted: boolean) => void;
    onVolumeChange?: (volume: number) => void;
    onError?: (code: number) => void;
    onImageChange?: (index: number) => void;
};

const TikTokEmbedPlayer = forwardRef<TikTokEmbedRef, Props>(({
    postId,
    height = 400,
    width = 300,
    autoplay = false,
    loop = false,
    showMusicInfo = false,
    showDescription = false,
    controls = true,
    progressBar = true,
    playButton = true,
    volumeControl = true,
    fullscreenButton = true,
    timestamp = false,
    rel = false,
    nativeContextMenu = false,
    closedCaption = false,
    onPlayerReady,
    onStateChange,
    onCurrentTime,
    onMute,
    onVolumeChange,
    onError,
    onImageChange,
}, ref) => {
    const webviewRef = useRef<WebView>(null);

    const params = new URLSearchParams({
        autoplay: autoplay ? '1' : '0',
        loop: loop ? '1' : '0',
        music_info: showMusicInfo ? '1' : '0',
        description: showDescription ? '1' : '0',
        controls: controls ? '1' : '0',
        progress_bar: progressBar ? '1' : '0',
        play_button: playButton ? '1' : '0',
        volume_control: volumeControl ? '1' : '0',
        fullscreen_button: fullscreenButton ? '1' : '0',
        timestamp: timestamp ? '1' : '0',
        rel: rel ? '1' : '0',
        native_context_menu: nativeContextMenu ? '1' : '0',
        closed_caption: closedCaption ? '1' : '0',
    });

    const src = `https://www.tiktok.com/player/v1/${postId}?${params.toString()}`;

    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body, html {
            margin: 0;
            padding: 0;
            overflow: hidden;
            background-color: black;
          }
          iframe {
            position: absolute;
            top: 0; left: 0;
            width: 100%;
            height: 100%;
            border: none;
          }
        </style>
      </head>
      <body>
        <iframe id="tiktok-iframe" src="${src}" allow="fullscreen" title="test"></iframe>
        <script>
          (function() {
            const iframe = document.getElementById('tiktok-iframe');
            window.addEventListener('message', function(event) {
              try {
                const msg = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
                if (msg && msg['x-tiktok-player'] && msg.type) {
                  iframe.contentWindow.postMessage(msg, '*');
                  if (msg.type === 'onPlayerReady' ||
                      msg.type === 'onStateChange' ||
                      msg.type === 'onCurrentTime' ||
                      msg.type === 'onMute' ||
                      msg.type === 'onVolumeChange' ||
                      msg.type === 'onError' ||
                      msg.type === 'onImageChange') {
                    window.ReactNativeWebView.postMessage(JSON.stringify(msg));
                  }
                }
              } catch(e) {}
            });
          })();
        </script>
      </body>
    </html>
  `;


    useImperativeHandle(ref, () => ({
        play: () => sendMessage('play'),
        pause: () => sendMessage('pause'),
        seekTo: (seconds: number) => sendMessage('seekTo', seconds),
        mute: () => sendMessage('mute'),
        unMute: () => sendMessage('unMute'),
        navigateTo: (index: number) => sendMessage('navigateTo', index),
    }));

    const sendMessage = (type: string, value?: any) => {
        webviewRef.current?.postMessage(JSON.stringify({
            'x-tiktok-player': true,
            type,
            value,
        }));
    };

    const handleMessage = (event: any) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);

            if (data && data['x-tiktok-player'] && data.type) {
                switch (data.type) {
                    case 'onPlayerReady':
                        onPlayerReady && onPlayerReady();
                        break;
                    case 'onStateChange':
                        onStateChange && onStateChange(data.value);
                        break;
                    case 'onCurrentTime':
                        onCurrentTime && onCurrentTime(data.currentTime, data.duration);
                        break;
                    case 'onMute':
                        onMute && onMute(data.muted);
                        break;
                    case 'onVolumeChange':
                        console.log('event', data)
                        onVolumeChange && onVolumeChange(data.volume);
                        break;
                    case 'onError':
                        onError && onError(data.code);
                        break;
                    case 'onImageChange':
                        onImageChange && onImageChange(data.index);
                        break;
                }
            }
        } catch (error) {
            console.log('Caught error in handleMessage in TiktokEmbededPlayer', error)
        }
    };

    return (
        <View style={{ height, width }}>
            <WebView
                ref={webviewRef}
                originWhitelist={['*']}
                source={{
                    html: html
                }}
                allowsInlineMediaPlayback={true}
                scrollEnabled={false}
                allowsFullscreenVideo={false}
                domStorageEnabled={true}
                javaScriptEnabled={true}
                style={{ flex: 1, backgroundColor: 'black' }}
                onMessage={handleMessage}
            />
        </View>
    );
});

export default TikTokEmbedPlayer