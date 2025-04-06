import {View, FlatList, Text, TouchableOpacity, StyleSheet, TextInput, SafeAreaView} from 'react-native';
import {useFocusEffect, useRouter} from 'expo-router';
import {useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Note} from '../types/Note';
import SearchBar from '../components/SearchBar';
import {Ionicons} from '@expo/vector-icons';
import {useCallback} from 'react';

function highlightMatch(text: string, query: string) {
    if (!query) return <Text>{text}</Text>;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return (
        <Text>
            {parts.map((part, i) => (
                regex.test(part) ? (
                    <Text key={i} style={{color: 'yellow'}}>{part}</Text>
                ) : (
                    <Text key={i}>{part}</Text>
                )
            ))}
        </Text>
    );
}


export default function HomeScreen() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [search, setSearch] = useState('');
    const router = useRouter();

    useFocusEffect(
        useCallback(() => {
            const loadNotes = async () => {
                const json = await AsyncStorage.getItem('notes');
                console.log(json);
                if (json) setNotes(JSON.parse(json));
            };
            loadNotes();
        }, [])
    );


    const filteredNotes = [
        {id: 'add-note', title: 'Add meaning title here', content: 'Add marvelious detail for your notes'},
        ...notes.filter(n =>
            n.title.toLowerCase().includes(search.toLowerCase()) ||
            n.content.toLowerCase().includes(search.toLowerCase())
        ),
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Note!t</Text>
                <TouchableOpacity>
                    <Ionicons name="filter" size={24} color="black" style={styles.filter}/>
                </TouchableOpacity>
            </View>

            <SearchBar value={search} onChange={setSearch}/>

            <FlatList
                data={filteredNotes}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.list}
                renderItem={({item, index}) => (
                    <TouchableOpacity
                        onPress={() => {
                            if (item.id === 'add-note') {
                                router.push('/note/new');
                            } else {
                                router.push({pathname: '/note/edit', params: {id: item.id}});
                            }
                        }}
                        style={[styles.card, item.id === 'add-note' ? styles.addCard : {}]}
                    >
                        <Text style={[styles.cardTitle, item.id === 'add-note' && {color: '#fff'}]}>
                            {item.id === 'add-note' ? item.title : highlightMatch(item.title, search)}
                        </Text>
                        <Text numberOfLines={6} style={[styles.cardContent, item.id === 'add-note' && {color: '#fff'}]}>
                            {item.id === 'add-note' ? item.content : highlightMatch(item.content, search)}
                        </Text>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#fff', paddingHorizontal: 16},
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10
    },
    title: {padding: 4, fontSize: 26, fontWeight: 'bold'},
    row: {justifyContent: 'space-between'},
    list: {paddingBottom: 100},
    card: {
        flex: 1,
        marginBottom: 12,
        borderRadius: 12,
        padding: 12,
        minHeight: 100,
        marginHorizontal: 6,
        marginVertical: 4,
        backgroundColor: '#dbdee4'
    },
    addCard: {
        backgroundColor: '#000',
    },
    cardTitle: {fontSize: 16, fontWeight: 'bold', marginBottom: 6},
    cardContent: {fontSize: 14, color: '#333'},
    filter: {
        marginRight: 4
    }
});
