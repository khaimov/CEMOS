# Nexus 2026 Skills Matrix - Data Schema

## Core Entities

### 1. EngineerProfile
* **id**: UUID
* **name**: String
* **role**: Enum (CE_L1, CE_L2, SPECIALIST, ARCHITECT)
* **linkedInProfileId**: String (Encrypted)
* **internalBadgeId**: String
* **lastSyncedAt**: Timestamp

### 2. SkillNode
* **id**: UUID
* **name**: String (e.g., "Kubernetes", "Vertex AI", "BigQuery")
* **category**: Enum (INFRA, DATA, PREDICTIVE_AI, GENERATIVE_AI, SECURITY)
* **marketDemandScore**: Float (0.0 - 1.0, updated via External Intelligence)

### 3. SkillValidation
* **engineerId**: UUID (FK)
* **skillId**: UUID (FK)
* **proficiencyLevel**: Enum (AWARENESS, PRACTITIONER, EXPERT, THOUGHT_LEADER)
* **validationSource**: Enum (LINKEDIN_ENDORSEMENT, INTERNAL_CERT, PROJECT_DELIVERY, MANUAL_OVERRIDE)
* **evidenceLink**: URL (Optional)
* **validatedAt**: Timestamp

### 4. ProjectAssignment
* **id**: UUID
* **customerId**: UUID
* **requiredSkills**: List<SkillId>
* **assignedEngineerId**: UUID
* **status**: Enum (PROPOSED, ACTIVE, COMPLETED, BLOCKED)
* **outcomeScore**: int (1-5, post-delivery feedback)

### 5. GapAnalysisSnapshot
* **teamId**: UUID
* **timestamp**: Timestamp
* **missingCriticalSkills**: List<SkillNode>
* **capacityRiskScore**: Float (High risk of burning out experts)

## Relationships
* **Engineer** HAS_MANY **SkillValidations**
* **Project** REQUIRES **SkillNodes**
* **Project** HAS_MEMBER **Engineer** (match score calculated via overlap of Required vs Validated skills)

## Privacy Controls
* LinkedIn data is read-only and scoped to "Professional Skills" and "Public Certifications".
* PII (Personal Identifiable Information) stripped before feeding into Gap Analysis AI.
