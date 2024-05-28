<template>
	<div class="grid">
		<div class="col-12">
			<div class="card">
				<h5>Upload Inappropriate Disposal</h5>
				<FileUpload
					name="demo[]"
					@uploader="onUpload"
					:multiple="true"
					accept="image/*"
					:maxFileSize="1000000"
					customUpload
				/>
			</div>
		</div>
	</div>
	<Toast />
</template>

<script setup>
import { useToast } from "primevue/usetoast";
import axios from "axios";

const toast = useToast();

const onUpload = (event) => {
	// Retrieve user data from localStorage
	const userData = localStorage.getItem("user");
	if (!userData) {
		console.error("User data not found in localStorage.");
		toast.add({
			severity: "error",
			summary: "Error",
			detail: "User data not found",
			life: 3000,
		});
	}

	const user = JSON.parse(userData);
	const userId = user._id;

	console.log(`User ID: ${userId}`);

	const token = localStorage.getItem("token");
	if (!token) {
		console.error("Token not found in localStorage.");
		toast.add({
			severity: "error",
			summary: "Error",
			detail: "Token not found",
			life: 3000,
		});
		return;
	}

	console.log(`Token: ${token}`);

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const { latitude, longitude } = position.coords;
				console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

				const uploadedFiles = event.files;
				console.log(`Files: ${uploadedFiles}`);

				uploadedFiles.forEach((file) => {
					const formData = new FormData();
					formData.append("userId", userId);
					formData.append("latitude", latitude);
					formData.append("longitude", longitude);
					formData.append("file", file);

					try {
						const response = axios.post(
							`${
								import.meta.env.VITE_API_BASE_URL
							}/image-snaps/upload/images`,
							formData,
							{
								headers: {
									Authorization: `Bearer ${token}`,
									"Content-Type": "multipart/form-data",
								},
							}
						);

						toast.add({
							severity: "success",
							summary: "Success",
							detail: "File Uploaded",
							life: 3000,
						});
					} catch (error) {
						console.error("Error uploading file:", error);
						toast.add({
							severity: "error",
							summary: "Error",
							detail: "File upload failed",
							life: 3000,
						});
					}
				});
			},
			(error) => {
				console.error("Error obtaining location", error);
				toast.add({
					severity: "error",
					summary: "Error",
					detail: "Unable to obtain location",
					life: 3000,
				});
			}
		);
	} else {
		console.error("Geolocation is not supported by this browser.");
		toast.add({
			severity: "error",
			summary: "Error",
			detail: "Geolocation is not supported by this browser",
			life: 3000,
		});
	}
};
</script>
