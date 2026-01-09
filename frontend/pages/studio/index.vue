<template>
	<div class="flex-1 flex flex-col">
		<div
			v-if="showOverlay"
			class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50"
		>
			<div class="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
				<h2 class="text-2xl font-bold mb-4">Bienvenue au Studio !</h2>
				<p class="text-gray-600 mb-6">
					{{ overlayMessage }}
				</p>
				<div class="flex justify-center space-x-4">
					<NuxtLink
						v-if="!hasBrands"
						to="/brands"
						class="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
					>
						Créer une Marque
					</NuxtLink>
					<NuxtLink
						v-if="!hasTemplates"
						to="/templates"
						class="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
					>
						Créer un Template
					</NuxtLink>
				</div>
			</div>
		</div>
		<!-- Nouvelle barre d'outils -->
		<div
			class="flex justify-between items-center px-4 py-2 border-b border-gray-200 bg-white"
		>
			<div class="flex items-center gap-4">
				<h1 class="text-xl font-semibold text-gray-800">Studio</h1>
			</div>
			<div
				class="flex items-center justify-between gap-2"
				style="width: 100%; padding-left: 290px"
			>
				<div class="flex items-center gap-2">
					<button
						@click="saveTemplate"
						class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center"
					>
						<i class="ph-duotone ph-floppy-disk mr-2"></i>
						Enregistrer
					</button>
					<button
						@click="updatePreview"
						class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
					>
						<i class="ph-duotone ph-eye mr-2"></i>
						Mettre à jour le rendu
					</button>
				</div>
				<div class="flex items-center gap-2">
					<button
						@click="showJsonModal = true"
						class="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center"
					>
						<i class="ph-duotone ph-brackets-curly mr-2"></i>
						Récupérer le JSON
					</button>
					<button
						@click="showCreateExampleModal = true"
						class="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center"
					>
						<i class="ph-duotone ph-star mr-2"></i>
						Créer template d'exemple
					</button>
					<button
						@click="downloadImage"
						id="download-image-btn"
						class="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg flex items-center"
					>
						<i class="ph-duotone ph-download mr-2"></i>
						Télécharger
					</button>
				</div>
			</div>
		</div>

		<div class="studio-container">
			<!-- Sidebar gauche : Variables -->
			<div class="studio-sidebar">
				<perfect-scrollbar class="h-full w-full">
					<div class="">
						<!-- Section Template (Accordéon) -->
						<div class="border-b border-gray-200 bg-blue-50">
							<!-- En-tête de l'accordéon -->
							<button
								@click="
									isTemplateAccordionOpen =
										!isTemplateAccordionOpen
								"
								class="w-full flex justify-between items-center py-3 text-left bg-blue-100"
							>
								<label
									class="block text-m font-bold text-gray-900"
									>Template</label
								>
								<i
									class="ph-duotone ph-caret-down text-xl transition-transform"
									:class="{
										'rotate-180': isTemplateAccordionOpen,
									}"
								></i>
							</button>
							<div>
								<select
									v-model="selectedTemplate"
									class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg py-3 px-4 font-medium"
									@change="handleTemplateChange"
								>
									<option
										v-for="template in templates"
										:key="template.id"
										:value="template"
									>
										{{ template.name }}
									</option>
								</select>
							</div>

							<!-- Contenu de l'accordéon -->
							<transition
								enter-active-class="transition ease-out duration-200"
								enter-from-class="transform opacity-0 scale-95"
								enter-to-class="transform opacity-100 scale-100"
								leave-active-class="transition ease-in duration-150"
								leave-from-class="transform opacity-100 scale-100"
								leave-to-class="transform opacity-0 scale-95"
							>
								<div
									v-if="isTemplateAccordionOpen"
									class="p-4 space-y-6"
								>
									<!-- Sélecteur de template -->

									<!-- Section Variables du Template -->
									<div>
										<div
											class="flex justify-between items-center mb-2"
										>
											<label
												class="block text-m font-bold text-gray-900"
												>Variables du Template</label
											>
											<button
												@click="
													showAddVariableModal = true
												"
												class="text-blue-500 hover:text-blue-600"
											>
												<i
													class="ph-duotone ph-plus-circle"
												></i>
											</button>
										</div>
										<div class="space-y-4">
											<div
												v-for="(
													variable, key
												) in templateVariables"
												:key="key"
												class="space-y-1"
											>
												<div
													class="flex items-center gap-2"
												>
													<button
														@click="
															insertVariableAtCursor(
																key
															)
														"
														class="text-blue-500 hover:text-blue-600 text-xs cursor-pointer"
														title="Insérer la variable"
													>
														<i
															class="ph-duotone ph-plus"
														></i>
													</button>
													<label
														class="block text-sm font-medium text-blue-600 cursor-move hover:text-blue-500 flex-1"
														draggable="true"
														@dragstart="
															handleDragStart(
																$event,
																key
															)
														"
														@dragend="handleDragEnd"
													>
														{{ key }}
													</label>
												</div>
												<div
													class="flex items-center gap-2"
												>
													<div class="flex-1">
														<input
															v-if="
																variable.type ===
																'text'
															"
															v-model="
																variable.value
															"
															type="text"
															class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
															:placeholder="`Valeur pour ${key}`"
														/>
														<textarea
															v-else
															v-model="
																variable.value
															"
															class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
															:placeholder="`Valeur pour ${key}`"
														></textarea>
													</div>
													<button
														@click="
															removeTemplateVariable(
																key
															)
														"
														class="text-red-500 hover:text-red-600"
													>
														<i
															class="ph-duotone ph-trash"
														></i>
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							</transition>
						</div>

						<!-- Modal d'ajout de variable -->
						<div
							v-if="showAddVariableModal"
							class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
						>
							<div
								class="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm"
							>
								<h3 class="text-lg font-semibold mb-4">
									Ajouter une variable
								</h3>
								<div class="mb-4">
									<label
										class="block text-sm font-medium mb-1"
										>Nom</label
									>
									<input
										v-model="addVariableName"
										type="text"
										class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
										placeholder="Nom de la variable"
									/>
								</div>
								<div class="mb-4">
									<label
										class="block text-sm font-medium mb-1"
										>Type</label
									>
									<select
										v-model="addVariableTypeString"
										class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									>
										<option value="text">Texte</option>
										<option value="textarea">
											Zone de texte
										</option>
									</select>
								</div>
								<div class="flex justify-end gap-2">
									<button
										@click="showAddVariableModal = false"
										class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
									>
										Annuler
									</button>
									<button
										@click="confirmAddVariable"
										class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
									>
										Ajouter
									</button>
								</div>
							</div>
						</div>

						<!-- Modal de confirmation de suppression -->
						<div
							v-if="showDeleteConfirmModal"
							class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
						>
							<div
								class="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm"
							>
								<h3 class="text-lg font-semibold mb-4">
									Confirmer la suppression
								</h3>
								<div class="mb-4">
									<p class="text-sm text-gray-600">
										Êtes-vous sûr de vouloir supprimer la
										variable
										<strong
											>"{{ variableToDelete }}"</strong
										>
										?
									</p>
								</div>
								<div class="flex justify-end gap-2">
									<button
										@click="showDeleteConfirmModal = false"
										class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
									>
										Annuler
									</button>
									<button
										@click="confirmDeleteVariable"
										class="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
									>
										Supprimer
									</button>
								</div>
							</div>
						</div>

						<!-- Modal JSON -->
						<div
							v-if="showJsonModal"
							class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
						>
							<div
								class="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-hidden"
							>
								<div
									class="flex justify-between items-center mb-4"
								>
									<h3 class="text-lg font-semibold">
										JSON pour la requête POST
									</h3>
									<button
										@click="showJsonModal = false"
										class="text-gray-500 hover:text-gray-700"
									>
										<i class="ph-duotone ph-x text-xl"></i>
									</button>
								</div>
								<div class="mb-4">
									<p class="text-sm text-gray-600 mb-2">
										Ce JSON est prêt à être utilisé pour la
										requête POST vers l'API generate :
									</p>
									<div class="bg-gray-100 p-4 rounded-lg">
										<pre
											class="text-sm overflow-auto max-h-96"
											>{{ generatedJson }}</pre
										>
									</div>
								</div>
								<div class="flex justify-end gap-2">
									<button
										@click="copyJsonToClipboard"
										:class="[
											'px-4 py-2 rounded text-white flex items-center transition-colors duration-200',
											isJsonCopied
												? 'bg-green-600 hover:bg-green-700'
												: 'bg-blue-600 hover:bg-blue-700',
										]"
									>
										<i
											:class="[
												'mr-2',
												isJsonCopied
													? 'ph-duotone ph-check-circle'
													: 'ph-duotone ph-copy',
											]"
										></i>
										{{
											isJsonCopied
												? "Copié !"
												: "Copier le JSON"
										}}
									</button>
									<button
										@click="showJsonModal = false"
										class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
									>
										Fermer
									</button>
								</div>
							</div>
						</div>

						<!-- Section Brand (Accordéon) -->
						<div class="border-b border-gray-200 bg-green-50">
							<!-- En-tête de l'accordéon -->
							<button
								@click="
									isBrandAccordionOpen = !isBrandAccordionOpen
								"
								class="w-full flex justify-between items-center py-3 text-left bg-green-100"
							>
								<label
									class="block text-m font-bold text-gray-900"
									>Marque</label
								>
								<i
									class="ph-duotone ph-caret-down text-xl transition-transform"
									:class="{
										'rotate-180': isBrandAccordionOpen,
									}"
								></i>
							</button>
							<div class="p-4">
								<select
									v-model="selectedBrand"
									class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-lg py-3 px-4 font-medium"
									@change="handleBrandChange"
								>
									<option
										v-for="brand in brands"
										:key="brand.id"
										:value="brand"
									>
										{{ brand.name }}
									</option>
								</select>
							</div>
							<!-- Contenu de l'accordéon -->
							<transition
								enter-active-class="transition ease-out duration-200"
								enter-from-class="transform opacity-0 scale-95"
								enter-to-class="transform opacity-100 scale-100"
								leave-active-class="transition ease-in duration-150"
								leave-from-class="transform opacity-100 scale-100"
								leave-to-class="transform opacity-0 scale-95"
							>
								<div
									v-if="isBrandAccordionOpen"
									class="p-4 space-y-6"
								>
									<!-- Sélecteur de marque -->

									<!-- Section Variables de la Marque -->
									<div>
										<label
											class="block text-m font-bold text-gray-900 mb-2"
											>Variables de la Marque</label
										>
										<div class="space-y-4">
											<!-- Couleurs principales -->
											<div
												class="flex items-center gap-2"
											>
												<button
													@click="
														insertVariableAtCursor(
															'brand.primaryColor'
														)
													"
													class="text-blue-500 hover:text-blue-600 text-xs cursor-pointer"
													title="Insérer la variable"
												>
													<i
														class="ph-duotone ph-plus"
													></i>
												</button>
												<label
													class="block text-xs font-medium text-blue-600 cursor-move hover:text-blue-500 flex-1"
													draggable="true"
													@dragstart="
														handleDragStart(
															$event,
															'brand.primaryColor'
														)
													"
													@dragend="handleDragEnd"
												>
													PrimaryColor
												</label>
											</div>
											<div
												class="flex items-center gap-2"
											>
												<div
													class="w-6 h-6 rounded-full border"
													:style="{
														backgroundColor:
															brandVariables.primaryColor,
													}"
												></div>
												<span
													class="text-sm text-gray-600"
													>{{
														brandVariables.primaryColor
													}}</span
												>
											</div>
											<div
												class="flex items-center gap-2"
											>
												<button
													@click="
														insertVariableAtCursor(
															'brand.secondaryColor'
														)
													"
													class="text-blue-500 hover:text-blue-600 text-xs cursor-pointer"
													title="Insérer la variable"
												>
													<i
														class="ph-duotone ph-plus"
													></i>
												</button>
												<label
													class="block text-xs font-medium text-blue-600 cursor-move hover:text-blue-500 flex-1"
													draggable="true"
													@dragstart="
														handleDragStart(
															$event,
															'brand.secondaryColor'
														)
													"
													@dragend="handleDragEnd"
												>
													SecondaryColor
												</label>
											</div>
											<div
												class="flex items-center gap-2"
											>
												<div
													class="w-6 h-6 rounded-full border"
													:style="{
														backgroundColor:
															brandVariables.secondaryColor,
													}"
												></div>
												<span
													class="text-sm text-gray-600"
													>{{
														brandVariables.secondaryColor
													}}</span
												>
											</div>
											<div
												class="flex items-center gap-2"
											>
												<button
													@click="
														insertVariableAtCursor(
															'brand.tertiaryColor'
														)
													"
													class="text-blue-500 hover:text-blue-600 text-xs cursor-pointer"
													title="Insérer la variable"
												>
													<i
														class="ph-duotone ph-plus"
													></i>
												</button>
												<label
													class="block text-xs font-medium text-blue-600 cursor-move hover:text-blue-500 flex-1"
													draggable="true"
													@dragstart="
														handleDragStart(
															$event,
															'brand.tertiaryColor'
														)
													"
													@dragend="handleDragEnd"
												>
													TertiaryColor
												</label>
											</div>
											<div
												class="flex items-center gap-2"
											>
												<div
													class="w-6 h-6 rounded-full border"
													:style="{
														backgroundColor:
															brandVariables.tertiaryColor,
													}"
												></div>
												<span
													class="text-sm text-gray-600"
													>{{
														brandVariables.tertiaryColor
													}}</span
												>
											</div>
											<div
												class="flex items-center gap-2"
											>
												<button
													@click="
														insertVariableAtCursor(
															'brand.textColor'
														)
													"
													class="text-blue-500 hover:text-blue-600 text-xs cursor-pointer"
													title="Insérer la variable"
												>
													<i
														class="ph-duotone ph-plus"
													></i>
												</button>
												<label
													class="block text-xs font-medium text-blue-600 cursor-move hover:text-blue-500 flex-1"
													draggable="true"
													@dragstart="
														handleDragStart(
															$event,
															'brand.textColor'
														)
													"
													@dragend="handleDragEnd"
												>
													TextColor
												</label>
											</div>
											<div
												class="flex items-center gap-2"
											>
												<div
													class="w-6 h-6 rounded-full border"
													:style="{
														backgroundColor:
															brandVariables.textColor,
													}"
												></div>
												<span
													class="text-sm text-gray-600"
													>{{
														brandVariables.textColor
													}}</span
												>
											</div>
											<div
												class="flex items-center gap-2"
											>
												<button
													@click="
														insertVariableAtCursor(
															'brand.textColor2'
														)
													"
													class="text-blue-500 hover:text-blue-600 text-xs cursor-pointer"
													title="Insérer la variable"
												>
													<i
														class="ph-duotone ph-plus"
													></i>
												</button>
												<label
													class="block text-xs font-medium text-blue-600 cursor-move hover:text-blue-500 flex-1"
													draggable="true"
													@dragstart="
														handleDragStart(
															$event,
															'brand.textColor2'
														)
													"
													@dragend="handleDragEnd"
												>
													TextColor2
												</label>
											</div>
											<div
												class="flex items-center gap-2"
											>
												<div
													class="w-6 h-6 rounded-full border"
													:style="{
														backgroundColor:
															brandVariables.textColor2,
													}"
												></div>
												<span
													class="text-sm text-gray-600"
													>{{
														brandVariables.textColor2
													}}</span
												>
											</div>
											<!-- Variables dynamiques -->
											<template
												v-for="(
													value, key
												) in brandVariables"
												:key="key"
											>
												<div
													v-if="
														key !== 'imageGroups' &&
														![
															'primaryColor',
															'secondaryColor',
															'tertiaryColor',
															'textColor',
															'textColor2',
														].includes(key)
													"
													class="space-y-1"
												>
													<div
														class="flex items-center gap-2"
													>
														<button
															@click="
																insertVariableAtCursor(
																	`brand.${key}`
																)
															"
															class="text-blue-500 hover:text-blue-600 text-xs cursor-pointer"
															title="Insérer la variable"
														>
															<i
																class="ph-duotone ph-plus"
															></i>
														</button>
														<label
															class="block text-sm font-medium text-blue-600 cursor-move hover:text-blue-500 flex-1"
															draggable="true"
															@dragstart="
																handleDragStart(
																	$event,
																	`brand.${key}`
																)
															"
															@dragend="
																handleDragEnd
															"
														>
															{{ key }}
														</label>
													</div>
													<div
														class="flex items-center gap-2"
													>
														<div class="flex-1">
															<!-- Affichage spécial pour le logo -->
															<div
																v-if="
																	key ===
																	'logoUrl'
																"
																class="flex items-center gap-2"
															>
																<img
																	v-if="value"
																	:src="value"
																	alt="Logo"
																	class="w-8 h-8 object-contain rounded border border-gray-200"
																	@error="
																		(
																			$event.target as HTMLImageElement
																		).style.display =
																			'none'
																	"
																/>
																<div
																	v-else
																	class="w-8 h-8 bg-gray-100 rounded border border-gray-200 flex items-center justify-center"
																>
																	<i
																		class="ph-duotone ph-image text-sm text-gray-400"
																	></i>
																	<span
																		class="text-xs text-gray-500 truncate"
																		>{{
																			value
																		}}</span
																	>
																</div>
															</div>
															<!-- Affichage normal pour les autres -->
															<span
																v-else
																class="text-sm text-gray-600"
																>{{
																	value
																}}</span
															>
														</div>
													</div>
												</div>
											</template>
										</div>
									</div>

									<!-- Section Groupes d'icônes -->
									<div v-if="selectedBrand?.icons?.length">
										<label
											class="block text-sm font-medium text-gray-700 mb-2"
											>Groupes d'icônes</label
										>
										<div
											class="p-3 bg-gray-50 rounded-lg border border-gray-200"
										>
											<div
												class="flex items-center gap-2"
											>
												<i
													class="ph-duotone ph-selection-all text-xl text-gray-500"
												></i>
												<div class="flex-1">
													<div
														class="text-sm font-medium text-gray-800 cursor-move"
														draggable="true"
														@dragstart="
															handleDragStart(
																$event,
																'icons:all'
															)
														"
														@dragend="handleDragEnd"
													>
														Tous les icônes
													</div>
													<div
														class="text-xs text-gray-500"
													>
														{{
															selectedBrand.icons
																.length
														}}
														icône(s) disponible(s)
													</div>
												</div>
											</div>
										</div>
									</div>

									<!-- Section Groupes d'images -->
									<div
										v-if="
											selectedBrand?.imageGroups?.length
										"
									>
										<label
											class="block text-sm font-medium text-gray-700 mb-2"
											>Groupes d'images</label
										>
										<div class="space-y-3">
											<div
												v-for="group in selectedBrand.imageGroups"
												:key="group.groupName"
												class="p-3 bg-gray-50 rounded-lg border border-gray-200"
											>
												<div
													class="flex items-center gap-2"
												>
													<i
														class="ph-duotone ph-images-square text-xl text-gray-500"
													></i>
													<div class="flex-1">
														<div
															class="text-sm font-medium text-gray-800"
														>
															{{
																group.groupName
															}}
														</div>
														<div
															class="text-xs text-gray-500"
														>
															<div
																class="font-medium mb-1"
															>
																{{
																	group.images_url &&
																	group
																		.images_url
																		.length >
																		0
																		? `${group.images_url.length} image(s)`
																		: "Aucune image"
																}}
															</div>
															<div
																v-if="
																	group.images_url &&
																	group
																		.images_url
																		.length >
																		0
																"
																class="space-y-1"
															>
																<div
																	v-for="img in group.images_url"
																	:key="
																		img.name
																	"
																	class="flex items-center gap-2"
																>
																	<img
																		v-if="
																			img.url
																		"
																		:src="
																			img.url
																		"
																		:alt="
																			img.name ||
																			'Image'
																		"
																		class="w-6 h-6 object-cover rounded border border-gray-200 cursor-move"
																		draggable="true"
																		@dragstart="
																			handleDragStart(
																				$event,
																				`image:${img.url}`
																			)
																		"
																		@dragend="
																			handleDragEnd
																		"
																		@error="
																			(
																				$event.target as HTMLImageElement
																			).style.display =
																				'none'
																		"
																	/>
																	<div
																		v-else
																		class="w-6 h-6 bg-gray-200 rounded border border-gray-200 flex items-center justify-center"
																	>
																		<i
																			class="ph-duotone ph-image text-xs text-gray-400"
																		></i>
																	</div>
																	<span
																		class="truncate text-xs"
																		>{{
																			img.name ||
																			"Sans nom"
																		}}</span
																	>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</transition>
						</div>
					</div>
				</perfect-scrollbar>
			</div>

			<!-- Centre : Éditeur HTML -->
			<div class="studio-main" :style="{ width: editorWidth + 'px' }">
				<ClientOnly>
					<div
						class="w-full h-full rounded-lg relative"
						@dragover="handleDragOver"
						@dragenter="handleDragEnter"
						@dragleave="handleDragLeave"
						@drop="handleDrop"
					>
						<MonacoEditor
							:key="`monaco-editor-${route.path}`"
							ref="monacoRef"
							:value="htmlContent"
							language="html"
							theme="vs-dark"
							height="100%"
							width="100%"
							class="w-full h-full rounded-lg"
							:options="monacoOptions"
							@change="handleEditorInput"
						/>
					</div>
					<template #fallback>
						<div
							class="w-full h-full rounded-lg bg-gray-100 flex items-center justify-center"
						>
							<div class="text-gray-500">Loading editor...</div>
						</div>
					</template>
				</ClientOnly>
			</div>

			<!-- Resizer -->
			<div
				class="resizer"
				@mousedown="startResize"
				:class="{ resizing: isResizing }"
			></div>

			<!-- Droite : Prévisualisation -->
			<div class="studio-preview">
				<div class="preview-container">
					<iframe
						ref="previewFrame"
						class="w-full h-full"
						:style="{
							width: dimensions.width + 'px',
							height: dimensions.height + 'px',
						}"
					></iframe>
				</div>
			</div>
		</div>
	</div>

	<!-- Modal de création de template d'exemple -->
	<div
		v-if="showCreateExampleModal"
		class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
		@click="showCreateExampleModal = false"
	>
		<div
			class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
			@click.stop
		>
			<div class="flex justify-between items-center p-4 border-b">
				<h3 class="text-lg font-semibold text-gray-900">
					Créer un template d'exemple
				</h3>
				<button
					@click="showCreateExampleModal = false"
					class="text-gray-400 hover:text-gray-600"
				>
					<i class="ph-duotone ph-x text-xl"></i>
				</button>
			</div>

			<div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
				<div class="space-y-6">
					<!-- Informations du template -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div>
							<h4 class="font-medium text-gray-900 mb-4">
								Informations du template
							</h4>

							<div class="space-y-4">
								<div>
									<label
										class="block text-sm font-medium text-gray-700 mb-1"
									>
										Nom du template *
									</label>
									<input
										v-model="exampleTemplate.name"
										type="text"
										class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
										placeholder="Ex: Template Citation Inspirante"
									/>
								</div>

								<div>
									<label
										class="block text-sm font-medium text-gray-700 mb-1"
									>
										Description
									</label>
									<textarea
										v-model="exampleTemplate.description"
										rows="3"
										class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
										placeholder="Description du template..."
									></textarea>
								</div>

								<div>
									<label
										class="block text-sm font-medium text-gray-700 mb-1"
									>
										Catégorie
									</label>
									<select
										v-model="exampleTemplate.category"
										class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									>
										<option value="">
											Aucune catégorie
										</option>
										<option
											v-for="category in TEMPLATE_CATEGORIES"
											:key="category"
											:value="category"
										>
											{{ category }}
										</option>
									</select>
								</div>

								<div>
									<label
										class="block text-sm font-medium text-gray-700 mb-1"
									>
										URL de l'image de preview
									</label>
									<input
										v-model="exampleTemplate.previewImage"
										type="url"
										class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
										placeholder="https://example.com/preview.jpg"
									/>
									<p class="text-xs text-gray-500 mt-1">
										L'image sera téléchargée et stockée dans
										le dossier des previews
									</p>
								</div>
							</div>
						</div>

						<div>
							<h4 class="font-medium text-gray-900 mb-4">
								Détails techniques
							</h4>

							<div class="space-y-4">
								<div class="grid grid-cols-2 gap-4">
									<div>
										<label
											class="block text-sm font-medium text-gray-700 mb-1"
										>
											Largeur (px)
										</label>
										<input
											v-model.number="
												exampleTemplate.layout.width
											"
											type="number"
											class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
										/>
									</div>
									<div>
										<label
											class="block text-sm font-medium text-gray-700 mb-1"
										>
											Hauteur (px)
										</label>
										<input
											v-model.number="
												exampleTemplate.layout.height
											"
											type="number"
											class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
										/>
									</div>
								</div>

								<div>
									<label
										class="block text-sm font-medium text-gray-700 mb-1"
									>
										Nombre de variables
									</label>
									<div
										class="text-2xl font-bold text-blue-600"
									>
										{{
											Object.keys(templateVariables)
												.length
										}}
									</div>
								</div>

								<div>
									<label
										class="block text-sm font-medium text-gray-700 mb-1"
									>
										Tags
									</label>
									<input
										v-model="exampleTemplate.tagsInput"
										type="text"
										class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
										placeholder="tag1, tag2, tag3"
									/>
									<p class="text-xs text-gray-500 mt-1">
										Séparez les tags par des virgules
									</p>
								</div>
							</div>
						</div>
					</div>

					<!-- Variables du template -->
					<div>
						<h4 class="font-medium text-gray-900 mb-4">
							Variables du template
						</h4>
						<div class="bg-gray-50 rounded-lg p-4">
							<div
								v-if="
									Object.keys(templateVariables).length === 0
								"
								class="text-center text-gray-500 py-4"
							>
								Aucune variable définie
							</div>
							<div
								v-else
								class="grid grid-cols-1 sm:grid-cols-2 gap-3"
							>
								<div
									v-for="(variable, key) in templateVariables"
									:key="key"
									class="bg-white p-3 rounded border"
								>
									<div class="font-medium text-gray-900">
										{{ key }}
									</div>
									<div class="text-sm text-gray-600">
										{{ variable.value }}
									</div>
									<div class="text-xs text-gray-500 mt-1">
										Type: {{ variable.type }}
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- JSON du template -->
					<div>
						<h4 class="font-medium text-gray-900 mb-4">
							JSON du template
						</h4>
						<div class="bg-gray-900 rounded-lg p-4">
							<pre
								class="text-green-400 text-sm overflow-x-auto"
								>{{ templateJson }}</pre
							>
						</div>
					</div>
				</div>
			</div>

			<div class="flex justify-end p-4 border-t bg-gray-50 space-x-3">
				<button
					@click="showCreateExampleModal = false"
					class="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
				>
					Annuler
				</button>
				<button
					@click="createExampleTemplate"
					:disabled="!exampleTemplate.name || creatingExample"
					class="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md font-medium flex items-center"
				>
					<i
						v-if="creatingExample"
						class="ph-duotone ph-circle-notch animate-spin mr-2"
					></i>
					<i v-else class="ph-duotone ph-star mr-2"></i>
					{{
						creatingExample
							? "Création..."
							: "Créer le template d'exemple"
					}}
				</button>
			</div>
		</div>
	</div>

	<!-- Notification Toast -->
	<Transition
		enter-active-class="transition ease-out duration-300"
		enter-from-class="transform translate-y-2 opacity-0"
		enter-to-class="transform translate-y-0 opacity-100"
		leave-active-class="transition ease-in duration-200"
		leave-from-class="transform translate-y-0 opacity-100"
		leave-to-class="transform translate-y-2 opacity-0"
	>
		<div
			v-if="showNotification"
			class="fixed top-4 right-4 z-50 max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 p-4"
			:class="{
				'border-green-500': notificationType === 'success',
				'border-red-500': notificationType === 'error',
			}"
		>
			<div class="flex items-start">
				<div class="flex-shrink-0">
					<div
						class="w-6 h-6 rounded-full flex items-center justify-center"
						:class="{
							'bg-green-100 text-green-600':
								notificationType === 'success',
							'bg-red-100 text-red-600':
								notificationType === 'error',
						}"
					>
						<i
							:class="{
								'ph-check': notificationType === 'success',
								'ph-x': notificationType === 'error',
							}"
							class="ph-duotone text-sm"
						></i>
					</div>
				</div>
				<div class="ml-3 w-0 flex-1">
					<p
						class="text-sm font-medium"
						:class="{
							'text-green-800': notificationType === 'success',
							'text-red-800': notificationType === 'error',
						}"
					>
						{{ notificationMessage }}
					</p>
				</div>
				<div class="ml-4 flex-shrink-0 flex">
					<button
						@click="showNotification = false"
						class="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
					>
						<i class="ph-x ph-duotone"></i>
					</button>
				</div>
			</div>
		</div>
	</Transition>
