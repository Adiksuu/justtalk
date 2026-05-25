import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import StoryCircle from '../utils/StoryCircle';

export default function Stories() {
    const STORIES = [
        {
            id: 'your-story',
            name: 'Your story',
            imageUrl: 'https://i.pravatar.cc/150?img=47',
            isYourStory: true,
        },
        {
            id: '1',
            name: 'Greta',
            imageUrl: 'https://i.pravatar.cc/150?img=1',
            borderColor: '#6366F1',
        },
        {
            id: '2',
            name: 'Sister',
            imageUrl: 'https://i.pravatar.cc/150?img=5',
            borderColor: '#6366F1',
        },
        {
            id: '3',
            name: 'Oliver Bla...',
            imageUrl: 'https://i.pravatar.cc/150?img=12',
            borderColor: '#6366F1',
        },
        {
            id: '4',
            name: 'Mira Vale',
            imageUrl: 'https://i.pravatar.cc/150?img=9',
            borderColor: '#4B5563',
        },
    ];


  return (
    <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storiesContainer}
        style={styles.storiesScroll}
    >
        {STORIES.map((story) => (
        <StoryCircle
            key={story.id}
            imageUrl={story.imageUrl}
            name={story.name}
            isYourStory={story.isYourStory}
            borderColor={story.borderColor}
        />
        ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
    storiesScroll: {
        flexGrow: 0,
    },
    storiesContainer: {
        paddingHorizontal: 20,
        paddingBottom: 12,
    },
})