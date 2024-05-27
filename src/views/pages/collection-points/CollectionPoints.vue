<template>
  <div ref="mapContainer" class="map-container"></div>
  <Toast />
</template>

<script setup>
import { onMounted, ref } from "vue";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import axios from "@/axios";
import { useToast } from "primevue/usetoast";

const toast = useToast();

let map = null;
const mapContainer = ref(null);
const markers = [];

onMounted(() => {
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

  map = new mapboxgl.Map({
    accessToken: import.meta.env.VITE_MAPBOX_TOKEN,
    container: mapContainer.value,
    style: 'mapbox://styles/mapbox/standard',
    center: [15.645585, 46.557644],
    zoom: 17
  });

  loadCollectionPoints();
});

const getMarkerPopup = (collectionPoint) => {
  return new mapboxgl.Popup({offset: 25}).setHTML(`<h3>${collectionPoint.location}</h3><p>${new Date().toLocaleTimeString()}</p>`);
}

const loadCollectionPoints = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/collection-points`);
    if (!response.data) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong...', life: 3000 });
      return;
    }

    response.data.forEach((collectionPoint) => {
      let marker = new mapboxgl.Marker({ color: '#92dd7a' })
        .setLngLat([collectionPoint.longitude, collectionPoint.latitude])
        .setPopup(getMarkerPopup(collectionPoint))
        .addTo(map);

      markers.push(marker);
    });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong...', life: 3000 });
    console.error(error);
  }
}
</script>

<style scoped>
.map-container {
  height: 47rem;
  width: 100%;
  border-radius: 24px;
  overflow: hidden;
}
</style>
