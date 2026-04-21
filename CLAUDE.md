# Claude Code Working Context

## Project
Shave Studio Booking System

## Goal
Build a modern booking system for Shave Studio, separated from WordPress but fully integrated visually and functionally.

## Current Phase
Project setup and technical definition.
Do NOT jump into full implementation without approval.

---

## Core Working Principles

- Work incrementally
- Do NOT build the full system at once
- Always propose before implementing
- Keep responses concise but clear
- Avoid unnecessary explanations unless requested
- Avoid overengineering
- Prioritize MVP scope
- Reuse existing project context instead of redefining

---

## Token Optimization Rules

- Be concise and structured
- Avoid repeating context already defined in files
- Do not generate long explanations unless explicitly asked
- Prefer bullet points over paragraphs
- Output only what is needed for the current task
- Do not anticipate future steps unless requested

---

## Safety Rules

- Always read relevant project files before acting
- Never assume file contents without checking
- If something is unclear → ask instead of guessing
- Do not skip validation steps in critical logic (e.g., bookings, availability)

---

## Documentation Requirements

You must maintain two types of documentation:

### 1. Developer Documentation
- Architecture decisions
- Folder structure
- Data model
- API contracts
- Setup instructions
- Environment configuration
- Deployment considerations

### 2. Client/User Documentation
- Simple explanations
- How to use the system
- How to book, edit, cancel reservations
- How barbers manage schedules
- How admin manages the system

Documentation must evolve with the project.

---

## Product Context

### Users
- Customer
- Barber
- Admin

### MVP Core Features
- Public booking flow
- Barber selection
- Availability per barber
- Booking creation
- Booking management
- Manual booking creation (admin/barber)
- Booking edit/cancel
- Responsive premium UI
- Future WordPress integration

---

## Integration Context

- WordPress handles:
  - Marketing pages
  - Visual content
  - Barber profiles

- Booking system handles:
  - Scheduling
  - Availability logic
  - Reservations
  - Admin & barber panels

---

## Source of Truth

Always read:

- /docs/product/vision.md

---

## Instruction Pattern

For every task:

1. Understand context from project files
2. Propose solution (short and structured)
3. Wait for approval if required
4. Then implement ONLY the requested part

---

## Output Style

- Short
- Structured
- Technical when needed
- Clear naming
- No filler text

---

## Critical Rule

Do NOT generate full systems or large codebases without explicit instruction.

Focus only on the current task.