# Template API

This server provides a Template API, using Eradani Connect to access the required IBM i resources. 

## Features

This application is a production-ready TypeScript/Express webserver preconfigured with several helpful programming tools:

- [TypeScript](#typescript)
- [Automatic Code Formatting with Prettier](#automatic-code-formatting-with-prettier)
- [Code Linting with ESLint](#code-linting-with-eslint)
- [Automatic Documentation with TypeDoc](#automatic-documentation-with-typedoc)
- [Automated Testing with Mocha and Chai](#automated-testing-with-mocha-and-chai)
- [Process Management with PM2](#process-management-with-pm2)
- [Development Management Scripts](#development-management-scripts)

### TypeScript

JavaScript is a loosely-typed programming language. That means that there are no compile-time restrictions on data types whatsoever. On small projects, this is a powerful asset in JavaScript's corner; developers are able to save the significant amounts of time required to develop and synchronize the data types used throughout their applications. However, on larger projects this can become an issue, as one developer has no assurances that they are using another developer's code interfaces correctly. As a result, hard-to-find bugs often arise in normal JavaScript applications.

TypeScript is a superset of JavaScript which encompases all of the features of normal JavaScript but also provides strict compile-time type-checking. When developers incorrectly configure a data structure in TypeScript, a compilation error is generated before the code is run.

You can run the TypeScript compiler using the `npm run build:dev` or `npm run build:release` commands.

### Automatic Code Formatting with Prettier

On larger teams, it is valuable to have all code in an application written using the same style standards. This helps developers easily read each other's code, since they all code in the same style.

Prettier is an automatic code formatting tool. Before a developer's code is compiled, Prettier will process the code and format it based on the standards set in your project's `.prettierrc` file. This means that developers can code in their own styles, and the entire codebase will still be automatically transformed to meet the style guidelines you set!

You can run Prettier using the `npm run format` command.

### Code Linting with ESLint

In the same vein as Prettier, ESLint helps ensure more detailed coding standards are met by developers on your team.

ESLint is the industry-standard among JavaScript developers for code-linting. Before the code is compiled, ESLint will check to make sure the new code conforms to the standards you configure in the project's `.eslintrc.js` file. If any standards are violated, a compilation error will be generated and the build process will be stopped. ESLint is included alongside Prettier because it provides more detailed checking options.

You can run ESLint using the `npm run lint` command.

### Automatic Documentation with TypeDoc

When a developer needs to work with a part of the application they didn't build, a centralized documentation system is extremely valuable. Instead of having to ask another developer how their code works or read the source code, the relevant information is presented in an easily-digestible web-based format.

TypeDoc will take your TypeScript source code and automatically generate web documentation for your entire application based only on source code and comments. To add additional notes to the documentation, you can add standard JSDoc comments to your code, and they will be parsed and included in the generated documentation pages.

You can run TypeDoc using the `npm run docs` command.
You can then view your generated docs using the `npm run view-docs` command.

### Automated Testing with Mocha and Chai

As an application grows, manual testing can become extremely inefficient, especially for quickly-changing applications. Adding automated tests will help your team focus on development, rather than having to retest the entire application every time they make a change.

Mocha is the most popular automated testing framework for Node.js applications. It allows you to quickly define test cases, setup, and teardown, all in JavaScript. Chai is an extremely english-like assertion library built for Mocha. It allows you to check test case outputs with code like `expect(result).to.be.a('number')` so you can read, write, and reason about test cases very quickly.

You can run your testing suite using the `npm run test` command.

### Process Management with PM2

While Node.js applications can be run using the `node` command, there are a few problems here when your applicatino goes into production. First, what happens if your Node.js application fails? The `node` command will simply exit and leave it down. Second, the `node` command only creates one instance of your Node.js application, which is far from the most efficient way to run a Node.js application.

PM2 is a process manager for Node.js applications. PM2's features include automatically restarting your Node.js application on failure, and simple integration with Node.js's `cluster` mode. In Node.js, your business logic is run in a single thread. When you run your application in `cluster` mode via PM2, your Node.js application will be replicated once for each CPU core on your machine. PM2 will also automatically load-balance between these processes, ensuring you get maximum performance out of your Node.js application. This project comes pre-configured with a PM2 configuration file so that you can run your application in cluster mode easily with `pm2 start`.

You can start the application using the `npm run start` command.

### Development Management Scripts

As you develop your Node.js application, it is important that your build process and integration pipeline are followed by developers. That is, when code is developed, it should be formatted, linted, compiled, tested, and documented. These steps can be difficult to manage manually, so this application comes with several development scripts to help your team.

These scripts are configured in the `package.json` file. The most important script is the `package:dev` script, run in your terminal with `npm run package:dev`. This script runs through the entire series of scripts in the pipeline so that your developers can focus on developing code, and automate the rest. Check out the `scripts` section of the `package.json` file to see the other available scripts!

The `npm run package:dev` command will run all of the scripts in the previous sections in sequence.

## Configuration

This is a list of steps that need to be completed in order to get the Template API Server configured and up and running _after cloning the git repository_. This guide will follow the steps assuming that you are setting up the application on an IBM i or Linux server via SSH.

Contact Eradani Support at (510) 239-7331 or info@eradani.com if you need help with any part of this guide.

### Create configuration file

Make a copy of the file `config/development.json.sample` and name it `config/development.json`. As a general rule, configuration files for open source applications are not added to the git repository because they may contain sensitive configuration data such as user profiles or API keys. The `development.json.sample` file is included in the git repository and has the structure expected by the application so that you can simply fill in the values you need. As you develop, a good rule of thumb is to add non-sensitive data into the `development.json.sample` file so that those configuration values will be tracked by git.

To set up the server, there are a few configuration values we need to set. Open your new `config/development.json` file 

- Set app.port to an available port
- Set the xml.* options to match those of the XMLSERVICE instance you will be using
- Set the logger.maxLoggingLevel option to your desired level of logging. Available levels are listed below in order of increasing severity. Once you set a logging level, **all levels below it in this list will also be enabled!** For example, if you set the logging level to _"info"_, the server will also store _"warn"_ and _"error"_ level logs, but not _"verbose"_, _"debug"_, or _"silly"_ level logs.
    - "silly"
    - "debug"
    - "verbose"
    - "info"
    - "warn"
    - "error"

After setting the values copy `config/development.json` to `config/production.json`.

### Create JWT keys

Run the following commands from a PASE shell to create the JWT keys and rename the public key with the name the server expects:

```sh
$ ssh-keygen -f config/keys/jwt-private.key
$ mv config/keys/jwt-private.key.pub config/keys/jwt-public.key
```

### Create the logs directory

Run the following the command to create the directory for the log files:

```sh
$ mkdir logs
```

### Set up Native IBM i Access

In this section, we are going to create a user profile which will own the application source code. We do this because when you run the Node.js application via PM2, it runs with the authority of the user who started it. Creating a specific user for the application will allow your various developers to all work with the application with a standard user profile which has access only to its own source code and relevant objects.

#### Create user profile

Create a user profile for the server. We typically create a user called `ECNCT`, but feel free to use any user you like. All objects will be owned by this user and the server will run as this user. This will make it easy to manage the application's permissions and access.

```
CRTUSRPRF USRPRF(ECNCT) PWDEXP(*YES) INLPGM(QSYS/QCMD) TEXT('Eradani Connect user profile') JOBD(QGPL/QDFTJOBD) MSGQ(QUSRSYS/ECNCT)
```

#### Create libraries

Create the program and data libraries.

```
CRTLIB LIB(ECNCT) TEXT('Eradani Connect program data')

CHGOBJOWN OBJ(ECNCT) OBJTYPE(*LIB) NEWOWN(ECNCT)

CRTLIB LIB(ECNCTUSR) TEXT('Eradani Connect user data')

CHGOBJOWN OBJ(ECNCTUSR) OBJTYPE(*LIB) NEWOWN(ECNCT)
```

#### Change application's owner

Change the owner of the server application source code:

```
CHGOWN OBJ('/path/to/template-application/in/ifs') NEWOWN(ECNCT) SUBTREE(*ALL)
```

## Updating the server application

Once you have committed and pushed your updated code to GitHub, there are 4 steps you will need to take to update the live application:

1. Download the updated code on to your IBM i
2. Make any required configuration changes
3. Compile the TypeScript code to executable JavaScript
4. Restart the application to apply the changes

### Downloading the updated code

By default, this application is set up to use Git to ship source code to the server. However, any deployment method is acceptable - the important part is that the TypeScript code on the IBM i gets updated with your changes. This guide will show you how to do this using Git.

First, open an SSH session (PuTTY) into the PASE environment on your IBM i.

Once there, move to the directory where the application source code resides:
```sh
$ cd /opt/eradani/eradani-connect-template
```

Then, tell Git to pull down the latest code from the cloud-hosted repository:
```sh
$ git pull
```

This command may ask you for your GitHub credentials.

Once the command finishes, the code on the server will be updated.

### Updating the application's configuration files

All of the application's configuration files are available on your IBM i at `/opt/eradani/eradani-connect-template/config`. By default, configuration files are automatically ignored by Git because they often include sensitive data such as API keys and passwords. So, if you have made changes to the configuration files in your development environment, you will also need to change them directly on the IBM i to make them match.

The main configuration file is `development.json`. You can edit it with the following command:
```sh
nano /opt/eradani-connect-template/config/development.json
```

Once you make your changes and save the file, you're done with this section!

### Compiling the TypeScript code

At the base level, all that needs to be done here is run the package script that came with the application. You can find this script in the `package.json` file under `package:dev` and `package:release`. It is up to you whether you would like to run `package:dev` or `package:release` to generate the executable JavaScript. Essentially, the difference is that `package:dev` will run much more quickly than `package:release` because `package:dev` writes over the previously generated JavaScript while `package:release` fully deletes the previous version before re-generating. `package:dev` also creates sourcemaps will make the application significantly easier to debug, but also increase the size of the generated JavaScript code. In general, we recommend running `package:dev` while your application is in development, and only running `package:release` on major version updates.

Run the package script:

```sh
$ npm run package:dev
```

-- OR --

```sh
$ npm run package:release
```

Once this command finishes, the JavaScript code will have been updated.

### Restarting the application

This application is managed by an open-source tool called PM2. PM2 is a Process Manager (PM) build specifically for Node.js, and provides a series of useful commands for managing the server. You can find a complete list [here](https://pm2.keymetrics.io/docs/usage/quick-start/#managing-processes).

To perform a zero-downtime reload of the application, use the following command:
```sh
$ pm2 reload eradani-connect-template
```

We recommend checking the application logs to make sure it restarts successfully. You can do that with the following command:
```sh
pm2 logs
```

If you see a message in the logs like "Server listening on Port XXXX", you're done!

Congratulations, your application is now updated!

## Final Notes

If you need any help managing or developing on this application, Eradani is here to help!

You can reach the Eradani office by calling (510) 239-7331 or emailing info@eradani.com.

If you have a direct technical question about this application, you can reach out to your application rep, Aaron Magid, directly at (510) 295-9297 or aaron@eradani.com.

Happy Coding!