</template>

<script setup lang="ts">
// Disable page transitions for this page to prevent blank page issues
definePageMeta({
	pageTransition: false,
});

import {
	ref,
	onMounted,
	onUnmounted,
	onBeforeUnmount,
	computed,
	nextTick,
} from "vue";
import type { Template, TemplateVariable } from "~/types/template";
import type { Brand } from "~/types/brand";
import * as Handlebars from "handlebars";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import { googleFontsService } from "~/services/googleFonts";
import { addGoogleFontsAndStyles } from "~/utils/htmlUtils";
import { useTemplateStore } from "~/stores/template";
import { useBrandStore } from "~/stores/brand";
import { useStudioStore } from "~/stores/studio";
import { useAuthStore } from "~/composables/useAuth";
import { TEMPLATE_CATEGORIES } from "~/constants/categories";
import { getApiUrl, resolveBackendImageUrl } from "~/utils/api";

// Import MonacoEditor only on client side
let MonacoEditor: any = null;
if (process.client) {
	MonacoEditor = (await import("monaco-editor-vue3")).default;
}

// Enregistrer le helper 'first'
Handlebars.registerHelper("first", function (array) {
	return array && array.length ? array[0] : "";
});

// Enregistrer le helper 'random'
Handlebars.registerHelper("random", function (array) {
	if (!array || !array.length) return "";
	const randomIndex = Math.floor(Math.random() * array.length);
	return array[randomIndex];
});
// Helper d'égalité simple
Handlebars.registerHelper("eq", function (a, b) {
	return a === b;
});

