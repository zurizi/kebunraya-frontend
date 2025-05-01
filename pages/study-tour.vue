<template>
  <div class="relative min-h-screen">
    <div
      class="relative z-20 flex flex-col w-full px-4 py-12 mx-auto space-y-4 max-w-7xl sm:px-6 lg:px-8"
    >
      <Splide :options="options">
        <SplideSlide class="relative md:h-[275px] xl:h-[300px] h-[250px]">
          <Image
            src="/pages/home/hero-bg.png"
            class="relative z-0 object-cover w-full"
            alt=""
          />
        </SplideSlide>
      </Splide>
      <div class="flex flex-col space-y-2">
        <h1 class="text-3xl">Study Tour</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur. Diam adipiscing vulputate
          sodales pellentesque. Leo sit morbi sagittis nibh dignissim. Ut
          dignissim adipiscing egestas venenatis egestas ridiculus neque sed.
        </p>
        <p>
          Elementum nulla velit viverra et vel risus interdum. Et tincidunt
          velit egestas duis ultrices. Iaculis nec ac faucibus faucibus
          suspendisse ultrices est. Orci vulputate in sed pellentesque malesuada
          morbi. Quam a fames dapibus eu arcu urna sagittis semper hac. Non
          adipiscing vulputate diam facilisis nam convallis. Egestas lectus
          faucibus non tincidunt leo tincidunt leo. In gravida at turpis mauris
          non dignissim sem id tellus.
        </p>
        <p>
          Risus luctus aenean ultricies vestibulum eu eget. Mattis vitae
          pellentesque elementum molestie condimentum vestibulum nisl sed. Vitae
          mattis vitae nullam justo massa hendrerit. Quam vestibulum lorem
          facilisis facilisi penatibus nisl nulla est sit. Quam in in id
          fringilla eget libero arcu nullam erat. Urna mattis augue egestas
          volutpat. Ornare nec felis amet aliquet tempor consectetur. Turpis sed
          praesent porttitor posuere. Vel semper consectetur porta odio ut.
          Risus sodales dapibus hendrerit risus. Semper diam aliquet tellus
          consectetur adipiscing massa. Eget mattis ut tristique elit ornare
          quis tempor. Ac quis odio a nec. Porttitor tellus arcu consequat
          aliquet ut pellentesque. Donec est amet mauris maecenas maecenas quis
          mollis. Velit dui diam mi risus.
        </p>
        <p>
          Tempus amet ornare bibendum massa commodo aliquet lacinia amet
          pretium. Faucibus venenatis id lacinia sagittis vitae lectus accumsan
          enim odio. Cras quis risus imperdiet et. Massa et neque nunc eget
          ipsum ullamcorper et tempor. Sagittis nunc ac in proin libero metus
          amet pharetra libero.
        </p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { Splide, SplideSlide } from "@splidejs/vue-splide";
import "@splidejs/vue-splide/css";

const options = {
  type: "loop",
  perPage: 1,
  autoplay: true,
  interval: 5000,
  rewind: true,
  width: "100%",
  arrows: true,
  pagination: true,
};
</script>

<style scoped>
.slide-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}
</style>
<style>
.slide-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
}

button.splide__arrow {
  background-color: #f5f5f9;
  font-size: 12px;
  width: 40px;
  height: 50px;
  line-height: 40px;
  transition: background-color 0.3s ease;
}

.splide__arrow:hover {
  @apply bg-white;
}

.splide__arrow--next {
  right: 0;
  border-radius: 25% 0 0 25%;
}

.splide__arrow--prev {
  left: 0;
  border-radius: 0 25% 25% 0;
}
</style>
