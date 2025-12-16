// School GraphQL Queries and Mutations

export const SCHOOL_QUERIES = {
	GET_ALL: `
    query GetSchools {
      schools {
        idStr
        name {
          en
          km
        }
        code
        schoolType
        educationLevels
        status
        address {
          province
          district
          commune
        }
        stats {
          totalStudents
          totalTeachers
          totalClasses
          totalBranches
        }
      }
    }
  `,

	GET_BY_ID: `
    query GetSchool($id: String!) {
      school(id: $id) {
        idStr
        displayName
        name {
          en
          km
        }
        code
        schoolType
        educationLevels
        status
        description
        address {
          street
          village
          commune
          district
          province
          postalCode
          country
        }
        contact {
          phone
          email
        }
        website
        primaryColor
        stats {
          totalStudents
          totalTeachers
          totalClasses
          totalBranches
        }
        settings {
          academicYearStartMonth
          gradingSystem
          currency
          language
          timezone
        }
        features
      }
    }
  `,

	MY_SCHOOLS: `
    query MySchools($ownerEmail: String!) {
      mySchools(ownerEmail: $ownerEmail) {
        idStr
        name {
          en
          km
        }
        code
        schoolType
        status
        stats {
          totalStudents
          totalTeachers
          totalClasses
        }
      }
    }
  `,

	PENDING_SCHOOLS: `
    query PendingSchools {
      pendingSchools {
        idStr
        name {
          en
          km
        }
        status
        address {
          province
        }
      }
    }
  `,

	BY_STATUS: `
    query SchoolsByStatus($status: String!) {
      schoolsByStatus(status: $status) {
        idStr
        name {
          en
          km
        }
        status
        schoolType
      }
    }
  `,
};

export const SCHOOL_MUTATIONS = {
	REGISTER: `
    mutation RegisterSchool($input: RegisterSchoolInput!) {
      registerSchool(input: $input) {
        idStr
        name {
          en
          km
        }
        code
        status
      }
    }
  `,

	APPROVE: `
    mutation ApproveSchool($input: ApproveSchoolInput!) {
      approveSchool(input: $input) {
        idStr
        status
      }
    }
  `,

	REJECT: `
    mutation RejectSchool($input: RejectSchoolInput!) {
      rejectSchool(input: $input) {
        idStr
        status
        rejectionReason
      }
    }
  `,
};