// Helper de condition générique
Handlebars.registerHelper(
	"ifCond",
	function (this: any, v1, operator, v2, options) {
		switch (operator) {
			case "==":
				return v1 == v2 ? options.fn(this) : options.inverse(this);
			case "===":
				return v1 === v2 ? options.fn(this) : options.inverse(this);
			case "!=":
				return v1 != v2 ? options.fn(this) : options.inverse(this);
			case "!==":
				return v1 !== v2 ? options.fn(this) : options.inverse(this);
			case "<":
				return v1 < v2 ? options.fn(this) : options.inverse(this);
			case "<=":
				return v1 <= v2 ? options.fn(this) : options.inverse(this);
			case ">":
				return v1 > v2 ? options.fn(this) : options.inverse(this);
			case ">=":
				return v1 >= v2 ? options.fn(this) : options.inverse(this);
			case "&&":
				return v1 && v2 ? options.fn(this) : options.inverse(this);
			case "||":
				return v1 || v2 ? options.fn(this) : options.inverse(this);
			default:
				return options.inverse(this);
		}
	}
);

// Helper pour obtenir la première image du groupe 'background'
Handlebars.registerHelper("firstBackgroundImage", function (imageGroups) {
	if (!Array.isArray(imageGroups)) return "";
	const backgroundGroup = imageGroups.find(
		(g) => g.groupName === "background"
	);
	if (
		!backgroundGroup ||
		!Array.isArray(backgroundGroup.images_url) ||
		backgroundGroup.images_url.length === 0
	)
		return "";
	return resolveBackendImageUrl(backgroundGroup.images_url[0].url || "");
});

