# sales-order-management

A monorepository that consists of frontend (Vue.js), backend (Express.js + Node.js) and database (MySQL)

```
root
├── frontend
├── backend
├── database
```

## Quick Access

Frontend: http://ec2-43-216-253-168.ap-southeast-5.compute.amazonaws.com:8080/

## Getting Started

```bash
# local build
$ docker-compose up --build

# production build
$ ENV=prod docker-compose up --build
```

## CI/CD

- Push your code to the `main` branch on GitHub.
- This will trigger the `github-ci.yml` workflow, which will build a `Docker image` and push it to `Docker Hub`.
- Once the `github-ci.yml` workflow completes successfully, the `github-cd.yml` workflow will automatically deploy to AWS EC2 instance.

## Bonus Acceptance Criteria

What would you suggest to the Product Owner on the current front-end design trend based on the wireframe?

- the `Created Date` field should include `Date Picker` that enforces the rules where the `fromDate` cannot be later than the `toDate`, and vice versa
