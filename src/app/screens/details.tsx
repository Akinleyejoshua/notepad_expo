// src/screens/HomeScreen.tsx
import { View, Text, Button, StyleSheet } from 'react-native';
import { useCustomNavigation } from '../../context/custom-navigation';
import { HomeHeader } from '@/components/home-header';
import { AppText } from '@/components/app-text';
import { CreateNavBar } from '@/components/create-navbar';
import { AppTextArea } from '@/components/app-textareaa';
import { useNoteStore } from '@/store/use-note-store';
import { useEffect, useState } from 'react';

// src/screens/DetailsScreen.tsx
export default function CreateScreen({ route }: { route: any }) {
  const navigation = useCustomNavigation();
  const { noteId } = route.params || {};

  const [state, setState] = useState({title: '', content: ''})
const setTitle = useNoteStore((state) => state.setNoteTitle);
const setContent = useNoteStore((state) => state.setNoteContent);
const getNoteById = useNoteStore(state => state.getNoteById)

useEffect(() => {
  if(noteId){
    (async () => {
      const note = await getNoteById(noteId);
      if (note) {
        setState({title: note.title, content: note.content});
      }
      console.log(note);
    })();
  }
}, [])

  const handleTitleChange = (updatedTitle: string) => {
    setTitle(updatedTitle);
  };

    const handleContentChange = (updatedContent: string) => {
    setContent(updatedContent);
  };

  return (
    <View style={styles.home}>
      <HomeHeader title="Edit" style={{marginTop: 60}} hasBackButton={true} />
      <View style={{height: 760}}>
        <AppTextArea value={state.title} placeholder="Title" style={{marginTop: 20}} onChange={(val:any) => handleTitleChange(val)}/>
        <AppTextArea value={state.content} placeholder="Content" style={{marginTop: 0}} inputStyle={{fontSize: 20,}} onChange={(val:any) => handleContentChange(val)}/>
      </View>
        <View
              style={{
                backgroundColor: "#d2d2d207",
                borderRadius: 50,
                padding: 1,
                marginBottom: 60,
              }}
            >
              <CreateNavBar tabName={"Edit"} tabActive={true} noteId={noteId}/>
            </View>
    </View>
  );
}

const styles = StyleSheet.create({
  home: {
    flex: 1, // Allows home container to span the entire screen height
    paddingHorizontal: 20,
    backgroundColor: "#fff", // Ensures clean backdrop match
    flexDirection: "column",
    justifyContent: "space-between",
    maxHeight: 700,
  },
  itemsContainer: {
    paddingVertical: 20,
    gap: 12, // Cleans up separation spaces uniformly
  },
});
