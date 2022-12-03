import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { NotesProvider } from './src/context/NotesContext';
import { useState, useContext } from 'react';
import { TextInput, TouchableOpacity, Linking } from 'react-native';
import { NotesContext } from './src/context/NotesContext'
import { FlatList } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 2000);

function ShowNoteScreen({ route, navigation }) {
  const { id } = route.params
  const { state, dispatch } = useContext(NotesContext)
  const note = state.find((record) => {
    return record.id === id
  })

  return (
    <View style={{ flex: 1, marginTop: 10 }}>
      <Text style={styles.showNotesTitle}>{note.title}</Text>
      <Text style={styles.showNotesText}>{note.content}</Text>
    </View>
  )
}

function ListNotesScreen({ navigation }) {
  const { state, dispatch } = useContext(NotesContext)
  
  return (
    <View style={styles.notesListContainer}>
      <View style={styles.notesListButtonConatainer}>
        <Text>Add a Note</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("create")}>
          <Ionicons name="add-circle" size={50} color="#7671DE" />
        </TouchableOpacity>
      </View>

      <Text style={styles.notesListTitle}>Saved Notes</Text>
      <FlatList
        data={state}
        keyExtractor={item => item.title}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity onPress={() => navigation.navigate("show", { id: item.id })}>
              <View style={styles.notesList}>
                <Text style={styles.notesListNoteTitle}>{item.title}</Text>
                <Ionicons name="remove-circle" size={24} color="#7671DE"
                  onPress={() => dispatch({ type: "REMOVE", payload: item.id })}
                />
              </View>
            </TouchableOpacity>
          )
        }} />
        <Text style={styles.notesListLinkText}>Note Hints</Text>
        <Ionicons name="link" size={50} color="#7671DE" style={styles.notesListLink}
        onPress={ ()=>{ Linking.openURL('https://www.usf.edu/student-affairs/student-accessibility/documents/note-taking-strategies.pdf')}}/>
    </View>
  )
}

function CreateNoteScreen({ navigation }) {
  const { state, dispatch } = useContext(NotesContext)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  return (
    <View style={styles.createNoteContainer}>
      <Text style={styles.createNoteHeader}>Enter Title</Text>
      <TextInput
        value={title}
        onChangeText={(text) => setTitle(text)}
        style={styles.createNoteInput}>
      </TextInput>
      <Text style={styles.createNoteHeader}>Enter Note</Text>
      <TextInput
        value={content}
        onChangeText={(text) => setContent(text)}
        style={styles.createNoteInput}
        numberOfLines={3}
        multiline={true}
        >
      </TextInput>

      <View style={styles.createNoteButtonConatainer}>
      <Text>Save Note</Text>
        <TouchableOpacity
          onPress={() => {
            dispatch({ type: "ADD", payload: { title, content } })
            navigation.goBack()}}>
          <Ionicons name="ios-save" size={50} color="#7671DE" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const Stack = createStackNavigator()

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="notes"
          component={ListNotesScreen}
          options={{
            headerTitleAlign: "center",
            title: "Don't Lose It"
          }}
        />
        <Stack.Screen
          name="create"
          component={CreateNoteScreen}
          options={{
            headerTitleAlign: "center",
            title: "Create Note"
          }}
        />
        <Stack.Screen
          name="show"
          component={ShowNoteScreen}
          options={{
            headerTitleAlign: "center",
            title: "Note"
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default () => {
  return (
    <NotesProvider>
      <App />
    </NotesProvider>
  )
}

const styles = StyleSheet.create({
  notesListContainer: {
    flex: 1,
  },
  notesListButtonConatainer: {
    alignItems: "center",
    marginTop: 20
  },
  notesList: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginBottom: 5,
    padding: 10,
    backgroundColor: "white",
    elevation: 4
  },
  notesListTitle: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
    fontSize: 20
  },
  notesListNoteTitle: {
    fontSize: 22,
  },
  notesListLink: {
    marginBottom: 75,
    textAlign: 'center',
  },
  notesListLinkText: {
    fontSize: 20,
    textAlign: 'center',
  },


  showNotesTitle: {
    fontSize: 35,
    textAlign: "center"
  },
  showNotesText: {
    fontSize: 22,
    textAlign: "center"
  },


  createNoteHeader: {
    fontSize: 22,
    marginTop: 20,
    marginBottom: 20
  },
  createNoteInput: {
    outline: 0,
    fontSize: 20,
    borderBottomWidth: 1,
    borderColor: "grey",
    marginVertical: 8
  },
  createNoteContainer: {
    flex: 1,
    margin: 20
  },
  createNoteButtonConatainer: {
    alignItems: "center",
    marginTop: 20
  },

})