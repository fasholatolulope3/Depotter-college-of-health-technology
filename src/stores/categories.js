import { ref } from 'vue';

export const categories = ref([
  { id: 1, name: 'MR DE POTTER', nominees: [{ name: 'Ogundele Ayomide Daniel', currentVotes: 0 }], icon: '👨‍💼' },
  { id: 2, name: 'MISS DE POTTER', nominees: [{ name: 'Orebanwo oluwanifemi Eniola', currentVotes: 0 }, { name: 'Peters Modupe Pretty', currentVotes: 0 }], icon: '👸' },
  { id: 3, name: 'Most Popular Personality', nominees: [{ name: 'Adewuyi Oyindamola', currentVotes: 0 }, { name: 'Yusuf Moriamo Idowu (Makanaki)', currentVotes: 0 }], icon: '🌟' },
  { id: 4, name: 'Most Popular Student', nominees: [{ name: 'Shakira olaofe', currentVotes: 0 }], icon: '🙋‍♂️' },
  { id: 5, name: 'Most Popular Student (Female)', nominees: [{ name: 'Aderoju Ademide Tolulope', currentVotes: 0 }], icon: '🙋‍♀️' },
  { id: 6, name: 'Best Departmental Fresher', nominees: [{ name: 'Fadahunsi Mubarak', currentVotes: 0 }], icon: '🌱' },
  { id: 7, name: 'Icon of the Year', nominees: [{ name: 'Ogunyale Esther', currentVotes: 0 }], icon: '👑' },
  { id: 8, name: 'Most Social Male', nominees: [{ name: 'Soyomi Gabriel oluwamayowa', currentVotes: 0 }], icon: '🕺' },
  { id: 9, name: 'Most Social Female', nominees: [{ name: 'Ojoye Moyosoreoluwa Adesewa', currentVotes: 0 }], icon: '💃' },
  { id: 10, name: 'Most Popular Male', nominees: [{ name: 'Akanni halleluyah Rock', currentVotes: 0 }], icon: '🙋‍♂️' },
  { id: 11, name: 'Miss Petite', nominees: [{ name: 'Isiaka Opeyemi', currentVotes: 0 }], icon: '👗' },
  { id: 12, name: 'Most Popular Brand', nominees: [{ name: 'sanyaolu ifeoluwa', currentVotes: 0 }], icon: '🛍️' },
  { id: 13, name: 'Skincare Therapist', nominees: [{ name: 'sanyaolu ifeoluwa (CEO of Larposh)', currentVotes: 0 }], icon: '💆‍♀️' },
  { id: 14, name: 'Most Outstanding Female', nominees: [{ name: 'Ogige Deborah Godsgift', currentVotes: 0 }], icon: '✨' },
  { id: 15, name: 'Miss Sophisticated', nominees: [{ name: 'Jenkeo Sunmisola Mary', currentVotes: 0 }], icon: '💎' },
  { id: 16, name: 'Best Departmental Fresher (Female)', nominees: [{ name: 'Inmo Hope Lydia', currentVotes: 0 }], icon: '🌱' },
  { id: 17, name: 'Most Handsome', nominees: [{ name: 'Nmega Victor Ayomide', currentVotes: 0 }], icon: '😎' },
  { id: 18, name: 'Miss ENDOWED', nominees: [{ name: 'Erinjogunola sofiat', currentVotes: 0 }], icon: '🔥' },
  { id: 19, name: 'Most Expensive', nominees: [{ name: 'Omijie Success Osemudiamen', currentVotes: 0 }], icon: '💰' },
  { id: 20, name: 'Best Departmental Fresher (Male)', nominees: [{ name: 'Oyetunji Timileyin', currentVotes: 0 }], icon: '🌱' },
  { id: 21, name: 'Miss Ebony', nominees: [{ name: 'Olatunji Zainab oyindamola', currentVotes: 0 }, { name: 'ojo Mary kemi', currentVotes: 0 }], icon: '🍫' },
  { id: 22, name: 'Best Departmental Student (Male)', nominees: [{ name: 'Yusuf Habeeb', currentVotes: 0 }], icon: '👨‍🎓' },
  { id: 23, name: 'Miss Pretty', nominees: [{ name: 'Owolabi Aisha', currentVotes: 0 }], icon: '🌸' },
  { id: 24, name: 'Most Reserved Personality', nominees: [{ name: 'Owolabi Aisha', currentVotes: 0 }], icon: '🤐' },
  { id: 25, name: 'Most Loved', nominees: [{ name: 'Shakirat olaofe', currentVotes: 0 }], icon: '❤️' },
  { id: 26, name: 'Most Influential Student of the Year', nominees: [{ name: 'Ogundaini solomon (WIZZLE)', currentVotes: 0 }], icon: '🌟' }
]);

export const applyApprovedVotes = (approvedVotesArray) => {
  // Reset all current votes to 0 first to prevent double-counting during real-time updates
  categories.value.forEach(category => {
    category.nominees.forEach(nominee => {
      nominee.currentVotes = 0;
    });
  });

  // Apply the approved votes
  approvedVotesArray.forEach(vote => {
    const category = categories.value.find(c => c.id === vote.categoryId);
    if (category) {
      const nominee = category.nominees.find(n => n.name === vote.nomineeName);
      if (nominee) {
        nominee.currentVotes += vote.quantity;
      }
    }
  });
};

