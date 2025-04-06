import {TextInput, View, StyleSheet} from 'react-native';
import {Ionicons} from "@expo/vector-icons";

export default function SearchBar({value, onChange}: { value: string; onChange: (text: string) => void }) {
    return (
        <View style={styles.wrapper}>
            <Ionicons name="search" size={24} style={styles.icon}/>
            <TextInput
                placeholder="Search notes..."
                value={value}
                onChangeText={onChange}
                style={styles.input}
                placeholderTextColor={'#3a3939'}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 12,
        padding: 4,
        backgroundColor: '#bcc1c1',
        borderRadius: 12,
        margin: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        height: 48,
        fontSize:16,
        flex: 1,
        textDecorationColor: 'white',
    },
    icon: {
        left: 10, // Place the icon on the left side,
        marginRight: 12,
        color: '#6a6767'
    }
});