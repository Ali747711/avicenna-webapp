import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  doc, 
  deleteDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';

// Collection names
const CHAT_SESSIONS = 'chatSessions';

// Save a chat session
export const saveChatSession = async (userId, chatData) => {
  try {
    const docRef = await addDoc(collection(db, CHAT_SESSIONS), {
      userId,
      symptoms: chatData.symptoms,
      response: chatData.response,
      language: chatData.language,
      timestamp: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving chat session:', error);
    throw error;
  }
};

// Get user's chat history
export const getUserChatHistory = async (userId) => {
  try {
    const q = query(
      collection(db, CHAT_SESSIONS),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const chatHistory = [];
    
    querySnapshot.forEach((doc) => {
      chatHistory.push({
        id: doc.id,
        ...doc.data(),
      });
    });
    
    return chatHistory;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
};

// Delete a chat session
export const deleteChatSession = async (sessionId) => {
  try {
    await deleteDoc(doc(db, CHAT_SESSIONS, sessionId));
  } catch (error) {
    console.error('Error deleting chat session:', error);
    throw error;
  }
}; 