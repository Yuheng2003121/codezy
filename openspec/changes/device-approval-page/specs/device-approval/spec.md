## ADDED Requirements

### Requirement: Display device authorization request details
The system SHALL display device authorization request information including user code, account email, and current status.

#### Scenario: Display user code
- **WHEN** user navigates to `/approve?user_code=XXXX`
- **THEN** system displays the user code in a badge component

#### Scenario: Display account information
- **WHEN** user is authenticated
- **THEN** system displays the user's email address

#### Scenario: Display pending status
- **WHEN** device authorization request is pending
- **THEN** system displays "Pending" status with loading indicator

### Requirement: Approve device authorization
The system SHALL allow authenticated users to approve device authorization requests.

#### Scenario: Successful approval
- **WHEN** user clicks "Approve" button
- **THEN** system calls `authClient.deviceAuthorization.approve()` with user code
- **AND** displays success message
- **AND** redirects to dashboard after 2 seconds

#### Scenario: Failed approval
- **WHEN** approval API call fails
- **THEN** system displays error message in Alert component
- **AND** keeps user on the page for retry

#### Scenario: Loading state during approval
- **WHEN** approval is in progress
- **THEN** "Approve" button shows loading spinner
- **AND** button is disabled

### Requirement: Deny device authorization
The system SHALL allow authenticated users to deny device authorization requests.

#### Scenario: Successful denial
- **WHEN** user clicks "Deny" button
- **THEN** system calls `authClient.deviceAuthorization.deny()` with user code
- **AND** displays success message
- **AND** redirects to dashboard after 2 seconds

#### Scenario: Failed denial
- **WHEN** denial API call fails
- **THEN** system displays error message in Alert component
- **AND** keeps user on the page for retry

#### Scenario: Loading state during denial
- **WHEN** denial is in progress
- **THEN** "Deny" button shows loading spinner
- **AND** button is disabled

### Requirement: Authentication protection
The system SHALL protect the approval page from unauthenticated access.

#### Scenario: Unauthenticated user access
- **WHEN** unauthenticated user navigates to `/approve`
- **THEN** system redirects to `/sign-in`

#### Scenario: Authenticated user access
- **WHEN** authenticated user navigates to `/approve`
- **THEN** system displays the approval page

### Requirement: UI consistency with design system
The system SHALL follow the project's established design patterns.

#### Scenario: Use shadcn/ui components
- **WHEN** rendering the page
- **THEN** system uses Card, Button, Badge, Alert components from `@/components/ui/`

#### Scenario: Follow color scheme
- **WHEN** rendering UI elements
- **THEN** system uses CSS variables (--primary, --background, --muted) from globals.css

#### Scenario: Match spacing conventions
- **WHEN** laying out components
- **THEN** system uses Tailwind spacing values (mb-8, gap-3, p-4) consistent with HomePage
