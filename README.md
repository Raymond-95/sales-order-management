# sales-order-management

A monorepository that consists of frontend (Vue.js), backend (Express.js + Node.js) and database (SQL script)

```
root
├── frontend
├── backend
├── database
```

## Quick Access

- hosted on `AWS EC2 instance`

- URL: http://ec2-43-216-253-168.ap-southeast-5.compute.amazonaws.com:8080

  > **NOTE**  
  > Please reach out to me if you are unable to view the page. I'm here to help!

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
- Once the `github-ci.yml` workflow completes successfully, the `github-cd.yml` workflow will automatically pull the docker images to `AWS EC2 instance` and run them.

## Bonus Acceptance Criteria

What would you suggest to the Product Owner on the current front-end design trend based on the wireframe?

- add padding to the container
- the `Created Date` field should include `Date Picker` that enforces the rules where the `fromDate` cannot be later than the `toDate`, and vice versa
- add `colors` to the buttons to indicate each action, such as using `red` for `close` and `grey` for `reset`
