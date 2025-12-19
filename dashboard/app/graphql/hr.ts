export const HR_QUERIES = {
	ALL_STAFF: `
    query AllStaff($schoolId: String!) {
      allStaff(schoolId: $schoolId) {
        id
        staffId
        firstName
        lastName
        email
        phone
        dateOfBirth
        gender
        address
        role
        department
        subjects
        hireDate
        salary
        currency
        status
        profilePhoto
        createdAt
        updatedAt
      }
    }
  `,

	STAFF_BY_ID: `
    query Staff($id: String!) {
      staff(id: $id) {
        id
        staffId
        firstName
        lastName
        email
        phone
        dateOfBirth
        gender
        address
        role
        department
        subjects
        hireDate
        salary
        currency
        status
        profilePhoto
        createdAt
        updatedAt
      }
    }
  `,

	PAYROLL_FOR_STAFF: `
    query PayrollForStaff($staffId: String!) {
      payrollForStaff(staffId: $staffId) {
        id
        staffId
        month
        baseSalary
        bonuses
        deductions
        netSalary
        currency
        paymentDate
        status
        createdAt
        updatedAt
      }
    }
  `,
};

export const HR_MUTATIONS = {
	CREATE_STAFF: `
    mutation CreateStaff($input: CreateStaffInput!) {
      createStaff(input: $input) {
        id
        staffId
        firstName
        lastName
        status
      }
    }
  `,

	UPDATE_STAFF: `
    mutation UpdateStaff($id: String!, $input: UpdateStaffInput!) {
      updateStaff(id: $id, input: $input) {
        id
        firstName
        lastName
        status
        updatedAt
      }
    }
  `,

	CREATE_PAYROLL: `
    mutation CreatePayroll($input: CreatePayrollInput!) {
      createPayroll(input: $input) {
        id
        month
        netSalary
        status
      }
    }
  `,

	DELETE_STAFF: `
    mutation DeleteStaff($id: String!) {
      deleteStaff(id: $id)
    }
  `,
};
