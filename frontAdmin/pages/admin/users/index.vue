<template>
	<AuthGuard require-auth require-admin>
		<div class="space-y-6">
			<!-- Page Header -->
			<div class="admin-card">
				<div class="flex items-center justify-between">
					<div>
						<h2 class="text-2xl font-bold text-gray-900 mb-2">
							Gestion des utilisateurs
						</h2>
						<p class="text-gray-600">
							Consultez et gérez tous les utilisateurs de
							l'application.
						</p>
					</div>
					<button
						@click="createUser"
						class="admin-button-primary inline-flex items-center"
					>
						<svg
							class="w-5 h-5 mr-2"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 6v6m0 0v6m0-6h6m-6 0H6"
							></path>
						</svg>
						Nouvel utilisateur
					</button>
				</div>
			</div>

			<!-- Search and Filters -->
			<div class="admin-card">
				<div class="flex flex-col md:flex-row gap-4">
					<div class="flex-1">
						<label
							for="search"
							class="block text-sm font-medium text-gray-700 mb-1"
						>
							Rechercher
						</label>
						<input
							id="search"
							v-model="searchQuery"
							type="text"
							placeholder="Rechercher par email, nom..."
							class="admin-input"
						/>
					</div>
					<div class="w-full md:w-48">
						<label
							for="status"
							class="block text-sm font-medium text-gray-700 mb-1"
						>
							Statut
						</label>
						<select v-model="statusFilter" class="admin-input">
							<option value="">Tous</option>
							<option value="active">Actif</option>
							<option value="inactive">Inactif</option>
							<option value="suspended">Suspendu</option>
							<option value="pending_verification">
								En attente de vérification
							</option>
						</select>
					</div>
					<div class="w-full md:w-48">
						<label
							for="role"
							class="block text-sm font-medium text-gray-700 mb-1"
						>
							Rôle
						</label>
						<select v-model="roleFilter" class="admin-input">
							<option value="">Tous</option>
							<option value="user">Utilisateur</option>
							<option value="admin">Administrateur</option>
						</select>
					</div>
				</div>
			</div>

			<!-- Users Table -->
			<div class="admin-card">
				<div class="overflow-x-auto">
					<table class="admin-table">
						<thead class="admin-table-header">
							<tr>
								<th class="admin-table-header-cell">
									Utilisateur
								</th>
								<th class="admin-table-header-cell">Email</th>
								<th class="admin-table-header-cell">Rôle</th>
								<th class="admin-table-header-cell">Statut</th>
								<th class="admin-table-header-cell">Plan</th>
								<th class="admin-table-header-cell">
									Utilisation
								</th>
								<th class="admin-table-header-cell">
									Date d'inscription
								</th>
								<th class="admin-table-header-cell">Actions</th>
							</tr>
						</thead>
						<tbody class="bg-white divide-y divide-gray-200">
							<tr
								v-for="user in filteredUsers"
								:key="user.id"
								class="hover:bg-gray-50"
							>
								<td class="admin-table-cell">
									<div class="flex items-center">
										<div
											class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center"
										>
											<span
												class="text-primary-600 font-semibold text-sm"
											>
												{{
													user.firstName?.charAt(0) ||
													user.email?.charAt(0) ||
													"U"
												}}
											</span>
										</div>
										<div class="ml-4">
											<div
												class="text-sm font-medium text-gray-900"
											>
												{{ user.firstName }}
												{{ user.lastName }}
											</div>
											<div class="text-sm text-gray-500">
												ID: {{ user.id }}
											</div>
										</div>
									</div>
								</td>
								<td class="admin-table-cell">
									<div class="text-sm text-gray-900">
										{{ user.email }}
									</div>
								</td>
								<td class="admin-table-cell">
									<span
										:class="{
											'px-2 py-1 text-xs font-medium rounded-full': true,
											'bg-blue-100 text-blue-800':
												user.role === 'user',
											'bg-yellow-100 text-yellow-800':
												user.role === 'admin',
										}"
									>
										{{ user.role }}
									</span>
								</td>
								<td class="admin-table-cell">
									<span
										:class="{
											'px-2 py-1 text-xs font-medium rounded-full': true,
											'bg-green-100 text-green-800':
												user.status === 'active',
											'bg-red-100 text-red-800':
												user.status === 'inactive',
											'bg-yellow-100 text-yellow-800':
												user.status ===
												'pending_verification',
											'bg-orange-100 text-orange-800':
												user.status === 'suspended',
										}"
									>
										{{ user.status }}
									</span>
								</td>
								<td class="admin-table-cell">
									<div class="text-sm text-gray-900">
										{{
											user.subscription?.plan?.name ||
											"Aucun plan"
										}}
									</div>
									<div class="text-xs text-gray-500">
										{{
											user.subscription?.status ||
											"Pas d'abonnement"
										}}
									</div>
								</td>
								<td class="admin-table-cell">
									<div class="text-sm text-gray-900">
										{{ user.imagesGeneratedThisMonth || 0 }}
										/ {{ user.monthlyImageLimit || 0 }}
									</div>
									<div class="text-xs text-gray-500">
										Images générées ce mois
									</div>
								</td>
								<td class="admin-table-cell">
									<div class="text-sm text-gray-900">
										{{ formatDate(user.createdAt) }}
									</div>
								</td>
								<td class="admin-table-cell">
									<div class="flex space-x-2">
										<button
											@click="showBillingDetails(user)"
											class="text-blue-600 hover:text-blue-900 text-sm font-medium"
										>
											Facturation
										</button>
										<button
											@click="editUser(user)"
											class="text-primary-600 hover:text-primary-900 text-sm font-medium"
										>
											Modifier
										</button>
										<button
											@click="toggleUserStatus(user)"
											:class="{
												'text-sm font-medium': true,
												'text-green-600 hover:text-green-900':
													user.status === 'inactive',
												'text-red-600 hover:text-red-900':
													user.status === 'active',
											}"
										>
											{{
												user.status === "active"
													? "Désactiver"
													: "Activer"
											}}
										</button>
										<button
											@click="deleteUser(user)"
											class="text-red-600 hover:text-red-900 text-sm font-medium"
										>
											Supprimer
										</button>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<!-- Empty State -->
				<div
					v-if="filteredUsers.length === 0"
					class="text-center py-12"
				>
					<svg
						class="mx-auto h-12 w-12 text-gray-400"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
						/>
					</svg>
					<h3 class="mt-2 text-sm font-medium text-gray-900">
						Aucun utilisateur trouvé
					</h3>
					<p class="mt-1 text-sm text-gray-500">
						{{
							searchQuery || statusFilter || roleFilter
								? "Aucun utilisateur ne correspond à vos critères."
								: "Commencez par créer un nouvel utilisateur."
						}}
					</p>
				</div>
			</div>
		</div>

		<!-- Create/Edit User Modal -->
		<UserModal
			v-if="showCreateModal || showEditModal"
			:user="editingUser"
			:is-edit="showEditModal"
			@close="closeModal"
			@save="saveUser"
		/>

		<!-- User Billing Details Modal -->
		<div
			v-if="isBillingModalOpen"
			class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
			@click="closeBillingModal"
		>
			<div
				class="relative top-10 mx-auto p-6 border w-11/12 max-w-7xl shadow-lg rounded-md bg-white"
				@click.stop
			>
				<div class="flex justify-between items-center mb-6">
					<h2 class="text-xl font-semibold text-gray-900">
						Détails de facturation -
						{{ selectedUser?.fullName || selectedUser?.email }}
					</h2>
					<button
						@click="closeBillingModal"
						class="text-gray-400 hover:text-gray-600"
					>
						<svg
							class="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							></path>
						</svg>
					</button>
				</div>
				<div class="max-h-[80vh] overflow-y-auto">
					<UserBillingDetails
						v-if="selectedUser"
						:user="selectedUser"
						@change-plan="showChangePlanModal"
					/>
				</div>
			</div>
		</div>

		<!-- Change Plan Modal -->
		<ChangeUserPlanModal
			:user="selectedUser"
			:is-open="isChangePlanModalOpen"
			@close="closeChangePlanModal"
			@plan-changed="handlePlanChanged"
		/>
	</AuthGuard>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "~/composables/useAuth";