// Helper pour obtenir la première image d'un tableau d'images (ex: brand.imageGroups.background)
Handlebars.registerHelper("firstImage", function (images) {
	if (!Array.isArray(images) || images.length === 0) return "";
	return resolveBackendImageUrl(images[0].url || "");
});

// Helper pour obtenir une image aléatoire d'un tableau d'images (ex: brand.imageGroups.background)
Handlebars.registerHelper("randomImage", function (images) {
	if (!Array.isArray(images) || images.length === 0) return "";
	const idx = Math.floor(Math.random() * images.length);
	return resolveBackendImageUrl(images[idx].url || "");
});

// Helper pour obtenir l'URL d'une image par son nom dans un tableau d'images
Handlebars.registerHelper("namedImage", function (images, name) {
	if (!Array.isArray(images) || !name) return "";
	const found = images.find((img) => img.name === name);
	return found && found.url ? resolveBackendImageUrl(found.url) : "";
});

// Helper pour formater les polices (ajoute des guillemets si nécessaire)
Handlebars.registerHelper("fontFamily", function (fontName) {
	if (!fontName) return "";
	// Si la police contient des espaces, l'entourer de guillemets
	if (fontName.includes(" ")) {
		return `"${fontName}"`;
	}
	return fontName;
});

// Helper pour rendre une icône (existant mais amélioré)
Handlebars.registerHelper("renderIcon", function (icon) {
	let html = "";
	if (typeof icon === "string") {
		if (icon.startsWith("ph-")) {
			html = `<div class="icon"><i class="ph-duotone ${icon}" style="font-size: 3em; color: var(--secondaryColor);"></i></div>`;
		} else if (icon.startsWith("fa-") || icon.startsWith("fa ")) {
			const faClass = icon.startsWith("fa ") ? icon : "fa " + icon;
			html = `<div class="icon"><i class="${faClass}" style="font-size: 3em; color: var(--secondaryColor);"></i></div>`;
		}
	} else if (icon && icon.class) {
		html = `<div class="icon"><i class="${icon.class}" style="font-size: 3em; color: var(--secondaryColor);"></i></div>`;
	}
	return new Handlebars.SafeString(html);
});

// Helper pour multiplier
Handlebars.registerHelper("multiply", function (a, b) {
	return a * b;
});

// Helper pour modulo
Handlebars.registerHelper("modulo", function (a, b) {
	return a % b;
});

// Helper pour comparer si a > bw
Handlebars.registerHelper("gt", function (a, b) {
	return a > b;
});

// Helper pour obtenir la longueur d'un tableau
Handlebars.registerHelper("length", function (array) {
	return Array.isArray(array) ? array.length : 0;
});

// Helper pour accéder à une propriété d'un objet par index
Handlebars.registerHelper("lookup", function (array, index, property) {
	if (!Array.isArray(array) || !array[index]) return "";
	return array[index][property] || "";
});
Handlebars.registerHelper("json", function (context) {
	return JSON.stringify(context);
});

// Helper resolveImage - résout les URLs d'images backend
Handlebars.registerHelper("resolveImage", function (imageUrl) {
	if (!imageUrl) return "";
	return resolveBackendImageUrl(imageUrl);
});

// Fonction pour extraire la valeur d'une variable (gère les deux formats)
const extractVariableValue = (variable: any): string => {
	if (typeof variable === "object" && variable !== null) {
		// Format: { value: string, type: string }
		if ("value" in variable && "type" in variable) {
			return variable.value;
		}
		// Format: string JSON stringifié
		if (typeof variable === "string") {
			try {
				const parsed = JSON.parse(variable);
				if (parsed && typeof parsed === "object" && "value" in parsed) {
					return parsed.value;
				}
			} catch (e) {
				// Si ce n'est pas du JSON valide, retourner la valeur telle quelle
				return variable;
			}
		}
	}
	// Format simple: string
	return String(variable);
};

// Fonction pour afficher des icônes aléatoirement dans des zones
function showIconRandomly(
	icons: any[],
	containerSelector: string,
	numberToShow: number
) {
	const container = document.querySelector(containerSelector);
	if (!container) {
		console.error(`Container ${containerSelector} not found`);
		return;
	}

	const zones = Array.from(container.children) as HTMLElement[];
	if (zones.length === 0) {
		console.error(`No child zones found in ${containerSelector}`);
		return;
	}

	const count = Math.min(numberToShow, zones.length, icons.length);

	const shuffledZones = zones.sort(() => 0.5 - Math.random()).slice(0, count);
	const shuffledIcons = icons.sort(() => 0.5 - Math.random()).slice(0, count);

	zones.forEach((zone) => (zone.innerHTML = ""));

	for (let i = 0; i < count; i++) {
		const icon = shuffledIcons[i];
		const iconElement = document.createElement("i");
		iconElement.className = icon.class;

		// Générer position et rotation aléatoire
		const offsetX = Math.random() * 80; // pourcentage de déplacement gauche (max 80%)
		const offsetY = Math.random() * 80; // pourcentage de déplacement haut (max 80%)
		const rotation = Math.random() * 60 - 30; // entre -30 et +30

		// Appliquer style
		iconElement.style.position = "absolute";
		iconElement.style.left = `${offsetX}%`;
		iconElement.style.top = `${offsetY}%`;
		iconElement.style.transform = `rotate(${rotation}deg)`;
		iconElement.style.transformOrigin = "center center";

		// Facultatif : pour éviter débordement
		iconElement.style.maxWidth = "100%";

		// Ajouter dans la zone
		const zone = shuffledZones[i];

		zone.appendChild(iconElement);
	}
}

