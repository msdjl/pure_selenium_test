# Pure selenium tests

A few tests covering https://www.w3schools.com/sql/trysql.asp?filename=trysql_select_all

Tests run in Github Actions in a selenium docker container

## How to run tests locally

Install nodejs and jdk, then

`cd pure_selenium_test`

`npm i`

`npm test`

#### or with docker

`docker compose up --abort-on-container-exit --exit-code-from test`