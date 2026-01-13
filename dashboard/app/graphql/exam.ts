// GraphQL Queries and Mutations for Exams

export const EXAM_FIELDS = `
	fragment ExamFields on ExamScheduleType {
		id
		school_id
		academic_year_id
		term_id
		name
		subject_id
		class_id
		exam_date
		start_time
		end_time
		room
		examiner_id
		max_score
		status
		created_at
		updated_at
	}
`;

export const EXAM_QUERIES = {
	GET_EXAMS: `
		query GetExams(
			$schoolId: String!
			$page: Int
			$pageSize: Int
			$filter: ExamFilterInput
			$sort: ExamSortInput
		) {
			exams(
				schoolId: $schoolId
				page: $page
				pageSize: $pageSize
				filter: $filter
				sort: $sort
			) {
				items {
					...ExamFields
				}
				total
				page
				total_pages
			}
		}
		${EXAM_FIELDS}
	`,
	GET_EXAM: `
		query GetExam($id: String!) {
			exam(id: $id) {
				...ExamFields
			}
		}
		${EXAM_FIELDS}
	`,
};

export const EXAM_MUTATIONS = {
	CREATE: `
		mutation CreateExam($input: ExamScheduleInput!) {
			createExam(input: $input) {
				...ExamFields
			}
		}
		${EXAM_FIELDS}
	`,
	UPDATE: `
		mutation UpdateExam($id: String!, $input: UpdateExamScheduleInput!) {
			updateExam(id: $id, input: $input) {
				...ExamFields
			}
		}
		${EXAM_FIELDS}
	`,
	DELETE: `
		mutation DeleteExam($id: String!) {
			deleteExam(id: $id)
		}
	`,
};
