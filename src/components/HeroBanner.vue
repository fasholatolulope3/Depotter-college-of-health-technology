<template>
  <section 
    class="relative w-full py-16 px-6 md:px-12 text-cream overflow-hidden" 
    style="background-image: url('/hero-bg.jpeg'); background-size: cover; background-position: center;"
  >
    <!-- Overlay to ensure text readability -->
    <div class="absolute inset-0 bg-chocolate/80 backdrop-blur-[2px]"></div>

    <!-- Subtle circular accents -->
    <div class="absolute top-[-10%] right-[-5%] w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
    <div class="absolute bottom-[-10%] left-[-5%] w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>

    <div class="relative max-w-7xl mx-auto space-y-6 z-10">
      <span class="inline-block px-3 py-1 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-xs font-semibold uppercase tracking-wider shadow-sm">
        Depotter College of Health Technology
      </span>
      
      <h1 class="text-4xl md:text-6xl font-serif font-bold leading-tight drop-shadow-md">
        Awards & Voting
      </h1>
      
      <p class="text-lg md:text-xl text-cream/90 max-w-2xl font-light leading-relaxed drop-shadow">
        Support your favorite candidates by voting in the categories below. 
        Each vote costs <span class="font-semibold text-white">₦100</span> and you can vote multiple times!
      </p>
    </div>
  </section>
</template>
