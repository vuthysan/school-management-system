// Parent-related GraphQL Queries

export const PARENT_QUERIES = {
	// Get children linked to current parent user
	GET_MY_CHILDREN: `
		query GetMyChildren {
			myChildren {
				id
				studentId
				firstNameKm
				lastNameKm
				firstNameEn
				lastNameEn
				fullName
				gradeLevel
				status
				dateOfBirth {
					day
					month
					year
				}
				gender
				contact {
					email
					phone
				}
				currentClass {
					id
					name
					grade
				}
				attendanceRate
				averageGrade
			}
		}
	`,

	// Get detailed info for a specific child
	GET_CHILD_DETAILS: `
		query GetChildDetails($studentId: String!) {
			student(id: $studentId) {
				id
				studentId
				firstNameKm
				lastNameKm
				firstNameEn
				lastNameEn
				fullName
				gradeLevel
				status
				dateOfBirth {
					day
					month
					year
				}
				gender
				contact {
					email
					phone
					address {
						province
						district
						commune
					}
				}
				healthInfo {
					bloodType
					allergies
					medicalConditions
				}
			}
		}
	`,

	// Get recent grades for a child
	GET_CHILD_GRADES: `
		query GetChildGrades($studentId: String!) {
			gradesByStudent(studentId: $studentId) {
				id
				subjectId
				subjectName
				score
				maxScore
				percentage
				gradeDate
				term
			}
		}
	`,

	// Get attendance for a child
	GET_CHILD_ATTENDANCE: `
		query GetChildAttendance($studentId: String!, $startDate: String, $endDate: String) {
			attendanceByStudent(studentId: $studentId, startDate: $startDate, endDate: $endDate) {
				id
				date
				status
				note
			}
		}
	`,
};
