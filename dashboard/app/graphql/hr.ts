// HR GraphQL Queries and Mutations

const STAFF_FIELDS = `
	id
	schoolId
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
`;

const PAYROLL_FIELDS = `
	id
	schoolId
	staffId
	staffName
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
`;

const LEAVE_FIELDS = `
	id
	schoolId
	staffId
	leaveType
	startDate
	endDate
	days
	reason
	status
	approvedBy
	rejectionReason
	createdAt
	updatedAt
`;

const LEAVE_BALANCE_FIELDS = `
	id
	schoolId
	staffId
	academicYear
	annualTotal
	annualUsed
	annualRemaining
	sickTotal
	sickUsed
	sickRemaining
	maternityTotal
	maternityUsed
	maternityRemaining
	personalTotal
	personalUsed
	personalRemaining
`;

export const HR_QUERIES = {
	ALL_STAFF: `
		query AllStaff($schoolId: String!) {
			allStaff(schoolId: $schoolId) {
				${STAFF_FIELDS}
			}
		}
	`,

	STAFF_BY_ID: `
		query Staff($id: String!) {
			staff(id: $id) {
				${STAFF_FIELDS}
			}
		}
	`,

	PAYROLL_FOR_STAFF: `
		query PayrollForStaff($staffId: String!) {
			payrollForStaff(staffId: $staffId) {
				${PAYROLL_FIELDS}
			}
		}
	`,

	PAYROLL_HISTORY: `
		query PayrollHistory($schoolId: String!, $month: String, $page: Int, $pageSize: Int) {
			payrollHistory(schoolId: $schoolId, month: $month, page: $page, pageSize: $pageSize) {
				items {
					${PAYROLL_FIELDS}
				}
				total
				page
				totalPages
			}
		}
	`,

	STAFF_LEAVES: `
		query StaffLeaves($schoolId: String!, $staffId: String, $status: String) {
			staffLeaves(schoolId: $schoolId, staffId: $staffId, status: $status) {
				${LEAVE_FIELDS}
			}
		}
	`,

	LEAVE_BALANCE: `
		query LeaveBalance($schoolId: String!, $staffId: String!, $academicYear: String!) {
			leaveBalance(schoolId: $schoolId, staffId: $staffId, academicYear: $academicYear) {
				${LEAVE_BALANCE_FIELDS}
			}
		}
	`,

	ALL_LEAVE_BALANCES: `
		query AllLeaveBalances($schoolId: String!, $academicYear: String!) {
			allLeaveBalances(schoolId: $schoolId, academicYear: $academicYear) {
				${LEAVE_BALANCE_FIELDS}
			}
		}
	`,
};

export const HR_MUTATIONS = {
	CREATE_STAFF: `
		mutation CreateStaff($input: CreateStaffInput!) {
			createStaff(input: $input) {
				${STAFF_FIELDS}
			}
		}
	`,

	UPDATE_STAFF: `
		mutation UpdateStaff($id: String!, $input: UpdateStaffInput!) {
			updateStaff(id: $id, input: $input) {
				${STAFF_FIELDS}
			}
		}
	`,

	DELETE_STAFF: `
		mutation DeleteStaff($id: String!) {
			deleteStaff(id: $id)
		}
	`,

	CREATE_PAYROLL: `
		mutation CreatePayroll($input: CreatePayrollInput!) {
			createPayroll(input: $input) {
				${PAYROLL_FIELDS}
			}
		}
	`,

	GENERATE_MONTHLY_PAYROLL: `
		mutation GenerateMonthlyPayroll($input: GeneratePayrollInput!) {
			generateMonthlyPayroll(input: $input) {
				generatedCount
				totalAmount
				month
				payrolls {
					${PAYROLL_FIELDS}
				}
			}
		}
	`,

	UPDATE_PAYROLL_STATUS: `
		mutation UpdatePayrollStatus($id: String!, $input: UpdatePayrollStatusInput!) {
			updatePayrollStatus(id: $id, input: $input) {
				${PAYROLL_FIELDS}
			}
		}
	`,

	CREATE_LEAVE: `
		mutation CreateLeave($input: CreateLeaveInput!) {
			createLeave(input: $input) {
				${LEAVE_FIELDS}
			}
		}
	`,

	UPDATE_LEAVE_STATUS: `
		mutation UpdateLeaveStatus($id: String!, $input: UpdateLeaveStatusInput!) {
			updateLeaveStatus(id: $id, input: $input) {
				${LEAVE_FIELDS}
			}
		}
	`,

	INIT_LEAVE_BALANCE: `
		mutation InitLeaveBalance($input: InitLeaveBalanceInput!) {
			initLeaveBalance(input: $input) {
				${LEAVE_BALANCE_FIELDS}
			}
		}
	`,
};
