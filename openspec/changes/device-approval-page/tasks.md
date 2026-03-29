## 1. Setup

- [ ] 1.1 Verify existing UI components are available (Card, Button, Badge, Alert, Loader2, CheckCircle2, XCircle icons)
- [ ] 1.2 Confirm authClient device authorization methods exist (`approve()`, `deny()`)

## 2. Component Implementation

- [ ] 2.1 Create DeviceApprovalPage component at `client/app/approve/page.tsx`
- [ ] 2.2 Implement authentication guard (redirect to `/sign-in` if not authenticated)
- [ ] 2.3 Add URL query parameter parsing for `user_code`
- [ ] 2.4 Implement state management for loading states (approve/deny separately)
- [ ] 2.5 Implement state management for error and success messages

## 3. UI Layout

- [ ] 3.1 Create page container with gradient background matching HomePage
- [ ] 3.2 Add header section with Terminal icon and title "Device Approval"
- [ ] 3.3 Create Card component with device authorization request details
- [ ] 3.4 Display user code in Badge component
- [ ] 3.5 Display account email and pending status
- [ ] 3.6 Add Approve and Deny button group with proper styling

## 4. Functionality

- [ ] 4.1 Implement `handleApprove()` function calling `authClient.deviceAuthorization.approve()`
- [ ] 4.2 Implement `handleDeny()` function calling `authClient.deviceAuthorization.deny()`
- [ ] 4.3 Add error handling with Alert component for API failures
- [ ] 4.4 Add success feedback with green Alert component
- [ ] 4.5 Implement auto-redirect to `/` after 2 seconds on success

## 5. Styling & Consistency

- [ ] 5.1 Apply consistent spacing (mb-8, gap-3, p-4) matching HomePage
- [ ] 5.2 Use CSS variables for colors (--primary, --background, --muted)
- [ ] 5.3 Ensure button heights match design system (h-12)
- [ ] 5.4 Add loading spinner animation for processing states
- [ ] 5.5 Add footer with "Secure OAuth 2.0 Device Flow" text and CLI badge

## 6. Testing & Verification

- [ ] 6.1 Test unauthenticated user redirect to `/sign-in`
- [ ] 6.2 Test successful approval flow and redirect
- [ ] 6.3 Test successful denial flow and redirect
- [ ] 6.4 Test error handling with simulated API failures
- [ ] 6.5 Verify visual consistency with HomePage and DeviceAuthorizationPage
