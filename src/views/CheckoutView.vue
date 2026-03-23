<script setup>
import { ref, onMounted } from 'vue';
import { useCartStore } from '../stores/cart';
import { useAdminStore } from '../stores/admin';
import { useDeadlineStore } from '../stores/deadline';
import { useRouter } from 'vue-router';

const cartStore = useCartStore();
const adminStore = useAdminStore();
const deadlineStore = useDeadlineStore();
const router = useRouter();

const receiptFile = ref(null);
const receiptPreview = ref(null);
const isProcessing = ref(false);

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  receiptFile.value = file;
  
  // Use createObjectURL for immediate UI feedback (faster than FileReader)
  receiptPreview.value = URL.createObjectURL(file);

  const reader = new FileReader();
  
  reader.onerror = () => {
    console.error('FileReader error');
    alert('Failed to read the file. Please try again or use a different image.');
  };

  reader.onload = (event) => {
    const img = new Image();
    img.onload = () => {
      // Create canvas for compression
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Max dimensions to keep it under localStorage/Firestore limits
      const MAX_WIDTH = 1200;
      const MAX_HEIGHT = 1200;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // Compress to JPEG with 0.6 quality (better for storage)
      const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6);
      
      // Update the preview with the actual data that will be sent
      receiptPreview.value = compressedDataUrl;
      
      console.log('Original size:', (file.size / 1024 / 1024).toFixed(2), 'MB');
      console.log('Compressed size:', (compressedDataUrl.length * 3/4 / 1024 / 1024).toFixed(2), 'MB');
    };
    img.onerror = () => {
      alert('Failed to process image. Please try a different receipt image.');
    };
    img.src = event.target.result;
  };
  
  reader.readAsDataURL(file);
};

const handlePayment = async () => {
  if (!receiptFile.value) {
    alert('Please upload your payment receipt.');
    return;
  }

  isProcessing.value = true;
  
  // Create transaction object for Firestore
  const transactionData = {
    receiptImage: receiptPreview.value,
    votes: JSON.parse(JSON.stringify(cartStore.votes)),
    totalCost: cartStore.totalCost
  };

  try {
    // Submit to Firestore with a timeout to prevent hanging "rolling" spinner
    console.log('Attempting to save core transaction to Firestore...');
    const dbPromise = adminStore.submitTransaction(transactionData);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database timeout - check your Firebase connection or Security Rules')), 10000)
    );

    const txId = await Promise.race([dbPromise, timeoutPromise]);
    console.log('Firestore save successful');
    
    // Save image to the receipts collection
    console.log('Attempting to save receipt image to receipts collection...');
    await adminStore.submitReceiptImage(txId, transactionData.receiptImage);

    alert('Submission successful! Your votes are now pending admin confirmation. They will count once the admin confirms your payment.');
    cartStore.$patch({ votes: [] });
    router.push('/');
  } catch (error) {
    console.error('Submission Error:', error);
    
    if (error.message.includes('Database timeout')) {
       alert('The submission is taking too long. Please check your internet connection and ensure your Firebase Firestore Security Rules are set to "Test Mode" or allow public writes.');
    } else {
       // Try one last time or just notify
       try {
         const txId = await adminStore.submitTransaction(transactionData);
         await adminStore.submitReceiptImage(txId, transactionData.receiptImage);
         alert('Votes submitted finally! (There were initial network delays).');
         cartStore.$patch({ votes: [] });
         router.push('/');
       } catch (finalError) {
         alert('Failed to submit. Error: ' + error.message);
       }
    }
  } finally {
    isProcessing.value = false;
  }
};


const goBack = () => {
  router.back();
};

onMounted(() => {
  // If deadline has passed, redirect back to home
  if (deadlineStore.isExpired) {
    alert('Voting has concluded. You cannot make any new payments.');
    router.push('/');
    return;
  }
  
  // If cart is empty, redirect back to home
  if (cartStore.totalVotes === 0) {
    router.push('/');
  }
});
</script>

