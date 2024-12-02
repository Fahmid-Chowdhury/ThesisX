# Thesis X: Collaborative Thesis Platform - Feature Requirement Analysis

## Overview
Thesis X is a collaborative platform designed for university students and faculty to streamline the process of selecting thesis supervisors and co-supervisors. It addresses common challenges in the thesis topic selection phase, helping students connect with faculty members more efficiently. Key features include allowing faculty to register with their research interests, previous works, and availability, while students can browse and select supervisors and co-supervisors based on their preferences. This platform aims to enhance communication and facilitate appointments between students and faculty during the thesis supervision process.

## Tech Stack
  - React.js
  - Express.js
  - Node.js
  - PostgreSQL
  - Prisma (ORM)
  - Socket.io

## Features

### 1. User Registration & Authentication
- User registration for both students and faculty.
- Login functionality with email/password.
- Password recovery and account verification via email.
- Role-based access control (students vs faculty).

### 2. Faculty Profile Management
- Faculty can input personal and academic information (e.g., name, department, research interests, published works).
- Upload research papers, publications, and thesis projects.
- Add availability for supervision (dates or thesis slots).
- Update contact information.

### 3. Student Profile Management
- Students can input personal details (e.g., name, department, etc.).
- Add research interests and past academic work.
- Track thesis progress (e.g., topic selection, proposal stage, submission).

### 4. Searchable Supervisor Database
- Searchable database with multiple filters (e.g., research topics, faculty name, department).
- Ability to sort results by relevance or availability.

### 5. Research Interest Tags & Filters
- Faculty can select or add predefined tags (e.g., Artificial Intelligence, Cyber Security, etc.).
- Students can filter faculty based on selected tags (research topics).
- Dynamic search to refine results based on selected tags.

### 6. Supervisor Selection Process
- Students can request supervision by selecting a supervisor and co-supervisor.
- Option to send a thesis proposal or idea with the supervisor request.
- Notification system for faculty when students request supervision.
- Supervisors can accept, reject, or request further information.

### 7. Supervisor Availability Calendar
- Faculty can manage a calendar of availability for supervising thesis students.
- Faculty can specify unavailable periods (e.g., sabbatical, vacation).
- Students can view supervisor availability before booking appointments or meetings.

### 8. Thesis Proposal Submission & Approval
- Students can submit thesis proposals via the platform.
- Supervisors can review, suggest changes, and approve/reject proposals.
- Collaborative commenting feature for supervisors to provide feedback.

### 9. Document Management and Storage
- Upload and manage thesis drafts, research papers, and related files.
- Automatically extract metadata (e.g., paper title, authors) from uploaded documents.

### 10. Communication Tools
- Messaging system for students and faculty to communicate directly.
- Share meeting links through Zoom, Google Meet, or Teams.
- File sharing via the messaging system (may have limitations).

### 11. Thesis Progress Tracker
- Milestone tracker to mark key stages (proposal, literature review, data collection, etc.).
- Option to set deadlines and reminders for students and supervisors.
- Students can update milestone statuses.
- Supervisors can review progress and provide feedback.

### 12. Admin Dashboard
- Admins can view and manage all faculty and student accounts.
- Ability to monitor the number of students assigned to each faculty member.
- Oversee thesis submission timelines and approval processes.