import { useUsersStore } from "~/stores/users";
import UserModal from "~/components/UserModal.vue";
import UserBillingDetails from "~/components/UserBillingDetails.vue";
import ChangeUserPlanModal from "~/components/ChangeUserPlanModal.vue";

definePageMeta({
	layout: "default",
	auth: true,
	admin: true,
});

const authStore = useAuthStore();
const usersStore = useUsersStore();

// Reactive data
const searchQuery = ref("");
const statusFilter = ref("");
const roleFilter = ref("");
const showCreateModal = ref(false);
const showEditModal = ref(false);
const editingUser = ref<any>(null);
const isBillingModalOpen = ref(false);
const selectedUser = ref<any>(null);
const isChangePlanModalOpen = ref(false);

// Computed properties
const filteredUsers = computed(() => {
	let users = usersStore.users;

	// Filter by search query
	if (searchQuery.value) {
		const query = searchQuery.value.toLowerCase();
		users = users.filter(
			(user) =>
				user.email.toLowerCase().includes(query) ||
				user.firstName?.toLowerCase().includes(query) ||
				user.lastName?.toLowerCase().includes(query)
		);
	}

	// Filter by status
	if (statusFilter.value) {
		users = users.filter((user) => user.status === statusFilter.value);
	}

	// Filter by role
	if (roleFilter.value) {
		users = users.filter((user) => user.role === roleFilter.value);
	}

	return users;
});

