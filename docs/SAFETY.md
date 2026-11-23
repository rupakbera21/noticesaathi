# docs/SAFETY.md — Safety and Guardrails Design

## Core Safety Principles

1. **Not Legal Advice**: NoticeSaathi prepares, explains, and organizes; it does not represent taxpayers, file documents, or offer formal legal opinions.
2. **Sources First**: Every legal or tax assertion must cite a retrieved official chunk from the CGST Act, CGST Rules, or official CBIC circulars. Uncited legal assertions are blocked by the grounding validator.
3. **Numbers from Code**: All dates, deadlines, interest, late fees, and totals are computed strictly by deterministic engines in `domain/` using dated rule files. Models never perform calculations.
4. **Mandatory CA Escalation**: Clear, deterministic triggers mandate escalation to a qualified Chartered Accountant (CA) or tax professional:
   - Allegations of fraud, wilful misstatement, or suppression of facts (e.g., Section 74 notices)
   - Search, inspection, or seizure proceedings (Section 67)
   - Proposed cancellation or suspension of GST registration
   - High-value demands exceeding configurable risk thresholds
   - Inconsistencies or low confidence in notice extraction
5. **Data Privacy & Processing**: Notice text is sent to our server for analysis and may be processed in-memory by Google Gemini or Groq. No persistent taxpayer profiles or notice archives are stored on application databases. Provider retention and upstream logging are unverified; client history resides in the active browser session.
6. **Prompt Injection Guardrails**: Notice text is treated as strictly untrusted user input enclosed within XML delimiter blocks.
