import { ref } from 'vue';

export const categories = ref([
  { id: 1, name: 'Mr Depotter', nominees: [{ name: 'Ogundele Ayomide Daniel (Asiwaju)', currentVotes: 0 }], icon: '👨‍💼' },
  { id: 2, name: 'Miss Depotter', nominees: [{ name: 'Peters Modupe Pretty (Pretty)', currentVotes: 0 }, { name: 'Orebanwo Oluwanifemi Eniola (Ennymenny)', currentVotes: 0 }], icon: '👸' },
  { id: 3, name: 'Miss Academic excellence', nominees: [{ name: 'Ibitayo Joy Motunrola (Ola)', currentVotes: 0 }], icon: '📚' },
  { id: 4, name: 'Miss Approachable', nominees: [{ name: 'Ayodele Pelumi Bukola (Black Beauty)', currentVotes: 0 }], icon: '🤝' },
  { id: 5, name: 'Most popular Personality', nominees: [{ name: 'Adewuyi Oyindamola (Prinxy Oyin)', currentVotes: 0 }, { name: 'Yusuf Moraimo Idowu (Makanaki)', currentVotes: 0 }], icon: '🌟' },
  { id: 6, name: 'Most popular student (Female)', nominees: [{ name: 'Olaofe Shakira (Keerah)', currentVotes: 0 }, { name: 'Aderoju Ademide Tolulope (Mideykekere)', currentVotes: 0 }], icon: '🙋‍♀️' },
  { id: 7, name: 'Most Popular student (male)', nominees: [{ name: 'Akanni Hallleluyah Rock (Big Rock)', currentVotes: 0 }], icon: '🙋‍♂️' },
  { id: 8, name: 'Best Departmental Fresher (Male)', nominees: [{ name: 'Fadahunsi Mubarak (Sirfad)', currentVotes: 0 }, { name: 'Oyetunji Timileyin (Timmy)', currentVotes: 0 }], icon: '🌱' },
  { id: 9, name: 'Best Departmental Fresher (Female)', nominees: [{ name: 'Inmo Hope Lydia (Unique)', currentVotes: 0 }], icon: '🌱' },
  { id: 10, name: 'Sophomore of the Year', nominees: [{ name: 'Lawson Oluwabukunmi Sophia (Lewa)', currentVotes: 0 }], icon: '🎓' },
  { id: 11, name: 'Icon of the Year', nominees: [{ name: 'Ogunyale Esther (Irebowale)', currentVotes: 0 }], icon: '👑' },
  { id: 12, name: 'Most Social (Male)', nominees: [{ name: 'Soyomi Gabriel Oluwamayowa (Hàrdéx)', currentVotes: 0 }], icon: '🕺' },
  { id: 13, name: 'Most Social (Female)', nominees: [{ name: 'Ojoye Moyosore Adeshewa (Desewa)', currentVotes: 0 }], icon: '💃' },
  { id: 14, name: 'Miss Petite', nominees: [{ name: 'Isiaka Opeyemi (Portable)', currentVotes: 0 }], icon: '👗' },
  { id: 15, name: 'Most Popular Brand', nominees: [{ name: 'Sanyaolu Ifeoluwa (Larposh)', currentVotes: 0 }], icon: '🛍️' },
  { id: 16, name: 'Skincare Therapist', nominees: [{ name: 'Sanyaolu Ifeoluwa (Larposh)', currentVotes: 0 }], icon: '💆‍♀️' },
  { id: 17, name: 'Most Outstanding (Female)', nominees: [{ name: 'Ogige Deborah Godsgift (Empress Debbie)', currentVotes: 0 }], icon: '✨' },
  { id: 18, name: 'Miss Sophisticated', nominees: [{ name: 'Jenkeo Sunmisola Mary (Sunmi)', currentVotes: 0 }], icon: '💎' },
  { id: 19, name: 'Most Handsome', nominees: [{ name: 'Nmega Victor Ayomide (Foden)', currentVotes: 0 }], icon: '😎' },
  { id: 20, name: 'Miss Endowed', nominees: [{ name: 'Erinjogunola Sofiat (AJ)', currentVotes: 0 }], icon: '🔥' },
  { id: 21, name: 'Most Expensive', nominees: [{ name: 'Omijie Success Osemudiamen (Love)', currentVotes: 0 }], icon: '💰' },
  { id: 22, name: 'Miss ebony', nominees: [{ name: 'Olatunji Zainab Oyindamola (Oyinherself)', currentVotes: 0 }, { name: 'Ojo Mary Kemi (Kemz)', currentVotes: 0 }], icon: '🍫' },
  { id: 23, name: 'Entrepreneur of The Year', nominees: [{ name: 'Adeponle Gbemisola Janet (Gbemiponmo)', currentVotes: 0 }], icon: '💼' },
  { id: 24, name: 'Best Departmental Student', nominees: [{ name: 'Yusuf Habeeb (Yuslad)', currentVotes: 0 }], icon: '👨‍🎓' },
  { id: 25, name: 'Miss pretty', nominees: [{ name: 'Owolabi Aisha (Humaira)', currentVotes: 0 }], icon: '🌸' },
  { id: 26, name: 'Most reserved personality', nominees: [{ name: 'Owolabi Aisha (Humaira)', currentVotes: 0 }], icon: '🤐' },
  { id: 27, name: 'Most Loved', nominees: [{ name: 'Olaofe Shakira (Keerah)', currentVotes: 0 }], icon: '❤️' },
  { id: 28, name: 'Most influential Student of the Year', nominees: [{ name: 'Ogundaini Solomon (Wizzle)', currentVotes: 0 }], icon: '🌟' }
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
    // Robust search using Number() for ID and trim() for name
    const category = categories.value.find(c => Number(c.id) === Number(vote.categoryId));
    if (category) {
      const nominee = category.nominees.find(n => n.name.trim() === vote.nomineeName.trim());
      if (nominee) {
        nominee.currentVotes += Number(vote.quantity || 0);
      } else {
        console.warn(`Nominee not found: "${vote.nomineeName}" in category: "${category.name}"`);
      }
    } else {
      console.warn(`Category ID not found: ${vote.categoryId} for nominee: ${vote.nomineeName}`);
    }
  });
};