const route = useRoute();
const router = useRouter();
const templateStore = useTemplateStore();
const brandStore = useBrandStore();
const studioStore = useStudioStore();
const authStore = useAuthStore();

const hasBrands = computed(() => brandStore.getBrandsCount > 0);
const hasTemplates = computed(() => templateStore.getTemplatesCount > 0);

// Ne montrer l'overlay que si les données sont chargées ET qu'il n'y a pas de brands/templates
const showOverlay = computed(
	() => isDataLoaded.value && (!hasBrands.value || !hasTemplates.value)
);

const overlayMessage = computed(() => {
	if (!hasBrands.value && !hasTemplates.value) {
		return "Pour commencer, vous devez créer au moins une marque et un template.";
	}
	if (!hasBrands.value) {
		return "Vous n'avez pas encore de marque. Créez-en une pour commencer à utiliser le studio.";
	}
	if (!hasTemplates.value) {
		return "Vous n'avez pas encore de template. Créez-en un pour commencer à utiliser le studio.";
	}
	return "";
});

// État - Utiliser le store studio pour la persistance
const selectedTemplate = computed({
	get: () => studioStore.selectedTemplate,
	set: (value) => studioStore.setSelectedTemplate(value),
});

const selectedBrand = computed({
	get: () => studioStore.selectedBrand,
	set: (value) => studioStore.setSelectedBrand(value),
});

const htmlContent = computed({
	get: () => studioStore.htmlContent,
	set: (value) => {
		if (!isMounted.value) return; // Prevent updates after unmount
		studioStore.setHtmlContent(value);
	},
});

const dimensions = computed({
	get: () => studioStore.dimensions,
	set: (value) => studioStore.setDimensions(value),
});

const editorWidth = computed({
	get: () => studioStore.editorWidth,
	set: (value) => studioStore.setEditorWidth(value),
});

const templateVariables = computed({
	get: () => studioStore.templateVariables,
	set: (value) => studioStore.updateTemplateVariables(value),
});

const brandVariables = ref<Record<string, any>>({});
const previewFrame = ref<HTMLIFrameElement | null>(null);
const monacoRef = ref();
const isMounted = ref(false);
const isDataLoaded = ref(false);

// État pour le redimensionnement
const isResizing = ref(false);
const startX = ref(0);
const startEditorWidth = ref(0);

// État pour la modal d'ajout de variable
const showAddVariableModal = ref(false);
const addVariableName = ref("");
const addVariableTypeString = ref("text");

const addVariableType = computed({
	get: () => addVariableTypeString.value as "text" | "textarea",
	set: (value: "text" | "textarea") => {
		addVariableTypeString.value = value;
	},
});

// État pour la modal JSON
const showJsonModal = ref(false);
const showCreateExampleModal = ref(false);

// État pour l'accordéon de la marque
const isBrandAccordionOpen = ref(false);

// État pour l'accordéon du template
const isTemplateAccordionOpen = ref(true);

// État pour la modal de confirmation de suppression
const showDeleteConfirmModal = ref(false);
const variableToDelete = ref("");

// État pour la confirmation de copie du JSON
const isJsonCopied = ref(false);

// Ajout : nom du template local
const templateName = ref("");

// Configuration Monaco Editor
const monacoOptions = ref({
	automaticLayout: true,
	minimap: { enabled: false },
	wordWrap: "on",
	fontSize: 14,
	lineNumbers: "on",
	scrollBeyondLastLine: false,
	// Désactiver le raccourci Ctrl+S par défaut
	actions: [],
});

// Interception Ctrl+S/Cmd+S pour sauvegarder le template
const handleSaveShortcut = (e: KeyboardEvent) => {
	if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
		e.preventDefault();
		e.stopPropagation();
		saveTemplate();
		return false;
	}
};

// Computed
const templates = computed(() => templateStore.templates);
const brands = computed(() => brandStore.brands);
const brandIconGroups = computed(() =>
	Array.isArray(selectedBrand.value?.icons) ? selectedBrand.value.icons : []
);
const brandImageGroupsByName = computed(() => {
	const groups = Array.isArray(selectedBrand.value?.imageGroups)
		? selectedBrand.value.imageGroups
		: [];
	return groups.reduce((acc, group) => {
		if (group.groupName) acc[group.groupName] = group.images_url || [];
		return acc;
	}, {} as Record<string, { name: string; url: string }[]>);
});

// Computed pour générer le JSON de la requête
const generatedJson = computed(() => {
	if (!selectedTemplate.value || !selectedBrand.value) {
		return JSON.stringify(
			{
				error: "Template et Brand doivent être sélectionnés",
			},
			null,
			2
		);
	}

	// Préparer les variables de template
	const templateVars: Record<string, string> = {};
	for (const [key, variable] of Object.entries(templateVariables.value)) {
		templateVars[key] = variable.value;
	}

	const jsonData = {
		templateName: selectedTemplate.value.name,
		brandName: selectedBrand.value.name,
		templateVariables: templateVars,
	};
	console.log(selectedBrand);
	return JSON.stringify(jsonData, null, 2);
});

// Méthode pour copier le JSON dans le presse-papiers
const copyJsonToClipboard = async () => {
	try {
		await navigator.clipboard.writeText(generatedJson.value);
		isJsonCopied.value = true;
		setTimeout(() => {
			isJsonCopied.value = false;
		}, 2000);
	} catch (err) {
		console.error("Erreur lors de la copie du JSON : ", err);
		alert("Erreur lors de la copie.");
	}
};