<template>
  <main class="max-w-3xl mx-auto px-6 py-12 pb-32">
    <!-- Header -->
    <div class="mb-8 flex items-center gap-4">
      <button @click="goBack" class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-chocolate hover:bg-cream border border-chocolate/10 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <h1 class="text-3xl font-serif font-black text-chocolate uppercase tracking-wide">
        Checkout Summary
      </h1>
    </div>

    <div class="bg-white rounded-[2rem] p-8 shadow-sm border border-chocolate/5 space-y-8">
      
      <!-- Votes Summary Section -->
      <section>
        <div class="flex items-center justify-between mb-4 border-b border-chocolate/10 pb-2">
          <h2 class="text-xl font-bold text-chocolate">Your Votes</h2>
          <span class="text-xs font-bold text-chocolate/30 uppercase tracking-widest">Bank Transfer Payment</span>
        </div>
        <div class="space-y-4">
          <div v-for="(vote, index) in cartStore.votes" :key="index" class="flex justify-between items-center py-2 border-b border-chocolate/5 last:border-0">
            <div>
              <p class="font-bold text-chocolate">{{ vote.nomineeName }}</p>
              <p class="text-sm text-chocolate/50">{{ vote.categoryName }}</p>
            </div>
            <div class="text-right">
              <p class="font-bold text-chocolate bg-cream px-3 py-1 rounded-full">{{ vote.quantity }} votes</p>
              <p class="text-sm text-chocolate/50 mt-1">₦{{ (vote.quantity * 100).toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <!-- Total Row -->
        <div class="mt-6 pt-4 border-t-2 border-chocolate/10 flex justify-between items-center text-xl font-black text-chocolate uppercase tracking-wide">
          <span>Total</span>
          <span>₦{{ cartStore.totalCost.toLocaleString() }}</span>
        </div>
      </section>

      <!-- Bank Transfer Payment Instructions -->
      <section class="bg-cream-dark p-6 rounded-2xl border border-chocolate/5">
        <h2 class="text-xl font-bold text-chocolate mb-4">Step 1: Make Transfer</h2>
        <p class="text-chocolate/80 mb-6">
          Please make a transfer of <span class="font-bold">₦{{ cartStore.totalCost.toLocaleString() }}</span> to the bank account below.
        </p>
        
        <div class="bg-white border border-chocolate/10 rounded-xl p-6 mb-6">
          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <span class="text-sm font-medium text-chocolate/50 uppercase tracking-wider">Bank Name</span>
              <span class="text-lg font-bold text-chocolate">Moniepoint</span>
            </div>
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <span class="text-sm font-medium text-chocolate/50 uppercase tracking-wider">Account Number</span>
              <span class="text-xl font-black text-[#09A588]">9043036911</span>
            </div>
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <span class="text-sm font-medium text-chocolate/50 uppercase tracking-wider">Account Name</span>
              <span class="text-md font-bold text-chocolate text-right">FASHOLA TOLULOPE OLADAPO</span>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 border border-chocolate/10 space-y-6 mb-6">
          <h3 class="font-bold text-chocolate flex items-center gap-2">
            <span class="bg-[#09A588] text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
            Submit Proof of Payment
          </h3>
          
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-chocolate/70 mb-1">Upload Transfer Receipt</label>

              <div class="relative group">
                <input 
                  type="file" 
                  accept="image/*" 
                  @change="handleFileChange" 
                  class="hidden" 
                  id="receipt-upload"
                />
                <label 
                  for="receipt-upload" 
                  class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-chocolate/20 rounded-xl cursor-pointer hover:bg-chocolate/5 hover:border-[#09A588] transition-all bg-chocolate/5 overflow-hidden"
                >
                  <template v-if="!receiptPreview">
                    <svg class="w-8 h-8 text-chocolate/30 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span class="text-sm text-chocolate/50 font-medium">Click to upload receipt image</span>
                  </template>
                  <template v-else>
                    <img :src="receiptPreview" class="absolute inset-0 w-full h-full object-cover" />
                    <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span class="text-white text-xs font-bold uppercase tracking-widest">Change Image</span>
                    </div>
                  </template>
                </label>
              </div>
            </div>
          </div>
        </div>

        <form @submit.prevent="handlePayment" class="space-y-4">
          <button 
            type="submit" 
            :disabled="isProcessing"
            class="w-full bg-[#09A588] hover:bg-[#07856d] text-white font-bold py-4 px-8 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <svg v-if="!isProcessing" class="w-5 h-5 bg-white rounded-full text-[#09A588] p-[2px]" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            <svg v-else class="animate-spin w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isProcessing ? 'Submitting...' : 'Submit Proof of Payment' }}
          </button>
          
          <p class="text-xs text-center text-chocolate/50 mt-4 leading-relaxed">
            By clicking this button, you confirm that you have made the transfer to the above account and uploaded the correct receipt. Votes will count after admin confirmation.
          </p>
        </form>
      </section>
      
    </div>
  </main>
</template>
