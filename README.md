# Developing locally

You will need to:

1. Install Node.js
2. Install Yarn: `npm -g install yarn`
3. Run `yarn`
4. Run `yarn dev`

This project uses Yarn Workspaces, if you just want to start a single project, use the `yarn workspace` command from anywhere:

- For the front end: `yarn workspace web dev`
- For the server: `yarn workspace server start`

# Testing

To run the tests, run the command `yarn test`.

To generate a coverage report, run the command `yarn test --coverage`.
