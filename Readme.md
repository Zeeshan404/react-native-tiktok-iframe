# react-native-tiktok-iframe

A React Native component for embedding **TikTok posts** via iframe (inside a WebView).  
Supports video & image posts, with full playback controls, event callbacks, and rich customization.

## 🌟 Features

- Play, pause, seek, mute/unmute  
- Navigate between images in image posts  
- Show or hide controls like progress bar, play button, volume control, timestamp, fullscreen  
- Events: `onPlayerReady`, `onStateChange`, `onCurrentTime`, `onMute`, `onVolumeChange`, `onError`, `onImageChange`  
- Lightweight and easy to drop into any RN app

## 📦 Installation

```bash
npm install @zeeshan404/react-native-tiktok-iframe
# or
yarn add @zeeshan404/react-native-tiktok-iframe
```

Don’t forget to install and link `react-native-webview` if you haven’t already:

```bash
npm install react-native-webview
```

## 🚀 Usage

```tsx
import React, { useRef } from 'react';
import { View, Button } from 'react-native';
import { TikTokEmbedPlayer, TikTokEmbedRef } from '@zeeshan404/react-native-tiktok-iframe';

export default function App() {
  const playerRef = useRef<TikTokEmbedRef>(null);

  return (
    <View style={{ flex: 1 }}>
      <TikTokEmbedPlayer
        ref={playerRef}
        postId="6718335390845095173"
        autoplay={false}
        loop={false}
        showMusicInfo={true}
        showDescription={true}
        onPlayerReady={() => console.log('ready')}
        onStateChange={(state) => console.log('state', state)}
      />

      <Button title="Play" onPress={() => playerRef.current?.play()} />
      <Button title="Pause" onPress={() => playerRef.current?.pause()} />
    </View>
  );
}
```

## 🧩 Props

- `postId` (string, required) — TikTok post ID
- `height` / `width` (number) — dimensions of the player
- `autoplay`, `loop` (boolean) — playback options
- `showMusicInfo`, `showDescription` (boolean) — toggle overlays
- `controls`, `progressBar`, `playButton`, `volumeControl`, `fullscreenButton`, `timestamp`, `rel`, `nativeContextMenu`, `closedCaption` (boolean) — player controls

## 🎯 Events

- `onPlayerReady` — fired when player is ready
- `onStateChange(state: number)` — state changes (-1 init, 0 ended, 1 playing, 2 paused, 3 buffering)
- `onCurrentTime(currentTime, duration)` — current playback time and duration
- `onMute(muted: boolean)`
- `onVolumeChange(volume: number)`
- `onError(code: number)`
- `onImageChange(index: number)` — when image carousel changes

## 📄 License

[MIT](https://choosealicense.com/licenses/mit/)