export interface User {
	id: string;
	email: string;
	firstName?: string;
	lastName?: string;
	role: string;
	status: string;
	subscription?: any;
	createdAt: string;
	updatedAt: string;
}