// Méthodes
const styleHandlebarsVariables = (element: HTMLElement) => {
	const simpleVarRegex = /{{(?![#/]|else)[^{}]+}}/g;
	const walker = document.createTreeWalker(
		element,
		NodeFilter.SHOW_TEXT,
		null
	);

	let node: Text | null;
	while ((node = walker.nextNode() as Text | null)) {
		if (!node) continue;
		const text = node.textContent || "";

		// Ne jamais styliser un nœud qui contient un bloc Handlebars
		if (
			text.includes("{{#") ||
			text.includes("{{/") ||
			text.includes("{{else")
		)
			continue;

		if (!text.match(simpleVarRegex)) continue;

		const fragment = document.createDocumentFragment();
		let lastIndex = 0;
		let match;
		simpleVarRegex.lastIndex = 0; // reset regex state

		while ((match = simpleVarRegex.exec(text))) {
			if (match.index > lastIndex) {
				fragment.appendChild(
					document.createTextNode(text.slice(lastIndex, match.index))
				);
			}
			const span = document.createElement("span");
			span.textContent = match[0];
			span.className = match[0].includes("brand.")
				? "handlebars-variable-brand"
				: "handlebars-variable";
			fragment.appendChild(span);
			lastIndex = match.index + match[0].length;
		}
		if (lastIndex < text.length) {
			fragment.appendChild(
				document.createTextNode(text.slice(lastIndex))
			);
		}
		node.parentNode?.replaceChild(fragment, node);
	}
};

const handleTemplateChange = async () => {
	if (!selectedTemplate.value?.id) return;

	try {
		// Mettre à jour l'URL avec le nouveau template
		router.replace({
			query: {
				...route.query,
				template: selectedTemplate.value.id,
			},
		});

		// Charger le contenu HTML du template
		const content = await templateStore.getTemplateContent(
			selectedTemplate.value.id
		);

		// Mettre à jour les dimensions
		dimensions.value = {
			width: selectedTemplate.value.layout.width,
			height: selectedTemplate.value.layout.height,
		};

		// Appliquer les dimensions au HTML si nécessaire
		htmlContent.value = applyDimensionsToHtml(content, dimensions.value);

		// Mettre à jour l'éditeur Monaco
		if (isMounted.value && monacoRef.value && monacoRef.value.editor) {
			try {
				monacoRef.value.editor.setValue(htmlContent.value);
			} catch (error) {
				console.warn("Error setting Monaco editor value:", error);
			}
		}

		// Initialiser les variables du template (conversion)
		const loadedVars = selectedTemplate.value.variables || {};
		const newVars: Record<string, TemplateVariable> = {};
		for (const key in loadedVars) {
			const val = loadedVars[key];

			// Gérer les différents formats de variables
			if (
				typeof val === "object" &&
				val !== null &&
				"value" in val &&
				"type" in val
			) {
				// Format: { value: string, type: string }
				newVars[key] = val as TemplateVariable;
			} else if (typeof val === "string") {
				// Format: string JSON stringifié ou string simple
				try {
					const parsed = JSON.parse(val);
					if (
						parsed &&
						typeof parsed === "object" &&
						"value" in parsed &&
						"type" in parsed
					) {
						// Format JSON stringifié avec value et type
						newVars[key] = parsed as TemplateVariable;
					} else {
						// String simple
						newVars[key] = { value: val, type: "text" };
					}
				} catch (e) {
					// String simple (pas du JSON valide)
					newVars[key] = { value: val, type: "text" };
				}
			} else {
				// Format simple: string ou autre
				newVars[key] = { value: String(val), type: "text" };
			}
		}

		templateVariables.value = newVars;

		// Synchroniser le nom local
		templateName.value = selectedTemplate.value.name || "";

		await updatePreview();
	} catch (error) {
		console.error("Erreur lors du chargement du template:", error);
		alert("Erreur lors du chargement du template");
	}
};

const applyDimensionsToHtml = (
	html: string,
	dimensions: { width: number; height: number }
): string => {
	// Créer un DOM parser pour analyser le HTML
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, "text/html");

	// Ajouter les dimensions au HTML
	const htmlElement = doc.documentElement;
	htmlElement.style.width = `${dimensions.width}px`;
	htmlElement.style.height = `${dimensions.height}px`;
	htmlElement.style.overflow = "hidden";

	// Vérifier si le body a déjà des dimensions définies
	const body = doc.body;
	const currentStyle = body.getAttribute("style") || "";

	// Extraire les dimensions actuelles si elles existent
	const widthMatch = currentStyle.match(/width:\s*(\d+)px/);
	const heightMatch = currentStyle.match(/height:\s*(\d+)px/);

	let newStyle = currentStyle;

	// Si les dimensions ne correspondent pas ou n'existent pas, les ajouter/modifier
	if (!widthMatch || parseInt(widthMatch[1]) !== dimensions.width) {
		newStyle = newStyle.replace(/width:\s*\d+px;?/, "");
		newStyle += `width: ${dimensions.width}px;`;
	}

	if (!heightMatch || parseInt(heightMatch[1]) !== dimensions.height) {
		newStyle = newStyle.replace(/height:\s*\d+px;?/, "");
		newStyle += `height: ${dimensions.height}px;`;
	}

	// Ajouter overflow hidden pour éviter les scrollbars
	newStyle = newStyle.replace(/overflow:\s*[^;]+;?/, "");
	newStyle += "overflow: hidden;";

	// Ajouter margin: 0
	newStyle = newStyle.replace(/margin:\s*[^;]+;?/, "");
	newStyle += "margin: 0;";

	// Nettoyer le style (enlever les espaces multiples et s'assurer qu'il y a des points-virgules)
	newStyle = newStyle.replace(/\s+/g, " ").trim();
	if (!newStyle.endsWith(";")) {
		newStyle += ";";
	}

	// Appliquer le nouveau style au body
	body.setAttribute("style", newStyle);

	// Retourner le HTML modifié
	return doc.documentElement.outerHTML;
};

const handleBrandChange = () => {
	if (!selectedBrand.value) return;

	// Mettre à jour l'URL avec la nouvelle marque
	router.replace({
		query: {
			...route.query,
			brand: selectedBrand.value.id,
		},
	});

	// Mettre à jour les variables de la marque
	brandVariables.value = {
		primaryColor: selectedBrand.value.primaryColor,
		secondaryColor: selectedBrand.value.secondaryColor,
		tertiaryColor: selectedBrand.value.tertiaryColor,
		textColor: selectedBrand.value.textColor,
		textColor2: selectedBrand.value.textColor2,
		titleFont: selectedBrand.value.titleFont,
		textFont: selectedBrand.value.textFont,
		tertiaryFont: selectedBrand.value.tertiaryFont,
		logoUrl: selectedBrand.value.logoUrl,
		imageGroups: selectedBrand.value.imageGroups || [],
	};
	console.log("Nouvelles variables de marque:", brandVariables.value);
	updatePreview();
};

const updateDimensions = () => {
	updatePreview();
};

const updatePreview = async () => {
	if (!isMounted.value || !previewFrame.value) return;

	// Vérifier que nous avons un template et une marque
	if (!selectedTemplate.value || !selectedBrand.value) return;

	// Récupère les polices de la marque
	const fonts = [
		brandVariables.value.titleFont,
		brandVariables.value.textFont,
		brandVariables.value.tertiaryFont,
	].filter(Boolean); // Filtrer les valeurs vides

	// Génère les balises <link> Google Fonts avec le service
	const googleFontsLinks = googleFontsService.getGoogleFontsLink(fonts);

	const data = {
		// On passe uniquement les valeurs simples pour Handlebars
		...Object.fromEntries(
			Object.entries(templateVariables.value).map(([k, v]) => [
				k,
				extractVariableValue(v),
			])
		),
		brand: {
			primaryColor: brandVariables.value.primaryColor,
			secondaryColor: brandVariables.value.secondaryColor,
			tertiaryColor: brandVariables.value.tertiaryColor,
			textColor: brandVariables.value.textColor,
			textColor2: brandVariables.value.textColor2,
			titleFont: brandVariables.value.titleFont,
			textFont: brandVariables.value.textFont,
			tertiaryFont: brandVariables.value.tertiaryFont,
			logoUrl: brandVariables.value.logoUrl,
			icons: selectedBrand.value?.icons || [],
			imageGroups: brandImageGroupsByName.value,
		},
		width: dimensions.value.width,
		height: dimensions.value.height,
	};

	// Compiler le template avec Handlebars
	const template = Handlebars.compile(htmlContent.value);
	const compiledHtml = template(data);

	// Ajouter les polices Google Fonts et les styles CSS (async)
	const finalHtml = await addGoogleFontsAndStyles(
		compiledHtml,
		googleFontsLinks
	);

	// Mettre à jour l'iframe
	previewFrame.value.srcdoc = finalHtml;
};

const downloadImage = async () => {
	const downloadButton = document.getElementById(
		"download-image-btn"
	) as HTMLButtonElement;
	if (!downloadButton) return;

	if (!selectedTemplate.value || !selectedBrand.value) {
		alert("Veuillez sélectionner un template et une marque");
		return;
	}

	try {
		// Sauvegarder le contenu original du bouton
		const originalContent = downloadButton.innerHTML;

		// Afficher l'indicateur de chargement
		downloadButton.innerHTML =
			'<i class="ph-duotone ph-circle-notch ph-spin"></i> Génération...';
		downloadButton.disabled = true;

		// Préparer les variables de template
		const templateVars: Record<string, string> = {};
		for (const [key, variable] of Object.entries(templateVariables.value)) {
			templateVars[key] = extractVariableValue(variable);
		}

		// Nouvelle structure de requête
		const requestData = {
			templateName: selectedTemplate.value.name,
			brandName: selectedBrand.value.name,
			templateVariables: templateVars,
		};

		console.log("Sending data to backend:", requestData);

		const headers = authStore.getAuthHeaders;

		const response = await fetch(getApiUrl("/generate"), {
			method: "POST",
			headers: {
				...headers,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(requestData),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => null);
			throw new Error(
				`HTTP error! status: ${response.status}${
					errorData ? ` - ${JSON.stringify(errorData)}` : ""
				}`
			);
		}

		const blob = await response.blob();
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `image-${Date.now()}.png`;
		document.body.appendChild(a);
		a.click();
		window.URL.revokeObjectURL(url);
		document.body.removeChild(a);
	} catch (error: unknown) {
		console.error("Erreur lors de la génération de l'image:", error);
		alert(
			"Erreur lors de la génération de l'image : " +
				(error instanceof Error ? error.message : String(error))
		);
	} finally {
		// Restaurer le bouton à son état initial
		downloadButton.innerHTML =
			'<i class="ph-duotone ph-download mr-2"></i> Télécharger l\'image';
		downloadButton.disabled = false;
	}
};

const saveTemplate = async () => {
	if (!selectedTemplate.value?.id) {
		alert("Veuillez sélectionner un template");
		return;
	}

	try {
		// Sauvegarder { key: { value, type } } pour chaque variable
		const variablesToSave: Record<string, TemplateVariable> = {};
		for (const key in templateVariables.value) {
			variablesToSave[key] = {
				value: templateVariables.value[key].value,
				type: templateVariables.value[key].type,
			};
		}

		const updated = await templateStore.updateTemplate(
			selectedTemplate.value.id,
			{
				html: htmlContent.value,
				variables: variablesToSave,
				name: templateName.value,
			}
		);
		// Réaffecter selectedTemplate à l'objet mis à jour du store (pour garder la référence du select)
		const found = templateStore.templates.find((t) => t.id === updated.id);
		if (found) selectedTemplate.value = found;
		updatePreview();
	} catch (error) {
		console.error("Erreur lors de l'enregistrement du template:", error);
		alert("Erreur lors de l'enregistrement du template");
	}
};

const startResize = (e: MouseEvent) => {
	isResizing.value = true;
	startX.value = e.clientX;
	startEditorWidth.value = editorWidth.value;

	document.addEventListener("mousemove", handleMouseMove);
	document.addEventListener("mouseup", stopResize);
};

const handleMouseMove = (e: MouseEvent) => {
	if (!isResizing.value) return;

	const deltaX = e.clientX - startX.value;
	const maxEditorWidth = window.innerWidth - 340 - 300; // Largeur écran - sidebar - min preview
	const newEditorWidth = Math.max(
		300,
		Math.min(maxEditorWidth, startEditorWidth.value + deltaX)
	);
	editorWidth.value = newEditorWidth;

	// Forcer Monaco à se redimensionner
	if (isMounted.value && monacoRef.value && monacoRef.value.editor) {
		try {
			monacoRef.value.editor.layout();
		} catch (error) {
			console.warn("Error laying out Monaco editor:", error);
		}
	}
};

const stopResize = () => {
	isResizing.value = false;
	document.removeEventListener("mousemove", handleMouseMove);
	document.removeEventListener("mouseup", stopResize);
};

const addTemplateVariable = () => {
	showAddVariableModal.value = true;
};

const removeTemplateVariable = (key: string) => {
	variableToDelete.value = key;
	showDeleteConfirmModal.value = true;
};

const confirmDeleteVariable = () => {
	if (variableToDelete.value) {
		delete templateVariables.value[variableToDelete.value];
		variableToDelete.value = "";
		showDeleteConfirmModal.value = false;
	}
};

const handleDragStart = (event: DragEvent, variableName: string) => {
	if (event.dataTransfer) {
		event.dataTransfer.setData("text/plain", variableName);
		event.dataTransfer.effectAllowed = "copy";

		// Créer un élément pour le drag avec un style différent pour les variables de marque
		const dragElement = document.createElement("div");
		dragElement.textContent = `{{${variableName}}}`;
		dragElement.style.cssText = `
			background-color: ${variableName.startsWith("brand.") ? "#3B82F6" : "#10B981"};
			color: white;
			padding: 2px 8px;
			border-radius: 4px;
			font-family: monospace;
			font-size: 14px;
			display: inline-block;
			opacity: 0.8;
		`;
		document.body.appendChild(dragElement);
		event.dataTransfer.setDragImage(dragElement, 0, 0);
		setTimeout(() => document.body.removeChild(dragElement), 0);
	}
};

const handleDragEnd = () => {
	// Restaurer le curseur par défaut sur l'éditeur
	if (!isMounted.value) return;
	const editorElement = monacoRef.value?.editor?.getDomNode();
	if (editorElement) {
		editorElement.classList.remove("drag-over-editor");
	}
};

const handleDragOver = (event: DragEvent) => {
	event.preventDefault();
	if (!isMounted.value) return;
	if (event.dataTransfer) {
		event.dataTransfer.dropEffect = "copy";
		// Changer le curseur en type texte sur l'éditeur
		const editorElement = monacoRef.value?.editor?.getDomNode();
		if (editorElement) {
			editorElement.classList.add("drag-over-editor");
		}
	}
};

const handleDragEnter = (event: DragEvent) => {
	if (!isMounted.value) return;
	// Changer le curseur en type texte sur l'éditeur
	const editorElement = monacoRef.value?.editor?.getDomNode();
	if (editorElement) {
		editorElement.classList.add("drag-over-editor");
	}
};

const handleDragLeave = (event: DragEvent) => {
	if (!isMounted.value) return;
	// Restaurer le curseur par défaut sur l'éditeur
	const editorElement = monacoRef.value?.editor?.getDomNode();
	if (editorElement) {
		editorElement.classList.remove("drag-over-editor");
	}
};

const handleDrop = (event: DragEvent) => {
	event.preventDefault();
	if (!isMounted.value || !event.dataTransfer || !monacoRef.value?.editor)
		return;

	// Restaurer le curseur par défaut sur l'éditeur
	const editorElement = monacoRef.value?.editor?.getDomNode();
	if (editorElement) {
		editorElement.classList.remove("drag-over-editor");
	}

	const variableName = event.dataTransfer.getData("text/plain");
	if (!variableName) return;

	try {
		const editor = monacoRef.value.editor;

		// Utiliser l'API Monaco pour obtenir la position à partir des coordonnées de la souris
		const position = editor.getTargetAtClientPoint(
			event.clientX,
			event.clientY
		);

		if (!position || !position.position) return;

		// Déterminer le contenu à insérer selon le type de variable
		let contentToInsert = `{{${variableName}}}`;

		// Si c'est une image individuelle, insérer l'URL directe
		if (variableName.startsWith("image:")) {
			const imageUrl = variableName.replace("image:", "");
			contentToInsert = imageUrl;
		}
		// Si c'est un groupe d'images, insérer le snippet approprié selon le groupe
		else if (variableName.startsWith("brand.imageGroups.")) {
			const groupName = variableName.replace("brand.imageGroups.", "");

			// Pour le groupe background, utiliser randomImage
			if (groupName === "background") {
				contentToInsert = `{{randomImage brand.imageGroups.${groupName}}}`;
			} else {
				// Pour les autres groupes, utiliser namedImage avec le premier nom d'image
				const imageGroup = selectedBrand.value?.imageGroups?.find(
					(g) => g.groupName === groupName
				);
				const firstImageName = imageGroup?.images_url?.[0]?.name;

				if (firstImageName) {
					contentToInsert = `{{namedImage brand.imageGroups.${groupName}} "${firstImageName}"}}`;
				} else {
					contentToInsert = `{{namedImage brand.imageGroups.${groupName}} "nom_image"}}`;
				}
			}
		}
		// Si c'est le groupe d'icônes, insérer le snippet pour 5 icônes aléatoires
		else if (variableName === "brand.icons") {
			contentToInsert = `{{#each (randomIconZones brand.icons 5) as |icon|}}
  <div class="icon">
    <i class="{{icon.class}}" style="font-size: 2.5em; color: var(--secondaryColor);"></i>
  </div>
{{/each}}`;
		}

		// Utiliser l'API Monaco pour insérer le texte
		editor.executeEdits("insert-variable", [
			{
				range: {
					startLineNumber: position.lineNumber,
					startColumn: position.column,
					endLineNumber: position.lineNumber,
					endColumn: position.column,
				},
				text: contentToInsert,
			},
		]);

		// Mettre à jour le contenu
		htmlContent.value = editor.getValue();
		updatePreview();
	} catch (error) {
		console.warn("Error in handleDrop:", error);
	}
};

// Fonction pour insérer une variable à la position du curseur (alternative au drag & drop)
const insertVariableAtCursor = (variableName: string) => {
	if (!isMounted.value || !monacoRef.value?.editor) return;

	try {
		const editor = monacoRef.value.editor;
		const position = editor.getPosition();
		if (!position) return;

		// Déterminer le contenu à insérer selon le type de variable
		let contentToInsert = `{{${variableName}}}`;

		// Si c'est une image individuelle, insérer l'URL directe
		if (variableName.startsWith("image:")) {
			const imageUrl = variableName.replace("image:", "");
			contentToInsert = imageUrl;
		}
		// Si c'est un groupe d'images, insérer le snippet approprié selon le groupe
		else if (variableName.startsWith("brand.imageGroups.")) {
			const groupName = variableName.replace("brand.imageGroups.", "");

			// Pour le groupe background, utiliser randomImage
			if (groupName === "background") {
				contentToInsert = `{{randomImage brand.imageGroups.${groupName}}}`;
			} else {
				// Pour les autres groupes, utiliser namedImage avec le premier nom d'image
				const imageGroup = selectedBrand.value?.imageGroups?.find(
					(g) => g.groupName === groupName
				);
				const firstImageName = imageGroup?.images_url?.[0]?.name;

				if (firstImageName) {
					contentToInsert = `{{namedImage brand.imageGroups.${groupName}} "${firstImageName}"}}`;
				} else {
					contentToInsert = `{{namedImage brand.imageGroups.${groupName}} "nom_image"}}`;
				}
			}
		}
		// Si c'est le groupe d'icônes, insérer le snippet pour 5 icônes aléatoires
		else if (variableName === "brand.icons") {
			contentToInsert = `{{#each (randomIconZones brand.icons 5) as |icon|}}
  <div class="icon">
    <i class="{{icon.class}}" style="font-size: 2.5em; color: var(--secondaryColor);"></i>
  </div>
{{/each}}`;
		}

		editor.executeEdits("insert-variable", [
			{
				range: {
					startLineNumber: position.lineNumber,
					startColumn: position.column,
					endLineNumber: position.lineNumber,
					endColumn: position.column,
				},
				text: contentToInsert,
			},
		]);

		htmlContent.value = editor.getValue();
		updatePreview();
	} catch (error) {
		console.warn("Error in insertVariableAtCursor:", error);
	}
};

const handleEditorInput = () => {
	if (!isMounted.value || !monacoRef.value?.editor) return;

	try {
		const content = monacoRef.value.editor.getValue();
		htmlContent.value = content;
		updatePreview();
	} catch (error) {
		console.warn("Error in handleEditorInput:", error);
	}
};

// État pour la modal d'ajout de variable
const confirmAddVariable = () => {
	const name = addVariableName.value.trim();
	if (!name || templateVariables.value[name]) return;
	templateVariables.value[name] = { value: "", type: addVariableType.value };
	showAddVariableModal.value = false;
	addVariableName.value = "";
	addVariableTypeString.value = "text";
};

// Initialisation
onMounted(async () => {
	await Promise.all([
		templateStore.fetchTemplates(),
		brandStore.fetchBrands(),
	]);

	// Marquer les données comme chargées
	isDataLoaded.value = true;

	// Restaurer l'état depuis le localStorage
	const savedIds = studioStore.loadFromLocalStorage();

	// Récupérer le template et la marque depuis l'URL ou le localStorage
	const templateId = (route.query.template as string) || savedIds.templateId;
	const brandId = (route.query.brand as string) || savedIds.brandId;

	// Marquer le composant comme monté
	isMounted.value = true;

	// Attendre que le DOM soit complètement monté (iframe inclus)
	await nextTick();
	await nextTick();

	// Sélectionner la marque d'abord (pour initialiser brandVariables)
	if (brandId) {
		const brand = brands.value.find((b) => b.id === brandId);
		if (brand) {
			selectedBrand.value = brand;
			handleBrandChange();
		}
	} else if (brands.value.length > 0) {
		selectedBrand.value = brands.value[0];
		handleBrandChange();
	}

	// Attendre un tick pour que brandVariables soit initialisé
	await nextTick();

	// Sélectionner le template (cela appellera updatePreview)
	if (templateId) {
		const template = templates.value.find((t) => t.id === templateId);
		if (template) {
			selectedTemplate.value = template;
			await handleTemplateChange();
		}
	} else if (templates.value.length > 0) {
		selectedTemplate.value = templates.value[0];
		await handleTemplateChange();
	}

	// S'assurer que le preview est mis à jour après tout
	await nextTick();
	if (isMounted.value && selectedTemplate.value && selectedBrand.value) {
		await updatePreview();
	}

	window.addEventListener("keydown", handleSaveShortcut);

	// Attendre que Monaco soit complètement monté
	await nextTick();
	await nextTick();

	// Ajouter un gestionnaire spécifique sur l'éditeur Monaco
	if (isMounted.value && monacoRef.value && monacoRef.value.editor) {
		try {
			const editorElement = monacoRef.value.editor.getDomNode();
			if (editorElement) {
				editorElement.addEventListener("keydown", handleSaveShortcut);
			}
		} catch (error) {
			console.warn("Error setting up Monaco editor listener:", error);
		}
	}
});

// Route guard to clean up before navigation
onBeforeRouteLeave(() => {
	// Clean up immediately when navigation starts
	cleanupMonacoEditor();
});

// Cleanup function that can be called from multiple places
const cleanupMonacoEditor = () => {
	// Marquer le composant comme démonté immédiatement
	isMounted.value = false;

	// Clean up resize event listeners
	if (isResizing.value) {
		document.removeEventListener("mousemove", handleMouseMove);
		document.removeEventListener("mouseup", stopResize);
		isResizing.value = false;
	}

	// Clean up Monaco Editor - doit être fait avec soin
	try {
		if (monacoRef.value?.editor) {
			// D'abord, retirer les event listeners
			try {
				const editorElement = monacoRef.value.editor.getDomNode();
				if (editorElement) {
					editorElement.removeEventListener(
						"keydown",
						handleSaveShortcut
					);
				}
			} catch (e) {
				// Ignore errors when removing listeners
			}

			// Ensuite, disposer l'éditeur
			try {
				if (typeof monacoRef.value.editor.dispose === "function") {
					monacoRef.value.editor.dispose();
				}
			} catch (e) {
				console.warn("Error disposing Monaco Editor:", e);
			}

			// Finalement, nettoyer la référence
			monacoRef.value = null;
		}
	} catch (error) {
		console.warn("Error cleaning up Monaco Editor:", error);
	}

	// Clear iframe content
	if (previewFrame.value) {
		try {
			previewFrame.value.srcdoc = "";
		} catch (error) {
			console.warn("Error clearing iframe:", error);
		}
		previewFrame.value = null;
	}
};

onBeforeUnmount(() => {
	// Call the cleanup function
	cleanupMonacoEditor();
});

onBeforeUnmount(() => {
	// Call the cleanup function
	cleanupMonacoEditor();
});

onUnmounted(() => {
	// Remove window event listener
	window.removeEventListener("keydown", handleSaveShortcut);
});

const exampleTemplate = ref({
	name: "",
	description: "",
	category: "",
	previewImage: "",
	layout: {
		width: 1000,
		height: 600,
	},
	tagsInput: "",
});

const creatingExample = ref(false);

const templateJson = computed(() => {
	const tags = exampleTemplate.value.tagsInput
		? exampleTemplate.value.tagsInput
				.split(",")
				.map((t) => t.trim())
				.filter(Boolean)
		: [];
	return JSON.stringify(
		{
			name: exampleTemplate.value.name,
			description: exampleTemplate.value.description,
			category: exampleTemplate.value.category,
			previewImage: exampleTemplate.value.previewImage,
			layout: exampleTemplate.value.layout,
			tags,
			variables: templateVariables.value,
			html: htmlContent.value,
			isActive: true,
		},
		null,
		2
	);
});

const createExampleTemplate = async () => {
	if (!exampleTemplate.value.name) {
		showToast("Le nom du template est requis", "error");
		return;
	}

	creatingExample.value = true;
	try {
		const tags = exampleTemplate.value.tagsInput
			? exampleTemplate.value.tagsInput
					.split(",")
					.map((t) => t.trim())
					.filter(Boolean)
			: [];
		const payload = {
			name: exampleTemplate.value.name,
			description: exampleTemplate.value.description,
			category: exampleTemplate.value.category,
			previewImage: exampleTemplate.value.previewImage,
			layout: exampleTemplate.value.layout,
			tags,
			variables: templateVariables.value,
			html: htmlContent.value,
			isActive: true,
		};

		const response = await fetch(getApiUrl("/templates/example"), {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`Erreur ${response.status}: ${errorText}`);
		}

		const result = await response.json();
		console.log("Template d'exemple créé avec succès:", result);

		// Afficher le message de succès
		showToast(
			`Template "${exampleTemplate.value.name}" créé avec succès !`,
			"success"
		);

		// Fermer la modal
		showCreateExampleModal.value = false;

		// Réinitialiser le formulaire
		exampleTemplate.value = {
			name: "",
			description: "",
			category: "",
			previewImage: "",
			layout: {
				width: 1000,
				height: 600,
			},
			tagsInput: "",
		};
	} catch (error) {
		console.error(
			"Erreur lors de la création du template d'exemple:",
			error
		);
		const errorMessage =
			error instanceof Error
				? error.message
				: "Erreur inconnue lors de la création";
		showToast(`Erreur: ${errorMessage}`, "error");
	} finally {
		creatingExample.value = false;
	}
};

// Variables réactives pour le formulaire de création de template d'exemple
const exampleTemplateName = ref("");
const exampleTemplateDescription = ref("");
const exampleTemplateCategory = ref("");
const exampleTemplatePreviewImage = ref("");
const exampleTemplateTags = ref("");
const exampleTemplateDimensions = ref({ width: 800, height: 600 });
const exampleTemplateVariables = ref<Record<string, TemplateVariable>>({});

// Variables pour les notifications
const showNotification = ref(false);
const notificationMessage = ref("");
const notificationType = ref<"success" | "error">("success");

// Fonction pour afficher une notification
const showToast = (message: string, type: "success" | "error" = "success") => {
	notificationMessage.value = message;
	notificationType.value = type;
	showNotification.value = true;

	// Masquer automatiquement après 4 secondes
	setTimeout(() => {
		showNotification.value = false;
	}, 4000);
};

// État pour l'accordéon de la marque
</script>

<style scoped>
.studio-container {
	display: flex;
	flex: 1;
	background: #f5f5f5;
	position: relative;
	overflow: hidden;
}

.studio-sidebar {
	width: 340px;
	background: white;
	border-right: 1px solid #e0e0e0;
	overflow-y: auto;
	flex-shrink: 0;
}

.studio-main {
	background: #fafbfc;
	padding: 24px;
	display: flex;
	flex-direction: column;
	min-width: 300px;
	flex-shrink: 0;
}

.resizer {
	width: 8px;
	background: transparent;
	cursor: col-resize;
	transition: background-color 0.2s;
	flex-shrink: 0;
}

.resizer:hover,
.resizer.resizing {
	background: #e0e0e0;
}

.studio-preview {
	background: white;
	padding: 24px;
	display: flex;
	flex-direction: column;
	flex: 1;
	min-width: 300px;
}

.preview-container {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #f5f5f5;
	border-radius: 8px;
	overflow: auto;
}

.preview-frame {
	border: none;
	border-radius: 8px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	background: white;
}

/* Style pour le curseur de drag & drop */
:deep(.drag-over-editor) {
	cursor: text !important;
}

:deep(.drag-over-editor .monaco-editor) {
	cursor: text !important;
}

:deep(.drag-over-editor .monaco-editor .cursor) {
	cursor: text !important;
}

:deep(.handlebars-variable) {
	background-color: #10b981;
	color: white;
	padding: 2px 8px;
	border-radius: 4px;
	font-family: monospace;
	font-size: 14px;
	display: inline-block;
	margin: 0 2px;
}

:deep(.handlebars-variable-brand) {
	background-color: #3b82f6;
	color: white;
	padding: 2px 8px;
	border-radius: 4px;
	font-family: monospace;
	font-size: 14px;
	display: inline-block;
	margin: 0 2px;
}

pre {
	outline: none;
	tab-size: 2;
}

pre:focus {
	outline: none;
}
</style>
