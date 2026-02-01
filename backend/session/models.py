# session/models.py

"""
This app is responsible ONLY for session / attempt flow logic
(start test, resume test, submit test).

It does NOT own any database models.

All persistent domain models such as:
- TestAttempt
- Response
- ResponseOption

are defined in tests.models as per SRD / SDD.
"""
