## Why

The OAuth 2.0 Device Flow authorization process currently lacks a user-friendly approval page where authenticated users can review and explicitly approve or deny device access requests. This creates a security gap where users cannot control which devices are authorized to access their account.

## What Changes

- Add new DeviceApprovalPage component at `/approve` route
- Display device authorization request details (user code, account info, status)
- Provide Approve and Deny action buttons with proper loading states
- Integrate with better-auth device authorization API (`approve()` and `deny()` methods)
- Add success/error feedback using Alert components
- Auto-redirect to dashboard after action completion
- Protect route with authentication guard (redirect to sign-in if not authenticated)

## Capabilities

### New Capabilities
- `device-approval`: User interface for reviewing and approving/denying device authorization requests in OAuth 2.0 Device Flow

### Modified Capabilities
- (none)

## Impact

- **New file**: `client/app/approve/page.tsx` - Device approval page component
- **Dependencies**: Uses existing `authClient` from `@/lib/auth-client`, UI components from `@/components/ui/`
- **Routes**: New route `/approve` accessible via `http://localhost:3000/approve?user_code=XXXX`
- **API calls**: Integrates with `authClient.deviceAuthorization.approve()` and `authClient.deviceAuthorization.deny()`
- **Design system**: Follows existing design patterns from HomePage and DeviceAuthorizationPage (shadcn/ui components, Tailwind CSS, color scheme)
