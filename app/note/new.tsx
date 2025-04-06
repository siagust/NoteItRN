import {useEffect, useRef, useState} from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Text,
    NativeSyntheticEvent, TextInputKeyPressEventData
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Note} from '@/types/Note';
import uuid from 'react-native-uuid';
import {useRouter} from 'expo-router';
import {Ionicons} from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

export default function NewNote() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const router = useRouter();
    const [clipboardText, setClipboardText] = useState('');
    const inputRef = useRef<TextInput>(null);
    const [isNewNote, setIsNewNote] = useState(true); // Add a flag to track if the note is new

    useEffect(() => {
        const saveNote = async () => {
            if (!title && !content) return;

            let newNote: Note;
            if (isNewNote) {
                newNote = {id: uuid.v4().toString(), title, content};
                setIsNewNote(false); // Mark the note as saved
            } else {
                // If the note is not new, find the existing note and update it
                const json = await AsyncStorage.getItem('notes');
                const notes: Note[] = json ? JSON.parse(json) : [];
                const existingNoteIndex = notes.findIndex(n => n.title === title && n.content === content);
                if (existingNoteIndex !== -1) {
                    newNote = notes[existingNoteIndex];
                    newNote.title = title;
                    newNote.content = content;
                } else {
                    // This should not happen in normal cases, but handle it just in case
                    newNote = {id: uuid.v4().toString(), title, content};
                }
            }

            const json = await AsyncStorage.getItem('notes');
            const notes: Note[] = json ? JSON.parse(json) : [];
            if (isNewNote) {
                notes.unshift(newNote);
            } else {
                const existingNoteIndex = notes.findIndex(n => n.id === newNote.id);
                if (existingNoteIndex !== -1) {
                    notes[existingNoteIndex] = newNote;
                }
            }

            await AsyncStorage.setItem('notes', JSON.stringify(notes));

            router.back();
        };

        const timeout = setTimeout(saveNote, 1000);
        return () => clearTimeout(timeout);
    }, [title, content, isNewNote]);

    useEffect(() => {
        fetchClipboard();
    }, []);

    const fetchClipboard = async () => {
        const text = await Clipboard.getStringAsync();
        if (text) setClipboardText(text);
    };

    const handleBulletPress = () => {
        const bullet = '• ';
        setContent(prev => (prev.length === 0 || prev.endsWith('\n') ? prev + bullet : prev + '\n' + bullet));
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.wrapper}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}><Ionicons name="arrow-back"
                                                                                                 size={22}/></TouchableOpacity>
            </View>

            <TextInput
                style={styles.title}
                placeholder="Note Title"
                value={title}
                onChangeText={setTitle}
            />

            <TextInput
                ref={inputRef}
                style={styles.content}
                placeholder="Write your note..."
                multiline
                value={content}
                onChangeText={setContent}
            />

            <View style={styles.toolBar}>
                <TouchableOpacity onPress={handleBulletPress} style={styles.toolBtn}>
                    <Ionicons name="list" size={16} color="#000"/>
                </TouchableOpacity>

                {clipboardText ? (
                    <TouchableOpacity style={styles.clipTextBtn}
                                      onPress={() => setContent(prev => prev + clipboardText)}>
                        <Text numberOfLines={1} style={styles.clipText}>{clipboardText}</Text>
                    </TouchableOpacity>
                ) : null}
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    wrapper: {flex: 1, padding: 16, backgroundColor: '#fff'},
    topBar: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12},
    iconBtn: {padding: 8, borderRadius: 8, backgroundColor: '#f2f2f2', marginLeft: 4},
    topActions: {flexDirection: 'row', gap: 10},
    title: {fontSize: 24, fontWeight: 'bold', marginBottom: 10},
    content: {flex: 1, fontSize: 18, marginTop: 10, textAlignVertical: 'top'},
    toolBar: {flexDirection: 'row', paddingTop: 10, alignItems: 'center'},
    toolBtn: {marginRight: 12, padding: 6, borderRadius: 6, backgroundColor: '#f2f2f2'},
    clipTextBtn: {flex: 1, backgroundColor: '#dce1e6', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6},
    clipText: {fontSize: 14, color: '#333'},
});