// Methods
const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString("fr-FR", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
};

const createUser = () => {
	showCreateModal.value = true;
};

const editUser = (user: any) => {
	editingUser.value = { ...user };
	showEditModal.value = true;
};

const closeModal = () => {
	showCreateModal.value = false;
	showEditModal.value = false;
	editingUser.value = null;
};

const saveUser = async (userData: any) => {
	try {
		if (showEditModal.value && editingUser.value) {
			// Add the user ID for the update operation
			const updateData = {
				...userData,
				id: (editingUser.value as any).id,
			};
			await usersStore.updateUser(updateData);
		} else {
			await usersStore.createUser(userData);
		}
		closeModal();
	} catch (error) {
		console.error("Error saving user:", error);
	}
};

const toggleUserStatus = async (user: any) => {
	try {
		const newStatus = user.status === "active" ? "inactive" : "active";
		await usersStore.updateUserStatus(user.id, newStatus);
	} catch (error) {
		console.error("Error toggling user status:", error);
	}
};

const deleteUser = async (user: any) => {
	if (
		confirm(
			`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.email} ?`
		)
	) {
		try {
			await usersStore.deleteUser(user.id);
		} catch (error) {
			console.error("Error deleting user:", error);
		}
	}
};

const showBillingDetails = (user: any) => {
	selectedUser.value = user;
	isBillingModalOpen.value = true;
};

const closeBillingModal = () => {
	isBillingModalOpen.value = false;
	selectedUser.value = null;
};

const showChangePlanModal = () => {
	isChangePlanModalOpen.value = true;
};

const closeChangePlanModal = () => {
	isChangePlanModalOpen.value = false;
};

const handlePlanChanged = (updatedUser: any) => {
	// Mettre à jour l'utilisateur dans la liste
	const index = usersStore.users.findIndex(
		(user) => user.id === updatedUser.id
	);
	if (index !== -1) {
		usersStore.users[index] = updatedUser;
	}
	// Mettre à jour l'utilisateur sélectionné dans le modal de facturation
	if (selectedUser.value && selectedUser.value.id === updatedUser.id) {
		selectedUser.value = updatedUser;
	}
};

// Load users on mount
onMounted(async () => {
	await usersStore.fetchUsers();
});
</script>
