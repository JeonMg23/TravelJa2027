# Security Specification (`security_spec.md`)

## 1. Data Invariants

1. **Default-Deny Catch-All**: All paths not explicitly matched in `/databases/{database}/documents` are denied (`allow read, write: if false;`).
2. **Bounded Member IDs (`ID Poisoning Guard`)**: `/profiles/{memberId}` only permits the 4 fixed expedition member IDs (`kakao_hyunwoo_mom`, `kakao_sehyun_mom`, `kakao_hyunwoo`, `kakao_sehyun`) matching `^[a-zA-Z0-9_\-]+$` with length 1..64.
3. **Strict Key & Schema Enforcement (`Anti-Update-Gap`)**:
   - `ExpeditionProfile` documents at `/profiles/{memberId}` must contain required keys `['memberId', 'nickname', 'defaultNickname', 'avatarId', 'avatarEmoji', 'updatedAt']` and only allowed keys `['memberId', 'nickname', 'defaultNickname', 'avatarId', 'avatarEmoji', 'profileImageUrl', 'updatedAt']`.
   - `StampMission` documents at `/stampMissions/{missionId}` must contain required keys `['missionId', 'tripId', 'dayNumber', 'title', 'placeTag', 'rewardPoint', 'hyunwooStamped', 'sehyunStamped', 'hyunwooRequested', 'sehyunRequested', 'praiseNote', 'updatedBy', 'isDeleted', 'updatedAt']` and only those keys.
4. **Immutable Identity & Trip Keys**:
   - On `/profiles/{memberId}` update, `memberId` and `defaultNickname` cannot be modified.
   - On `/stampMissions/{missionId}` update, `missionId` and `tripId` (`'tokyo_2027'`) cannot be modified.
5. **Temporal Integrity**: `updatedAt` must always equal `request.time` (server timestamp) on both `create` and `update`.
6. **No Client Deletions**: Hard deletion (`delete`) is denied (`if false`) on both `/profiles/{memberId}` and `/stampMissions/{missionId}`. Custom missions use the bounded boolean `isDeleted` flag.

## 2. The "Dirty Dozen" Payloads

1. **Shadow Field Injection on Profile**: Adding `"isAdmin": true` to `/profiles/kakao_hyunwoo_mom`.
2. **Shadow Field Injection on StampMission**: Adding `"bonusHack": 999` to `/stampMissions/mission_d1_1`.
3. **ID Poisoning on StampMission**: Creating a mission with `missionId` containing spaces or special characters (`"mission/../hack"`).
4. **Cross-Trip Spoofing**: Creating or listing `/stampMissions/{missionId}` with `tripId: "other_trip"`.
5. **Out-of-Bounds Reward Points**: Setting `rewardPoint: 100` (must be `int` in `1..5`).
6. **Out-of-Bounds Day Number**: Setting `dayNumber: 99` (must be `int` in `0..6`).
7. **Oversized Title / Praise Note ("Denial of Wallet")**: Sending a 5,000-character string in `title` (max 80) or `praiseNote` (max 120).
8. **Timestamp Forgery**: Providing a forged client-side future timestamp for `updatedAt` instead of `request.time`.
9. **Immutable Key Mutation on Update**: Attempting to change `tripId` or `missionId` during an `update` to `/stampMissions/mission_d1_1`.
10. **Type Poisoning on Stamp Booleans**: Sending `"hyunwooStamped": "yes"` or `"hyunwooRequested": "true"` (string instead of `bool`).
11. **Hard Delete Attempt**: Calling `deleteDoc` on `/stampMissions/mission_d1_1` or `/profiles/kakao_hyunwoo`.
12. **Unmapped Collection Write**: Attempting to write to `/randomCollection/doc1`.
