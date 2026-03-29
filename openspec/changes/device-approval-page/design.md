## Context

The project implements OAuth 2.0 Device Flow for CLI authentication. Currently, there is a device authorization page (`/device`) where users enter a user code, but there is no dedicated approval page where authenticated users can review and explicitly approve or deny device access requests. The better-auth library provides `approve()` and `deny()` methods that need a UI to expose these capabilities to users.

## Goals / Non-Goals

**Goals:**
- Create a clean, modern DeviceApprovalPage component following existing design patterns
- Display device authorization request details (user code, account info, pending status)
- Provide Approve and Deny actions with proper loading states and feedback
- Integrate with better-auth device authorization API
- Protect the route with authentication (redirect unauthenticated users to sign-in)
- Auto-redirect to dashboard after successful action

**Non-Goals:**
- Modifying the backend device authorization flow
- Adding new authentication methods
- Changing the existing DeviceAuthorizationPage (`/device`)
- Implementing device management or revocation features (future work)

## Decisions

1. **Component Structure**: Single-page component with inline state management
   - Rationale: Simple use case doesn't require complex state management (Zustand/Redux)
   - Alternative: Could use React Query for server state, but overkill for this simple flow

2. **UI Components**: Use existing shadcn/ui components (Card, Button, Badge, Alert)
   - Rationale: Maintains design consistency with HomePage and DeviceAuthorizationPage
   - Follows project's established pattern of using radix-nova style

3. **Loading States**: Separate loading states for Approve and Deny actions
   - Rationale: Allows user to see which action is being processed
   - Prevents race conditions if user clicks both buttons rapidly

4. **Error Handling**: Display errors inline using Alert component
   - Rationale: Consistent with existing error handling patterns in the project
   - Provides immediate feedback without disrupting user flow

5. **Auto-redirect**: 2-second delay after successful action
   - Rationale: Gives user time to see success message before navigation
   - Matches pattern used in DeviceAuthorizationPage

## Risks / Trade-offs

- [Risk] User might accidentally approve wrong device → [Mitigation] Clear visual distinction between Approve (primary) and Deny (outline) buttons
- [Risk] Network failure during approval → [Mitigation] Error handling with retry option (user can refresh and try again)
- [Risk] Session expires during flow → [Mitigation] Auth guard redirects to sign-in, user can re-authenticate and return
