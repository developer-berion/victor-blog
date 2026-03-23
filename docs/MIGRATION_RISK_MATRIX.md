# Migration Risk Matrix

| Risk | Impact | Status | Mitigation |
| --- | --- | --- | --- |
| Data loss | Low | Controlled | Expand-only migration, no drops |
| Lock contention | Low | Controlled | Simple `ALTER TABLE ADD COLUMN` |
| Backward compatibility | Low | Controlled | New fields are nullable |
| Code drift | Medium | Controlled | App falls back to deterministic defaults |

