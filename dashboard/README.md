# SMS Dashboard

Modern school management system dashboard built with Next.js, HeroUI, and Tailwind CSS.

## Project Structure

The application uses a role-based and semantically grouped directory structure within the Next.js App Router.

### Directory Map (Routes)

```
app/
├── (public)/              # Public landing and auth entry
│   └── page.tsx           # Login page (at /)
└── auth/                  # Protected routes prefix
    ├── (dashboard)/       # Main application space
    │   ├── page.tsx       # Core dashboard (at /auth)
    │   ├── admin/         # Admin specialized features
    │   │   ├── (academic)     # Classes, attendance, grading
    │   │   ├── (institution)  # Branches, schools, settings
    │   │   ├── (management)   # Staff, students, members
    │   │   ├── (operations)   # Inventory, library, transport
    │   │   └── (finance)      # Financial management
    │   └── owner/         # School owner features
    ├── callback/          # OAuth callback processing
    ├── get-started/       # Onboarding flow
    ├── pending-approval/  # Access request status
    └── settings/          # Shared user settings & profile
```

## Authentication Architecture

The application implements a robust authentication and authorization flow:

1.  **Public entry**: Users arrive at `/` (Login).
2.  **OAuth flow**: Users login via KOOMPI ID, redirecting to `/auth/callback`.
3.  **Prefix-based protection**: All core application features are prefixed with `/auth`.
4.  **Guards**:
    - `AuthGuard`: Ensures the user has a valid JWT session.
    - `MembershipGuard`: Standardizes access based on school membership and approval status.
5.  **Role-based UI**: Sidebar modules and dashboard stats dynamically adapt based on the user's current role (Admin, Teacher, Student, etc.).

## Technologies Used

- [Next.js 14](https://nextjs.org/docs/getting-started)
- [HeroUI v2](https://heroui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [react-i18next](https://react.i18next.com/)
- [GraphQL/Apollo](https://www.apollographql.com/)

## Development

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

## License

Licensed under the [MIT license](LICENSE).
