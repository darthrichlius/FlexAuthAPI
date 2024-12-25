# FlexAuth

A standards-compliant OAuth service and provider.

> **⚠️ Important:** Do not use before version v0.3-rc.

## ABOUT THE PROJECT

### Status

The project is **under active development**.

**Important:** Please read the disclaimer section carefully before proceeding.  
For a deeper understanding of the design decisions, architecture, and implementation, refer to the documentation section.

### Vision

To build a secure, standalone (self-hosted), and reusable authentication service that simplifies the implementation of authentication and authorization for both users and applications.

### Purpose

FlexAuth aims to provide a ready-to-integrate authentication service with modern security protocols for seamless user authentication and fine-grained authorization.

### Target Use Cases

FlexAuth is designed to be used in both **user-centric** and **microservices-oriented** environments.

- **For users**, the goal is to provide an intuitive and customizable visual authentication experience.
- **For developers**, FlexAuth serves as a turnkey solution to integrate secure, scalable authentication and authorization into distributed systems.
- **For applications**, FlexAuth provides an OAuth-based service to manage fine-grained access control and authorization.

## FEATURES

**Note:** This is the envisioned feature set. As of now, not all features may be available.  
Refer to the [roadmap](#) and changelog for the latest updates.

### Authentication

For a comprehensive list and description of features, refer to [FEATURES.md](FEATURES.md).

**As an authentication provider:**

- Token-based credential generation (JWTs)
- Multi-factor authentication (MFA)
  - TOTP (Time-based One-Time Password)
  - Email OTP (One-Time Password)
  - SMS OTP
- Single Sign-On (SSO) across multiple platforms
- Passkey authentication (Passwordless authentication)
- Remember Me functionality for persistent sessions
- Email validation to ensure functional addresses

**As a proxy for third-party authentication:**

- Google SSO integration
- GitHub SSO integration
- Additional third-party integrations planned

### Compatibility

- OAuth 2.0 Token-based authentication
- Session-based authentication
- Cookie-based authentication

## DOCUMENTATION

- **Project Overview**
- **Technical Documentation** (What, How, Why)
  - API Documentation (Guides, Tutorials, Examples)
- **API References**: Detailed API specifications for Business and Data Abstract APIs

## DISCLAIMER

**THIS PROJECT IS FOR DEMONSTRATION PURPOSES ONLY. DO NOT USE IT IN PRODUCTION!**  
(Unless you fully understand the risks and requirements)

This project is not intended for production environments.  
The code is provided as-is, with no warranties, and is likely **unstable for production use**.  
The roadmap reflects a personal vision with features and requirements that may not align with production standards.  
The implementation requires additional steps that are outside the scope of this project.  
For example, you must implement your own observability tools and manage your own infrastructure (databases, caching, serverless, events, etc.).

**IT IS FUNCTIONAL, STABLE FOR TESTING, AND USABLE IN NON-PRODUCTION ENVIRONMENTS.**

You can run the project locally using Docker (recommended).


## CONTRIBUTING

This project is not intended for collaborative contributions.  
If you are interested in collaborating on an authentication project, we recommend exploring [OpenAuth](https://github.com/openauthjs/openauth).

Collaborating requires dedicated time and resources to manage contributions effectively.  
Unfortunately, we currently lack the capacity to provide the necessary support.  
As accepting collaboration without ensuring a qualitative approach goes against our values, we have chosen to not allow collaboration at this time.


## LICENSE

For full license details, please refer to the [LICENSE.md](./LICENSE.md) file.
