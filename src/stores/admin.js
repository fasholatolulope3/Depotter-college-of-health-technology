import { defineStore } from "pinia";
import { ref, onMounted } from "vue";
import { applyApprovedVotes } from "./categories";
import { db } from "../firebase";
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy 
} from "firebase/firestore";

export const useAdminStore = defineStore("admin", () => {
  const pendingTransactions = ref([]);

  // Initialize real-time listener
  const initListener = () => {
    const q = query(collection(db, "transactions"), orderBy("timestamp", "desc"));
    onSnapshot(q, (snapshot) => {
      pendingTransactions.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Update totals in categories store based on approved transactions
      const approved = pendingTransactions.value.filter(t => t.status === 'approved');
      // Reset votes first to avoid double counting if needed, or handle in applyApprovedVotes
      // For simplicity, we'll re-apply all approved votes
      // Note: categories.js needs to handle this reset/re-apply
      applyApprovedVotes(approved.flatMap(t => t.votes));
    });
  };

  // Call initListener immediately
  initListener();

  const submitTransaction = async (transactionData) => {
    try {
      const docRef = await addDoc(collection(db, "transactions"), {
        timestamp: new Date().toISOString(),
        status: 'pending',
        ...transactionData
      });
      return docRef.id;
    } catch (error) {
      console.error("Error adding transaction: ", error);
      throw error;
    }
  };

  const approveTransaction = async (id) => {
    try {
      const docRef = doc(db, "transactions", id);
      await updateDoc(docRef, {
        status: 'approved'
      });
    } catch (error) {
      console.error("Error approving transaction: ", error);
    }
  };

  const rejectTransaction = async (id) => {
    try {
      const docRef = doc(db, "transactions", id);
      await updateDoc(docRef, {
        status: 'rejected'
      });
    } catch (error) {
      console.error("Error rejecting transaction: ", error);
    }
  };

  return {
    pendingTransactions,
    submitTransaction,
    approveTransaction,
    rejectTransaction,
  };
});

