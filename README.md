RICA Import Permit Application
Overview
The RICA Import Permit Application is a web-based service developed for Irembo to digitize government-to-citizen services. This service enables local manufacturers, assemblers, and miners to apply for value-added tax exemptions for raw materials, capital goods, and machinery by submitting a detailed application form. Upon submission, the application data is sent via email to both the applicant's email (if provided) and a designated recipient (p.touko@irembo.com).
Purpose
The goal is to provide a user-friendly interface for citizens to apply for the RICA Import Permit, ensuring accurate data collection and validation as per the service requirement document. The application streamlines the submission process and ensures reliable email delivery of the application payload to the specified recipients.
Features

Form Submission: Users can complete a multi-section form with fields for business owner details, business details, and product information.
Dynamic Validation: Client-side validation enforces required fields, correct formats (e.g., 16-digit ID, 9-digit TIN), and conditional logic (e.g., ID or passport number based on citizenship).
Responsive Design: The interface adapts seamlessly to desktop and mobile devices.
Email Integration: Successful submissions are emailed to the user and p.touko@irembo.com using a backend email service.
Success/Error Feedback: Clear success and error messages are displayed to the user post-submission.

Technologies Used

Frontend:
React: A JavaScript library for building a dynamic, component-based user interface.
Axios: For making HTTP requests to the backend API.
CSS (Tailwind-inspired): Custom styles for a responsive, modern form layout with error/success message styling.


Backend:
Node.js & Express: Handles API requests and form submission processing.
Nodemailer: Sends application data via email to the user and designated recipient.


Development Tools:
JavaScript (ES6+): For modern, maintainable code.
Git: Version control for collaborative development.
NPM: Package management for dependencies.



Usage

Access the application via the deployed URL or run locally with npm start.
Complete the form, ensuring all required fields (marked with *) are filled correctly.
Submit the form to send the application data to the backend.
Receive confirmation via a success message or error feedback if validation fails.
Check the provided email and p.touko@irembo.com for the application payload.

Notes

The form adheres to the service requirement document, with fields like Applicant Citizenship, TIN Number, and Quantity of Product(s) validated as specified.
The backend ensures secure email delivery using Nodemailer, with fallback error handling for failed submissions.
The application is optimized for accessibility and responsiveness, ensuring a seamless experience across devices.

Deployment: Vercel
Url:https://rica-import-permit-gilt.vercel.app/


For issues or enhancements, contact the development team at Irembo.