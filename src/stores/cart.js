import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCartStore = defineStore('cart', () => {
  // Array of { categoryId, nomineeName, quantity }
  const votes = ref([]);

  const addVote = (categoryId, categoryName, nomineeName) => {
    const existingIndex = votes.value.findIndex(
      v => v.categoryId === categoryId && v.nomineeName === nomineeName
    );

    if (existingIndex > -1) {
      votes.value[existingIndex].quantity++;
    } else {
      votes.value.push({ categoryId, categoryName, nomineeName, quantity: 1 });
    }
  };

  const removeVote = (categoryId, nomineeName) => {
    const existingIndex = votes.value.findIndex(
      v => v.categoryId === categoryId && v.nomineeName === nomineeName
    );

    if (existingIndex > -1) {
      if (votes.value[existingIndex].quantity > 1) {
        votes.value[existingIndex].quantity--;
      } else {
        votes.value.splice(existingIndex, 1);
      }
    }
  };

  const getQuantity = (categoryId, nomineeName) => {
    const vote = votes.value.find(
      v => v.categoryId === categoryId && v.nomineeName === nomineeName
    );
    return vote ? vote.quantity : 0;
  };

  const totalVotes = computed(() => {
    return votes.value.reduce((total, vote) => total + vote.quantity, 0);
  });

  const totalCost = computed(() => {
    return totalVotes.value * 100; // ₦100 per vote
  });

  return {
    votes,
    addVote,
    removeVote,
    getQuantity,
    totalVotes,
    totalCost
  };
});
