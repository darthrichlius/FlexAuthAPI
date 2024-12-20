# Features

FlexAuth offers a comprehensive set of authentication and authorization features designed to simplify secure access control integration in both user-centric and microservices environments. Below is an overview of the core features:

## Core Features

These features form the **foundation of FlexAuth** and will definitely be implemented to ensure a secure, scalable, and customizable authentication service:

### Authentication Features

- **Token-based Credentials Generation**  
  Securely generate authentication tokens (JWTs) for user sessions, fully compliant with OAuth 2.0 standards, enabling scalable and stateless authentication.

- **Multi-factor Authentication (MFA)**  
  Enhance security with multiple forms of verification:
  
  - **TOTP (Time-based One-Time Password)**: A time-sensitive token for verifying user identity.
  - **Email OTP (One-Time Password)**: A one-time password sent to the user's email for secondary verification.
  - **SMS OTP**: A one-time password sent via SMS for additional security, ideal for mobile authentication.

- **Single Sign-On (SSO)**

  - **Internal SSO (Authentication Provider)**: Enable users to sign in once to FlexAuth and gain access to all of your internal applications, offering a centralized authentication service across your ecosystem.
  - **Third-Party SSO Integrations**: Provide users with the ability to authenticate through external identity providers, such as Google and GitHub, offering more flexibility for integration with various platforms.

- **Passkey Authentication (Passwordless Authentication)**  
  Support for passwordless authentication using passkeys, a modern and more secure method for user verification. This eliminates the need for traditional passwords, leveraging public key cryptography for a secure authentication process.

- **Remember Me**  
  Provide a better user experience by allowing persistent sessions, reducing the need for frequent logins while ensuring security.

- **Email Validation**  
  Ensure users provide valid, functional email addresses during registration or password recovery processes.

### Authorization Features

- **Role-Based Access Control (RBAC)**  
  Implement role-based access control to manage permissions. Users are assigned roles, and each role has specific permissions associated with it, simplifying access management within applications.

- **OAuth 2.0 Scopes**  
  Support for OAuth 2.0 scopes, allowing precise control over what actions and resources users can access within your application. This feature enables fine-grained permission management based on defined scopes during the authorization process.


## Authentication Method Compatibility

- **OAuth 2.0 Token-based Authentication**  
  Fully OAuth 2.0-compliant, allowing secure, standardized access management for APIs and microservices.

- **Session-based Authentication**  
  Legacy support for session-based authentication, commonly used in traditional web applications that require server-side session management.

- **Cookie-based Authentication**  
  Seamless integration for applications using cookies for session management, providing stateless interactions with secure session handling.



## Planned Potential Additional Features

These features are planned for future implementation. While they are not part of the current version, they represent the direction for future releases and will be incorporated as development progresses:

### Push Notification-based Authentication

- **What it offers**: Users authenticate by approving a login request sent via push notification to their mobile device.
- **Why it's useful**: This provides a smooth, frictionless authentication process while maintaining high security through device approval.

### Hardware-based TOTP (Time-based One-Time Passwords)

- **What it offers**: Use of physical hardware tokens to generate one-time passwords for authentication.
- **Why it's useful**: Hardware tokens offer higher security and are ideal for sensitive environments where preventing phishing and account compromise is critical.

### Risk-based Authentication (Adaptive Authentication)

- **What it offers**: Adjusts authentication requirements based on factors like device, location, and user behavior. High-risk actions might require additional verification steps (e.g., MFA).
- **Why it's useful**: This dynamic approach enhances security by adjusting the level of authentication based on risk factors, reducing friction during low-risk scenarios.

### Secure QR Code Authentication

- **What it offers**: Dynamic QR codes for user authentication, enabling secure and mobile-friendly login or action confirmation.
- **Why it's useful**: QR codes streamline the authentication process, particularly in mobile-first environments, and provide another secure method for verification.

### Single Sign-On (SSO) with MFA

- **What it offers**: A unified SSO experience combined with Multi-Factor Authentication (MFA), ensuring secure access across multiple services.
- **Why it's useful**: Once logged in, users can securely access multiple services, reducing the need for repeated logins while enhancing security with MFA.

---

These features are designed to offer flexibility, security, and easy integration, whether you're building user-facing applications or large-scale distributed systems. FlexAuth handles the complexities of authentication and authorization, allowing you to focus on your core application logic.
