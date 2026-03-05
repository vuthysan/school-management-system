// Inventory GraphQL Queries and Mutations

export const INVENTORY_ITEM_FIELDS = `
	id
	schoolId
	branchId
	name
	description
	category
	quantity
	unitCost
	currency
	totalValue
	location
	supplier
	purchaseDate
	warrantyExpiry
	condition
	assignedTo
	status
	createdAt
	updatedAt
`;

export const INVENTORY_QUERIES = {
	GET_INVENTORY_ITEMS: `
		query GetInventoryItems($schoolId: String!, $page: Int, $pageSize: Int, $filter: InventoryFilterInput) {
			inventoryItems(schoolId: $schoolId, page: $page, pageSize: $pageSize, filter: $filter) {
				items {
					${INVENTORY_ITEM_FIELDS}
				}
				total
				page
				totalPages
			}
		}
	`,

	GET_INVENTORY_ITEM: `
		query GetInventoryItem($id: String!) {
			inventoryItem(id: $id) {
				${INVENTORY_ITEM_FIELDS}
			}
		}
	`,

	GET_INVENTORY_STATS: `
		query GetInventoryStats($schoolId: String!) {
			inventoryStats(schoolId: $schoolId) {
				totalItems
				totalValue
				lowStockCount
				categories {
					category
					count
					totalValue
				}
			}
		}
	`,

	GET_LOW_STOCK_ITEMS: `
		query GetLowStockItems($schoolId: String!, $threshold: Int) {
			lowStockItems(schoolId: $schoolId, threshold: $threshold) {
				${INVENTORY_ITEM_FIELDS}
			}
		}
	`,
};

export const INVENTORY_MUTATIONS = {
	CREATE_INVENTORY_ITEM: `
		mutation CreateInventoryItem($input: CreateInventoryItemInput!) {
			createInventoryItem(input: $input) {
				${INVENTORY_ITEM_FIELDS}
			}
		}
	`,

	UPDATE_INVENTORY_ITEM: `
		mutation UpdateInventoryItem($id: String!, $input: UpdateInventoryItemInput!) {
			updateInventoryItem(id: $id, input: $input) {
				${INVENTORY_ITEM_FIELDS}
			}
		}
	`,

	DELETE_INVENTORY_ITEM: `
		mutation DeleteInventoryItem($id: String!) {
			deleteInventoryItem(id: $id)
		}
	`,
};
