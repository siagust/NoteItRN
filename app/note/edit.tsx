import {useLocalSearchParams, useRouter} from 'expo-router';
import {useEffect, useRef, useState} from 'react';
import {
    View,
    TextInput,
    Alert,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Text,
    NativeSyntheticEvent,
    TextInputKeyPressEventData, Share,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Note} from '../../types/Note';
import * as Clipboard from 'expo-clipboard';
import {Ionicons, Feather} from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';

export default function NoteDetail() {
    const {id} = useLocalSearchParams();
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [clipboardText, setClipboardText] = useState('');
    const inputRef = useRef<TextInput>(null);

    useEffect(() => {
        const loadNote = async () => {
            const json = await AsyncStorage.getItem('notes');
            if (json && typeof id === 'string') {
                const notes: Note[] = JSON.parse(json);
                const target = notes.find(n => n.id === id);
                if (target) {
                    setTitle(target.title);
                    setContent(target.content);
                }
            }
        };
        loadNote();
        fetchClipboard();
    }, [id]);

    const fetchClipboard = async () => {
        const text = await Clipboard.getStringAsync();
        if (text) setClipboardText(text);
    };

    useEffect(() => {
        const saveNote = async () => {
            if (!id || typeof id !== 'string') return;
            const json = await AsyncStorage.getItem('notes');
            const notes: Note[] = json ? JSON.parse(json) : [];
            const index = notes.findIndex(n => n.id === id);
            if (index !== -1) {
                notes[index] = {id, title, content};
                await AsyncStorage.setItem('notes', JSON.stringify(notes));
            }
        };
        const timeout = setTimeout(saveNote, 500);
        return () => clearTimeout(timeout);
    }, [title, content]);

    const deleteNote = async () => {
        if (!id || typeof id !== 'string') return;
        Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
            {text: 'Cancel', style: 'cancel'},
            {
                text: 'Delete', style: 'destructive', onPress: async () => {
                    const json = await AsyncStorage.getItem('notes');
                    const notes: Note[] = json ? JSON.parse(json) : [];
                    const updated = notes.filter(n => n.id !== id);
                    await AsyncStorage.setItem('notes', JSON.stringify(updated));
                    router.replace('/');
                }
            }
        ]);
    };

    const handleBulletPress = () => {
        const bullet = '• ';
        setContent(prev => prev + '\n' + bullet);
    };

    const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
        if (e.nativeEvent.key === 'Enter') {
            const bullet = '• ';
            setTimeout(() => {
                setContent(prev => prev + bullet);
            }, 100);
        }
    };

    const shareNote = async () => {
        if (await Sharing.isAvailableAsync()) {
            await Share.share({
                message: `${title}\n\n${content}`,
            });
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.wrapper}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}><Ionicons name="arrow-back"
                                                                                                 size={22}/></TouchableOpacity>
                <View style={styles.topActions}>
                    <TouchableOpacity onPress={shareNote} style={styles.iconBtn}>
                        <Feather name="share-2" size={20}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={deleteNote} style={styles.iconBtn}>
                        <Ionicons name="trash" size={22}/>
                    </TouchableOpacity>
                </View>
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
                onKeyPress={handleKeyPress}
            />

            <View style={styles.toolBar}>
                <TouchableOpacity onPress={handleBulletPress} style={styles.toolBtn}>
                    <Ionicons name="list" size={16} color="#000"/>
                </TouchableOpacity>

                {clipboardText ? (
                    <TouchableOpacity
                        style={styles.clipTextBtn}
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
