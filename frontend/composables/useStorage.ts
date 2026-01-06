import { computed } from "vue";

export interface StorageInfo {
	planName: string;
	storageLimitBytes: number;
	bytesUsed: number;
	bytesAvailable: number;
	usagePercentage: number;
	isUnlimited: boolean;
}

export const useStorage = () => {
	// Format storage in human readable format
	const formatStorage = (bytes: number): string => {
		if (bytes === -1) return "Illimité";
		const gb = bytes / (1024 * 1024 * 1024);
		const mb = bytes / (1024 * 1024);

		// Use MB for values less than 1 GB, otherwise use GB
		if (gb < 1) {
			return `${Math.round(mb)} MB`;
		} else {
			return `${gb.toFixed(1)} GB`;
		}
	};

	// Format storage info for display
	const formatStorageInfo = (storageInfo: StorageInfo) => {
		return {
			planName: storageInfo.planName,
			usedFormatted: formatStorage(storageInfo.bytesUsed),
			availableFormatted: storageInfo.isUnlimited
				? "Illimité"
				: formatStorage(storageInfo.bytesAvailable),
			usagePercentage: storageInfo.usagePercentage,
		};
	};

	return {
		formatStorage,
		formatStorageInfo,
	};
};
