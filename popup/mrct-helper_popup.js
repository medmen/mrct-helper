/**
 * mrct-helper_popup.js
 *
 * Popup script for the MRCT-Helper extension.
 * Handles built-in preset selection, lists saved presets from local storage,
 * and allows applying or deleting saved presets.
 */

const defaultFormtypes = {
	"CT": "CT_KHK",
	"MR-STRESS": "MRT_STRESS",
	"MR-ITIS": "MRT_ITIS_3T"
};

/**
 * Fetches all saved presets from browser storage, active tab localStorage, and local context.
 *
 * @returns {Promise<Array<{name: string, modality: 'CT'|'MRT', fields: Record<string, any>}>>}
 */
async function fetchSavedPresets() {
	const presets = [];
	const seenNames = new Set();

	// 1. Read from browser.storage.local
	if (typeof browser !== 'undefined' && browser.storage && browser.storage.local) {
		try {
			const allItems = await browser.storage.local.get(null);
			for (const [key, value] of Object.entries(allItems || {})) {
				if (!key || key.startsWith('_') || key === 'form_saver_index' || seenNames.has(key)) {
					continue;
				}
				if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
					continue;
				}

				if (typeof value === 'object' && value !== null) {
					let modality = 'CT';
					let fields = value;
					if (value.fields && typeof value.fields === 'object') {
						fields = value.fields;
						modality = (value.modality === 'MRT' || value.modality === 'MR') ? 'MRT' : (value.modality || 'CT');
					} else if (value.modality) {
						modality = (value.modality === 'MRT' || value.modality === 'MR') ? 'MRT' : 'CT';
						const { modality: _, ...rest } = value;
						fields = rest;
					}

					presets.push({
						name: key,
						modality: modality,
						fields: fields
					});
					seenNames.add(key);
				}
			}
		} catch (error) {
			console.warn('Error reading from browser.storage.local in popup:', error);
		}
	}

	// 2. Read from active tab's localStorage / content script
	if (typeof browser !== 'undefined' && browser.tabs && browser.scripting) {
		try {
			const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
			if (tab && tab.id) {
				const results = await browser.scripting.executeScript({
					target: { tabId: tab.id },
					func: async () => {
						if (typeof getSavedPresets === 'function') {
							try {
								return await getSavedPresets();
							} catch (e) {}
						}

						const list = [];
						if (typeof localStorage !== 'undefined' && localStorage !== null) {
							const keys = [];
							if (typeof localStorage.length === 'number') {
								for (let i = 0; i < localStorage.length; i++) {
									const k = localStorage.key(i);
									if (k) keys.push(k);
								}
							} else {
								keys.push(...Object.keys(localStorage));
							}

							for (const k of keys) {
								if (!k || k.startsWith('_') || k === 'form_saver_index' || k === 'length' || k === '__proto__' || k === 'constructor' || k === 'prototype') {
									continue;
								}
								try {
									const raw = typeof localStorage.getItem === 'function' ? localStorage.getItem(k) : localStorage[k];
									if (!raw || typeof raw !== 'string') continue;
									const parsed = JSON.parse(raw);
									if (parsed && typeof parsed === 'object') {
										const mod = (parsed.modality === 'MRT' || parsed.modality === 'MR') ? 'MRT' : (parsed.modality || 'CT');
										const flds = parsed.fields && typeof parsed.fields === 'object' ? parsed.fields : parsed;
										list.push({ name: k, modality: mod, fields: flds });
									}
								} catch (e) {}
							}
						}
						return list;
					},
					args: []
				});

				if (results && results[0] && Array.isArray(results[0].result)) {
					for (const preset of results[0].result) {
						if (preset && preset.name && !seenNames.has(preset.name)) {
							presets.push(preset);
							seenNames.add(preset.name);
						}
					}
				}
			}
		} catch (error) {
			console.warn('Error fetching presets from active tab in popup:', error);
		}
	}

	// 3. Fallback: Read from local context's localStorage (if available)
	if (typeof localStorage !== 'undefined' && localStorage !== null) {
		try {
			const keys = [];
			if (typeof localStorage.length === 'number') {
				for (let i = 0; i < localStorage.length; i++) {
					const k = localStorage.key(i);
					if (k) keys.push(k);
				}
			} else {
				keys.push(...Object.keys(localStorage));
			}

			for (const key of keys) {
				if (!key || key.startsWith('_') || key === 'form_saver_index' || seenNames.has(key)) {
					continue;
				}
				if (key === '__proto__' || key === 'constructor' || key === 'prototype' || key === 'length' || key === 'getItem' || key === 'setItem' || key === 'removeItem' || key === 'clear') {
					continue;
				}

				try {
					const raw = typeof localStorage.getItem === 'function' ? localStorage.getItem(key) : localStorage[key];
					if (!raw || typeof raw !== 'string') continue;
					const parsed = JSON.parse(raw);
					if (parsed && typeof parsed === 'object') {
						const modality = (parsed.modality === 'MRT' || parsed.modality === 'MR') ? 'MRT' : (parsed.modality || 'CT');
						const fields = parsed.fields && typeof parsed.fields === 'object' ? parsed.fields : parsed;
						presets.push({ name: key, modality, fields });
						seenNames.add(key);
					}
				} catch (e) {}
			}
		} catch (error) {
			console.warn('Error reading from popup localStorage:', error);
		}
	}

	return presets;
}

