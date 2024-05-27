<template>
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
		</DataTable>
		<Dialog v-model:visible="isDialogVisible" modal>
			<img :src="selectedImage" class="w-full" />
		</Dialog>
	</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "@/axios";

const disposals = ref([]);
const isDialogVisible = ref(false);
const selectedImage = ref(null);

const loadDisposals = async () => {
	try {
		const response = await axios.get(
			`${import.meta.env.VITE_API_BASE_URL}/image-snaps/files/images`
		);

		for (const item of response.data) {
			const imageResponse = await axios.get(
				`${
					import.meta.env.VITE_API_BASE_URL
				}/image-snaps/image-base64/images/${item}`
			);

			const {
				mimeType,
				base64,
				userId,
				longitude,
				latitude,
				created,
				address,
			} = imageResponse.data;

			const username = await axios.get(
				`${import.meta.env.VITE_API_BASE_URL}/users/${userId}`
			);

			const imageUrl = `data:${mimeType};base64,${base64}`;

			const date = new Date(created);
			const formattedCreated = `${date.getFullYear()}-${String(
				date.getMonth() + 1
			).padStart(2, "0")}-${String(date.getDate()).padStart(
				2,
				"0"
			)} ${String(date.getHours()).padStart(2, "0")}:${String(
				date.getMinutes()
			).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;

			disposals.value.push({
				address: address,
				created: formattedCreated,
				user: JSON.parse(JSON.stringify(username.data)).firstname,
				image: imageUrl,
			});
		}
	} catch (error) {
		console.log(error);
	}
};
const openImage = (image) => {
	selectedImage.value = image;
	isDialogVisible.value = true;
};

onMounted(() => {
	loadDisposals();
});
</script>
