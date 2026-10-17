# Security Specification (`security_spec.md`)

## 1. Data Invariants

1. **Default-Deny Catch-All**: All paths not explicitly matched in `/databases/{database}/documents` are denied (`allow read, write: if false;`).
2. **Bounded Member IDs (`ID Poisoning Guard`)**: A profile document in `/profiles/{memberId}` can ONLY exist for the 4 canonical Tokyo expedition member IDs (`kakao_hyunwoo_mom`, `kakao_sehyun_mom`, `kakao_hyunwoo`, `kakao_sehyun`), and `memberId` must match `^[a-zA-Z0-9_\-]+$` with length `1..64`.
3. **Strict Schema & Anti-Shadow-Update**: Every `create` and `update` on `/profiles/{memberId}` must pass `isValidExpeditionProfile(incoming())`, enforcing required keys (`memberId`, `nickname`, `defaultNickname`, `avatarId`, `avatarEmoji`, `updatedAt`) and allowing only those keys plus optional `profileImageUrl`. Shadow/ghost fields (e.g., `isAdmin`, `isVerified`) are strictly rejected.
4. **Immutable Core Identity Fields**: During `update`, `memberId` and `defaultNickname` are immutable (`incoming().memberId == existing().memberId && incoming().defaultNickname == existing().defaultNickname`), and `affectedKeys().hasOnly(['nickname', 'avatarId', 'avatarEmoji', 'profileImageUrl', 'updatedAt'])` is enforced.
5. **Temporal Integrity**: `updatedAt` must equal `request.time` (server timestamp) on both `create` and `update`. Client-forged past or future timestamps are rejected.
6. **Query Enforcement on List**: `allow list` on `/profiles/{memberId}` requires `resource.data.memberId in ['kakao_hyunwoo_mom', 'kakao_sehyun_mom', 'kakao_hyunwoo', 'kakao_sehyun']`, preventing unrestricted collection scraping.
7. **Deletion Lock**: Profile documents in `/profiles/{memberId}` cannot be deleted (`allow delete: if false;`).

## 2. The "Dirty Dozen" Payloads

1. **Payload 1 (ID Poisoning / Arbitrary Member ID)**: Creating `/profiles/attacker_999` -> `PERMISSION_DENIED`.
2. **Payload 2 (Shadow Field Injection on Create)**: Creating `/profiles/kakao_hyunwoo` with `{ ..., isVerified: true }` -> `PERMISSION_DENIED`.
3. **Payload 3 (Shadow Field Injection on Update)**: Updating `/profiles/kakao_hyunwoo` with `{ ..., role: 'ADMIN' }` -> `PERMISSION_DENIED`.
4. **Payload 4 (Immutable `memberId` Tampering on Update)**: Updating `/profiles/kakao_hyunwoo` with `memberId: 'kakao_sehyun'` -> `PERMISSION_DENIED`.
5. **Payload 5 (Immutable `defaultNickname` Tampering on Update)**: Updating `/profiles/kakao_hyunwoo` with `defaultNickname: '해커'` -> `PERMISSION_DENIED`.
6. **Payload 6 (Nickname Boundary Overflow)**: Updating `/profiles/kakao_hyunwoo` with a 100-character `nickname` (max 40) -> `PERMISSION_DENIED`.
7. **Payload 7 (Empty Nickname)**: Updating `/profiles/kakao_hyunwoo` with `nickname: ""` -> `PERMISSION_DENIED`.
8. **Payload 8 (Invalid `avatarId` Regex)**: Updating `/profiles/kakao_hyunwoo` with `avatarId: "../evil/script"` -> `PERMISSION_DENIED`.
9. **Payload 9 (Forged Client Timestamp)**: Writing `/profiles/kakao_hyunwoo` with a client-supplied past/future timestamp instead of `request.time` -> `PERMISSION_DENIED`.
10. **Payload 10 (Value Poisoning on `profileImageUrl`)**: Writing `profileImageUrl: 12345` (non-string) or > 500,000 chars -> `PERMISSION_DENIED`.
11. **Payload 11 (Unauthorized Delete)**: Deleting `/profiles/kakao_hyunwoo_mom` -> `PERMISSION_DENIED`.
12. **Payload 12 (Write to `/test/connection`)**: Attempting to write or delete `/test/connection` -> `PERMISSION_DENIED`.

## 3. Red Team Conflict Report

- **Identity Spoofing**: Blocked by `incoming().memberId == memberId` on create and `incoming().memberId == existing().memberId` on update.
- **State Shortcutting**: Blocked by `isValidExpeditionProfile(incoming())` wrapping both `create` and `update`.
- **Resource Poisoning**: Blocked by `isAllowedMemberId(memberId)` (capping total documents in `/profiles` to 4) and strict `.size()` bounds on every string field.
- **Value Poisoning**: Blocked because `isValidExpeditionProfile(incoming())` is the outer gate of `allow update` alongside `affectedKeys().hasOnly(...)`.
