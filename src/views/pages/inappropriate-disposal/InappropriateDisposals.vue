<template>
  <div class="card">
  <h5>Inappropriate Disposals</h5>
    <div ref="mapContainer" class="map-container"></div>
  </div>
	<div class="card">
		<DataTable :value="disposals">
			<Column header="Image">
				<template #body="slotProps">
					<img
						:src="`${slotProps.data.image}`"
						:alt="slotProps.data.name"
						class="w-6rem border-round"
						@click="openImage(slotProps.data.image)"
						style="cursor: pointer"
					/>
				</template>
			</Column>
			<Column field="address" header="Address"></Column>
			<Column field="created" header="Created"></Column>
			<Column field="user" header="User"></Column>
      <Column>
        <template #body="slotProps">
          <Button icon="pi pi-search" @click="redirectToCoordinates(slotProps.data.longitude, slotProps.data.latitude)" />
        </template>
      </Column>
		</DataTable>
		<Dialog v-model:visible="isDialogVisible" modal>
			<img :src="selectedImage" class="w-full" />
		</Dialog>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "@/axios";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const disposals = ref([]);
const isDialogVisible = ref(false);
const selectedImage = ref(null);

let map = null;
const mapContainer = ref(null);
const markers = [];

const loadDisposals = async () => {
	try {
		const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/image-snaps/files/images`);

		for (const item of response.data) {
			const imageResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/image-snaps/image-base64/images/${item}`);

			const {
				mimeType,
				base64,
				userId,
				longitude,
				latitude,
				created,
				address,
			} = imageResponse.data;

			const username = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/${userId}`);

			const imageUrl = `data:${mimeType};base64,${base64}`;

			const date = new Date(created);
			const formattedCreated = `${date.getFullYear()}-${String(
				date.getMonth() + 1
			).padStart(2, "0")}-${String(date.getDate()).padStart(
				2, "0"
			)} ${String(date.getHours()).padStart(2, "0")}:${String(
				date.getMinutes()
			).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;

      markers.push(new mapboxgl.Marker({ color: '#92dd7a' })
          .setLngLat([longitude, latitude])
          .setPopup(getMarkerPopup(imageUrl, address, created, JSON.parse(JSON.stringify(username.data)).firstname))
          .addTo(map)
      );

			disposals.value.push({
				address: address,
				created: formattedCreated,
				user: JSON.parse(JSON.stringify(username.data)).firstname,
				image: imageUrl,
        latitude: latitude,
        longitude: longitude,
			});
		}
	} catch (error) {
		console.log(error);
	}
};

const getMarkerPopup = (imageUrl, address, created, username) => {
  return new mapboxgl.Popup({offset: 25}).setHTML(`
      <div class="d-flex justify-content-center align-items-center flex-column text-center">
        <h3>Illegal Disposal</h3>
        <img src="${imageUrl}" :alt="slotProps.data.name" class="w-6rem border-round" style="cursor: pointer" />
        <p>${new Date(created).toLocaleDateString()} at ${address}</p>
        <p>Reported by ${username}</p>
      </div>
    `);
}

const redirectToCoordinates = (longitude, latitude) => {
  map.flyTo({
    center: [longitude, latitude],
    essential: true
  });
}

const openImage = (image) => {
	selectedImage.value = image;
	isDialogVisible.value = true;
};

const redirectToCoordinatesAndZoomOut = (longitude, latitude, zoomLevel) => {
  map.flyTo({
    center: [longitude, latitude],
    zoom: zoomLevel,
    essential: true
  });
}

onMounted(() => {
	loadDisposals();

  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

  map = new mapboxgl.Map({
    accessToken: import.meta.env.VITE_MAPBOX_TOKEN,
    container: mapContainer.value,
    style: 'mapbox://styles/mapbox/standard',
    center: [15.045314, 46.150356],
    zoom: 10
  });

  redirectToCoordinatesAndZoomOut(15.045314, 46.150356, 7);
});
</script>

<style scoped>
.map-container {
  height: 30rem;
  width: 100%;
  border-radius: 24px;
  overflow: hidden;
}

.mapboxgl-popup {
  border-radius: 20px !important;
  background: #000 !important;
}
</style>
