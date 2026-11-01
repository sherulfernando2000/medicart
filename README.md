# MediCart – Online Pharmacy Platform

MediCart is a lightweight, frontend-only React + TypeScript e-commerce platform designed for **DevOps CI/CD pipelines** and **Infrastructure as Code (IaC)** deployment assignments.

---

## 🚀 Key Features

1. **Branding & UI**:
   - Modern, responsive header/navbar branded as **'MediCart – Online Pharmacy'**.
   - Certified pharmaceutical catalog featuring common essential medicines: **Paracetamol**, **Amoxicillin**, **Vitamin C**, **Ibuprofen**, and more.
   - Interactive 'Add to Cart', Cart Drawer, and Checkout Modal with instant Order Confirmation receipts.
   - Built-in Dark / Light theme switcher.

2. **Mock Data Layer (`src/services/mockApiService.ts`)**:
   - Built-in in-memory service supporting the 4 core actions:
     - **Health Status Check**: Internal app health, uptime, and microservice checks (`getHealthStatus`).
     - **Get Medicine List**: Searchable and categorized list of medicines (`getMedicineList`).
     - **Get Single Medicine Details**: Full pharmaceutical dosage, manufacturer, and indications (`getMedicineDetails`).
     - **Checkout Order Confirmation**: Generates unique receipt `#MC-XXXXXX` and updates inventory (`checkoutOrder`).

3. **CI/CD Automated Testing Suite**:
   - Integrated with React Testing Library and Vitest.
   - Fully compatible with `npm test -- --watchAll=false` for CI environments (GitHub Actions, Jenkins, GitLab CI).
   - Automated tests:
     - **Test 1**: Renders the MediCart header/title correctly.
     - **Test 2**: Renders the list of pharmaceutical items.
     - **Test 3**: Tests that clicking the checkout button updates the UI to show an order confirmation.

4. **Production Build & EC2 Deployment**:
   - Fast, optimized production build generating static assets in `dist/`.
   - Includes production `nginx.conf` with SPA client routing (`try_files`), Gzip compression, and ALB health check `/health`.
   - Production multi-stage `Dockerfile` included.

---

## 🛠️ Getting Started

### Install Dependencies
```bash
npm install
```

### Run Locally in Development Mode
```bash
npm run dev
```

### Run Automated Unit Tests (CI Mode)
```bash
npm test -- --watchAll=false
```
or standard:
```bash
npm test
```

### Generate Production Static Build
```bash
npm run build
```
This outputs a standalone static build folder in `dist/` ready to be served by Nginx, Apache, AWS S3 + CloudFront, or an EC2 instance.

---

## 🌐 Deploying to AWS EC2 (Nginx)

1. **Build the production bundle**:
   ```bash
   npm run build
   ```

2. **Copy `dist/` to your EC2 instance**:
   ```bash
   scp -r dist/* ec2-user@<EC2_PUBLIC_IP>:/usr/share/nginx/html/
   ```

3. **Deploy Nginx configuration**:
   ```bash
   sudo cp nginx.conf /etc/nginx/conf.d/medicart.conf
   sudo systemctl restart nginx
   ```

4. **Verify Health Endpoint**:
   ```bash
   curl http://<EC2_PUBLIC_IP>/health
   ```
