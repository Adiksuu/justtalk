import React from 'react'
import ImageView from 'react-native-image-viewing';

export default function ImagePreview({ images, visible, setIsVisible }: { images: {uri: string}[], visible: boolean, setIsVisible: (visible: boolean) => void }) {
  return (
    <ImageView
        images={images}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
        swipeToCloseEnabled={true}
        doubleTapToZoomEnabled={true}
      />
  )
}