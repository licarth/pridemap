### Prerequisites

- Install `gcloud`
- Run `gcloud auth application-default login` to login.

### Write all instagram logos

`cat ids.txt | xargs -L1 yarn node ./src/index.js`