/**
 * Fills the form in the active tab with the given preset data or preset name.
 *
 * @param {string|Record<string, any>} presetData - Preset identifier or fields object.
 */
async function applyPresetToTab(presetData) {
	try {
		if (typeof browser !== 'undefined' && browser.tabs && browser.scripting) {
			const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
			if (tab && tab.id) {
				await browser.scripting.executeScript({
					target: { tabId: tab.id },
					func: (data) => {
						if (typeof fill_myform === 'function') {
							return fill_myform(data);
						}
					},
					args: [presetData]
				});
			}
		}
	} catch (error) {
		console.error('Could not apply preset from popup:', error);
	}
}

/**
 * Deletes a preset by name from local storage, browser storage, and the active tab.
 *
 * @param {string} presetName - The name of the preset to delete.
 */
async function deletePreset(presetName) {
	if (!presetName || typeof presetName !== 'string') return;
	const name = presetName.trim();

	// 1. Delete from popup localStorage
	if (typeof localStorage !== 'undefined' && localStorage !== null) {
		try {
			if (typeof localStorage.removeItem === 'function') {
				localStorage.removeItem(name);
			} else {
				delete localStorage[name];
			}
		} catch (e) {}
	}

	// 2. Delete from browser.storage.local
	if (typeof browser !== 'undefined' && browser.storage && browser.storage.local) {
		try {
			await browser.storage.local.remove(name);
		} catch (e) {}
	}

	// 3. Delete in active tab content script
	if (typeof browser !== 'undefined' && browser.tabs && browser.scripting) {
		try {
			const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
			if (tab && tab.id) {
				await browser.scripting.executeScript({
					target: { tabId: tab.id },
					func: async (pName) => {
						if (typeof deletePresetFromStorage === 'function') {
							await deletePresetFromStorage(pName);
						} else {
							if (typeof localStorage !== 'undefined') localStorage.removeItem(pName);
							if (typeof browser !== 'undefined' && browser.storage && browser.storage.local) {
								await browser.storage.local.remove(pName);
							}
							if (typeof renderSavedPresetButtons === 'function') {
								await renderSavedPresetButtons();
							}
						}
					},
					args: [name]
				});
			}
		} catch (error) {
			console.warn('Could not delete preset on active tab:', error);
		}
	}

	// Re-render popup list
	await loadAndRenderPresets();
}

/**
 * Renders the saved presets into the popup UI.
 *
 * @param {Array<{name: string, modality: string, fields: any}>} presets - List of presets.
 */
