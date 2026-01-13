// Room/Classroom GraphQL Queries and Mutations

export const ROOM_FIELDS = `
	id
	schoolId
	name
	building
	floor
	capacity
	roomType
	status
	facilities
	description
`;

export const ROOM_QUERIES = {
	GET_ALL: `
		query GetRooms($schoolId: String!) {
			rooms(schoolId: $schoolId) {
				${ROOM_FIELDS}
			}
		}
	`,

	GET_BY_ID: `
		query GetRoom($id: String!) {
			room(id: $id) {
				${ROOM_FIELDS}
			}
		}
	`,
};

export const ROOM_MUTATIONS = {
	CREATE: `
		mutation CreateRoom($input: CreateRoomInput!) {
			createRoom(input: $input) {
				${ROOM_FIELDS}
			}
		}
	`,

	UPDATE: `
		mutation UpdateRoom($id: String!, $input: UpdateRoomInput!) {
			updateRoom(id: $id, input: $input) {
				${ROOM_FIELDS}
			}
		}
	`,

	DELETE: `
		mutation DeleteRoom($id: String!) {
			deleteRoom(id: $id)
		}
	`,
};
