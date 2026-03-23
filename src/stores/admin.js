import { defineStore } from "pinia";
import { ref, onMounted } from "vue";
import { useCategoriesStore } from "./categories";
import { db } from "../firebase";
import { 
  collection, 
  addDoc, 
  updateDoc,
  setDoc,
  getDoc,
  doc, 
  onSnapshot, 
  query, 
  orderBy 
} from "firebase/firestore";

export const useAdminStore = defineStore("admin", () => {
  const pendingTransactions = ref([]);
  const categoriesStore = useCategoriesStore();

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
      
      const allVotes = approved
        .filter(t => t.votes && Array.isArray(t.votes))
        .flatMap(t => t.votes);
        
      categoriesStore.applyApprovedVotes(allVotes);
    }, (error) => {
      console.error("FIRESTORE LISTENER ERROR:", error);
      alert("Database error: " + error.message + ". Please refresh the page. If issue persists, check your Firestore Security Rules.");
    });
  };


  // Call initListener immediately
  initListener();

  const submitTransaction = async (transactionData) => {
    try {
      // Ensure status is included, defaulting to 'pending' if not provided
      const { receiptImage, ...dataWithoutImage } = transactionData;
      const finalData = {
        timestamp: new Date().toISOString(),
        status: dataWithoutImage.status || 'pending',
        ...dataWithoutImage
      };
      
      const docRef = await addDoc(collection(db, "transactions"), finalData);
      return docRef.id;
    } catch (error) {
      console.error("Error adding transaction: ", error);
      throw error;
    }
  };

  const submitReceiptImage = async (transactionId, imageBase64) => {
    try {
      const docRef = doc(db, "receipts", transactionId);
      await setDoc(docRef, { receiptImage: imageBase64 });
    } catch (error) {
      console.error("Error adding receipt image: ", error);
      throw error;
    }
  };

  const getReceiptImage = async (transactionId) => {
    try {
      const docRef = doc(db, "receipts", transactionId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data().receiptImage;
      }
      return null;
    } catch (error) {
      console.error("Error fetching receipt image: ", error);
      return null;
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
    submitReceiptImage,
    getReceiptImage,
    approveTransaction,
    rejectTransaction,
  };
});