function renderPresetList(presets) {
	if (typeof document === 'undefined' || typeof document.getElementById !== 'function') {
		return;
	}

	const listContainer = document.getElementById('saved-presets-list');
	if (!listContainer) return;

	// Clear existing list
	listContainer.innerHTML = '';
	if (Array.isArray(listContainer.children)) {
		listContainer.children.length = 0;
	}

	if (!presets || presets.length === 0) {
		const emptyLi = document.createElement('li');
		emptyLi.className = 'empty-msg';
		emptyLi.textContent = 'Keine gespeicherten Presets';
		listContainer.appendChild(emptyLi);
		return;
	}

	for (const preset of presets) {
		const li = document.createElement('li');
		li.className = 'preset-item';

		// Modality badge
		const badge = document.createElement('span');
		const mod = (preset.modality || 'CT').toUpperCase();
		badge.className = `modality-badge ${mod === 'MRT' || mod === 'MR' ? 'mrt' : 'ct'}`;
		badge.textContent = mod;
		li.appendChild(badge);

		// Preset apply button
		const btn = document.createElement('button');
		btn.type = 'button';
		btn.className = 'preset-btn';
		btn.textContent = preset.name;
		btn.title = `Preset "${preset.name}" anwenden`;
		btn.addEventListener('click', async () => {
			await applyPresetToTab(preset.fields || preset.name);
		});
		li.appendChild(btn);

		// Delete button
		const delBtn = document.createElement('button');
		delBtn.type = 'button';
		delBtn.className = 'delete-btn';
		delBtn.textContent = '×';
		delBtn.title = `Preset "${preset.name}" löschen`;
		delBtn.setAttribute('aria-label', `Preset "${preset.name}" löschen`);
		delBtn.addEventListener('click', async (e) => {
			if (e && typeof e.stopPropagation === 'function') {
				e.stopPropagation();
			}
			await deletePreset(preset.name);
		});
		li.appendChild(delBtn);

		listContainer.appendChild(li);
	}
}

/**
 * Loads presets and renders them in the popup.
 */
async function loadAndRenderPresets() {
	try {
		const presets = await fetchSavedPresets();
		renderPresetList(presets);
	} catch (error) {
		console.warn('Could not load and render presets:', error);
	}
}

// Global click event listener
if (typeof document !== 'undefined' && typeof document.addEventListener === 'function') {
	document.addEventListener("click", async (e) => {
		if (!e || !e.target) return;

		const targetId = e.target.id;
		const classList = e.target.classList;
		const isClear = (classList && typeof classList.contains === 'function' && classList.contains("clear")) ||
			(e.target.className && typeof e.target.className === 'string' && e.target.className.includes("clear"));

		if (targetId && Object.hasOwn(defaultFormtypes, targetId)) {
			try {
				if (typeof browser !== 'undefined' && browser.tabs && browser.scripting) {
					const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
					if (tab && tab.id) {
						await browser.scripting.executeScript({
							target: { tabId: tab.id },
							func: formtype => {
								if (typeof fill_myform === 'function') {
									return fill_myform(formtype);
								}
							},
							args: [defaultFormtypes[targetId]]
						});
					}
				}
			} catch (error) {
				console.error("Could not fill form from popup.", error);
			}
		} else if (isClear) {
			if (typeof browser !== 'undefined' && browser.tabs && typeof browser.tabs.reload === 'function') {
				browser.tabs.reload();
			}
			if (typeof window !== 'undefined' && typeof window.close === 'function') {
				window.close();
			}
		}
	});

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', loadAndRenderPresets);
	} else {
		loadAndRenderPresets();
	}
}

// Export for Node.js test environments
if (typeof module !== 'undefined' && module.exports) {
	module.exports = {
		defaultFormtypes,
		fetchSavedPresets,
		applyPresetToTab,
		deletePreset,
		renderPresetList,
		loadAndRenderPresets
	};
}
