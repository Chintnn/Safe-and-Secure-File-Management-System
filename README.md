# **Sky-Shelf – A Secure and Scalable File Management System on AWS**

## **Overview**

Sky-Shelf is a cloud-based file management platform built to simplify file storage and retrieval using Amazon Web Services (AWS), specifically for users without deep technical knowledge of cloud infrastructure. Developed using Spring Boot, Gradle, and Jasypt for encryption, Sky-Shelf offers a clean, user-friendly web interface for managing files in password-protected folders. It hides the complexity of AWS, making cloud storage accessible for individuals, educators, and small businesses.

## **Key Features**

* **Secure Cloud Storage**: Files are stored securely in Amazon S3.
* **Protected Folders**: Folder-level password protection with encryption.
* **User-Friendly UI**: Built with Thymeleaf and Bootstrap for easy navigation.
* **Scalable Design**: Supports growth through AWS services like EC2 and Elastic Beanstalk.
* **Data Encryption**: Uses Jasypt for secure authentication and encrypted folder access.

---

## **System Architecture**

Sky-Shelf follows a modular, cloud-native architecture with the following core components:

| **Component**    | **Function**                                                                |
| ---------------- | --------------------------------------------------------------------------- |
| **Frontend**     | A web-based interface using Thymeleaf and Bootstrap for user interactions.  |
| **Backend**      | A Spring Boot service managing logic, authentication, and AWS interactions. |
| **Storage**      | Amazon S3 provides reliable and scalable file storage.                      |
| **Security**     | Jasypt for encryption, IAM roles for controlled access.                     |
| **Build System** | Gradle manages dependencies and builds the application.                     |

## **Component Interaction Flow**

1. Users interact via the web interface to upload or organize files.
2. Backend services encrypt folder passwords with Jasypt and communicate with AWS S3.
3. Files are stored with metadata such as folder name and owner.
4. Passwords are required to access protected folders, ensuring secure access.

---

## **Prerequisites**

* Java 11 or newer
* Gradle 7.x
* AWS account with S3 and IAM access
* Basic understanding of S3 and IAM configurations

---

## **Getting Started**

## **Clone the Project**

```bash
git clone https://github.com/Chintnn/Sky-Shelf---A-Safe-and-Secure-File-Management-System.git
cd Sky-Shelf---A-Safe-and-Secure-File-Management-System
```

## **AWS Setup**

1. Create an S3 bucket.
2. Set up an IAM role with permissions (`s3:PutObject`, `s3:GetObject`, etc.).
3. Configure AWS credentials locally using the AWS CLI or environment variables:

   * `AWS_ACCESS_KEY_ID`
   * `AWS_SECRET_ACCESS_KEY`

## **Application Configuration**

Edit `application.properties` in `src/main/resources` with your settings:

```properties
aws.s3.bucket=your-bucket-name
spring.thymeleaf.cache=false
```

## **Build and Run Locally**

```bash
./gradlew bootRun
```

Visit: `http://localhost:8080`

---

## **Deployment**

## **Package the App**

```bash
./gradlew bootJar
```

## **Deploy to AWS**

* Use **AWS Elastic Beanstalk** for simplified deployment or deploy manually to an EC2 instance.
* Ensure the assigned instance has the correct IAM role for S3 access.
* Refer to AWS documentation for step-by-step deployment instructions.

---

## **How to Use Sky-Shelf**

The web interface supports:

* **Login**: Authenticate with your credentials.
* **Create Folders**: With optional password protection.
* **Upload Files**: To specific folders.
* **Access Files**: View or download based on access rights.

**Example Workflow:**

1. Log in
2. Create a password-protected folder named "ProjectDocs"
3. Upload a PDF file to it
4. Share the password with collaborators for secure access

---

## **Security Highlights**

* **Encrypted Passwords**: Folder passwords and sensitive data are encrypted via Jasypt.
* **IAM Access Control**: Limits AWS permissions with least-privilege roles.
* **Folder Access Verification**: Requires password before revealing folder contents.
* **Secure Auth & Sessions**: Protects against unauthorized access.

---

## **Intended Users**

| **User Type**    | **Use Case**                                       |
| ---------------- | -------------------------------------------------- |
| Individuals      | Safely store personal files like health documents. |
| Educators        | Share course materials with restricted access.     |
| Small Businesses | Share confidential documents (e.g., contracts).    |
| Remote Teams     | Collaborate using shared folders for projects.     |

---

## **Future Roadmap**

* **Hybrid Cloud Integration**: Combine on-premise and cloud storage.
* **NAS Support**: Manage both network and cloud files.
* **Advanced Permissions**: Add role-based access and admin dashboards.
* **Mobile App**: Cross-platform app using Flutter or React Native.
