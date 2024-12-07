<script setup lang="ts">
import { ref, watch } from 'vue'

const currentSlide = ref(2)
const slides = 3 // Nombre total d'images

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % slides
}

function prevSlide() {
  currentSlide.value = (currentSlide.value - 1 + slides) % slides
}

watch(currentSlide, (newSlide) => {
  document.documentElement.style.setProperty('--current-slide', newSlide)
})
</script>

<template>
  <main>
    <div id="carousel" class="carousel">
      <div>
        <button class="contrast" @click="prevSlide">
          ‹
        </button>
        <button class="contrast" style="right: 0em" @click="nextSlide">
          ›
        </button>
      </div>
      <div class="carousel-track">
        <img src="@/assets/images/1000x400.png" alt="Slide 1">
        <img src="@/assets/images/1000x400.png" alt="Slide 2">
        <img src="@/assets/images/1000x400.png" alt="Slide 3">
      </div>
    </div>
    <div id="content">
      <div id="best">
        <h3>Best</h3>
        <div class="product">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
        </div>
      </div>
      <div id="new">
        <h3>Nouveauté</h3>
        <div class="product">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
          <img src="@/assets/images/125x200.png" alt="DummyProduct">
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.carousel {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 100%;
  height: 15em;
  margin: auto;
  position: relative;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s ease-in-out;
  transform: translateX(calc(-100% * var(--current-slide, 0)));
  width: 100%;
}

.carousel img {
  width: 100%;
  height: fit-content;
  flex-shrink: 0;
  border-radius: var(--radius);
}

button.contrast {
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 0.5em 1em;
  cursor: pointer;
  font-size: 1.2rem;
  border-radius: 0.3em;
  flex-shrink: 0;
  z-index: 2;
}

button.contrast:hover {
  background: rgba(0, 0, 0, 0.7);
}

#content {
  margin-left: 1.5em;
}

.product img {
  margin-right: 1.2em;
  margin-bottom: 1.5em;
}

#best {
  margin-top: 1.6em;
  margin-bottom: 3em;
}
</style>
